# AI-SAHAYAK Testing Guide

Comprehensive testing instructions for all 10 modules.

---

## Quick Start Testing

1. **Start the application:**
   ```bash
   npm run dev
   ```

2. **Open browser:**
   ```
   http://localhost:5000
   ```

3. **Grant microphone permissions** when prompted

---

## Module 1: Voice Assistant

**URL:** `/assistant/voice`

### Test Cases

#### TC1.1: Voice Recording
1. Click the large microphone button
2. **Expected:** Button turns red, "Listening..." message appears
3. Speak clearly: "What is the PM-KISAN scheme?"
4. Click button again to stop
5. **Expected:** 
   - Transcript appears in card
   - AI response generated
   - Audio playback starts automatically

#### TC1.2: Audio Playback
1. After receiving response, click "Play" button
2. **Expected:** Audio plays through speakers
3. Adjust volume if needed
4. **Expected:** Volume controls work

#### TC1.3: Fallback Mechanism
1. If Bytez fails, Web Speech API should activate
2. **Expected:** Still get transcript
3. **Expected:** System gracefully handles errors

### Success Criteria
- ✅ Audio recording works
- ✅ Transcript accurate (>80%)
- ✅ AI response relevant
- ✅ TTS audio plays
- ✅ Processing time <5 seconds

---

## Module 2: Chat Assistant

**URL:** `/assistant/chat`

### Test Cases

#### TC2.1: Text Chat
1. Type message: "Tell me about Pradhan Mantri Awas Yojana"
2. Click Send or press Enter
3. **Expected:** AI response appears
4. **Expected:** Message history preserved

#### TC2.2: Voice Mode in Chat
1. Click microphone icon in chat input
2. Speak your question
3. Stop recording
4. **Expected:** Message sent automatically
5. **Expected:** Response includes audio

#### TC2.3: Conversation History
1. Send multiple messages
2. Refresh page
3. **Expected:** Conversation persists
4. View in sidebar
5. **Expected:** All conversations listed

### Success Criteria
- ✅ Messages send correctly
- ✅ Responses are contextual
- ✅ History persists across sessions
- ✅ Voice mode works in chat

---

## Module 3: Recent Queries

**URL:** `/queries`

### Test Cases

#### TC3.1: View Query History
1. Navigate to Recent Queries
2. **Expected:** List of past voice interactions
3. **Expected:** Shows transcript + response
4. **Expected:** Sorted by date (newest first)

#### TC3.2: Replay Audio
1. Click "Play" on any query
2. **Expected:** Original TTS audio plays
3. **Expected:** Playback controls work

#### TC3.3: Search/Filter
1. Use search box (if implemented)
2. **Expected:** Filters results
3. **Expected:** Real-time filtering

### Success Criteria
- ✅ All queries displayed
- ✅ Audio playback works
- ✅ Pagination/infinite scroll
- ✅ Search functionality

---

## Module 4: Eligibility Checker

**URL:** `/eligibility`

### Test Cases

#### TC4.1: Check Scheme Eligibility
1. Select scheme category (e.g., "Agriculture")
2. Enter user details:
   - Age: 45
   - Income: 150000
   - Occupation: Farmer
   - State: Punjab
3. Click "Check Eligibility"
4. **Expected:**
   - Scheme recommendation appears
   - Eligibility status (yes/no)
   - Clear reasoning
   - Required documents list
   - Next steps provided

#### TC4.2: Ineligible User
1. Enter details for ineligible user:
   - Age: 25
   - Income: 500000 (high)
   - Occupation: Engineer
2. Click "Check Eligibility"
3. **Expected:**
   - Status: Not Eligible
   - Clear explanation why
   - Alternative scheme suggestions

#### TC4.3: View History
1. Check eligibility multiple times
2. Navigate to History tab
3. **Expected:** Past checks displayed
4. **Expected:** Can review past results

### Success Criteria
- ✅ Accurate eligibility determination
- ✅ Clear reasoning provided
- ✅ Document list relevant
- ✅ Next steps actionable
- ✅ History persists

---

## Module 5: Market Data

**URL:** `/markets`

### Test Cases

#### TC5.1: View Default Market Prices
1. Navigate to Market Data
2. **Expected:** Table/cards showing current prices
3. **Expected:** Data for multiple commodities
4. **Expected:** State and market info displayed

