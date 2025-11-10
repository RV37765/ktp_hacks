# ArtGuard AI - Louvre Museum Security Command Center

AI-powered, voice-controlled security system for the Louvre Museum featuring real-time surveillance, intelligent threat detection, and natural language command processing. Experience authentic Louvre floor plans with labeled artworks including the Mona Lisa, Winged Victory, Egyptian Sphinxes, and Marly Horses.

## Features

### Voice & Text Commands
- **Web Speech API integration** for hands-free control
- **Natural language processing** for intuitive commands
- **Text-to-speech** responses for immersive interaction
- **Command examples:**
  - `"status report"` - Get system overview
  - `"show camera 2"` - Focus on specific camera
  - `"show all cameras"` - Return to grid view
  - `"where is agent Dubois"` - Locate security personnel (supports both "agent" and "guard")
  - `"any alerts?"` - Check active alerts
  - `"initiate lockdown"` - Emergency evacuation protocol (clears all visitors and alerts)
  - `"release lockdown"` - Resume normal operations
  - `"show suspicious"` - Filter view to show only red/suspicious individuals
  - `"show every visitor"` - Display all visitors (green and red)
  - Artwork/location queries: `"Mona Lisa"`, `"Salle des États"`, `"Egyptian Antiquities"`, `"Winged Victory"`, `"Marly Horses"`

### Animated Camera Feeds
- **Authentic Louvre floor maps** for 4 iconic locations:
  - **Camera 1**: Salle des États (Denon Wing) - Mona Lisa gallery with protective case and viewing benches
  - **Camera 2**: Daru Staircase (Denon Wing) - Winged Victory of Samothrace with grand staircase
  - **Camera 3**: Egyptian Antiquities (Sully Wing) - Sphinx statues and sarcophagi displays
  - **Camera 4**: Cour Marly (Richelieu Wing) - Marly Horses sculptures
- **Intelligent threat detection** - Visitors turn RED after loitering 8+ seconds
- **Labeled obstacles** - All artworks, benches, and exhibits clearly labeled on floor maps
- **Smart collision avoidance** - Visitors avoid obstacles (except stairs which allow passage)
- **2x2 grid view** or **focused zoom mode** (2.4x larger with scaled labels)
- **Real-time visitor count** and activity status
- **Lockdown mode** - Empty rooms with "LOCKDOWN" status indicator
- **Suspicious filter** - Shows count of red/suspicious individuals when filtering

### Dynamic Alert System
- **Auto-generated alerts** from suspicious loitering behavior
- **Color-coded severity levels:**
  - 🔴 Critical/High - Pulsing animation
  - 🟡 Medium - Yellow highlights
  - 🔵 Low - Blue indicators
- **Clickable alerts** - Auto-focus on associated camera for investigation
- **Dismissible alerts** - X button to clear individual alerts
- **Smart cooldown** - 45-second delay per camera prevents alert spam
- **Lockdown integration** - All alerts cleared when lockdown initiated
- **Alert types:** Suspicious loitering, motion detection, large crowds, access violations

### Enhanced Dashboard
- **Stats Display** with real-time indicators:
  - 6 cameras across Denon, Sully, and Richelieu wings
  - 4 French security agents (Agent Dubois, Moreau, Laurent, Rousseau)
  - Active alerts count with severity breakdown
  - System uptime and status
- **Chat log** with conversation history (supports 200+ messages)
- **Interactive UI** with hover effects and animations
- **Fixed-height camera container** prevents page jumping during view changes
- **Voice and text input** for flexible command entry

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
│   ├── smartResponses.js # Natural language command parser
│   ├── textToSpeech.js   # TTS functionality
│   ├── museumData.ts     # Louvre Museum data (cameras, agents, alerts, rooms)
│   └── mapDefinitions.js # Authentic Louvre floor plans with labeled obstacles
```

## Louvre Museum Authenticity

### Floor Plans
All camera feeds display accurate floor layouts based on actual Louvre Museum rooms:
- **Uniform dimensions**: 350x220px for consistent grid display
- **Scaled obstacles**: All artworks and exhibits properly labeled (Mona Lisa, Sphinx, Sarcophagus, Winged Victory, Marly Horse, Benches, Stairs)
- **Multi-line text rendering**: Labels wrap to fit within obstacles
- **2.4x zoom scaling**: Labels and fonts scale proportionally in focused view

### French Security Personnel
- **Agent Dubois** (LOU-001) - 12 years experience - Stationed at Salle des États
- **Agent Moreau** (LOU-002) - 7 years experience - Stationed at Daru Staircase
- **Agent Laurent** (LOU-003) - 9 years experience - Stationed at Egyptian Antiquities
- **Agent Rousseau** (LOU-004) - 15 years experience - Stationed at Cour Marly

### Wing Structure
- **Denon Wing**: Mona Lisa gallery (Salle des États), Daru Staircase
- **Sully Wing**: Egyptian Antiquities (Ground Floor)
- **Richelieu Wing**: Cour Marly (Room 105)

## How It Works

### Real-Time Threat Detection
1. Camera feeds show animated green dots representing museum visitors
2. Dots move realistically on authentic Louvre floor maps, avoiding labeled obstacles (artworks, benches, displays)
3. Visitors can walk through stairs but bounce off walls and artworks
4. When a visitor stops moving for 8+ seconds → **turns RED** (suspicious loitering)
5. System automatically generates a HIGH severity alert with 45-second cooldown per camera
6. Alert appears in panel with specific location details (e.g., "Denon Wing - Salle des États")
7. Voice announcement: "Alert: Suspicious loitering detected at [location]"
8. Click alert → Camera auto-focuses for investigation
9. Use `"show suspicious"` command to filter view to only red dots

### Voice Command Flow
1. Click microphone button or type in text input field
2. Natural language parser processes command (supports spoken numbers like "two" and digits)
3. AI responds with relevant information based on museum context
4. Visual effects applied:
   - Camera focus/grid switching
   - Lockdown mode (clears visitors and alerts)
   - Suspicious filtering (shows only red dots)
   - Emergency protocols
5. Response spoken back via text-to-speech (if supported)

### Lockdown Protocol
1. Command: `"initiate lockdown"`
2. All visitor dots removed from camera feeds
3. All active alerts dismissed
4. Status changes to "LOCKDOWN" on each camera
5. Command: `"release lockdown"` → System resets with all fresh green dots

### Collision Avoidance System
- Dots spawn only in valid positions (not inside obstacles, with margin buffer)
- Increased spawn attempts (up to 100) ensure proper placement
- Wall margins prevent edge spawning
- Directional bounce logic based on collision side
- Stairs are passable for realistic museum navigation

## Team Contributions

- **Person 1 (Voice & AI)**: Voice recognition, command processing, chat system
- **Person 2 (Camera Feeds)**: Canvas animations, threat detection, visual effects
- **Person 3 (UI/UX)**: Enhanced components, data structures, styling

## Browser Compatibility

- **Voice input:** Chrome, Edge (desktop) - requires Web Speech API
- **Text input:** Works in all modern browsers
- **Canvas animations:** All modern browsers with HTML5 Canvas support
