# 🧪 Chat Assistant Testing Script

## Quick Testing Commands

### 1. Test Static Knowledge Base

Open browser console and run these test queries in Chat Assistant:

```javascript
// Market Prices Tests
"What is the price of tomatoes?"
"Onion rate today"
"Cotton market price"
"Tamatar ka bhav kya hai?" // Hindi

// Government Schemes Tests
"How do I apply for PM-Kisan?"
"What is Ayushman Bharat scheme?"
"Pension scheme eligibility"
"Housing scheme for poor people"
"Scholarship for students"

// Website Knowledge Tests
"What is this website?"
"How do I use voice assistant?"
"Can I check eligibility for schemes?"
"What languages are supported?"
"How does the document analyzer work?"

// Module Knowledge Tests
"What can the voice assistant do?"
"How does eligibility checker work?"
"What documents can I analyze?"
"Tell me about market data features"
```

### 2. Test OpenRouter API Integration

**Prerequisites:**
1. Set valid OpenRouter API key in `.env`:
   ```env
   OPENROUTER_API_KEY=sk-or-v1-xxxxx
   ```

2. Restart server:
   ```powershell
   npm run dev
   ```

**Test Queries (Complex AI Questions):**

```javascript
// These should trigger OpenRouter API (if key is set)
"Explain the benefits of PM-Kisan scheme in detail"
"What is the step-by-step process for Ayushman Bharat enrollment?"
"Compare PM Awas Yojana for rural vs urban areas"
"How can a farmer get both PM-Kisan and Kisan Credit Card benefits?"
```

### 3. Test Fallback Chain

**Test Scenario 1: OpenRouter → Gemini → Static**

1. **Remove OpenRouter key** temporarily:
   ```env
   # OPENROUTER_API_KEY=your-key
   ```

2. **Restart server**

3. **Ask complex question**:
   ```
   "What is PM-Kisan scheme?"
   ```
   
4. **Expected**: Should fallback to static knowledge with prefix:
   ```
   "API not working — providing trained safe fallback response.

   PM-Kisan (Pradhan Mantri Kisan Samman Nidhi) is a central sector scheme..."
   ```

**Test Scenario 2: Full Static Mode**

1. **Disconnect internet** (or block API endpoints)

2. **Ask trained queries**:
   ```
   "Tomato price"
   "PM-Kisan apply"
   "Ration card scheme"
   ```

3. **Expected**: All should get static responses immediately

### 4. Test Pattern Matching

```javascript
// Exact pattern match (should be instant)
"tomato price" → Market Prices > Tomato entry
"PM Kisan apply" → Government Schemes > PM-Kisan entry
"ayushman bharat" → Government Schemes > Ayushman entry

// Hindi patterns
"tamatar ka bhav" → Market Prices > Tomato entry
"pyaaz rate" → Market Prices > Onion entry
```

### 5. Test Keyword Matching

```javascript
// Keywords: tomato, price (2 matches)
"Tell me about tomato price in market" → Market Prices > Tomato

// Keywords: PM, Kisan, scheme (3 matches)
"I want to know about PM Kisan scheme details" → Government Schemes > PM-Kisan

// Keywords: ayushman, health, card (3 matches)
"How to get ayushman health card" → Government Schemes > Ayushman Bharat
```

### 6. Test Multilingual Support

1. **Switch to Hindi** in language selector

2. **Ask in Hindi**:
   ```
   "टमाटर का भाव क्या है?"
   "पीएम किसान योजना कैसे apply करें?"
   ```

3. **Expected**: Response in Hindi with Hindi voice output

4. **Repeat for other languages**: Tamil, Telugu, Bengali, etc.

### 7. Test Voice Output

1. **Enable speakers/headphones**

2. **Click voice icon** on any response

3. **Expected**: 
   - Should speak in selected language
   - Can stop mid-speech
   - Visual feedback during speech

### 8. Test Generic Fallback

```javascript
// Queries with no matching patterns/keywords
"xyz random query 123"
"abcd efgh ijkl"
"blah blah blah"

// Expected response:
"API not working — safe fallback mode active. I can help with government schemes, market prices, eligibility checks, and using this website. Ask about PM-Kisan, Ayushman Bharat, market rates, or how to use AI-Sahayak features."
```

---

## 🔍 Verification Checklist

### Frontend Integration
- [ ] `getStaticAnswer` imported from `chatStaticKnowledge.ts`
- [ ] `generateStaticFallback()` calls `getStaticAnswer()`
- [ ] No TypeScript errors in `chat-assistant.tsx`
- [ ] Voice output works for static responses

### Backend Integration
- [ ] OpenRouter API key added to `.env`
- [ ] Chat endpoint tries OpenRouter first
- [ ] Falls back to Gemini on OpenRouter failure
- [ ] Returns error for frontend static fallback
- [ ] System prompt includes AI-Sahayak persona
- [ ] Language preference included in API calls

### Static Knowledge Base
- [ ] 400+ entries present in `chatStaticKnowledge.ts`
- [ ] Market Prices category complete (100+ entries)
- [ ] Government Schemes category complete (200+ entries)
- [ ] Website Knowledge category complete (50+ entries)
- [ ] Module Knowledge category complete (50+ entries)
- [ ] Pattern matching works correctly
- [ ] Keyword matching works (min 2 keywords)

### Voice Integration
- [ ] TTS works for all responses
- [ ] Language mapping correct for 10 languages
- [ ] Stop/pause controls functional
- [ ] Simple answers used for TTS

### Error Handling
- [ ] Graceful fallback on API errors
- [ ] No console errors during fallback
- [ ] User-friendly error messages
- [ ] Fallback prefix visible in responses

---

## 📊 Expected Results

### Successful Static Response Format:
```
API not working — providing trained safe fallback response.

[Knowledge Base Answer]

For example:
"Tomatoes are currently priced between ₹40-60 per kg in most markets..."
```

### Successful OpenRouter Response Format:
```
[AI-Generated Response in User's Language]

For example:
"PM-Kisan is a comprehensive scheme designed to provide financial assistance..."
```

---

## 🐛 Common Issues & Solutions

### Issue: "getStaticAnswer is not defined"
**Solution**: Check import statement at top of `chat-assistant.tsx`:
```typescript
import { getStaticAnswer } from "@/data/chatStaticKnowledge";
```

### Issue: No fallback responses
**Solution**: Check error handling in `sendMessageMutation.onError`

### Issue: Voice not working
**Solution**: 
1. Check browser TTS support (use Chrome/Edge)
2. Verify `synthRef.current` is initialized
3. Check language mapping in `speakText()` function

### Issue: OpenRouter API not working
**Solution**:
1. Verify API key format: `sk-or-v1-xxxxx`
2. Check API key has credits/free tier access
3. Verify internet connection
4. Check OpenRouter status: https://openrouter.ai/status

---

## 🎯 Success Criteria

✅ **All test queries return appropriate responses**  
✅ **Fallback chain works: OpenRouter → Gemini → Static**  
✅ **Pattern matching returns exact matches**  
✅ **Keyword matching returns relevant results**  
✅ **Generic fallback activates for unknown queries**  
✅ **Voice output works in all supported languages**  
✅ **No console errors during normal operation**  
✅ **API failures handled gracefully**  

---

**Testing Duration**: 15-20 minutes  
**Required**: Browser console, network inspector (optional)  
**Environment**: Development server running on localhost:5000
