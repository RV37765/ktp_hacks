# ArtGuard AI - Museum Security Command Center

AI-powered, voice-controlled security system for museum surveillance and threat detection. Features real-time camera monitoring, intelligent alert generation, and natural language command processing.

## Features

### 🎤 Voice & Text Commands
- **Web Speech API integration** for hands-free control
- **Natural language processing** for intuitive commands
- **Text-to-speech** responses for immersive interaction
- **Command examples:**
  - `"status report"` - Get system overview
  - `"show camera 2"` - Focus on specific camera
  - `"show all cameras"` - Return to grid view
  - `"where is guard Martinez"` - Locate security personnel
  - `"any alerts?"` - Check active alerts
  - `"initiate lockdown"` - Emergency protocols
  - Gallery/artwork queries (e.g., "Mona Lisa", "Gallery 3")

### 📹 Animated Camera Feeds
- **Live floor maps** with animated people tracking
- **Intelligent threat detection** - Dots turn RED when people loiter (8+ seconds)
- **Obstacle-aware movement** - Realistic pathfinding around walls and displays
- **2x2 grid view** or **focused zoom mode** (2.4x larger)
- **Different floor maps** for each area (Main Gallery, Storage, Sculpture Hall, Security Office)
- **Real-time people count** and activity status

### 🚨 Dynamic Alert System
- **Auto-generated alerts** from suspicious camera activity
- **Color-coded severity levels:**
  - 🔴 Critical/High - Pulsing animation
  - 🟡 Medium - Yellow highlights
  - 🔵 Low - Blue indicators
- **Clickable alerts** - Auto-focus on associated camera
- **Dismissible alerts** - X button to clear
- **Smart cooldown** - 60-second delay prevents alert spam
- **Alert types:** Motion detection, access violations, system issues

### 📊 Enhanced Dashboard
- **Stats Display** with real-time indicators:
  - Camera status (online/offline)
  - Guard status (on-duty/break)
  - Active alerts count
  - System uptime
- **Chat log** with conversation history
- **Interactive UI** with hover effects and animations

## Tech Stack

- **Next.js 16** with Turbopack
- **React 19** with hooks
- **Tailwind CSS 4** for styling
- **lucide-react** for icons
- **Canvas API** for camera animations
- **Web Speech API** for voice I/O

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── page.tsx          # Main application with integrated features
│   ├── layout.tsx        # App layout
│   └── globals.css       # Global styles
├── components/
│   ├── VoiceInput.jsx    # Speech recognition UI
│   ├── ChatLog.jsx       # Message history display
│   ├── AnimatedCamera.jsx # Canvas-based camera feed
│   ├── AlertPanel.jsx    # Enhanced alert display
│   ├── StatsDisplay.jsx  # System statistics
│   └── ScenarioButtons.jsx # Demo scenarios
├── lib/
│   ├── smartResponses.js # Command processing logic
│   ├── textToSpeech.js   # TTS functionality
│   ├── museumData.js     # Mock security data
│   ├── mapDefinitions.js # Floor map layouts
│   ├── pathMovement.js   # Pathfinding algorithms
│   └── scenarios.js      # Demo scenarios
```

## How It Works

### Real-Time Threat Detection
1. Camera feeds show animated dots representing people
2. Dots move realistically, avoiding obstacles
3. When a dot stops moving for 8+ seconds → **turns RED**
4. System automatically generates a HIGH severity alert
5. Alert appears in panel with location details
6. Voice announcement: "Alert: Suspicious loitering detected at [location]"
7. Click alert → Camera auto-focuses for investigation

### Voice Command Flow
1. Click microphone or use text input
2. System processes command via natural language parser
3. AI responds with relevant information
4. Effects applied (camera focus, emergency protocols, etc.)
5. Response spoken back via text-to-speech

## Team Contributions

- **Person 1 (Voice & AI)**: Voice recognition, command processing, chat system
- **Person 2 (Camera Feeds)**: Canvas animations, threat detection, visual effects
- **Person 3 (UI/UX)**: Enhanced components, data structures, styling

## Browser Compatibility

- **Voice input:** Chrome, Edge (desktop) - requires Web Speech API
- **Text input:** Works in all modern browsers
- **Canvas animations:** All modern browsers with HTML5 Canvas support