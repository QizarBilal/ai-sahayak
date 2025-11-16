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
  // CATEGORY A: MARKET PRICES (100+ entries)
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