#### TC5.2: Filter by Commodity
1. Select commodity from dropdown (e.g., "Wheat")
2. **Expected:** Filtered results
3. **Expected:** Prices for selected commodity only

#### TC5.3: Filter by State
1. Select state (e.g., "Punjab")
2. **Expected:** Markets in that state
3. **Expected:** Relevant prices

#### TC5.4: View Charts
1. Check for price trend charts
2. **Expected:** Visual representation of prices
3. **Expected:** Charts responsive and interactive

#### TC5.5: Cache Verification
1. Load market data
2. Check Network tab in DevTools
3. Reload page within 5 minutes
4. **Expected:** Data served from cache
5. **Expected:** No new API call

### Success Criteria
- ✅ Real data from API
- ✅ Filtering works correctly
- ✅ Charts render properly
- ✅ Caching functional
- ✅ Data updates regularly

---

## Module 6: Document Analyzer

**URL:** `/documents/analyze`

### Test Cases

#### TC6.1: Upload & OCR
1. Click "Upload Document"
2. Select image file (Aadhaar, PAN, etc.)
3. Click "Analyze"
4. **Expected:**
   - Text extracted via OCR
   - Accuracy >70% for clear images

#### TC6.2: Summarization
1. After OCR completes
2. **Expected:** Summary generated
3. **Expected:** Summary is concise (2-3 sentences)
4. **Expected:** Key info highlighted

#### TC6.3: Translation
1. Select target language (e.g., "Hindi")
2. Click "Translate"
3. **Expected:** Document translated
4. **Expected:** Formatting preserved

#### TC6.4: View Document History
1. Navigate to Documents list
2. **Expected:** All uploaded docs shown
3. Click on a document
4. **Expected:** Can view past analysis

### Success Criteria
- ✅ OCR accuracy >70%
- ✅ Summary captures key points
- ✅ Translation accurate
- ✅ Document history accessible
- ✅ File size limits enforced

---

## Module 7: Service Discovery

**URL:** `/services/search`

### Test Cases

#### TC7.1: Search by Service Type
1. Select service type (e.g., "Hospital")
2. Enter location: "New Delhi"
3. Click "Search"
4. **Expected:**
   - List of nearby hospitals
   - Distance calculated
   - Address displayed

#### TC7.2: Use Current Location
1. Click "Use Current Location"
2. Grant location permission
3. **Expected:** Auto-detect location
4. **Expected:** Services near user

#### TC7.3: View Service Details
1. Click on a service from results
2. **Expected:** Full details shown
3. **Expected:** Contact info if available
4. **Expected:** Map view (optional)

#### TC7.4: Get Directions
1. Click "Get Directions" on a service
2. **Expected:** Opens maps app or shows route

### Success Criteria
- ✅ Geocoding works
- ✅ Services found accurately
- ✅ Distances calculated correctly
- ✅ OpenStreetMap integration
- ✅ Results sorted by distance

---

## Module 8: Draft Generator

**URL:** `/drafts`

### Test Cases

#### TC8.1: Generate Application
1. Select draft type: "Government Application"
2. Enter purpose: "Applying for ration card"
3. Fill in personal details
4. Click "Generate Draft"
5. **Expected:**
   - Formal application generated
   - Proper formatting
   - All required sections included

#### TC8.2: Generate Letter
1. Select "Formal Letter"
2. Purpose: "Request for certificate"
3. Generate
4. **Expected:**
   - Letter format correct
   - Greeting and closing appropriate

#### TC8.3: Edit Generated Draft
1. After generation, edit content
2. Make changes
3. Click "Save"
4. **Expected:** Draft saved with edits

#### TC8.4: Version History
1. Edit draft multiple times
2. Check version history
3. **Expected:** Can view past versions
4. **Expected:** Can restore old version

### Success Criteria
- ✅ Professional formatting
- ✅ Context-appropriate content
- ✅ Edit functionality works
- ✅ Saves correctly
- ✅ Version control functional

---

## Module 9: Dashboard

**URL:** `/`

### Test Cases

#### TC9.1: View Personalized Dashboard
1. Log in as user
2. Navigate to dashboard
3. **Expected:** Username displayed (not "John")
4. **Expected:** Quick access cards visible

