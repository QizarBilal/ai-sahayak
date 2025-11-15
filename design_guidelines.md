# AI-Sahayak Design Guidelines

## Design Approach
**Accessibility-First for Low-Literacy Rural Users**: This is not a typical web application. Design prioritizes visual clarity, large interactive elements, pictorial communication, and audio-first interactions over conventional web patterns.

## Mandatory Color Palette

**Light Mode:**
- Background: `#F7F7F7`
- Text: `#2F4F4F`
- Accent: `#1E90FF` (primary) or `#00FFFF` (secondary highlights)

**Dark Mode:**
- Background: `#121212`
- Text: `#F0F0F0`
- Accent: `#1E90FF` (primary) or `#00FFFF` (secondary highlights)

Include a persistent, prominent theme toggle accessible from all pages.

## Typography & Layout

**Font Strategy:**
- Use Google Fonts: Select 1-2 highly legible sans-serif fonts (e.g., Inter, Noto Sans)
- Larger-than-typical font sizes: Base text 18px minimum, headings 28-48px
- Heavy font weights (600-700) for better readability
- High contrast ratios for accessibility

**Spacing System:**
- Use generous Tailwind spacing: predominantly `p-6, p-8, p-12, m-6, m-8` for breathing room
- Large tap targets: minimum 48px × 48px for all interactive elements
- Extra padding around critical actions (microphone, submit buttons)

## Audio-First Interface Requirements

**Every Page Must Include:**
1. **Large Microphone Button**: Positioned prominently (top-right or center), minimum 64px diameter, pulsing animation when active, clear visual feedback
2. **Play Audio Button**: For text-to-speech playback of page content/instructions, minimum 48px
3. **Visual Audio Indicators**: Waveform animations, sound level meters, or pulsing states during recording/playback

**Audio Feedback:**
- Use MusicGen earcons (short audio cues) for actions: button press, success, error, navigation
- Provide audio instructions for every workflow step
- Include "Tap to hear instructions" prompts throughout

## Component Design for Low-Literacy Users

**Icon-First Communication:**
- Large, colorful icons (96px-128px) representing each module (microphone, document, map, etc.)
- Use universally recognizable symbols
- Minimal text labels, use pictograms when possible
- Color-coding by category (e.g., green for eligibility, blue for services, orange for markets)

**Button Design:**
- Extra-large CTAs: minimum 56px height, generous horizontal padding
- Clear icon + text combinations
- High contrast against backgrounds
- Rounded corners (border-radius: 12-16px) for friendly appearance
- When buttons appear on images/hero sections, apply backdrop-blur-md background

**Card/Module Layouts:**
- Large cards with ample whitespace
- Single clear action per card
- Visual hierarchy: Icon → Short heading → Brief description → Action button
- Shadow/elevation for depth and touch affordance

## Module-Specific Design Patterns

**Voice Assistant Module:**
- Full-screen microphone interface on `/assistant/voice`
- Large circular waveform visualization during recording
- Real-time transcription display with large text
- Playable audio responses with prominent play/pause controls

**Dashboard:**
- Grid layout with large module cards (2 columns on desktop, 1 on mobile)
- Each card: Large icon, module name, 1-sentence description, "Open" button
- Voice shortcuts prominently displayed at top
- Greeting personalized with actual username (not "John")

**Forms (Eligibility, Drafts):**
- One question per screen or clearly separated sections
- Voice input option for every text field
- Visual progress indicators
- Audio confirmation of selections

**Data Display (Markets, Queries):**
- Simple charts with large labels
- Audio summary playback button
- High-contrast colors for data visualization
- Table alternatives: large cards for mobile

## Navigation & Layout

**Mobile-First Responsive:**
- Single column layouts on mobile
- Bottom navigation bar with large icons (56px height minimum)
- Hamburger menu for secondary actions
- Full-width buttons on mobile

**Desktop Adaptation:**
- Maximum 2-3 column layouts
- Sidebar navigation with both icons and text
- Maintain generous spacing (don't compress for desktop)

## Images

**Hero Sections:**
- Use authentic stock photography of rural India (farmers, villages, government offices, mobile phone usage in rural settings)
- Apply subtle overlays (20-40% opacity) for text readability
- Position: Full-width, 60-80vh height on landing/dashboard

**Module Illustrations:**
- Include contextual imagery: documents for analyzer, maps for service discovery, market scenes for mandi data
- Use illustrations or photos showing diverse Indian users

**Trust Elements:**
- Government logos/emblems where appropriate
- Visual indicators of security and official status

## Critical Constraints

- No small text (minimum 16px, prefer 18px+)
- No complex animations that might confuse users
- Clear visual feedback for all interactions
- Offline state indicators
- Loading states with audio/visual feedback
- Error messages in simple language with audio alternatives