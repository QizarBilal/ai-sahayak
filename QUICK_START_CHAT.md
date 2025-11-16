# 🚀 Chat Assistant Quick Start Guide

## ⚡ 30-Second Setup

### 1. **Add OpenRouter API Key** (Optional but Recommended)

```env
# In .env file
OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

Get free key: https://openrouter.ai/

### 2. **Restart Server**

```powershell
npm run dev
```

### 3. **Test It!**

Open Chat Assistant and ask:
- "What is the price of tomatoes?"
- "How do I apply for PM-Kisan?"
- "What is this website?"

---

## 🎯 What You Get

### ✅ **Real-Time AI Mode** (with OpenRouter key)
- Intelligent responses using DeepSeek/Llama/Mistral AI
- Complex question answering
- Conversational context awareness

### ✅ **Offline/Fallback Mode** (works without API)
- 400+ pre-trained responses
- Market prices for vegetables & crops
- Government scheme details (PM-Kisan, Ayushman, etc.)
- Website usage guidance

### ✅ **Automatic Fallback**
```
OpenRouter API → Gemini API → Static Knowledge
```
Never fails, always responds!

### ✅ **Voice Output**
- All responses spoken in your language
- 10 Indian languages supported
- Clear, natural speech

---

## 📝 Example Queries

### **Market Prices** (Static Knowledge)
```
✓ "What is the price of tomatoes?"
✓ "Onion rate today"
✓ "Cotton market price"
✓ "Tamatar ka bhav" (Hindi)
```

### **Government Schemes** (Static Knowledge)
```
✓ "How do I apply for PM-Kisan?"
✓ "What is Ayushman Bharat?"
✓ "Pension scheme eligibility"
✓ "Housing scheme for poor"
✓ "Student scholarship apply"
```

### **Complex Questions** (OpenRouter AI)
```
✓ "Explain PM-Kisan benefits in detail"
✓ "Compare rural and urban housing schemes"
✓ "What documents needed for multiple schemes?"
✓ "How to maximize farmer subsidies?"
```

---

## 🔧 Troubleshooting

### ❌ "API not working" message appears

**This is normal!** It means:
1. OpenRouter key not set (or invalid)
2. API temporarily unavailable
3. Internet connection issue

**✅ System automatically uses static knowledge**
- You still get accurate answers for trained topics
- Add OpenRouter key to enable AI mode

### ❌ Voice not working

**Solutions:**
- Use Chrome or Edge browser (best TTS support)
- Check system audio/volume
- Allow browser permissions for speech
- Try refreshing page

### ❌ Responses in wrong language

**Solutions:**
- Check language selector (top-right)
- System responds in selected language
- Voice output matches selected language

---

## 📊 Coverage

### **Static Knowledge Includes:**

| Topic | Coverage |
|-------|----------|
| **Market Prices** | 100+ items (vegetables, grains, crops) |
| **Gov Schemes** | 8 major schemes with full details |
| **Website Help** | All features explained |
| **Modules** | Complete usage guides |

### **Total: 400+ Pre-Trained Responses**

---

## 💡 Pro Tips

### **Tip 1: Use Specific Keywords**
✅ "PM-Kisan apply process"  
❌ "Tell me about farming things"

### **Tip 2: Try Multiple Phrasings**
- "Tomato price"
- "What is tomato rate?"
- "Tamatar ka bhav"

All work due to smart matching!

### **Tip 3: Voice First**
Click mic button for hands-free operation
- Automatic voice input
- Automatic voice output
- Perfect for rural users

### **Tip 4: Language Switching**
Responses adapt to your language:
- Switch to Hindi → Get Hindi responses
- Switch to Tamil → Get Tamil responses
- Works for all 10 supported languages

---

## 🎓 For Developers

### **Add New Knowledge:**

Edit: `client/src/data/chatStaticKnowledge.ts`

```typescript
{
  category: "Market Prices",
  patterns: [
    "wheat price", "gehun ka bhav", "wheat rate"
  ],
  keywords: ["wheat", "gehun", "price", "bhav", "rate"],
  answer: "Wheat is currently priced at ₹25-30 per kg...",
  simpleAnswer: "Wheat costs about 25 to 30 rupees per kilo"
}
```

### **Change AI Model:**

Edit: `server/routes.ts` line ~365

```typescript
model: 'deepseek/deepseek-chat-v3:free', // Change this
```

Available free models:
- `deepseek/deepseek-chat-v3:free`
- `meta-llama/llama-3.2-3b-instruct:free`
- `mistralai/mistral-small-2402:free`

---

## 📚 Full Documentation

- **Complete Guide**: `CHAT_ASSISTANT_ENHANCEMENT.md`
- **Testing Guide**: `TESTING_GUIDE_CHAT_ASSISTANT.md`
- **Implementation**: `IMPLEMENTATION_SUMMARY_CHAT.md`

---

## ✅ Quick Verification

1. ✓ Open Chat Assistant
2. ✓ Ask: "What is the price of tomatoes?"
3. ✓ Should see: Price details with fallback prefix (if no API)
4. ✓ Click voice icon
5. ✓ Should hear: Response spoken in your language

**If all work → Setup Complete!** 🎉

---

## 🆘 Need Help?

1. Check `CHAT_ASSISTANT_ENHANCEMENT.md` for detailed docs
2. Run test queries from `TESTING_GUIDE_CHAT_ASSISTANT.md`
3. Review inline code comments
4. Open GitHub issue if stuck

---

**Version**: 2.0.0  
**Status**: ✅ Production Ready  
**Last Updated**: January 2025
