// lib/textToSpeech.js
// Simple, defensive wrapper around the browser SpeechSynthesis API.
// Exposes: speak(text, options?), stop(), isSupported()

const DEFAULTS = {
  rate: 1.1,   // a touch faster for "professional ops" cadence
  pitch: 0.9,  // slightly lower, calmer tone
  volume: 1.0,
  lang: "en-US",
  voiceName: null, // try to match if you want a specific installed voice
};

export function isSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

// Fetch voices (some browsers load them async)
function loadVoices() {
  return new Promise((resolve) => {
    if (!isSupported()) return resolve([]);
    const synth = window.speechSynthesis;

    let voices = synth.getVoices();
    if (voices && voices.length > 0) return resolve(voices);

    // Voices may not be loaded yet; wait for the event
    const handler = () => {
      voices = synth.getVoices();
      resolve(voices || []);
      synth.removeEventListener("voiceschanged", handler);
    };
    synth.addEventListener("voiceschanged", handler);
    // Trigger a no-op to kick voices loading on some platforms
    synth.getVoices();
    // Fallback timeout (just in case voiceschanged never fires)
    setTimeout(() => resolve(synth.getVoices() || []), 800);
  });
}

function pickVoice(voices, { lang, voiceName }) {
  // If specific name requested, try to match by name first.
  if (voiceName) {
    const byName = voices.find((v) => v.name.toLowerCase().includes(voiceName.toLowerCase()));
    if (byName) return byName;
  }
  // Prefer an en-US voice if available, falling back to any English voice.
  const byLang = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(lang.toLowerCase()));
  if (byLang) return byLang;

  const anyEnglish = voices.find((v) => (v.lang || "").toLowerCase().startsWith("en"));
  if (anyEnglish) return anyEnglish;

  // Otherwise, just return the first available voice.
  return voices[0] || null;
}

export async function speak(text, options = {}) {
  if (!isSupported()) {
    console.warn("🔊 SpeechSynthesis not supported in this browser.");
    return { ok: false, reason: "unsupported" };
  }
  const settings = { ...DEFAULTS, ...options };
  try {
    const synth = window.speechSynthesis;

    // Cancel anything still speaking/queued
    if (synth.speaking || synth.pending) {
      synth.cancel();
    }

    const voices = await loadVoices();
    const utter = new SpeechSynthesisUtterance(text);
    const chosen = pickVoice(voices, settings);

    if (chosen) utter.voice = chosen;
    utter.rate = settings.rate;
    utter.pitch = settings.pitch;
    utter.volume = settings.volume;
    utter.lang = (chosen && chosen.lang) || settings.lang;

    console.log("🔊 [TTS] Speaking:", { text, voice: utter.voice?.name, rate: utter.rate, pitch: utter.pitch });

    return new Promise((resolve) => {
      utter.onend = () => resolve({ ok: true });
      utter.onerror = (e) => {
        console.error("🔊 [TTS] Error:", e);
        resolve({ ok: false, reason: "error", error: e });
      };
      synth.speak(utter);
    });
  } catch (err) {
    console.error("🔊 [TTS] Exception:", err);
    return { ok: false, reason: "exception", error: err };
  }
}

export function stop() {
  if (!isSupported()) return;
  const synth = window.speechSynthesis;
  if (synth.speaking || synth.pending) {
    synth.cancel();
    console.log("🔊 [TTS] Stopped.");
  }
}
