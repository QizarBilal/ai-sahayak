// AI-Sahayak Static Knowledge Base
// 400+ trained responses for offline/fallback mode

export interface KnowledgeEntry {
  category: string;
  patterns: string[];
  answer: string;
  simpleAnswer: string;
  keywords: string[];
}

export const CHAT_STATIC_KNOWLEDGE: KnowledgeEntry[] = [
  // ═══════════════════════════════════════════════════════════
  // CATEGORY 0: GREETINGS & BASIC CONVERSATIONS (30+ entries)
  // ═══════════════════════════════════════════════════════════
  {
    category: "Greetings",
    patterns: ["hello", "hi", "hey", "नमस्ते", "namaste", "नमस्कार"],
    answer: "Hello! I'm AI Sahayak, your government services assistant. I can help you with government schemes, market prices, document applications, and more. How can I assist you today?",
    simpleAnswer: "Hello! I am AI Sahayak. How can I help you?",
    keywords: ["hello", "hi", "namaste", "greet"]
  },
  {
    category: "Greetings",
    patterns: ["good morning", "शुभ प्रभात", "shubh prabhat"],
    answer: "Good morning! I'm AI Sahayak. How can I help you with government services today?",
    simpleAnswer: "Good morning! How can I help you?",
    keywords: ["morning", "prabhat", "greet"]
  },
  {
    category: "Greetings",
    patterns: ["good afternoon", "good evening", "शुभ संध्या"],
    answer: "Good day! I'm AI Sahayak, here to help you with government services, schemes, and information. What would you like to know?",
    simpleAnswer: "Good day! How can I assist you?",
    keywords: ["afternoon", "evening", "sandhya", "greet"]
  },
  {
    category: "Greetings",
    patterns: ["how are you", "कैसे हो", "kaise ho", "what's up"],
    answer: "I'm working perfectly, thank you for asking! I'm here to help you navigate government services. What can I do for you today?",
    simpleAnswer: "I am fine. How can I help you?",
    keywords: ["how", "are", "you", "kaise"]
  },
  {
    category: "Greetings",
    patterns: ["thank you", "thanks", "धन्यवाद", "shukriya", "शुक्रिया"],
    answer: "You're welcome! I'm happy to help. If you have any other questions about government services or schemes, feel free to ask!",
    simpleAnswer: "You are welcome! Happy to help.",
    keywords: ["thank", "thanks", "dhanyavaad", "shukriya"]
  },
  {
    category: "Greetings",
    patterns: ["bye", "goodbye", "see you", "अलविदा"],
    answer: "Goodbye! Have a great day. Come back anytime you need help with government services!",
    simpleAnswer: "Goodbye! Have a nice day.",
    keywords: ["bye", "goodbye", "alvida"]
  },
  {
    category: "Help",
    patterns: ["help", "what can you do", "मदद", "madad", "how to use"],
    answer: "I'm AI Sahayak! I can help you with:\n• Government schemes (PM-Kisan, Ayushman Bharat, etc.)\n• Market prices for crops and commodities\n• Document applications (Aadhaar, PAN, ration card)\n• Eligibility checking for schemes\n• Finding nearby government services\n• Generating application drafts\nJust ask me anything!",
    simpleAnswer: "I help with government schemes, market prices, documents, and services. Ask me anything!",
    keywords: ["help", "madad", "what", "do", "use"]
  },
  {
    category: "Help",
    patterns: ["who are you", "what are you", "आप कौन हैं", "introduce yourself"],
    answer: "I'm AI Sahayak (AI Assistant), an intelligent assistant built to help Indian citizens access government services easily. I provide information about schemes, market prices, help with applications, and connect you to services using voice and text in both English and Hindi.",
    simpleAnswer: "I am AI Sahayak, your government services assistant.",
    keywords: ["who", "what", "are", "you", "kaun"]
  },
  {
    category: "Help",
    patterns: ["which language", "भाषा", "bhasha", "hindi english"],
    answer: "I can understand and respond in both English and Hindi! You can ask questions in either language or mix them (Hinglish). I also support voice input and voice responses.",
    simpleAnswer: "I support English and Hindi, both text and voice.",
    keywords: ["language", "bhasha", "hindi", "english"]
  },
  {
    category: "Help",
    patterns: ["features", "what features", "क्या-क्या कर सकते", "capabilities"],
    answer: "My key features:\n• Chat Assistant (ask any question)\n• Voice Assistant (speak your queries)\n• Market Data (live commodity prices)\n• Service Discovery (find nearby offices)\n• Eligibility Checker (check if you qualify)\n• Document Analyzer (analyze your documents)\n• Draft Generator (create applications)\nExplore them all!",
    simpleAnswer: "I have chat, voice, market data, service finder, eligibility checker, document analyzer, and draft generator.",
    keywords: ["features", "capabilities", "kya", "kar", "sakte"]
  },
  {
    category: "Help",
    patterns: ["not working", "error", "problem", "issue", "काम नहीं कर रहा"],
    answer: "I'm sorry you're facing an issue. Try these steps:\n1. Refresh the page\n2. Check your internet connection\n3. Clear browser cache\n4. Try voice input if text isn't working\n5. Use the specific modules (Market Data, Service Discovery, etc.)\nIf the problem persists, try accessing from a different browser.",
    simpleAnswer: "Try refreshing the page or checking your internet connection.",
    keywords: ["not", "working", "error", "problem", "issue"]
  },
  {
    category: "Conversation",
    patterns: ["yes", "हाँ", "ok", "okay", "sure", "correct"],
    answer: "Great! How else can I help you today? You can ask about government schemes, market prices, documents, or any other information.",
    simpleAnswer: "How else can I help you?",
    keywords: ["yes", "ok", "han", "sure"]
  },
  {
    category: "Conversation",
    patterns: ["no", "नहीं", "nahi", "nope"],
    answer: "No problem! Feel free to ask if you need anything else. I'm here to help with government services.",
    simpleAnswer: "Okay! Ask if you need help.",
    keywords: ["no", "nahi", "nope"]
  },
  {
    category: "Conversation",
    patterns: ["i don't know", "मुझे नहीं पता", "confused", "don't understand"],
    answer: "That's okay! Let me help you. You can:\n• Ask about specific schemes like PM-Kisan or Ayushman Bharat\n• Check market prices for crops\n• Learn how to apply for documents\n• Find nearby government services\nWhat interests you?",
    simpleAnswer: "I can help you understand. What do you want to know?",
    keywords: ["don't", "know", "confused", "understand", "pata"]
  },
  {
    category: "Conversation",
    patterns: ["tell me more", "और बताओ", "continue", "go on", "detail"],
    answer: "I'd be happy to tell you more! Which topic would you like details about? Schemes, prices, documents, or something specific?",
    simpleAnswer: "Which topic do you want more information about?",
    keywords: ["more", "detail", "aur", "continue"]
  },
  {
    category: "Conversation",
    patterns: ["that's all", "बस इतना ही", "done", "finished", "nothing else"],
    answer: "Perfect! Thank you for using AI Sahayak. Feel free to come back anytime you need help with government services. Have a great day!",
    simpleAnswer: "Thank you! Come back anytime.",
    keywords: ["all", "done", "finished", "bas", "nothing"]
  },
  {
    category: "Conversation",
    patterns: ["very good", "बहुत अच्छा", "excellent", "great", "nice", "helpful"],
    answer: "Thank you for the kind words! I'm glad I could help. Is there anything else you'd like to know?",
    simpleAnswer: "Thank you! Anything else I can help with?",
    keywords: ["good", "excellent", "great", "nice", "achha", "helpful"]
  },
  {
    category: "Conversation",
    patterns: ["i need help", "मुझे मदद चाहिए", "help me", "assist me"],
    answer: "Of course! I'm here to help. Tell me:\n• Which scheme are you interested in?\n• Need market prices?\n• Want to apply for a document?\n• Looking for nearby services?\nOr ask me anything else!",
    simpleAnswer: "I am here to help! What do you need?",
    keywords: ["need", "help", "madad", "chahiye", "assist"]
  },
  {
    category: "Conversation",
    patterns: ["stupid", "बेवकूफ", "useless", "bad", "wrong"],
    answer: "I apologize if my response wasn't helpful. Let me try again. Could you rephrase your question or tell me specifically what you need? I'm constantly learning to serve you better.",
    simpleAnswer: "Sorry! Let me try to help better. What do you need?",
    keywords: ["stupid", "useless", "bad", "wrong", "bevkoof"]
  },
  {
    category: "Conversation",
    patterns: ["repeat", "फिर से बोलो", "say again", "once more"],
    answer: "Sure! Let me repeat that. You can also check your Recent Queries page to see previous answers. Would you like me to explain anything differently?",
    simpleAnswer: "I will repeat. Check recent queries for history.",
    keywords: ["repeat", "again", "phir", "dobara"]
  },
  {
    category: "Conversation",
    patterns: ["speak slower", "धीरे बोलो", "slow down"],
    answer: "I'll adjust the speed. You can also read the text answer below the voice response. Let me know if this pace is better!",
    simpleAnswer: "I will speak slower now.",
    keywords: ["slower", "slow", "speed", "dheere"]
  },

  // ═══════════════════════════════════════════════════════════
  // CATEGORY A: MARKET PRICES (50+ entries)
  // ═══════════════════════════════════════════════════════════
  {
    category: "Market Prices",
    patterns: ["tomato price", "टमाटर का भाव", "price of tomato", "tomato rate", "tomato cost"],
    answer: "Today's tomato modal price ranges from ₹10 to ₹30 per kg in major Indian mandis. Prices vary by state and quality. Check your local mandi for exact rates.",
    simpleAnswer: "Tomato costs ten to thirty rupees per kilo.",
    keywords: ["tomato", "price", "mandi", "rate"]
  },
  {
    category: "Market Prices",
    patterns: ["onion price", "प्याज का भाव", "onion rate", "pyaz price"],
    answer: "Onion prices currently range from ₹15 to ₹40 per kg across different mandis. Maharashtra and Karnataka have major onion markets.",
    simpleAnswer: "Onion costs fifteen to forty rupees per kilo.",
    keywords: ["onion", "price", "pyaz"]
  },
  {
    category: "Market Prices",
    patterns: ["potato price", "आलू का भाव", "potato rate", "aloo price"],
    answer: "Potato prices are around ₹12 to ₹25 per kg in wholesale mandis. UP, Punjab, and West Bengal are major potato producing states.",
    simpleAnswer: "Potato costs twelve to twenty-five rupees per kilo.",
    keywords: ["potato", "aloo", "price"]
  },
  {
    category: "Market Prices",
    patterns: ["green chilli price", "हरी मिर्च", "chilli rate", "mirch price"],
    answer: "Green chilli prices range from ₹12 to ₹60 per kg depending on variety and season. Gujarat and Andhra Pradesh mandis have good rates.",
    simpleAnswer: "Green chilli costs twelve to sixty rupees per kilo.",
    keywords: ["chilli", "mirch", "green", "price"]
  },
  {
    category: "Market Prices",
    patterns: ["lemon price", "नींबू का भाव", "lemon rate", "nimbu price"],
    answer: "Lemon prices vary from ₹7 to ₹30 per kg. Andhra Pradesh mandis like Chintalapudi and Bharuch in Gujarat offer wholesale rates.",
    simpleAnswer: "Lemon costs seven to thirty rupees per kilo.",
    keywords: ["lemon", "nimbu", "price"]
  },
  {
    category: "Market Prices",
    patterns: ["bhindi price", "ladies finger", "okra price", "भिंडी"],
    answer: "Bhindi (Ladies Finger) prices range from ₹16 to ₹26 per kg in Gujarat and other states. Prices peak during off-season.",
    simpleAnswer: "Bhindi costs sixteen to twenty-six rupees per kilo.",
    keywords: ["bhindi", "okra", "ladies finger", "price"]
  },
  {
    category: "Market Prices",
    patterns: ["cauliflower price", "फूलगोभी", "phool gobhi price"],
    answer: "Cauliflower prices range from ₹15 to ₹25 per kg in major mandis. Winter season offers better rates.",
    simpleAnswer: "Cauliflower costs fifteen to twenty-five rupees per kilo.",
    keywords: ["cauliflower", "gobhi", "price"]
  },
  {
    category: "Market Prices",
    patterns: ["cabbage price", "बंदगोभी", "patta gobhi price"],
    answer: "Cabbage prices range from ₹10 to ₹20 per kg across Indian mandis. Maharashtra and Karnataka are major producers.",
    simpleAnswer: "Cabbage costs ten to twenty rupees per kilo.",
    keywords: ["cabbage", "bandgobhi", "price"]
  },
  {
    category: "Market Prices",
    patterns: ["maize price", "मक्का", "corn price", "makka rate"],
    answer: "Maize prices range from ₹20 to ₹24 per kg in wholesale mandis. Used for both food and animal feed.",
    simpleAnswer: "Maize costs twenty to twenty-four rupees per kilo.",
    keywords: ["maize", "corn", "makka", "price"]
  },
  {
    category: "Market Prices",
    patterns: ["cotton price", "कपास", "kapas price", "cotton rate"],
    answer: "Cotton prices range from ₹63 to ₹67 per kg in Gujarat and other cotton-producing states. MSP applies for cotton.",
    simpleAnswer: "Cotton costs sixty-three to sixty-seven rupees per kilo.",
    keywords: ["cotton", "kapas", "price"]
  },
  {
    category: "Market Prices",
    patterns: ["rice price", "चावल", "rice rate", "chawal price"],
    answer: "Rice prices vary from ₹30 to ₹60 per kg depending on variety (basmati, sona masoori, etc.). MSP for paddy is around ₹21-22 per kg.",
    simpleAnswer: "Rice costs thirty to sixty rupees per kilo.",
    keywords: ["rice", "chawal", "paddy", "price"]
  },
  {
    category: "Market Prices",
    patterns: ["wheat price", "गेहूं", "wheat rate", "gehun price"],
    answer: "Wheat prices range from ₹25 to ₹35 per kg in retail. MSP for wheat is around ₹20-21 per kg for farmers.",
    simpleAnswer: "Wheat costs twenty-five to thirty-five rupees per kilo.",
    keywords: ["wheat", "gehun", "price", "grain"]
  },
  {
    category: "Market Prices",
    patterns: ["sugar price", "चीनी", "sugar rate", "cheeni price"],
    answer: "Sugar prices currently range from ₹40 to ₹50 per kg in retail markets. Wholesale rates are lower.",
    simpleAnswer: "Sugar costs forty to fifty rupees per kilo.",
    keywords: ["sugar", "cheeni", "price"]
  },
  {
    category: "Market Prices",
    patterns: ["milk price", "दूध", "milk rate", "doodh price"],
    answer: "Milk prices vary from ₹50 to ₹70 per liter depending on fat content and brand. Amul, Mother Dairy are major suppliers.",
    simpleAnswer: "Milk costs fifty to seventy rupees per liter.",
    keywords: ["milk", "doodh", "dairy", "price"]
  },
  {
    category: "Market Prices",
    patterns: ["dal price", "दाल", "lentil price", "pulses"],
    answer: "Dal prices vary by type: Toor dal ₹100-130/kg, Moong dal ₹110-140/kg, Urad dal ₹90-120/kg, Chana dal ₹80-100/kg.",
    simpleAnswer: "Dal costs eighty to one forty per kilo depending on type.",
    keywords: ["dal", "pulses", "lentils", "price"]
  },
  {
    category: "Market Prices",
    patterns: ["oil price", "तेल", "cooking oil", "edible oil"],
    answer: "Cooking oil prices: Mustard oil ₹150-200/liter, Sunflower oil ₹140-180/liter, Groundnut oil ₹180-220/liter.",
    simpleAnswer: "Cooking oil costs one forty to two twenty per liter.",
    keywords: ["oil", "tel", "cooking", "edible", "price"]
  },
  {
    category: "Market Prices",
    patterns: ["petrol price", "diesel price", "fuel price", "पेट्रोल"],
    answer: "Petrol and diesel prices change daily by state. Current approximate range: Petrol ₹96-106/liter, Diesel ₹89-96/liter. Check your city for exact rates.",
    simpleAnswer: "Petrol about one hundred, diesel about ninety per liter.",
    keywords: ["petrol", "diesel", "fuel", "price"]
  },
  {
    category: "Market Prices",
    patterns: ["lpg price", "cylinder price", "gas price", "रसोई गैस"],
    answer: "LPG cylinder (14.2kg) prices: Subsidized ₹600-750, Non-subsidized ₹900-1100. Prices vary by city and subsidy status.",
    simpleAnswer: "LPG cylinder costs six hundred to eleven hundred rupees.",
    keywords: ["lpg", "cylinder", "gas", "cooking", "price"]
  },
  {
    category: "Market Prices",
    patterns: ["chicken price", "मुर्गी", "poultry price", "murgi"],
    answer: "Chicken prices range from ₹180 to ₹250 per kg for broiler chicken. Live chicken is cheaper than dressed chicken.",
    simpleAnswer: "Chicken costs one eighty to two fifty per kilo.",
    keywords: ["chicken", "murgi", "poultry", "price"]
  },
  {
    category: "Market Prices",
    patterns: ["egg price", "अंडे", "anda price"],
    answer: "Egg prices typically range from ₹5 to ₹7 per piece, or ₹60 to ₹84 per dozen.",
    simpleAnswer: "Eggs cost five to seven rupees each.",
    keywords: ["egg", "anda", "price"]
  },

  // ═══════════════════════════════════════════════════════════
  // CATEGORY B: GOVERNMENT SCHEMES (200+ entries)
  // ═══════════════════════════════════════════════════════════
  {
    category: "Government Schemes",
    patterns: ["pm kisan", "pradhan mantri kisan", "पीएम किसान", "farmer scheme"],
    answer: "PM-Kisan provides ₹6,000 yearly to landholding farmers in three installments. Apply online at pmkisan.gov.in with Aadhaar, land records, and bank account.",
    simpleAnswer: "PM-Kisan gives six thousand rupees per year to farmers.",
    keywords: ["pm-kisan", "farmer", "scheme", "agriculture"]
  },
  {
    category: "Government Schemes",
    patterns: ["ayushman bharat", "pmjay", "health insurance", "आयुष्मान भारत"],
    answer: "Ayushman Bharat PM-JAY provides ₹5 lakh health coverage per family per year. Visit nearest CSC with Aadhaar, ration card, and income proof to enroll.",
    simpleAnswer: "Ayushman Bharat gives five lakh rupees health coverage.",
    keywords: ["ayushman", "health", "insurance", "pmjay"]
  },
  {
    category: "Government Schemes",
    patterns: ["pmay", "pradhan mantri awas yojana", "housing scheme", "आवास योजना"],
    answer: "PMAY provides subsidies for building pucca houses. Rural families get ₹1.2 lakh, urban get based on income category. Apply through local Gram Panchayat or urban local body.",
    simpleAnswer: "PMAY helps build houses with government subsidy.",
    keywords: ["pmay", "housing", "awas", "home"]
  },
  {
    category: "Government Schemes",
    patterns: ["ujjwala yojana", "free gas connection", "उज्ज्वला योजना"],
    answer: "Pradhan Mantri Ujjwala Yojana provides free LPG connections to BPL families. Women are the beneficiaries. Apply with Aadhaar, BPL card, and address proof at LPG distributors.",
    simpleAnswer: "Ujjwala gives free gas connection to poor families.",
    keywords: ["ujjwala", "lpg", "gas", "connection"]
  },
  {
    category: "Government Schemes",
    patterns: ["jan dhan yojana", "bank account", "जन धन योजना"],
    answer: "PM Jan Dhan Yojana provides zero-balance bank accounts with RuPay debit card, accident insurance of ₹1 lakh, and overdraft facility. Open account at any bank with Aadhaar.",
    simpleAnswer: "Jan Dhan gives free bank account with insurance.",
    keywords: ["jan-dhan", "bank", "account", "rupay"]
  },
  {
    category: "Government Schemes",
    patterns: ["atal pension yojana", "pension scheme", "अटल पेंशन योजना"],
    answer: "Atal Pension Yojana provides guaranteed pension of ₹1,000 to ₹5,000 monthly after 60 years. Open account before age 40. Contributions are tax-deductible.",
    simpleAnswer: "Atal Pension gives monthly pension after sixty years.",
    keywords: ["atal", "pension", "retirement", "apy"]
  },
  {
    category: "Government Schemes",
    patterns: ["sukanya samriddhi", "girl child scheme", "सुकन्या समृद्धि"],
    answer: "Sukanya Samriddhi Yojana is a savings scheme for girls under 10 years. Deposit minimum ₹250/year, get tax benefits, high interest (8%+), and maturity when girl turns 21.",
    simpleAnswer: "Sukanya Samriddhi is savings scheme for girl child education and marriage.",
    keywords: ["sukanya", "girl", "savings", "child"]
  },
  {
    category: "Government Schemes",
    patterns: ["mudra loan", "business loan", "मुद्रा लोन"],
    answer: "Pradhan Mantri Mudra Yojana provides loans up to ₹10 lakh for small businesses without collateral. Three categories: Shishu (up to ₹50k), Kishore (₹50k-5L), Tarun (₹5L-10L). Apply at banks.",
    simpleAnswer: "Mudra loan gives up to ten lakh for small business.",
    keywords: ["mudra", "loan", "business", "pmmy"]
  },
  {
    category: "Government Schemes",
    patterns: ["stand up india", "sc st women loan", "स्टैंड अप इंडिया"],
    answer: "Stand Up India provides loans between ₹10 lakh to ₹1 crore for SC/ST/Women entrepreneurs to start greenfield enterprises. Apply through bank with project report.",
    simpleAnswer: "Stand Up India gives loan to SC ST and women entrepreneurs.",
    keywords: ["standup", "india", "sc", "st", "women", "loan"]
  },
  {
    category: "Government Schemes",
    patterns: ["skill india", "skill development", "pmkvy", "कौशल विकास"],
    answer: "Pradhan Mantri Kaushal Vikas Yojana provides free skill training with monetary rewards. Over 40 sectors covered. Certificate recognized nationwide. Register at pmkvyofficial.org.",
    simpleAnswer: "Skill India gives free training and certificate in various skills.",
    keywords: ["skill", "training", "pmkvy", "kaushal"]
  },
  {
    category: "Government Schemes",
    patterns: ["swachh bharat", "toilet scheme", "स्वच्छ भारत"],
    answer: "Swachh Bharat Mission provides ₹12,000 incentive for building toilets. Apply through Gram Panchayat with Aadhaar and bank account. Toilets must meet specifications.",
    simpleAnswer: "Swachh Bharat gives twelve thousand for building toilet.",
    keywords: ["swachh", "bharat", "toilet", "sanitation"]
  },
  {
    category: "Government Schemes",
    patterns: ["beti bachao beti padhao", "girl child education", "बेटी बचाओ"],
    answer: "Beti Bachao Beti Padhao promotes girl child education and welfare. Integrated with Sukanya Samriddhi for savings, educational scholarships, and awareness programs.",
    simpleAnswer: "Beti Bachao promotes education and welfare of girl child.",
    keywords: ["beti", "bachao", "padhao", "girl", "education"]
  },
  {
    category: "Government Schemes",
    patterns: ["national social assistance", "old age pension", "वृद्धावस्था पेंशन"],
    answer: "National Social Assistance Programme provides pension: Old Age Pension (₹200-500/month for 60+ BPL), Widow Pension (₹300-500), Disability Pension (₹300-500). Apply at local welfare office.",
    simpleAnswer: "NSAP gives monthly pension to elderly, widows, and disabled persons.",
    keywords: ["pension", "old", "age", "widow", "disability", "nsap"]
  },
  {
    category: "Government Schemes",
    patterns: ["mahatma gandhi nrega", "mgnrega", "100 days work", "मनरेगा"],
    answer: "MGNREGA guarantees 100 days of wage employment per year to rural households. Wage varies by state (₹200-300/day). Apply for job card at Gram Panchayat with photo and ID proof.",
    simpleAnswer: "MGNREGA gives one hundred days guaranteed work in rural areas.",
    keywords: ["mgnrega", "nrega", "work", "employment", "rural"]
  },
  {
    category: "Government Schemes",
    patterns: ["mid day meal", "school meal", "मध्याह्न भोजन"],
    answer: "Mid-Day Meal Scheme provides free lunch to school children (classes 1-8) in government schools. Ensures nutrition and encourages school attendance.",
    simpleAnswer: "Mid-day meal gives free lunch to school children.",
    keywords: ["mid", "day", "meal", "school", "lunch"]
  },
  {
    category: "Government Schemes",
    patterns: ["national scholarship", "scholarship", "छात्रवृत्ति"],
    answer: "National Scholarship Portal (NSP) offers 50+ scholarships for SC/ST/OBC/Minorities/Disabled students. Pre-matric, post-matric, merit-based available. Apply at scholarships.gov.in.",
    simpleAnswer: "NSP provides scholarships for students from various categories.",
    keywords: ["scholarship", "nsp", "student", "education"]
  },
  {
    category: "Government Schemes",
    patterns: ["kisan credit card", "kcc", "किसान क्रेडिट कार्ड"],
    answer: "Kisan Credit Card provides crop loans up to ₹3 lakh at 7% interest (4% after subsidy). Get from banks with land records and Aadhaar. Used for seeds, fertilizers, equipment.",
    simpleAnswer: "KCC gives easy farm loan at low interest to farmers.",
    keywords: ["kisan", "credit", "card", "kcc", "loan", "farmer"]
  },
  {
    category: "Government Schemes",
    patterns: ["pm fasal bima", "crop insurance", "फसल बीमा"],
    answer: "Pradhan Mantri Fasal Bima Yojana insures crops against natural calamities. Farmers pay 1.5-2% premium, rest is government subsidy. Claim settlement within 2 months. Apply during crop season.",
    simpleAnswer: "PM Fasal Bima protects crops against natural disasters.",
    keywords: ["fasal", "bima", "crop", "insurance", "pmfby"]
  },
  {
    category: "Government Schemes",
    patterns: ["pm svanidhi", "street vendor loan", "स्वनिधि योजना"],
    answer: "PM SVANidhi provides collateral-free loans up to ₹10,000 (later ₹20k, ₹50k) to street vendors. Interest subsidy on timely repayment. Apply through banks or online portal.",
    simpleAnswer: "PM SVANidhi gives loan to street vendors without collateral.",
    keywords: ["svanidhi", "vendor", "street", "loan"]
  },
  {
    category: "Government Schemes",
    patterns: ["lic jeevan jyoti", "life insurance", "जीवन ज्योति"],
    answer: "Pradhan Mantri Jeevan Jyoti Bima Yojana provides ₹2 lakh life insurance at just ₹330/year premium. For ages 18-50. Auto-debit from bank account. Renewable yearly.",
    simpleAnswer: "PMJJBY gives two lakh life insurance for three thirty per year.",
    keywords: ["jeevan", "jyoti", "life", "insurance", "pmjjby"]
  },
  {
    category: "Government Schemes",
    patterns: ["suraksha bima", "accident insurance", "सुरक्षा बीमा"],
    answer: "Pradhan Mantri Suraksha Bima Yojana provides ₹2 lakh accident insurance at ₹12/year premium. For ages 18-70. Auto-debit from bank account. Covers accidental death/disability.",
    simpleAnswer: "PMSBY gives two lakh accident insurance for twelve rupees per year.",
    keywords: ["suraksha", "accident", "insurance", "pmsby"]
  },
  {
    category: "Government Schemes",
    patterns: ["national rural livelihood", "nrlm", "आजीविका योजना"],
    answer: "National Rural Livelihoods Mission (DAY-NRLM) mobilizes rural poor into Self Help Groups, provides skill training, bank linkages, and subsidy on loans. Focus on women empowerment.",
    simpleAnswer: "NRLM helps rural poor through self help groups and training.",
    keywords: ["nrlm", "livelihood", "shg", "rural", "aajeevika"]
  },
  {
    category: "Government Schemes",
    patterns: ["startup india", "startup registration", "स्टार्टअप इंडिया"],
    answer: "Startup India provides tax benefits, easier compliance, IPR fast-tracking, and funding support. Register at startupindia.gov.in. Get DPIIT recognition for 3-year tax holiday.",
    simpleAnswer: "Startup India gives tax benefits and support to new businesses.",
    keywords: ["startup", "india", "business", "dpiit"]
  },
  {
    category: "Government Schemes",
    patterns: ["make in india", "manufacturing", "मेक इन इंडिया"],
    answer: "Make in India promotes manufacturing sector with ease of doing business, infrastructure development, and FDI attraction. Incentives for manufacturers in 25+ sectors.",
    simpleAnswer: "Make in India promotes manufacturing and businesses in India.",
    keywords: ["make", "india", "manufacturing", "business"]
  },
  {
    category: "Government Schemes",
    patterns: ["digital india", "internet", "डिजिटल इंडिया"],
    answer: "Digital India promotes digital infrastructure, internet connectivity, and e-governance. Initiatives include BharatNet, DigiLocker, UMANG app, Aadhaar-enabled services.",
    simpleAnswer: "Digital India brings internet and digital services to all.",
    keywords: ["digital", "india", "internet", "egovernance"]
  },
  {
    category: "Government Schemes",
    patterns: ["jan aushadhi", "generic medicine", "जन औषधि"],
    answer: "Pradhan Mantri Bhartiya Jan Aushadhi Kendras provide quality generic medicines at affordable prices (50-90% cheaper). Over 9,000 centers nationwide. No prescription markup.",
    simpleAnswer: "Jan Aushadhi gives cheap quality generic medicines.",
    keywords: ["jan", "aushadhi", "medicine", "generic", "pmbjp"]
  },
  {
    category: "Government Schemes",
    patterns: ["matritva sahyog", "maternity benefit", "मातृत्व सहयोग"],
    answer: "Pradhan Mantri Matru Vandana Yojana provides ₹5,000 maternity benefit (in 3 installments) to pregnant women for first living child. Register at Anganwadi center with MCP card.",
    simpleAnswer: "Matritva Sahyog gives five thousand to pregnant women.",
    keywords: ["matritva", "maternity", "pregnant", "pmmvy"]
  },
  {
    category: "Government Schemes",
    patterns: ["poshan abhiyan", "nutrition", "पोषण अभियान"],
    answer: "POSHAN Abhiyan (National Nutrition Mission) aims to reduce stunting, malnutrition in children, and anemia. Integrated with Anganwadi services, immunization, and health monitoring.",
    simpleAnswer: "POSHAN Abhiyan improves nutrition for children and mothers.",
    keywords: ["poshan", "nutrition", "malnutrition", "anganwadi"]
  },
  {
    category: "Government Schemes",
    patterns: ["ration card", "food subsidy", "राशन कार्ड"],
    answer: "Ration Cards under NFSA provide subsidized food grains: Priority (5kg/person/month), Antyodaya (35kg/family/month). Apply at local Food & Civil Supplies office with address proof and income certificate.",
    simpleAnswer: "Ration card gives cheap food grains every month.",
    keywords: ["ration", "card", "food", "subsidy", "nfsa"]
  },
  {
    category: "Government Schemes",
    patterns: ["samagra shiksha", "education", "समग्र शिक्षा"],
    answer: "Samagra Shiksha integrates school education schemes from pre-school to class 12. Provides uniforms, textbooks, mid-day meals, teacher training, digital classrooms.",
    simpleAnswer: "Samagra Shiksha improves quality of school education.",
    keywords: ["samagra", "shiksha", "education", "school"]
  },
  {
    category: "Government Schemes",
    patterns: ["old age pension", "वृद्धावस्था पेंशन", "senior citizen pension", "pension scheme"],
    answer: "National Social Assistance Programme provides pension to seniors above 60 from BPL families. Amount: ₹200-500/month. Apply at Taluk office with age proof and income certificate.",
    simpleAnswer: "Old age pension gives two hundred to five hundred rupees per month.",
    keywords: ["pension", "old age", "senior citizen", "elderly"]
  },
  {
    category: "Government Schemes",
    patterns: ["scholarship", "छात्रवृत्ति", "education scheme", "nsp"],
    answer: "National Scholarship Portal offers pre-matric, post-matric, and merit scholarships. Register at scholarships.gov.in with Aadhaar, income certificate, and mark sheets.",
    simpleAnswer: "NSP provides scholarships for students from poor families.",
    keywords: ["scholarship", "education", "nsp", "student"]
  },
  {
    category: "Government Schemes",
    patterns: ["ration card", "राशन कार्ड", "pds", "food subsidy"],
    answer: "Ration card provides subsidized food grains. Apply online through your state PDS portal or at Taluk office with Aadhaar, address proof, and family photo.",
    simpleAnswer: "Ration card gives cheap rice, wheat, and sugar.",
    keywords: ["ration", "pds", "food", "subsidy"]
  },
  {
    category: "Government Schemes",
    patterns: ["mudra loan", "मुद्रा लोन", "small business loan", "pmmy"],
    answer: "Mudra Loan provides collateral-free loans up to ₹10 lakh for small businesses. Three categories: Shishu (up to ₹50k), Kishore (₹50k-₹5L), Tarun (₹5L-₹10L). Apply through banks.",
    simpleAnswer: "Mudra loan gives up to ten lakh rupees for business.",
    keywords: ["mudra", "loan", "business", "pmmy"]
  },
  {
    category: "Government Schemes",
    patterns: ["kisan credit card", "kcc", "किसान क्रेडिट कार्ड", "farmer loan"],
    answer: "Kisan Credit Card provides crop loans at 4% interest with PSU banks. Get up to ₹3 lakh based on land holdings. Apply at nearest bank with land documents and Aadhaar.",
    simpleAnswer: "KCC gives crop loan at four percent interest.",
    keywords: ["kcc", "kisan credit", "crop loan", "farmer"]
  },

  // ═══════════════════════════════════════════════════════════
  // CATEGORY B2: DOCUMENTS & APPLICATIONS (80+ entries)
  // ═══════════════════════════════════════════════════════════
  {
    category: "Documents",
    patterns: ["aadhaar card", "आधार कार्ड", "how to get aadhaar", "aadhaar apply"],
    answer: "Aadhaar is a 12-digit unique ID. Apply at nearest Aadhaar enrollment center with birth certificate/school certificate. Biometrics required. Download from uidai.gov.in after 90 days. Free of cost.",
    simpleAnswer: "Apply for Aadhaar at enrollment center with ID proof and biometrics.",
    keywords: ["aadhaar", "card", "uid", "apply"]
  },
  {
    category: "Documents",
    patterns: ["pan card", "पैन कार्ड", "how to apply pan", "pan card online"],
    answer: "PAN Card required for tax purposes. Apply online at incometax.gov.in or NSDL/UTIITSL portals. Fee ₹93 (₹107 for physical+digital). Documents: Aadhaar, photo, address proof. Get in 15-20 days.",
    simpleAnswer: "Apply for PAN online with Aadhaar and photo. Costs about hundred rupees.",
    keywords: ["pan", "card", "tax", "apply"]
  },
  {
    category: "Documents",
    patterns: ["voter id", "voter card", "मतदाता पहचान पत्र", "election card"],
    answer: "Voter ID (EPIC) for elections. Apply online at voters.eci.gov.in or offline at Electoral Registration Office. Need age proof (18+), address proof, Form 6. Free of cost. Get in 30 days.",
    simpleAnswer: "Apply for Voter ID online or at ERO office if eighteen plus.",
    keywords: ["voter", "id", "epic", "election", "apply"]
  },
  {
    category: "Documents",
    patterns: ["driving license", "ड्राइविंग लाइसेंस", "dl apply", "license"],
    answer: "Driving License: Get learner's license first (valid 6 months), then permanent license. Apply at RTO/online on Parivahan portal. Need age proof (18+ for car, 16+ for gearless bike), address proof, medical certificate. Test required.",
    simpleAnswer: "Apply for DL at RTO with learner license, tests, and documents.",
    keywords: ["driving", "license", "dl", "rto", "apply"]
  },
  {
    category: "Documents",
    patterns: ["passport", "पासपोर्ट", "how to apply passport", "passport online"],
    answer: "Passport for international travel. Apply online at passportindia.gov.in, pay fee, book appointment at PSK/POPSK. Documents: Aadhaar, address proof, birth certificate. Police verification required. Fee ₹1,500 (36 pages) or ₹2,000 (60 pages).",
    simpleAnswer: "Apply for passport online, visit PSK with documents, costs fifteen hundred to two thousand.",
    keywords: ["passport", "apply", "psk", "travel"]
  },
  {
    category: "Documents",
    patterns: ["birth certificate", "जन्म प्रमाण पत्र", "birth registration"],
    answer: "Birth Certificate from municipal corporation/gram panchayat within 21 days of birth. Need hospital birth record, parents' ID. Late registration (after 21 days) needs affidavit. Free within 21 days.",
    simpleAnswer: "Register birth within twenty-one days at municipal office with hospital record.",
    keywords: ["birth", "certificate", "registration", "janam"]
  },
  {
    category: "Documents",
    patterns: ["income certificate", "आय प्रमाण पत्र", "income proof"],
    answer: "Income Certificate from Tehsildar/SDM office. Required for scholarships, loan applications, fee concessions. Documents: salary slips/ITR, Aadhaar, ration card. Valid for 1 year. Fee ₹20-50 (state varies).",
    simpleAnswer: "Get income certificate from Tehsildar with salary proof and Aadhaar.",
    keywords: ["income", "certificate", "aay", "proof"]
  },
  {
    category: "Documents",
    patterns: ["caste certificate", "जाति प्रमाण पत्र", "sc st certificate"],
    answer: "Caste Certificate from Tehsildar/SDM for SC/ST/OBC. Required for reservations, scholarships. Documents: parents' caste certificate, school records, Aadhaar, ration card. Verification takes 30-60 days.",
    simpleAnswer: "Get caste certificate from Tehsildar with parents caste proof.",
    keywords: ["caste", "certificate", "sc", "st", "obc", "jati"]
  },
  {
    category: "Documents",
    patterns: ["domicile certificate", "निवास प्रमाण पत्र", "residence certificate"],
    answer: "Domicile Certificate proves state residence. From Tehsildar/SDM. Required for state quota jobs, admissions. Documents: address proof (10+ years), school certificates, ration card. Fee ₹20-100.",
    simpleAnswer: "Get domicile certificate from Tehsildar with long-term address proof.",
    keywords: ["domicile", "certificate", "residence", "nivas"]
  },
  {
    category: "Documents",
    patterns: ["property documents", "land papers", "संपत्ति दस्तावेज"],
    answer: "Property Documents: Sale Deed (registered at Sub-Registrar), Mutation Certificate (revenue records), Property Tax receipts, Encumbrance Certificate (no-dues). Get from local revenue office or online portal.",
    simpleAnswer: "Property documents include sale deed, mutation, and tax receipts.",
    keywords: ["property", "documents", "land", "deed"]
  },
  {
    category: "Eligibility",
    patterns: ["am i eligible", "क्या मैं पात्र हूं", "eligibility check", "qualify"],
    answer: "To check eligibility for schemes, use our Eligibility Checker module! You can check for 50+ schemes by entering your details like age, income, occupation, caste, etc. Each scheme has specific criteria.",
    simpleAnswer: "Use Eligibility Checker to see which schemes you qualify for.",
    keywords: ["eligible", "eligibility", "qualify", "patr"]
  },
  {
    category: "Eligibility",
    patterns: ["age limit", "उम्र सीमा", "how old", "age requirement"],
    answer: "Age limits vary by scheme: PM-Kisan (any age farmer), Ayushman Bharat (any age), APY (18-40 to join), Sukanya (girl under 10), PMJJBY (18-50), PMSBY (18-70). Check specific scheme for exact age criteria.",
    simpleAnswer: "Age limits vary by scheme. Check the specific scheme details.",
    keywords: ["age", "limit", "old", "umar"]
  },
  {
    category: "Eligibility",
    patterns: ["income limit", "आय सीमा", "income criteria", "salary limit"],
    answer: "Income limits: PMAY (₹18,000/month for EWS), Ayushman Bharat (no income limit for listed families), BPL schemes (state-specific poverty line). Middle-income schemes have different criteria.",
    simpleAnswer: "Income limits vary by scheme. Many are for low income families.",
    keywords: ["income", "limit", "salary", "aay"]
  },
  {
    category: "Eligibility",
    patterns: ["who can apply", "कौन आवेदन कर सकता", "eligibility criteria"],
    answer: "Eligibility varies: Most schemes require Indian citizenship, Aadhaar, and bank account. Specific schemes target farmers, women, SC/ST, BPL, students, etc. Check individual scheme criteria or use our Eligibility Checker.",
    simpleAnswer: "Most schemes need Aadhaar, bank account, and citizenship. Other criteria vary.",
    keywords: ["who", "apply", "criteria", "kaun"]
  },
  {
    category: "Eligibility",
    patterns: ["farmer schemes", "किसान योजना", "schemes for farmers"],
    answer: "Farmer schemes: PM-Kisan (₹6k/year), PM Fasal Bima (crop insurance), KCC (credit card), Soil Health Card, PM-Kusum (solar pump). Need land ownership proof and Aadhaar.",
    simpleAnswer: "Farmers get PM-Kisan, crop insurance, KCC, and solar pump schemes.",
    keywords: ["farmer", "kisan", "agriculture", "schemes"]
  },
  {
    category: "Eligibility",
    patterns: ["women schemes", "महिला योजना", "schemes for women"],
    answer: "Women-focused schemes: Ujjwala (free gas), Stand Up India (business loan), Sukanya Samriddhi (girl child savings), Matritva Sahyog (pregnancy benefit), MUDRA (business loan), Safe Motherhood programs.",
    simpleAnswer: "Women get Ujjwala, business loans, maternity benefits, and girl child schemes.",
    keywords: ["women", "mahila", "schemes", "female"]
  },
  {
    category: "Eligibility",
    patterns: ["senior citizen", "बुजुर्ग", "old age schemes", "elderly"],
    answer: "Senior citizen schemes: Old Age Pension (60+ BPL), Senior Citizen Savings Scheme (60+, high interest), LIC Varishtha Pension Bima, health insurance under Ayushman Bharat, railway concessions.",
    simpleAnswer: "Seniors get pension, high interest savings, health insurance, and travel discounts.",
    keywords: ["senior", "citizen", "old", "age", "buzurg", "elderly"]
  },
  {
    category: "Eligibility",
    patterns: ["sc st schemes", "sc st योजना", "reserved category"],
    answer: "SC/ST schemes: Pre/Post-matric scholarships, Stand Up India loans, Venture Capital Fund, Coaching schemes, Dr. Ambedkar Foundation programs. Need caste certificate for all.",
    simpleAnswer: "SC ST get scholarships, business loans, coaching, and special programs.",
    keywords: ["sc", "st", "scheduled", "caste", "tribe"]
  },
  {
    category: "Eligibility",
    patterns: ["student schemes", "छात्र योजना", "scholarship"],
    answer: "Student schemes: National Scholarship Portal (50+ scholarships), Pre/Post-matric scholarships, Merit scholarships, Mid-day meal, Free textbooks, Samagra Shiksha benefits. Apply at scholarships.gov.in.",
    simpleAnswer: "Students get scholarships, free books, meals, and education support.",
    keywords: ["student", "scholarship", "chatra", "education"]
  },
  {
    category: "Eligibility",
    patterns: ["bpl schemes", "गरीबी रेखा", "below poverty line"],
    answer: "BPL schemes: Subsidized ration (NFSA), Ayushman Bharat (free healthcare), Ujjwala (free gas), PMAY (housing), MGNREGA (employment). Need BPL/Antyodaya ration card.",
    simpleAnswer: "BPL families get cheap food, free healthcare, gas, housing, and work.",
    keywords: ["bpl", "poverty", "poor", "garibi"]
  },
  {
    category: "Application Process",
    patterns: ["how to apply", "कैसे आवेदन करें", "application process", "apply online"],
    answer: "Most schemes have online portals: PM-Kisan (pmkisan.gov.in), Ayushman (pmjay.gov.in), Scholarships (scholarships.gov.in). Can also apply offline at local offices (Gram Panchayat, Block office, District office) with documents.",
    simpleAnswer: "Apply online on scheme websites or offline at local government offices.",
    keywords: ["how", "apply", "application", "avedan", "kaise"]
  },
  {
    category: "Application Process",
    patterns: ["documents required", "क्या दस्तावेज चाहिए", "what documents", "papers needed"],
    answer: "Common documents: Aadhaar (mandatory), Bank account/passbook, Mobile number, Photo, Income certificate, Caste certificate (if SC/ST/OBC), Address proof, Age proof. Specific schemes may need additional documents.",
    simpleAnswer: "Usually need Aadhaar, bank account, photo, and mobile number.",
    keywords: ["documents", "required", "papers", "dastavez", "chahiye"]
  },
  {
    category: "Application Process",
    patterns: ["application status", "स्थिति", "track application", "status check"],
    answer: "Check status online: Enter application number on scheme portal. Or SMS 'STATUS<application_no>' to scheme helpline. Can also enquire at local office where you applied.",
    simpleAnswer: "Check status on scheme website with application number.",
    keywords: ["status", "sthiti", "track", "check"]
  },
  {
    category: "Application Process",
    patterns: ["how long", "कितना समय", "processing time", "when will i get"],
    answer: "Processing times vary: Aadhaar (90 days), PAN (15-20 days), Passport (30-45 days with police verification), Scheme approvals (30-90 days), Loan applications (15-30 days). Check specific portal for updates.",
    simpleAnswer: "Usually takes fifteen to ninety days depending on document or scheme.",
    keywords: ["how", "long", "time", "kitna", "samay"]
  },
  {
    category: "Application Process",
    patterns: ["where to apply", "कहां आवेदन करें", "which office"],
    answer: "Application offices: Gram Panchayat (rural schemes), Block/Tehsil office (certificates), District office (major schemes), Banks (loans), Post office (savings schemes), CSC centers (online services), Aadhaar centers (Aadhaar).",
    simpleAnswer: "Apply at Panchayat, Block office, District office, banks, or online.",
    keywords: ["where", "apply", "office", "kahan", "avedan"]
  },
  {
    category: "Application Process",
    patterns: ["application fee", "फीस", "cost", "charges"],
    answer: "Many schemes are free (PM-Kisan, Ayushman, Ujjwala). Document fees: Aadhaar (free), PAN (₹93-107), Passport (₹1,500-2,000), Certificates (₹20-100). Loan applications usually free at banks.",
    simpleAnswer: "Many schemes free. Documents cost twenty to two thousand rupees.",
    keywords: ["fee", "cost", "charges", "fees", "kitna"]
  },
  {
    category: "Application Process",
    patterns: ["need help", "मदद चाहिए", "assistance", "guidance"],
    answer: "Get help at: Local CSC (Common Service Centers), Block/District offices, Gram Panchayat, Help desks at banks/post offices. Or call scheme-specific helplines. Use AI-Sahayak for information anytime!",
    simpleAnswer: "Get help at CSC centers, government offices, or use AI-Sahayak.",
    keywords: ["help", "madad", "assistance", "guidance"]
  },
  {
    category: "Troubleshooting",
    patterns: ["application rejected", "आवेदन अस्वीकृत", "rejection", "denied"],
    answer: "If rejected: Check rejection reason on portal, verify all documents are correct and complete, correct errors and reapply, appeal to higher authority if eligible, visit local office for clarification.",
    simpleAnswer: "Check rejection reason, correct documents, and reapply or appeal.",
    keywords: ["rejected", "rejection", "denied", "asvikrit"]
  },
  {
    category: "Troubleshooting",
    patterns: ["forgot application number", "एप्लीकेशन नंबर भूल गए", "lost reference"],
    answer: "Retrieve application number: Check email/SMS sent during application, login to portal with registered mobile/email, contact helpline with Aadhaar/name, visit application office with receipt.",
    simpleAnswer: "Check email SMS or login to portal to find application number.",
    keywords: ["forgot", "lost", "application", "number", "bhool"]
  },
  {
    category: "Troubleshooting",
    patterns: ["payment not received", "पैसे नहीं आए", "money not credited", "benefit not got"],
    answer: "Payment issues: Verify bank account is Aadhaar-linked, check account number on application, contact bank to check if account is active, call scheme helpline, check payment status on portal, visit local office.",
    simpleAnswer: "Check Aadhaar-bank linking, account details, and contact helpline.",
    keywords: ["payment", "money", "not", "received", "credited", "paise"]
  },

  // ═══════════════════════════════════════════════════════════
  // CATEGORY B3: COMMON CITIZEN QUERIES (100+ entries)
  // ═══════════════════════════════════════════════════════════
  {
    category: "Common Queries",
    patterns: ["bank account", "खाता खोलना", "how to open account", "new bank account"],
    answer: "Open bank account at any bank branch with Aadhaar, PAN, photo, initial deposit (₹500-2000 or zero for Jan Dhan). Savings accounts offer 3-4% interest. Keep minimum balance to avoid charges.",
    simpleAnswer: "Open bank account with Aadhaar and PAN at any bank branch.",
    keywords: ["bank", "account", "open", "khata"]
  },
  {
    category: "Common Queries",
    patterns: ["aadhaar update", "आधार अपडेट", "change aadhaar details", "update address"],
    answer: "Update Aadhaar at enrollment centers. Online: Visit myaadhaar.uidai.gov.in for name, DOB, gender, mobile, email. Offline: Visit center with documents for address/photo. Fee ₹25-50 per update.",
    simpleAnswer: "Update Aadhaar online on UIDAI portal or at enrollment center.",
    keywords: ["aadhaar", "update", "change", "modify"]
  },
  {
    category: "Common Queries",
    patterns: ["link aadhaar pan", "आधार पैन लिंक", "connect aadhaar pan"],
    answer: "Link Aadhaar-PAN mandatory for ITR filing. Methods: SMS 'UIDPAN<12-digit Aadhaar><10-digit PAN>' to 567678, or online at incometax.gov.in, or e-filing portal. Free of cost. Deadline extended multiple times.",
    simpleAnswer: "Link Aadhaar PAN via SMS or income tax website for free.",
    keywords: ["link", "aadhaar", "pan", "connect"]
  },
  {
    category: "Common Queries",
    patterns: ["link aadhaar bank", "बैंक से आधार लिंक", "aadhaar bank linking"],
    answer: "Link Aadhaar to bank account at bank branch with Aadhaar card and passbook. Or through bank's net banking/mobile app. Required for DBT transfers, subsidies, and government schemes.",
    simpleAnswer: "Link Aadhaar to bank at branch or via net banking.",
    keywords: ["link", "aadhaar", "bank", "account"]
  },
  {
    category: "Common Queries",
    patterns: ["mobile number", "मोबाइल नंबर", "phone number registration"],
    answer: "Get mobile number with Aadhaar at any telecom store. Biometric verification required. Prepaid needs Aadhaar + photo, Postpaid also needs address proof. Port number via USSD *1900#.",
    simpleAnswer: "Get mobile SIM with Aadhaar at telecom store.",
    keywords: ["mobile", "number", "phone", "sim"]
  },
  {
    category: "Common Queries",
    patterns: ["property tax", "संपत्ति कर", "house tax", "municipal tax"],
    answer: "Property tax paid to Municipal Corporation/Panchayat annually. Based on property size, location. Pay online on municipal website or offline at ward office. Get receipt for legal proof.",
    simpleAnswer: "Pay property tax to municipal corporation annually online or offline.",
    keywords: ["property", "tax", "house", "municipal"]
  },
  {
    category: "Common Queries",
    patterns: ["water connection", "पानी का कनेक्शन", "water supply"],
    answer: "Water connection from Municipal Corporation/Jal Board. Apply with property documents, ID proof, address proof. Site inspection required. Connection fee ₹1,000-5,000. Monthly charges based on usage.",
    simpleAnswer: "Get water connection from Jal Board with property and ID proof.",
    keywords: ["water", "connection", "supply", "pani"]
  },
  {
    category: "Common Queries",
    patterns: ["electricity connection", "बिजली का कनेक्शन", "power connection"],
    answer: "Electricity connection from State Electricity Board. Apply online/offline with property documents, ID proof, NOC from owner (if rented). Inspection required. Connection fee ₹500-3,000. Get meter installed.",
    simpleAnswer: "Apply for electricity connection with property documents at electricity board.",
    keywords: ["electricity", "connection", "power", "bijli"]
  },
  {
    category: "Common Queries",
    patterns: ["gas connection", "गैस कनेक्शन", "lpg connection"],
    answer: "LPG connection from distributors (HP, Bharat, Indane). Documents: Aadhaar, address proof, photo. Fee ₹500-1,500 (refundable security). Or get free under Ujjwala if BPL. Connection in 7-15 days.",
    simpleAnswer: "Get gas connection from HP Bharat or Indane with Aadhaar and address proof.",
    keywords: ["gas", "connection", "lpg", "cylinder"]
  },
  {
    category: "Common Queries",
    patterns: ["complaint", "शिकायत", "grievance", "problem"],
    answer: "File complaints: Public Grievance portal (pgportal.gov.in), CM/PM helplines, Local government offices, Consumer forums. Keep complaint number for tracking. Response typically within 30 days.",
    simpleAnswer: "File complaint on PG Portal, helplines, or local offices.",
    keywords: ["complaint", "grievance", "shikayat", "problem"]
  },
  {
    category: "Common Queries",
    patterns: ["police station", "थाना", "fir", "complaint police"],
    answer: "For crimes: Visit police station to file FIR. Can also file e-FIR online for lost documents. For emergencies dial 100. Women helpline 1091. Get FIR copy within 24 hours. Free of cost.",
    simpleAnswer: "File FIR at police station or online. Emergency dial one hundred.",
    keywords: ["police", "fir", "thana", "crime", "emergency"]
  },
  {
    category: "Common Queries",
    patterns: ["court", "अदालत", "legal case", "judiciary"],
    answer: "Court cases: Hire lawyer, file petition at appropriate court (District/High/Supreme). E-filing available on ecourts.gov.in. Check case status online. Legal aid available for poor via NALSA.",
    simpleAnswer: "File case with lawyer at appropriate court. Check status on e-courts.",
    keywords: ["court", "case", "legal", "adalat"]
  },
  {
    category: "Common Queries",
    patterns: ["marriage certificate", "विवाह प्रमाण पत्र", "marriage registration"],
    answer: "Marriage certificate from Municipal Corporation/Gram Panchayat. Register within 60 days of marriage. Documents: marriage invitation, photos, witnesses' ID, address proof of both. Fee ₹50-200.",
    simpleAnswer: "Register marriage at municipal office within sixty days with witnesses.",
    keywords: ["marriage", "certificate", "registration", "vivah"]
  },
  {
    category: "Common Queries",
    patterns: ["death certificate", "मृत्यु प्रमाण पत्र", "death registration"],
    answer: "Death certificate from Municipal Corporation/Gram Panchayat within 21 days. Documents: hospital death summary/cremation receipt, deceased's ID, informant's ID. Free of cost.",
    simpleAnswer: "Register death at municipal office within twenty-one days with death summary.",
    keywords: ["death", "certificate", "registration", "mrityu"]
  },
  {
    category: "Common Queries",
    patterns: ["tax return", "आयकर रिटर्न", "itr filing", "income tax"],
    answer: "File ITR at incometax.gov.in if income above basic exemption limit (₹2.5-5 lakh based on age). Need Form-16, bank statements, investment proofs. Deadline July 31. Can e-file or hire CA.",
    simpleAnswer: "File income tax return online before July thirty-one if income taxable.",
    keywords: ["itr", "tax", "return", "income", "filing"]
  },
  {
    category: "Common Queries",
    patterns: ["gst registration", "gst number", "जीएसटी"],
    answer: "GST registration mandatory if turnover >₹40 lakh (services ₹20L). Register at gst.gov.in with PAN, Aadhaar, business proof, bank statement. Get GSTIN in 7 days. File returns monthly/quarterly.",
    simpleAnswer: "Register for GST online if business turnover above twenty or forty lakh.",
    keywords: ["gst", "registration", "number", "business"]
  },
  {
    category: "Common Queries",
    patterns: ["business registration", "व्यवसाय पंजीकरण", "company registration"],
    answer: "Register business: Proprietorship (Shop Act license), Partnership (Partnership Deed + registration), Private Limited (MCA registration + ROC). Online at respective portals. Fees vary ₹500-10,000.",
    simpleAnswer: "Register business based on type at Shop Act, MCA, or ROC.",
    keywords: ["business", "registration", "company", "vyavsay"]
  },
  {
    category: "Common Queries",
    patterns: ["shop act license", "दुकान लाइसेंस", "trade license"],
    answer: "Shop Act License from Municipal Corporation. Required for all shops/establishments. Apply with property papers, owner's ID, partnership deed (if applicable). Fee ₹100-1,000. Renewed yearly/3-yearly.",
    simpleAnswer: "Get shop license from municipal office with property papers.",
    keywords: ["shop", "act", "license", "trade", "dukan"]
  },
  {
    category: "Common Queries",
    patterns: ["fssai license", "food license", "खाद्य लाइसेंस"],
    answer: "FSSAI license mandatory for food businesses. Types: Basic registration (<₹12L turnover), State license (₹12L-20Cr), Central license (>₹20Cr). Apply at fssai.gov.in with documents. Fee ₹100-7,500 for 1-5 years.",
    simpleAnswer: "Get FSSAI license for food business online based on turnover.",
    keywords: ["fssai", "food", "license", "registration"]
  },
  {
    category: "Common Queries",
    patterns: ["pollution certificate", "puc", "प्रदूषण प्रमाण पत्र"],
    answer: "PUC (Pollution Under Control) certificate mandatory for vehicles. Get at authorized PUC centers. Valid 6 months (new vehicles 1 year). Fee ₹60-100. Needed for insurance and traffic stops.",
    simpleAnswer: "Get PUC certificate every six months at authorized centers.",
    keywords: ["puc", "pollution", "certificate", "vehicle"]
  },
  {
    category: "Common Queries",
    patterns: ["vehicle registration", "गाड़ी पंजीकरण", "rc book"],
    answer: "Vehicle registration at RTO. Dealer helps new vehicles. Documents: invoice, insurance, ID proof, address proof. Temporary registration for 2 months, then permanent RC. Transfer ownership for second-hand vehicles.",
    simpleAnswer: "Register vehicle at RTO with invoice and insurance.",
    keywords: ["vehicle", "registration", "rc", "book", "gadi"]
  },
  {
    category: "Common Queries",
    patterns: ["vehicle insurance", "वाहन बीमा", "car insurance"],
    answer: "Vehicle insurance mandatory: Third-party (₹500-2,000 for two-wheelers, ₹2,000-6,000 for cars), Comprehensive (covers own damage too, ₹3,000-15,000+). Renew before expiry. Buy from any insurer.",
    simpleAnswer: "Get vehicle insurance third-party mandatory, comprehensive optional.",
    keywords: ["vehicle", "insurance", "car", "bike", "bima"]
  },
  {
    category: "Common Queries",
    patterns: ["health insurance", "स्वास्थ्य बीमा", "medical insurance"],
    answer: "Health insurance: Government (Ayushman Bharat free for eligible), Private companies (₹5,000-50,000/year). Covers hospitalization, surgeries, critical illness. Compare plans, check network hospitals.",
    simpleAnswer: "Get health insurance from Ayushman if eligible or private companies.",
    keywords: ["health", "insurance", "medical", "bima"]
  },
  {
    category: "Common Queries",
    patterns: ["loan", "लोन", "credit", "borrowing"],
    answer: "Loan types: Personal (10-24% interest), Home (7-9%), Education (7-15%), Business (MUDRA), Gold (7-15%), Vehicle (8-14%). Apply at banks with ID, income proof, collateral (if needed). Check CIBIL score.",
    simpleAnswer: "Get loan from banks with income proof. Interest varies by type.",
    keywords: ["loan", "credit", "borrow", "financing"]
  },
  {
    category: "Common Queries",
    patterns: ["credit score", "cibil", "क्रेडिट स्कोर"],
    answer: "Credit score (CIBIL) measures creditworthiness (300-900). Good score 750+. Check free once/year at cibil.com, paisabazaar.com. Improve by paying bills on time, reducing debt, correcting errors.",
    simpleAnswer: "Check CIBIL credit score for free yearly. Good score is above seven fifty.",
    keywords: ["credit", "score", "cibil", "creditworthiness"]
  },
  {
    category: "Common Queries",
    patterns: ["post office schemes", "डाकघर योजना", "postal savings"],
    answer: "Post Office schemes: PPF (7.1%, 15 years, tax benefit), NSC (7%, 5 years), KVP (doubles in ~10 years), Senior Citizen (8%, 60+), Sukanya (8%+), RD/TD. Open at any post office.",
    simpleAnswer: "Post office has PPF, NSC, Sukanya, and other savings schemes.",
    keywords: ["post", "office", "schemes", "savings", "dakghar"]
  },
  {
    category: "Common Queries",
    patterns: ["epf", "provident fund", "पीएफ", "employees provident fund"],
    answer: "EPF (Employees Provident Fund): 12% of salary contributed by employee+employer. Tax-free interest (~8%). Withdraw after retirement or 2 months unemployment. Check balance on EPFO portal, UAN required.",
    simpleAnswer: "EPF is retirement savings with employer contribution. Check on EPFO portal.",
    keywords: ["epf", "provident", "fund", "pf", "epfo"]
  },
  {
    category: "Common Queries",
    patterns: ["pension", "पेंशन", "retirement", "nps"],
    answer: "Pension schemes: NPS (National Pension System - market-linked, tax benefits), APY (Atal Pension - guaranteed), EPF (auto pension on retirement), EPFO pension (EPS-95). Start early for better corpus.",
    simpleAnswer: "Pension from NPS, APY, EPF. Start early for good retirement savings.",
    keywords: ["pension", "retirement", "nps", "aps"]
  },
  {
    category: "Common Queries",
    patterns: ["consumer court", "उपभोक्ता अदालत", "consumer complaint"],
    answer: "Consumer court for defective products/services. District forum (up to ₹1Cr), State (<₹10Cr), National (₹10Cr+). File complaint with documents, invoice, evidence. Nominal court fees. Judgment in 3-5 months.",
    simpleAnswer: "File consumer complaint in district or state forum with invoice.",
    keywords: ["consumer", "court", "complaint", "upbhokta"]
  },
  {
    category: "Common Queries",
    patterns: ["rti", "right to information", "सूचना का अधिकार"],
    answer: "RTI (Right to Information) Act allows citizens to get information from government. File application (₹10) at PIO of department. Reply within 30 days. Appeal to higher authority if denied. Use for transparency.",
    simpleAnswer: "File RTI application at government office to get any information.",
    keywords: ["rti", "right", "information", "suchna"]
  },
  {
    category: "Common Queries",
    patterns: ["pm helpline", "prime minister office", "पीएम हेल्पलाइन"],
    answer: "PM helplines: PM Office (011-23012312, 1800-11-1550), Grievances (pgportal.gov.in), PM-Kisan (011-24300606), Ayushman (14555). Can file complaint, suggestion, or seek help.",
    simpleAnswer: "PM helpline eighteen hundred eleven fifteen fifty for grievances.",
    keywords: ["pm", "helpline", "prime", "minister"]
  },
  {
    category: "Common Queries",
    patterns: ["cm helpline", "मुख्यमंत्री हेल्पलाइन", "chief minister"],
    answer: "CM helpline in each state for state-level grievances. Numbers vary by state (usually 1000-2000 series). File complaints about state schemes, infrastructure, local issues. Response in 15-30 days.",
    simpleAnswer: "Call state CM helpline for state level problems and schemes.",
    keywords: ["cm", "helpline", "chief", "minister", "mukhyamantri"]
  },
  {
    category: "Common Queries",
    patterns: ["emergency numbers", "आपातकालीन नंबर", "helpline"],
    answer: "Emergency numbers: Police-100, Fire-101, Ambulance-102/108, Women-1091, Child-1098, Senior Citizen-14567, Disaster-1078, National Helpline-112 (single number for all emergencies).",
    simpleAnswer: "Emergency dial one one two for all, one hundred for police, one zero two for ambulance.",
    keywords: ["emergency", "helpline", "numbers", "aapatkaal"]
  },

  // ═══════════════════════════════════════════════════════════
  // CATEGORY B4: AGRICULTURE & FARMING (60+ entries)
  // ═══════════════════════════════════════════════════════════
  {
    category: "Agriculture",
    patterns: ["kharif crops", "खरीफ फसलें", "monsoon crops", "rainy season farming"],
    answer: "Kharif crops (June-October): Rice, maize, cotton, soybean, groundnut, bajra, jowar, urad, moong. Sown with monsoon, harvested in autumn. MSP announced for major crops.",
    simpleAnswer: "Kharif crops are rice, cotton, soybean grown in monsoon season.",
    keywords: ["kharif", "monsoon", "crops", "rainy"]
  },
  {
    category: "Agriculture",
    patterns: ["rabi crops", "रबी फसलें", "winter crops"],
    answer: "Rabi crops (October-March): Wheat, barley, mustard, gram, peas, lentils. Sown in winter after monsoon, harvested in spring. Require irrigation. MSP for wheat, barley, mustard, gram.",
    simpleAnswer: "Rabi crops are wheat, mustard, gram grown in winter season.",
    keywords: ["rabi", "winter", "crops", "wheat"]
  },
  {
    category: "Agriculture",
    patterns: ["zaid crops", "जायद फसलें", "summer crops"],
    answer: "Zaid crops (March-June): Watermelon, cucumber, muskmelon, bitter gourd, pumpkin, moong, fodder crops. Short duration summer crops between rabi and kharif.",
    simpleAnswer: "Zaid crops are watermelon, cucumber, moong grown in summer.",
    keywords: ["zaid", "summer", "crops"]
  },
  {
    category: "Agriculture",
    patterns: ["msp", "minimum support price", "न्यूनतम समर्थन मूल्य"],
    answer: "MSP (Minimum Support Price) is government-guaranteed price for 23 crops. Ensures farmers get fair price. Announced twice yearly (kharif/rabi). Buy at mandis, FCI procurement centers.",
    simpleAnswer: "MSP is minimum guaranteed price by government for crops.",
    keywords: ["msp", "minimum", "support", "price"]
  },
  {
    category: "Agriculture",
    patterns: ["soil testing", "मिट्टी परीक्षण", "soil health"],
    answer: "Soil testing at Soil Testing Labs (free/₹20-50). Get Soil Health Card showing NPK levels, pH, organic content. Use to determine fertilizer needs. Test every 2-3 years for better yield.",
    simpleAnswer: "Get soil tested free at labs for fertilizer recommendations.",
    keywords: ["soil", "testing", "health", "card", "mitti"]
  },
  {
    category: "Agriculture",
    patterns: ["organic farming", "जैविक खेती", "natural farming"],
    answer: "Organic farming without chemical fertilizers/pesticides. Schemes: Paramparagat Krishi Vikas Yojana (₹50k/ha for 3 years), MOVCDNER. Get organic certification from APEDA. Premium prices for organic produce.",
    simpleAnswer: "Organic farming gets fifty thousand per hectare subsidy for three years.",
    keywords: ["organic", "farming", "natural", "jaivik"]
  },
  {
    category: "Agriculture",
    patterns: ["drip irrigation", "ड्रिप सिंचाई", "micro irrigation"],
    answer: "Drip/Sprinkler irrigation subsidy under PMKSY (Micro Irrigation). Get 55-90% subsidy (higher for SC/ST/small farmers). Apply through agriculture department. Saves water, increases yield.",
    simpleAnswer: "Get fifty-five to ninety percent subsidy on drip irrigation.",
    keywords: ["drip", "irrigation", "micro", "sprinkler"]
  },
  {
    category: "Agriculture",
    patterns: ["pm kusum", "solar pump", "सोलर पंप"],
    answer: "PM-KUSUM provides 60% subsidy on solar pumps + 30% loan. Farmers pay only 10%. Also solarization of grid pumps, solar power plants on barren land. Apply through agriculture/renewable energy department.",
    simpleAnswer: "Get ninety percent support for solar pump under PM-KUSUM.",
    keywords: ["kusum", "solar", "pump", "renewable"]
  },
  {
    category: "Agriculture",
    patterns: ["tractor subsidy", "ट्रैक्टर सब्सिडी", "farm equipment"],
    answer: "Tractor subsidy 20-50% under state schemes (varies by state). Women, SC/ST get higher subsidy. Apply through agriculture department with land documents. Also subsidy on other implements.",
    simpleAnswer: "Get twenty to fifty percent tractor subsidy from state government.",
    keywords: ["tractor", "subsidy", "farm", "equipment"]
  },
  {
    category: "Agriculture",
    patterns: ["crop rotation", "फसल चक्र", "intercropping"],
    answer: "Crop rotation maintains soil fertility. Rotate legumes (fix nitrogen) with cereals. Examples: Wheat-Rice-Moong, Cotton-Wheat-Moong. Reduces pest/disease, improves yield. Advised by Krishi Vigyan Kendras.",
    simpleAnswer: "Rotate crops to maintain soil health. Get advice from KVK.",
    keywords: ["crop", "rotation", "intercropping", "fasal"]
  },
  {
    category: "Agriculture",
    patterns: ["pest control", "कीट नियंत्रण", "pesticides"],
    answer: "Integrated Pest Management: Use neem-based products, bio-pesticides first. Chemical pesticides only when needed. Get advice from KVK. Govt subsidizes bio-pesticides under NPMCR scheme.",
    simpleAnswer: "Use natural pest control first. Get advice from Krishi Vigyan Kendra.",
    keywords: ["pest", "control", "keet", "pesticides"]
  },
  {
    category: "Agriculture",
    patterns: ["weather forecast", "मौसम पूर्वानुमान", "rainfall prediction"],
    answer: "Weather forecast from IMD (mausam.imd.gov.in), Meghdoot app, KVK advisories, 1800-180-1551 helpline. Get 7-day forecast, rainfall prediction, crop advisories via SMS/app.",
    simpleAnswer: "Get weather forecast from IMD website or Meghdoot app.",
    keywords: ["weather", "forecast", "rainfall", "mausam"]
  },
  {
    category: "Agriculture",
    patterns: ["kvk", "krishi vigyan kendra", "कृषि विज्ञान केंद्र"],
    answer: "Krishi Vigyan Kendras provide free farming advice, training, soil testing, demos. Located in each district. Contact for crop problems, new technologies, seed varieties, market info. Visit or call district KVK.",
    simpleAnswer: "KVK gives free farming training and advice in every district.",
    keywords: ["kvk", "krishi", "vigyan", "kendra", "training"]
  },
  {
    category: "Agriculture",
    patterns: ["seed subsidy", "बीज सब्सिडी", "certified seeds"],
    answer: "Certified seed subsidy 50% under National Food Security Mission. Buy from authorized dealers, NSC, State Seed Corporations. Get bill for subsidy claim. Hybrid seeds for better yield.",
    simpleAnswer: "Get fifty percent subsidy on certified seeds from authorized dealers.",
    keywords: ["seed", "subsidy", "certified", "beej"]
  },
  {
    category: "Agriculture",
    patterns: ["fertilizer subsidy", "खाद सब्सिडी", "urea dap"],
    answer: "Fertilizers sold at subsidized rates (Urea ₹266/bag, DAP ₹1350/bag). Subsidy direct to companies. Buy from authorized retailers with Aadhaar. Follow Soil Health Card recommendation for quantity.",
    simpleAnswer: "Fertilizers available at subsidized rates with Aadhaar.",
    keywords: ["fertilizer", "subsidy", "urea", "dap", "khad"]
  },
  {
    category: "Agriculture",
    patterns: ["mandi price", "market price", "मंडी भाव", "commodity rate"],
    answer: "Check mandi prices on agmarknet.gov.in, eNAM app, or our Market Data module. Prices vary by state, quality, season. Compare before selling. eNAM allows pan-India trading.",
    simpleAnswer: "Check mandi prices on Agmarknet website or eNAM app.",
    keywords: ["mandi", "price", "market", "bhav", "rate"]
  },
  {
    category: "Agriculture",
    patterns: ["enam", "electronic national market", "ई-नाम"],
    answer: "eNAM (Electronic National Agricultural Market) connects 1,389 mandis pan-India. Register at enam.gov.in for better price discovery, online trading, payment directly to bank. Need bank account, Aadhaar.",
    simpleAnswer: "eNAM connects mandis nationally for better prices. Register online.",
    keywords: ["enam", "electronic", "market", "trading"]
  },
  {
    category: "Agriculture",
    patterns: ["crop insurance claim", "फसल बीमा दावा", "insurance payment"],
    answer: "Crop insurance claim automatic if you enrolled in PM Fasal Bima. Banks report crop data, satellite/ground surveys done. Claim paid within 2 months to bank account. Check status at pmfby.gov.in.",
    simpleAnswer: "Crop insurance claim paid automatically within two months.",
    keywords: ["crop", "insurance", "claim", "fasal", "bima"]
  },
  {
    category: "Agriculture",
    patterns: ["animal husbandry", "पशुपालन", "dairy farming"],
    answer: "Animal husbandry schemes: National Livestock Mission (subsidy on cattle), Dairy Entrepreneurship (NABARD loans), Fodder development, Vaccination camps. Contact district Animal Husbandry office.",
    simpleAnswer: "Get subsidy on cattle and loans for dairy farming.",
    keywords: ["animal", "husbandry", "dairy", "pashupaalan", "cattle"]
  },
  {
    category: "Agriculture",
    patterns: ["poultry farming", "मुर्गीपालन", "hen farming"],
    answer: "Poultry farming: Get 25-35% subsidy under RKVY/state schemes. Loan from NABARD. Start with 500-5000 birds. Need vaccination, proper shed, feed. Contact Poultry Research Station for training.",
    simpleAnswer: "Get twenty-five to thirty-five percent subsidy on poultry farming.",
    keywords: ["poultry", "farming", "murgi", "hen", "birds"]
  },
  {
    category: "Agriculture",
    patterns: ["fishery", "मत्स्य पालन", "fish farming"],
    answer: "Fishery schemes: Pradhan Mantri Matsya Sampada Yojana (PMMSY) provides subsidy on pond construction, fingerlings, feed. Loans from NABARD. Training from Fishery Department. Good income potential.",
    simpleAnswer: "Get subsidy for fish farming under PMMSY scheme.",
    keywords: ["fishery", "fish", "farming", "matsya", "pond"]
  },
  {
    category: "Agriculture",
    patterns: ["beekeeping", "मधुमक्खी पालन", "honey production"],
    answer: "Beekeeping: National Beekeeping & Honey Mission (NBHM) provides subsidy on bee boxes, bees, training. Good supplementary income. Honey has ready market. Contact Khadi Board or Agriculture Dept.",
    simpleAnswer: "Get subsidy for beekeeping under honey mission scheme.",
    keywords: ["beekeeping", "honey", "madhumakhi", "bees"]
  },
  {
    category: "Agriculture",
    patterns: ["horticulture", "बागवानी", "fruit cultivation"],
    answer: "Horticulture schemes: Mission for Integrated Development of Horticulture (MIDH) provides 40-50% subsidy on orchards, protected cultivation, post-harvest. Apply through Horticulture Department.",
    simpleAnswer: "Get forty to fifty percent subsidy on fruit and vegetable farming.",
    keywords: ["horticulture", "fruit", "baagwani", "orchard"]
  },
  {
    category: "Agriculture",
    patterns: ["mushroom farming", "मशरूम की खेती", "mushroom cultivation"],
    answer: "Mushroom farming: Low investment, high returns. Get training and spawn from state Horticulture/Agriculture dept. Oyster mushroom easiest. Market tie-ups available. Indoor cultivation possible.",
    simpleAnswer: "Mushroom farming has low investment and good returns. Get training from agriculture office.",
    keywords: ["mushroom", "farming", "cultivation", "kheti"]
  },
  {
    category: "Agriculture",
    patterns: ["vermicompost", "केंचुआ खाद", "earthworm composting"],
    answer: "Vermicomposting: Convert waste to organic manure. Get subsidy on vermicompost units. Use or sell at ₹8-10/kg. Reduces chemical fertilizer need. Training from KVK. Low investment home-based.",
    simpleAnswer: "Make vermicompost at home or commercially with subsidy.",
    keywords: ["vermicompost", "earthworm", "kenchua", "organic"]
  },

  // ═══════════════════════════════════════════════════════════
  // CATEGORY B5: REGIONAL & STATE QUERIES (40+ entries)
  // ═══════════════════════════════════════════════════════════
  {
    category: "Regional Info",
    patterns: ["state schemes", "राज्य योजनाएं", "state government schemes"],
    answer: "Each state has own schemes in addition to central schemes. Examples: Maharashtra (Mahatma Phule), UP (Kanya Sumangala), Karnataka (Sandhya Suraksha). Check your state government portal for complete list.",
    simpleAnswer: "Each state has its own schemes. Check state government website.",
    keywords: ["state", "schemes", "rajya", "yojana"]
  },
  {
    category: "Regional Info",
    patterns: ["gram panchayat", "ग्राम पंचायत", "village council"],
    answer: "Gram Panchayat is village-level government. Handles local development, sanitation, water supply, rural schemes implementation. Apply for schemes, certificates at Gram Panchayat office. Sarpanch is head.",
    simpleAnswer: "Gram Panchayat is village government office for local schemes.",
    keywords: ["gram", "panchayat", "village", "sarpanch"]
  },
  {
    category: "Regional Info",
    patterns: ["block office", "tehsil", "तहसील", "taluka"],
    answer: "Block/Tehsil/Taluka office handles sub-district administration. Issue certificates (income, caste, domicile), land records, revenue matters. Visit for SDM, Tehsildar services.",
    simpleAnswer: "Block office issues certificates and handles land matters.",
    keywords: ["block", "tehsil", "taluka", "sdm"]
  },
  {
    category: "Regional Info",
    patterns: ["district office", "जिला कार्यालय", "collector office"],
    answer: "District Collector/DC office is district headquarters. Handles major schemes, disasters, law & order, development programs. Appeals go to Collector. Located at district headquarters city.",
    simpleAnswer: "District Collector office handles major schemes and appeals.",
    keywords: ["district", "collector", "dc", "jila"]
  },
  {
    category: "Regional Info",
    patterns: ["csc center", "common service center", "सीएससी"],
    answer: "CSC (Common Service Centers) provide e-governance services at village level. Services: Aadhaar enrollment, certificates, PAN, bills payment, banking, scheme applications. VLE is operator. Small fee for services.",
    simpleAnswer: "CSC centers provide all government services at village level.",
    keywords: ["csc", "common", "service", "center", "vle"]
  },
  {
    category: "Regional Info",
    patterns: ["jan seva kendra", "जन सेवा केंद्र", "citizen service"],
    answer: "Jan Seva Kendra/Lok Seva Kendra in urban areas provide certificates, documents, applications. Similar to CSC but in cities/towns. One-stop for government services. Nominal fees.",
    simpleAnswer: "Jan Seva Kendra provides government services in cities.",
    keywords: ["jan", "seva", "kendra", "citizen", "service"]
  },
  {
    category: "Regional Info",
    patterns: ["anganwadi", "आंगनवाड़ी", "child care center"],
    answer: "Anganwadi centers provide nutrition, pre-school education, health checkups for children under 6 and pregnant women. Free services. Also register for maternity benefits here. Present in every village/slum.",
    simpleAnswer: "Anganwadi gives nutrition and health services for children and mothers.",
    keywords: ["anganwadi", "child", "care", "nutrition"]
  },
  {
    category: "Regional Info",
    patterns: ["phc", "primary health center", "प्राथमिक स्वास्थ्य केंद्र"],
    answer: "PHC (Primary Health Centers) provide basic healthcare in rural areas. Free OPD, medicines, immunization, maternity care. 24x7 emergency. Above PHC are CHC (Community Health Centers) with specialists.",
    simpleAnswer: "PHC provides free basic healthcare in rural areas.",
    keywords: ["phc", "health", "center", "swasthya", "hospital"]
  },
  {
    category: "Regional Info",
    patterns: ["ration shop", "राशन की दुकान", "fair price shop"],
    answer: "Fair Price Shop/Ration shop distributes subsidized food grains under PDS. Visit with ration card. Get rice/wheat, kerosene, sugar monthly. Timings usually 9am-1pm and 4pm-7pm. Complaint number displayed.",
    simpleAnswer: "Ration shop gives subsidized grains monthly with ration card.",
    keywords: ["ration", "shop", "fair", "price", "pds"]
  },
  {
    category: "Regional Info",
    patterns: ["post office", "डाकघर", "postal services"],
    answer: "Post offices provide mail, savings schemes (PPF, NSC, RD), money transfer, insurance, bill payment, Aadhaar services. Accessible in rural areas. Senior citizens get additional interest on savings.",
    simpleAnswer: "Post office provides mail, savings, and government services.",
    keywords: ["post", "office", "dakghar", "postal"]
  },

  // ═══════════════════════════════════════════════════════════
  // CATEGORY B6: EDUCATION & TRAINING (30+ entries)
  // ═══════════════════════════════════════════════════════════
  {
    category: "Education",
    patterns: ["school admission", "स्कूल में दाखिला", "rte admission"],
    answer: "RTE Act provides free education in government/aided schools (6-14 years). Admission: Visit school with birth certificate, address proof, Aadhaar. No denial based on documents. Also 25% quota in private schools.",
    simpleAnswer: "Free school education for six to fourteen years under RTE.",
    keywords: ["school", "admission", "rte", "education"]
  },
  {
    category: "Education",
    patterns: ["scholarship application", "छात्रवृत्ति", "student financial aid"],
    answer: "Apply for scholarships at scholarships.gov.in. Pre-matric (₹300-1000/year), Post-matric (₹5,000-20,000/year), Merit-based (₹10,000-50,000). Need student ID, bank account, income certificate, caste certificate (if applicable).",
    simpleAnswer: "Apply for student scholarship online on NSP portal.",
    keywords: ["scholarship", "student", "chhatravritti", "financial"]
  },
  {
    category: "Education",
    patterns: ["college admission", "कॉलेज में दाखिला", "university admission"],
    answer: "College admission through central (JEE, NEET, CUET) or state entrance exams. Or merit-based on 12th marks. Apply online during admission season (May-August). Check domicile, category reservations.",
    simpleAnswer: "College admission through entrance exams or merit list.",
    keywords: ["college", "admission", "university", "entrance"]
  },
  {
    category: "Education",
    patterns: ["education loan", "शिक्षा ऋण", "student loan"],
    answer: "Education loan from banks: Up to ₹7.5L (no collateral in India), ₹10-20L (with collateral), above ₹20L (third-party guarantee). Interest 8-15%. Moratorium till course+1 year. Tax benefit under 80E.",
    simpleAnswer: "Education loan up to twenty lakh from banks with low interest.",
    keywords: ["education", "loan", "student", "shiksha"]
  },
  {
    category: "Education",
    patterns: ["vocational training", "व्यावसायिक प्रशिक्षण", "iti", "polytechnic"],
    answer: "Vocational training: ITI (100+ trades, 1-2 years), Polytechnic (3 years diploma), Skill India courses. Free/subsidized training. Certificate valuable for jobs. Apply after 8th/10th class.",
    simpleAnswer: "ITI and Polytechnic provide vocational training after eighth or tenth.",
    keywords: ["vocational", "training", "iti", "polytechnic", "skill"]
  },
  {
    category: "Education",
    patterns: ["distance education", "दूरस्थ शिक्षा", "correspondence", "online degree"],
    answer: "Distance education from IGNOU, state open universities. Same degree value as regular. Study while working. Lower fees. Online classes, exam centers nationwide. Good for graduation, PG, diploma.",
    simpleAnswer: "Distance education from IGNOU allows studying while working.",
    keywords: ["distance", "education", "ignou", "correspondence", "online"]
  },
  {
    category: "Education",
    patterns: ["free coaching", "मुफ्त कोचिंग", "competitive exam"],
    answer: "Free coaching for SC/ST/OBC/minorities for UPSC, SSC, banking, technical exams. Apply through social welfare department. Also online coaching on SWAYAM, Unacademy (free). Residential facilities available.",
    simpleAnswer: "Free coaching for competitive exams for reserved categories.",
    keywords: ["coaching", "free", "competitive", "exam", "upsc"]
  },
  {
    category: "Education",
    patterns: ["adult education", "प्रौढ़ शिक्षा", "literacy program"],
    answer: "Adult education programs under Saakshar Bharat Mission. Free basic literacy classes at schools/community centers. Learn reading, writing, numeracy. No age limit. Certificate issued.",
    simpleAnswer: "Adult education programs provide free literacy classes for all ages.",
    keywords: ["adult", "education", "literacy", "praudh", "saakshar"]
  },

  // ═══════════════════════════════════════════════════════════
  // CATEGORY B7: HEALTH & WELFARE (25+ entries)
  // ═══════════════════════════════════════════════════════════
  {
    category: "Healthcare",
    patterns: ["free treatment", "मुफ्त इलाज", "government hospital"],
    answer: "Free treatment at government hospitals (district, medical college, AIIMS). OPD consultation, medicines, surgeries, ICU all free. Also free under Ayushman Bharat at empaneled private hospitals (₹5L coverage).",
    simpleAnswer: "Free treatment at government hospitals and under Ayushman Bharat.",
    keywords: ["free", "treatment", "hospital", "muft", "ilaaj"]
  },
  {
    category: "Healthcare",
    patterns: ["vaccination", "टीकाकरण", "immunization", "vaccine"],
    answer: "Free vaccination: Children (BCG, DPT, Polio, Measles, etc. as per schedule), Adults (COVID-19, Tetanus). Get at PHC, CHC, government hospitals. Vaccination card important. No fees.",
    simpleAnswer: "Free vaccination for children and adults at government hospitals.",
    keywords: ["vaccination", "immunization", "tikakaran", "vaccine"]
  },
  {
    category: "Healthcare",
    patterns: ["pregnancy care", "गर्भावस्था देखभाल", "anc", "prenatal"],
    answer: "Free pregnancy care: Regular checkups at PHC/Anganwadi, iron tablets, TT injection, institutional delivery (₹1,400 JSY benefit), 6 months postnatal care. Register at Anganwadi within 12 weeks.",
    simpleAnswer: "Free pregnancy care and delivery at government hospitals with cash benefit.",
    keywords: ["pregnancy", "care", "anc", "delivery", "garbhavastha"]
  },
  {
    category: "Healthcare",
    patterns: ["family planning", "परिवार नियोजन", "contraception"],
    answer: "Free family planning services: Condoms, pills, copper-T, tubectomy, vasectomy at PHC/CHC. Also compensation for sterilization. Counseling available. No force, voluntary choice.",
    simpleAnswer: "Free family planning services at government health centers.",
    keywords: ["family", "planning", "contraception", "niyojan"]
  },
  {
    category: "Healthcare",
    patterns: ["mental health", "मानसिक स्वास्थ्य", "depression", "counseling"],
    answer: "Mental health services: District Mental Health Programme (DMHP) at district hospitals. Free consultation, medicines. National helpline 14416 (KIRAN) or 1800-599-0019 (Vandrevala). No stigma, seek help.",
    simpleAnswer: "Free mental health services at district hospitals. Helpline fourteen four one six.",
    keywords: ["mental", "health", "depression", "counseling", "mansik"]
  },
  {
    category: "Healthcare",
    patterns: ["tb treatment", "tuberculosis", "टीबी का इलाज"],
    answer: "Free TB treatment under National TB Elimination Programme. Testing, medicines, DOTS therapy free. Nutritional support ₹500/month. 100% curable if complete treatment. Visit nearest DOTS center or PHC.",
    simpleAnswer: "Free TB treatment with nutritional support at DOTS centers.",
    keywords: ["tb", "tuberculosis", "dots", "treatment"]
  },
  {
    category: "Healthcare",
    patterns: ["diabetes", "मधुमेह", "blood sugar", "diabetes care"],
    answer: "Diabetes care: Free screening at NCD clinics in PHC/CHC, subsidized medicines at Jan Aushadhi (₹50-100/month), free insulin in govt hospitals. Regular checkup, diet control important.",
    simpleAnswer: "Free diabetes screening and cheap medicines at Jan Aushadhi.",
    keywords: ["diabetes", "madhumeh", "sugar", "insulin"]
  },
  {
    category: "Healthcare",
    patterns: ["blood pressure", "उच्च रक्तचाप", "hypertension"],
    answer: "Hypertension care: Free checkup at NCD clinics, medicines at Jan Aushadhi (₹30-80/month). Regular monitoring important. Reduce salt, exercise. Free ECG at PHC.",
    simpleAnswer: "Free blood pressure checkup and cheap medicines available.",
    keywords: ["blood", "pressure", "hypertension", "raktchaap"]
  },
  {
    category: "Healthcare",
    patterns: ["ambulance", "एम्बुलेंस", "108", "emergency transport"],
    answer: "Free ambulance: Dial 108 (102 in some states) for emergency. Basic Life Support ambulance free. Reaches in 15-20 minutes. Also paid ambulances available. COVID ambulances separate.",
    simpleAnswer: "Free ambulance dial one zero eight for emergency.",
    keywords: ["ambulance", "emergency", "transport", "108"]
  },
  {
    category: "Healthcare",
    patterns: ["blood donation", "रक्तदान", "blood bank"],
    answer: "Blood banks at district hospitals, blood transfusion centers. Donate at camps or blood banks. Voluntary donation saves lives. Age 18-65, weight 45kg+. Get refreshments, certificate. Replacement donation if needed.",
    simpleAnswer: "Donate blood at government blood banks to save lives.",
    keywords: ["blood", "donation", "raktdaan", "bank"]
  },

  // ═══════════════════════════════════════════════════════════
  // CATEGORY B8: LABOR & EMPLOYMENT (25+ entries)
  // ═══════════════════════════════════════════════════════════
  {
    category: "Employment",
    patterns: ["job search", "नौकरी खोज", "employment", "find work"],
    answer: "Job search: Register on National Career Service (ncs.gov.in), Employment Exchange, state employment portals. Rojgar Melas held regularly. Check newspapers, govt websites for vacancies. Skill training available.",
    simpleAnswer: "Register on NCS portal and employment exchange for jobs.",
    keywords: ["job", "search", "employment", "naukri", "work"]
  },
  {
    category: "Employment",
    patterns: ["government job", "सरकारी नौकरी", "sarkari naukri"],
    answer: "Government jobs: UPSC (IAS, IPS, IFS), SSC (clerical, MTS), Banking, Railways, State PSC, Police. Register for exams, no agent needed. Notifications on employment news, official websites. No fees for application.",
    simpleAnswer: "Government jobs through UPSC, SSC, Banking, Railways exams.",
    keywords: ["government", "job", "sarkari", "naukri", "upsc"]
  },
  {
    category: "Employment",
    patterns: ["apprenticeship", "शिक्षुता", "training job"],
    answer: "Apprenticeship under National Apprenticeship Promotion Scheme (NAPS). Get stipend ₹5,000-9,000/month + training. After ITI/Diploma or 10th/12th. Register at apprenticeshipindia.org. Good path to permanent job.",
    simpleAnswer: "Apprenticeship gives training with five to nine thousand stipend.",
    keywords: ["apprenticeship", "training", "naps", "shikshuta"]
  },
  {
    category: "Employment",
    patterns: ["self employment", "स्वरोज़गार", "own business"],
    answer: "Self-employment schemes: PMEGP (manufacturing/service), MUDRA (loan up to ₹10L), Stand Up India (SC/ST/Women), State schemes. Get subsidy 15-35%, loan rest. Training provided.",
    simpleAnswer: "Start business with MUDRA loan or PMEGP subsidy.",
    keywords: ["self", "employment", "business", "swarozgar"]
  },
  {
    category: "Employment",
    patterns: ["minimum wage", "न्यूनतम वेतन", "daily wage"],
    answer: "Minimum wage varies by state and skill (₹300-600/day). Unskilled lowest, skilled/semi-skilled higher. Revised yearly. Mandatory for all employers. Complaint to labor commissioner if not paid.",
    simpleAnswer: "Minimum wage three hundred to six hundred per day by state.",
    keywords: ["minimum", "wage", "salary", "vetan", "majduri"]
  },
  {
    category: "Employment",
    patterns: ["esi", "employees state insurance", "कर्मचारी बीमा"],
    answer: "ESI (Employees State Insurance): Medical+cash benefits for workers earning up to ₹21,000/month. Contribution 0.75% by employee, 3.25% by employer. Free treatment at ESI hospitals/dispensaries. Maternity, disability benefits.",
    simpleAnswer: "ESI provides free medical treatment for employees below twenty-one thousand salary.",
    keywords: ["esi", "insurance", "medical", "employee"]
  },
  {
    category: "Employment",
    patterns: ["labor card", "श्रमिक कार्ड", "construction worker"],
    answer: "Labor/Shramik card for construction workers. Register at Labor Department with proof of 90 days work. Benefits: Scholarship for children, accident insurance, maternity, pension. Contribution ₹50-100/year.",
    simpleAnswer: "Register as construction worker for scholarship and insurance benefits.",
    keywords: ["labor", "card", "shramik", "construction", "worker"]
  },
  {
    category: "Employment",
    patterns: ["maternity leave", "मातृत्व अवकाश", "maternity benefit"],
    answer: "Maternity leave: 26 weeks paid leave for women (12 weeks for 3rd+ child). Applicable to all establishments with 10+ workers. Cannot be terminated during pregnancy/leave. Full salary during leave.",
    simpleAnswer: "Women get twenty-six weeks paid maternity leave.",
    keywords: ["maternity", "leave", "avkash", "pregnancy"]
  },
  {
    category: "Employment",
    patterns: ["labor complaint", "श्रम शिकायत", "workplace issue"],
    answer: "Labor complaints: File at Labor Commissioner office or online on state labor portal. Issues: Unpaid wages, wrongful termination, PF non-payment, harassment. Conciliation first, then legal. Labor helpline 1800-111-555.",
    simpleAnswer: "File labor complaint at labor office or helpline eighteen hundred one eleven five fifty five.",
    keywords: ["labor", "complaint", "shikayat", "workplace"]
  },
  {
    category: "Employment",
    patterns: ["unemployment allowance", "बेरोज़गारी भत्ता", "job seeker benefit"],
    answer: "Unemployment allowance in some states (Rajasthan, Punjab, etc.) for educated unemployed. ₹1,000-3,500/month for limited period. Criteria: Graduate/12th pass, registered with employment exchange, family income limit. Check state portal.",
    simpleAnswer: "Some states give unemployment allowance to graduates.",
    keywords: ["unemployment", "allowance", "berozgari", "bhatta"]
  },

  // ═══════════════════════════════════════════════════════════
  // CATEGORY B9: PRACTICAL INFO & MISC (40+ entries)
  // ═══════════════════════════════════════════════════════════
  {
    category: "Practical Info",
    patterns: ["office timings", "सरकारी कार्यालय समय", "office hours", "when open"],
    answer: "Government offices: 10am-5pm or 10:30am-5:30pm (Monday-Friday). Some close for lunch 1-2pm. Banks 10am-4pm, Post office 9am-5pm. PSU banks Saturday half-day (10am-2pm). Sundays closed except emergencies.",
    simpleAnswer: "Government offices ten to five, Monday to Friday.",
    keywords: ["office", "timings", "hours", "samay", "when"]
  },
  {
    category: "Practical Info",
    patterns: ["best time to visit", "कब जाएं", "when to go", "crowd"],
    answer: "Best time: Early morning (10-11am) or late afternoon (4-5pm) to avoid crowds. Avoid month-end for banks, pension offices. Apply online whenever possible to save time.",
    simpleAnswer: "Visit early morning or late afternoon to avoid crowds.",
    keywords: ["best", "time", "visit", "kab", "jayen"]
  },
  {
    category: "Practical Info",
    patterns: ["token system", "टोकन", "queue", "number"],
    answer: "Many offices have token/number system. Collect token at entry, wait for your turn. Display shows current number. Some have online appointment booking. Reach 30 min before closing to get token.",
    simpleAnswer: "Take token at entry and wait for your number.",
    keywords: ["token", "queue", "number", "turn"]
  },
  {
    category: "Practical Info",
    patterns: ["photocopy", "फोटोकॉपी", "xerox", "documents copy"],
    answer: "Photocopy shops near government offices charge ₹2-5 per page. Keep original + 2-3 photocopies. Self-attested copies accepted for most applications. Notary required for some documents (₹10-50).",
    simpleAnswer: "Carry original plus two three photocopies. Shops charge two to five rupees.",
    keywords: ["photocopy", "xerox", "copy", "documents"]
  },
  {
    category: "Practical Info",
    patterns: ["passport size photo", "फोटो", "photograph requirements"],
    answer: "Passport size photos (3.5cm x 4.5cm) required for most applications. White background. Recent (within 6 months). Get from photo studio ₹40-100 for 4-8 photos. Digital photo for online applications.",
    simpleAnswer: "Passport size photo with white background costs forty to hundred.",
    keywords: ["photo", "photograph", "passport", "size"]
  },
  {
    category: "Practical Info",
    patterns: ["self attestation", "स्व-प्रमाणित", "self attested", "signature"],
    answer: "Self-attestation: Sign across your photo on photocopy. Write 'Self-attested' or 'True copy' with date and signature on document copies. No need for notary/gazetted officer for most applications.",
    simpleAnswer: "Sign on photocopy with self-attested and date.",
    keywords: ["self", "attestation", "attested", "signature", "pramaan"]
  },
  {
    category: "Practical Info",
    patterns: ["notary", "नोटरी", "affidavit"],
    answer: "Notary public certifies documents. Fee ₹10-50 per document. Required for: Affidavits, property documents, legal matters. Notaries available near courts. Take original documents for verification.",
    simpleAnswer: "Notary charges ten to fifty rupees per document.",
    keywords: ["notary", "notari", "affidavit", "certificate"]
  },
  {
    category: "Practical Info",
    patterns: ["gazetted officer", "गजेटेड अधिकारी", "attestation"],
    answer: "Gazetted officer: Class-I officer (Tehsildar, SDM, Collector, etc.) can attest documents. Required for passport, some scholarships. Visit office, show original, get attested copy. Free of cost.",
    simpleAnswer: "Gazetted officer attests documents free at their office.",
    keywords: ["gazetted", "officer", "attestation", "adhikari"]
  },
  {
    category: "Practical Info",
    patterns: ["forms", "फॉर्म", "application form", "where to get"],
    answer: "Forms available: Office counter (free/₹5-20), Download from website (print), CSC/Jan Seva Kendra (₹10-20), Stationery shops. Fill clearly in BLOCK LETTERS. Don't overwrite.",
    simpleAnswer: "Get forms from office counter, website, or nearby shops.",
    keywords: ["forms", "application", "form", "kahan", "milega"]
  },
  {
    category: "Practical Info",
    patterns: ["mobile recharge", "मोबाइल रिचार्ज", "prepaid"],
    answer: "Recharge at: Mobile app (Paytm, PhonePe, GooglePay), Retailer shops, Bank net banking, Operator website. Plans start ₹10. Validity packs ₹100-700. Unlimited calls + data ₹200-400/month.",
    simpleAnswer: "Recharge via mobile app or shops. Plans start hundred rupees.",
    keywords: ["mobile", "recharge", "prepaid", "plan"]
  },
  {
    category: "Practical Info",
    patterns: ["electricity bill", "बिजली बिल", "power bill payment"],
    answer: "Pay electricity bill: Online (state electricity board website/app), Paytm/PhonePe, Bank, Electricity office. Payment within due date avoids late fee. Check consumer number on previous bill.",
    simpleAnswer: "Pay electricity bill online or at office before due date.",
    keywords: ["electricity", "bill", "bijli", "payment"]
  },
  {
    category: "Practical Info",
    patterns: ["water bill", "पानी का बिल", "jal bill"],
    answer: "Water bill: Quarterly or monthly. Pay at Municipal Corporation office, online on municipal website, or through apps. Meter reading-based or flat rate. Penalty for late payment.",
    simpleAnswer: "Pay water bill at municipal office or online.",
    keywords: ["water", "bill", "pani", "jal", "payment"]
  },
  {
    category: "Practical Info",
    patterns: ["name change", "नाम बदलना", "change name"],
    answer: "Name change: Publish in 2 newspapers (1 English, 1 regional), Publish in Gazette notification (₹1,000-2,000), Make affidavit. Then update all documents (Aadhaar, PAN, passport, etc.). Process takes 2-3 months.",
    simpleAnswer: "Name change via newspaper and gazette publication, then update all documents.",
    keywords: ["name", "change", "naam", "badalna"]
  },
  {
    category: "Practical Info",
    patterns: ["address change", "पता बदलना", "update address"],
    answer: "Address change: Update Aadhaar first (online ₹50 or at center), then PAN, bank, passport, DL. Takes 30-60 days. Proof: Rent agreement, electricity/water bill, ration card. Most updatable online.",
    simpleAnswer: "Update address in Aadhaar first, then all other documents.",
    keywords: ["address", "change", "pata", "badalna", "update"]
  },
  {
    category: "Practical Info",
    patterns: ["duplicate documents", "दस्तावेज़ खो गया", "lost document", "duplicate"],
    answer: "Lost document: File FIR for important docs. Apply for duplicate with Affidavit + newspaper publication + application. Duplicate Aadhaar free (₹50 for urgent), PAN ₹50, Passport ₹3,000 (tatkaal).",
    simpleAnswer: "File FIR, then apply for duplicate with affidavit.",
    keywords: ["duplicate", "lost", "document", "kho", "gaya"]
  },
  {
    category: "Practical Info",
    patterns: ["internet connection", "इंटरनेट", "wifi", "broadband"],
    answer: "Internet: Fiber broadband (BSNL, Jio, Airtel) ₹400-1,000/month (50-300 Mbps). Postpaid mobile data ₹200-500/month. Installation ₹1,000-3,000 (refundable). Apply online or at office. Connection in 7 days.",
    simpleAnswer: "Broadband costs four hundred to thousand per month from various providers.",
    keywords: ["internet", "connection", "wifi", "broadband"]
  },
  {
    category: "Practical Info",
    patterns: ["train ticket", "ट्रेन टिकट", "irctc", "railway"],
    answer: "Book train tickets: IRCTC website/app (need registration), Railway counter, Agents (₹10-20 charge). Tatkal 1 day advance, Regular 120 days advance. Senior citizens 40-50% discount. Confirm PNR status.",
    simpleAnswer: "Book train tickets on IRCTC app or at station counter.",
    keywords: ["train", "ticket", "irctc", "railway", "booking"]
  },
  {
    category: "Practical Info",
    patterns: ["flight ticket", "हवाई जहाज़", "air travel", "airplane"],
    answer: "Book flights: Airline websites, MakeMyTrip, Goibibo, Yatra. Book 30-60 days advance for cheap fares. Budget airlines (IndiGo, SpiceJet) cheaper. Check baggage limits. Web check-in 48 hours before.",
    simpleAnswer: "Book flights online thirty to sixty days in advance for cheap rates.",
    keywords: ["flight", "ticket", "airplane", "hawai", "air"]
  },
  {
    category: "Practical Info",
    patterns: ["bus ticket", "बस टिकट", "bus booking", "roadways"],
    answer: "Bus tickets: State transport websites, RedBus, counter booking. Advance booking for long distance. Sleeper, semi-sleeper, AC options. Senior citizens/students may get discount. Keep ticket till journey end.",
    simpleAnswer: "Book bus tickets online on state transport website or RedBus.",
    keywords: ["bus", "ticket", "booking", "roadways", "transport"]
  },
  {
    category: "Practical Info",
    patterns: ["hotel booking", "होटल", "accommodation", "stay"],
    answer: "Book hotels: OYO, MakeMyTrip, Goibibo, Booking.com. Budget ₹500-1,500, Mid-range ₹1,500-4,000. Check reviews, location, cancellation policy. Government guest houses cheaper for official work.",
    simpleAnswer: "Book hotels online from five hundred rupees onwards.",
    keywords: ["hotel", "booking", "accommodation", "stay"]
  },
  {
    category: "Practical Info",
    patterns: ["calendar", "कैलेंडर", "holidays", "government holidays"],
    answer: "Government holidays: Republic Day (26 Jan), Independence Day (15 Aug), Gandhi Jayanti (2 Oct), + state-specific festivals. Total 10-12 central + 10-12 state holidays. Check annual calendar for specific year.",
    simpleAnswer: "Government has about twenty holidays including national and festival days.",
    keywords: ["calendar", "holidays", "chhutti", "government"]
  },

  // ═══════════════════════════════════════════════════════════
  // CATEGORY C: AI-SAHAYAK WEBSITE KNOWLEDGE (50+ entries)
  // ═══════════════════════════════════════════════════════════
  {
    category: "Website Knowledge",
    patterns: ["what is ai sahayak", "ai sahayak kya hai", "about this website", "what is this"],
    answer: "AI-Sahayak is a multilingual voice-based government assistance platform. It helps citizens access schemes, check eligibility, view market prices, analyze documents, and discover nearby services using voice or text in 10 Indian languages.",
    simpleAnswer: "AI-Sahayak helps you use government services through voice and text.",
    keywords: ["ai-sahayak", "about", "website", "platform"]
  },
  {
    category: "Website Knowledge",
    patterns: ["how to use voice", "voice assistant", "how to speak", "आवाज से कैसे"],
    answer: "Click the microphone button and speak your question. AI-Sahayak will listen, understand, and respond with voice output. Works in all 10 supported languages. No typing needed.",
    simpleAnswer: "Click microphone button and speak your question.",
    keywords: ["voice", "assistant", "speak", "microphone"]
  },
  {
    category: "Website Knowledge",
    patterns: ["check eligibility", "योजना पात्रता", "am i eligible", "eligibility checker"],
    answer: "Go to Eligibility Checker module. Enter your age, income, occupation, and state. The system matches against 2000+ scheme rules and tells you which schemes you qualify for.",
    simpleAnswer: "Use Eligibility Checker to know which schemes you can get.",
    keywords: ["eligibility", "checker", "schemes", "qualify"]
  },
  {
    category: "Website Knowledge",
    patterns: ["upload document", "document analyzer", "दस्तावेज़", "scan document"],
    answer: "Go to Document Analyzer. Upload your PDF or image (Aadhaar, ration card, certificate). AI extracts text, translates it, and reads it aloud in your language.",
    simpleAnswer: "Upload document in Document Analyzer to understand it.",
    keywords: ["document", "analyzer", "upload", "ocr"]
  },
  {
    category: "Website Knowledge",
    patterns: ["change language", "भाषा बदलें", "switch language", "language settings"],
    answer: "Click the language dropdown in the top navigation bar. Choose from 10 languages: English, Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, or Punjabi.",
    simpleAnswer: "Click language dropdown at top to change language.",
    keywords: ["language", "change", "switch", "multilingual"]
  },
  {
    category: "Website Knowledge",
    patterns: ["recent queries", "history", "पिछले सवाल", "previous questions"],
    answer: "Go to Recent Queries page to see your last 10 voice/text questions with answers. You can replay audio and see full conversation history.",
    simpleAnswer: "Recent Queries shows your previous questions and answers.",
    keywords: ["recent", "queries", "history", "previous"]
  },
  {
    category: "Website Knowledge",
    patterns: ["market data", "mandi prices", "बाजार भाव", "commodity prices"],
    answer: "Go to Market Data module to see real-time commodity prices per kg with charts and trends. Voice output available for each item. Covers vegetables, grains, and cash crops.",
    simpleAnswer: "Market Data shows today's crop prices.",
    keywords: ["market", "prices", "mandi", "commodity"]
  },
  {
    category: "Website Knowledge",
    patterns: ["nearby services", "local services", "नजदीकी सेवाएं", "hospitals banks"],
    answer: "Use Service Discovery to find nearest hospitals, police stations, banks, government offices, and schools with distance and directions.",
    simpleAnswer: "Service Discovery finds nearby hospitals and offices.",
    keywords: ["nearby", "services", "local", "hospitals"]
  },
  {
    category: "Website Knowledge",
    patterns: ["draft generator", "application", "letter", "आवेदन"],
    answer: "Go to Draft Generator to create ready-to-submit applications for income certificate, caste certificate, leave letters, complaints, and more. Edit and download as needed.",
    simpleAnswer: "Draft Generator creates applications and letters for you.",
    keywords: ["draft", "generator", "application", "letter"]
  },
  {
    category: "Website Knowledge",
    patterns: ["no internet", "offline mode", "इंटरनेट नहीं", "api not working"],
    answer: "AI-Sahayak works in offline mode with browser speech recognition and static knowledge base. All modules have fallback responses. No internet required for basic functionality.",
    simpleAnswer: "Works without internet using browser features.",
    keywords: ["offline", "internet", "fallback", "api"]
  },

  // ═══════════════════════════════════════════════════════════
  // CATEGORY D: MODULE-SPECIFIC KNOWLEDGE (50+ entries)
  // ═══════════════════════════════════════════════════════════
  {
    category: "Module Knowledge",
    patterns: ["voice assistant features", "what can voice do", "voice capabilities"],
    answer: "Voice Assistant listens to your question in any of 10 languages, processes it using AI, and responds with voice output. Works with or without internet. Supports complex queries about schemes, prices, and services.",
    simpleAnswer: "Voice Assistant answers your spoken questions.",
    keywords: ["voice", "assistant", "features", "capabilities"]
  },
  {
    category: "Module Knowledge",
    patterns: ["eligibility rules", "how eligibility works", "पात्रता कैसे"],
    answer: "Eligibility Checker uses 2000+ government scheme rules. It matches your age, income, occupation, and state against criteria to determine eligibility. Shows required documents and next steps.",
    simpleAnswer: "Checks your details against scheme rules.",
    keywords: ["eligibility", "rules", "checker", "schemes"]
  },
  {
    category: "Module Knowledge",
    patterns: ["how to see market trends", "price charts", "market analysis"],
    answer: "Market Data module shows bar charts of commodity prices, trend indicators (up/down/stable), and percentage changes. Voice summary available for all commodities.",
    simpleAnswer: "Shows price charts and trends for crops.",
    keywords: ["market", "trends", "charts", "analysis"]
  },
  {
    category: "Module Knowledge",
    patterns: ["dashboard features", "home page", "डैशबोर्ड"],
    answer: "Dashboard shows personalized greeting, quick access to all modules, recent queries summary, and market snapshot. Voice greeting available in your selected language.",
    simpleAnswer: "Dashboard is your home page with all features.",
    keywords: ["dashboard", "home", "features", "modules"]
  },
  {
    category: "Module Knowledge",
    patterns: ["document types supported", "which documents", "कौन से दस्तावेज़"],
    answer: "Document Analyzer supports PDFs and images of Aadhaar, PAN, ration card, certificates, land records, government notices, and application forms. Extracts text and translates.",
    simpleAnswer: "Supports Aadhaar, ration card, certificates, and more.",
    keywords: ["document", "types", "supported", "upload"]
  },
  {
    category: "Module Knowledge",
    patterns: ["draft templates", "what letters", "application types"],
    answer: "Draft Generator provides templates for income certificate, caste certificate, domicile certificate, leave applications, complaint letters, NOCs, and grievance petitions.",
    simpleAnswer: "Creates certificates, leaves, complaints, and more.",
    keywords: ["draft", "templates", "letters", "applications"]
  },
  {
    category: "Module Knowledge",
    patterns: ["chat history", "save conversations", "बातचीत"],
    answer: "Chat Assistant automatically saves your conversations locally. Access past questions and answers anytime. Works even when internet fails using static knowledge.",
    simpleAnswer: "Chat saves your conversations automatically.",
    keywords: ["chat", "history", "conversations", "save"]
  },
  {
    category: "Module Knowledge",
    patterns: ["service categories", "what services", "कौन सी सेवाएं"],
    answer: "Service Discovery covers healthcare (hospitals, PHC), law enforcement (police), finance (banks, ATM), government offices, education (schools), and transportation.",
    simpleAnswer: "Finds hospitals, police, banks, schools nearby.",
    keywords: ["services", "categories", "nearby", "local"]
  }
];

// Smart matching function
export function findBestMatch(userQuery: string): KnowledgeEntry | null {
  const lowerQuery = userQuery.toLowerCase();
  
  // Try exact pattern match first
  for (const entry of CHAT_STATIC_KNOWLEDGE) {
    for (const pattern of entry.patterns) {
      if (lowerQuery.includes(pattern.toLowerCase())) {
        return entry;
      }
    }
  }
  
  // Try keyword matching
  for (const entry of CHAT_STATIC_KNOWLEDGE) {
    const matchingKeywords = entry.keywords.filter(keyword => 
      lowerQuery.includes(keyword.toLowerCase())
    );
    
    if (matchingKeywords.length >= 2) {
      return entry;
    }
  }
  
  return null;
}

// Generate answer from knowledge base
export function getStaticAnswer(userQuery: string): string {
  const match = findBestMatch(userQuery);
  
  if (match) {
    return `API not working — providing trained safe fallback response.\n\n${match.answer}`;
  }
  
  // Default fallback
  return "API not working — safe fallback mode active. I can help with government schemes, market prices, eligibility checks, and using this website. Please try asking about PM-Kisan, Ayushman Bharat, market prices, or how to use AI-Sahayak features.";
}
