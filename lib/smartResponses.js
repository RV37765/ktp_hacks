// lib/smartResponses.js
// Rule-based parser for voice/text commands.
// Returns { text, effects?: { focusCameraId?, showAllCameras?, emergency?, help? } }

function normalize(str) {
  return (str || "").toLowerCase().trim();
}

function wordsToNumber(str) {
  const wordMap = {
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6,
    'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
  };
  const normalizedStr = normalize(str);
  for (const [word, num] of Object.entries(wordMap)) {
    if (normalizedStr.includes(word)) {
      return num;
    }
  }
  return null;
}

function extractNumber(str) {
  // First try to extract digit
  const m = (str || "").match(/(\d{1,3})/);
  if (m) return parseInt(m[1], 10);

  // If no digit found, try to find written number
  return wordsToNumber(str);
}
function listAlerts(alerts) {
  if (!alerts || alerts.length === 0) return "No active alerts.";
  return alerts.map((a) => `• [${a.severity.toUpperCase()}] ${a.message} (${a.time})`).join("\n");
}
function statusReport(ctx) {
  const cams = ctx?.cameras || [];
  const guards = ctx?.guards || [];
  const alerts = ctx?.alerts || [];
  const online = cams.filter((c) => c.status === "active").length;
  const offline = cams.length - online;
  return [
    `System status: ${online}/${cams.length} cameras online, ${offline} offline.`,
    `Guards on duty: ${guards.filter((g) => g.status === "on-duty").length}/${guards.length}.`,
    alerts.length ? `Alerts: ${alerts.length} active.\n${listAlerts(alerts)}` : "No active alerts.",
  ].join("\n");
}
function helpText() {
  return [
    "Try commands like:",
    "• “status report”",
    "• “show camera 2” or “show all cameras”",
    "• “where is guard Martinez”",
    "• “any alerts?” or “what’s wrong?”",
    "• “initiate lockdown”, “call police”, “emergency”",
    "• “mona lisa” or “gallery 3”",
  ].join("\n");
}

export function getSmartResponse(userCommand, museumContext) {
  const raw = userCommand || "";
  const cmd = normalize(raw);
  const ctx = museumContext || {};

  console.log("🤖 [Smart] Input:", raw);

  if (cmd.includes("status")) {
    return { text: statusReport(ctx) };
  }

  if (cmd.includes("show camera")) {
    const n = extractNumber(cmd);
    if (n != null) {
      const camera = (ctx.cameras || []).find((c) => c.id === n);
      if (camera) return { text: `Showing ${camera.name}.`, effects: { focusCameraId: camera.id } };
      return { text: `Camera ${n} not found.` };
    }
  }

  if (cmd.includes("show all camera") || cmd.includes("show all feeds") || cmd.includes("show all")) {
    return { text: "Displaying all camera feeds.", effects: { showAllCameras: true, focusCameraId: null } };
  }

  if (cmd.includes("where is guard") || cmd.includes("where's guard") || (cmd.includes("where is") && cmd.includes("guard"))) {
    const nameMatch = raw.match(/guard\s+([a-z]+(?:\s+[a-z]+)?)/i);
    const nameToken = nameMatch ? nameMatch[1].toLowerCase() : null;
    const guards = ctx.guards || [];
    if (nameToken) {
      const guard = guards.find((g) => g.name.toLowerCase().includes(nameToken));
      if (guard) return { text: `${guard.name} is at ${guard.location} (${guard.status}).` };
      return { text: `I don't have a current location for Guard ${nameToken}.` };
    }
    return { text: "Please specify a guard name, e.g., “Where is Guard Martinez?”" };
  }

  if (cmd.includes("any alerts") || cmd.includes("what's wrong") || cmd.includes("what is wrong") || cmd.includes("alerts")) {
    return { text: listAlerts(ctx.alerts || []) };
  }

  if (cmd.includes("lockdown") || cmd.includes("initiate lockdown")) {
    return { text: "Initiating museum lockdown protocol. All entrances secured, staff notified.", effects: { emergency: "lockdown" } };
  }

  if (cmd.includes("call police") || cmd.includes("emergency") || cmd.includes("panic")) {
    return { text: "Emergency services protocol triggered. Contacting local authorities and broadcasting message to guards.", effects: { emergency: "police" } };
  }

  if (cmd.includes("mona lisa") || cmd.includes("gallery 3")) {
    const cam = (ctx.cameras || []).find((c) => /mona lisa|gallery 3/i.test(c.name) || /gallery 3/i.test(c.room || ""));
    if (cam) return { text: `Focusing on ${cam.name}.`, effects: { focusCameraId: cam.id } };
    return { text: "I could not find a camera for that location." };
  }

  if (cmd === "help" || cmd.includes("help me") || cmd.includes("what can you do")) {
    return { text: helpText(), effects: { help: true } };
  }

  return { text: `I didn't catch that. ${helpText()}` };
}