#### TC9.2: Voice Shortcuts
1. Click voice icon on any feature card
2. **Expected:** Can activate features via voice
3. **Expected:** Shortcut works correctly

#### TC9.3: Recent Activity
1. Check recent activity section
2. **Expected:** Shows latest queries, checks, etc.
3. **Expected:** Quick links to continue tasks

### Success Criteria
- ✅ Personalization works
- ✅ Voice shortcuts functional
- ✅ All feature cards accessible
- ✅ Recent activity accurate

---

## Module 10: Settings & Theme

**URL:** Settings accessible from any page

### Test Cases

#### TC10.1: Theme Toggle
1. Click theme toggle (top-right)
2. **Expected:** Switches to dark mode
3. **Expected:** Colors match spec:
   - Dark background: #121212
   - Dark text: #F0F0F0
   - Accent: #1E90FF
4. Toggle back
5. **Expected:** Light mode colors:
   - Light background: #F7F7F7
   - Light text: #2F4F4F
   - Accent: #1E90FF

#### TC10.2: Theme Persistence
1. Toggle theme
2. Refresh page
3. **Expected:** Theme persists

#### TC10.3: Profile Settings
1. Navigate to profile
2. Update details
3. Save
4. **Expected:** Changes saved

### Success Criteria
- ✅ Theme toggle works
- ✅ Colors match specification
- ✅ Theme persists across sessions
- ✅ All pages respect theme

---

## Cross-Module Integration Tests

### INT1: Voice → Eligibility
1. Use voice assistant to ask about eligibility
2. System should suggest going to eligibility checker
3. Navigate and continue seamlessly

### INT2: Document → Draft
1. Analyze a document
2. Use extracted info to generate a draft
3. Should auto-fill relevant fields

### INT3: Market → Voice
1. View market data
2. Ask voice assistant about prices
3. Get current information

---

## Performance Tests

### PERF1: Page Load Time
- **Target:** <2 seconds initial load
- **Test:** Use Lighthouse or PageSpeed Insights

### PERF2: API Response Time
- **Target:** <1 second for most endpoints
- **Test:** Check Network tab

### PERF3: Voice Processing
- **Target:** <5 seconds end-to-end
- **Test:** Record → transcript → response

---

## Browser Compatibility

Test on:
- ✅ Chrome 90+ (primary)
- ✅ Firefox 90+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile Chrome (Android)
- ✅ Mobile Safari (iOS)

---

## Accessibility Tests

### WCAG Compliance
1. Run axe DevTools
2. **Expected:** No critical issues
3. Check keyboard navigation
4. **Expected:** All features accessible via keyboard

### Screen Reader
1. Use NVDA/JAWS
2. Navigate through app
3. **Expected:** All content readable

---

## Security Tests

### SEC1: API Key Exposure
1. Open DevTools → Network
2. Check all API calls
3. **Expected:** API keys never exposed

### SEC2: Input Validation
1. Try SQL injection in forms
2. **Expected:** Input sanitized
3. Try XSS attacks
4. **Expected:** React escapes content

---

## Error Handling Tests

### ERR1: Network Failure
1. Turn off internet
2. Try to use features
3. **Expected:** Graceful error messages
4. **Expected:** Retry option available

### ERR2: API Failure
1. Use invalid API key
2. **Expected:** Clear error message
3. **Expected:** Doesn't crash app

### ERR3: Invalid Input
1. Submit empty forms
2. Upload wrong file types
3. **Expected:** Validation errors shown
4. **Expected:** Helpful error messages

---

## Test Summary Checklist

- [ ] All 10 modules tested
- [ ] Voice recording works
- [ ] API integrations functional
- [ ] Database operations correct
- [ ] Theme system works
- [ ] Caching effective
- [ ] Error handling robust
- [ ] Performance acceptable
- [ ] Browser compatibility verified
- [ ] Security measures in place
- [ ] Accessibility standards met
- [ ] Documentation accurate

---

## Reporting Issues

When reporting bugs:
1. Module name
2. Steps to reproduce
3. Expected vs actual behavior
4. Browser/device info
5. Screenshots/videos

---

**Testing Guide Version:** 1.0.0

**Last Updated:** November 15, 2025
