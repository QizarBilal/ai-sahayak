import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { transcribeAudio, synthesizeSpeech, generateEarcon } from "./bytez-client";
import { 
  generateText, 
  chatWithHistory, 
  generateStructuredResponse,
  checkEligibility,
  summarizeDocument,
  translateText,
  generateDraft,
  generateVoiceResponse
} from "./gemini";
import { 
  extractTextFromImage,
  searchNearbyServices,
  getMarketPrices,
  calculateDistance
} from "./api-integrations";
import { cache, getCached } from "./cache";
import multer from "multer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// Using native fetch (Node 18+)

const upload = multer({ storage: multer.memoryStorage() });

const JWT_SECRET = process.env.JWT_SECRET || "ai-sahayak-secret-key-change-in-production";

// Helper functions for fallback eligibility checking
function getCategoryScheme(category: string): string {
  const schemes: Record<string, string> = {
    agriculture: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    education: "National Scholarship Portal - Post Matric Scholarship",
    health: "Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana",
    housing: "Pradhan Mantri Awas Yojana - Gramin",
    employment: "Pradhan Mantri Mudra Yojana",
    women: "Pradhan Mantri Matru Vandana Yojana",
    senior: "Indira Gandhi National Old Age Pension Scheme",
  };
  return schemes[category] || "Government Welfare Scheme";
}

function checkEligibilityFallback(category: string, userDetails: any) {
  const age = userDetails.age || 0;
  const income = userDetails.income || 0;
  const schemes: Record<string, any> = {
    agriculture: {
      eligible: income < 200000,
      reason: income < 200000 
        ? "You are eligible for PM-KISAN scheme as you are a farmer with landholding."
        : "Your income exceeds the eligibility criteria for PM-KISAN.",
      requiredDocuments: ["Aadhaar Card", "Land Ownership Documents", "Bank Account Details", "Passport Size Photo"],
      nextSteps: [
        "Visit your nearest Common Service Centre (CSC) or PM-KISAN portal",
        "Fill the online application form with your details",
        "Upload required documents",
        "Submit the application and note the reference number",
        "Track your application status online"
      ]
    },
    education: {
      eligible: age >= 10 && age <= 35 && income < 250000,
      reason: (age >= 10 && age <= 35 && income < 250000)
        ? "You are eligible for National Scholarship Portal schemes based on your age and income."
        : "You do not meet the age or income criteria for scholarship schemes.",
      requiredDocuments: ["Aadhaar Card", "Income Certificate", "Caste Certificate (if applicable)", "Previous Year Mark Sheet", "Bank Account Details"],
      nextSteps: [
        "Register on National Scholarship Portal (scholarships.gov.in)",
        "Complete your profile with accurate details",
        "Apply for relevant scholarship schemes",
        "Upload all required documents",
        "Submit and track your application"
      ]
    },
    health: {
      eligible: income < 500000,
      reason: income < 500000
        ? "You are eligible for Ayushman Bharat health coverage with annual income below ₹5 lakhs."
        : "Your income exceeds the eligibility limit for Ayushman Bharat scheme.",
      requiredDocuments: ["Aadhaar Card", "Ration Card", "Income Certificate", "Residence Proof"],
      nextSteps: [
        "Visit nearest Ayushman Bharat - Health and Wellness Centre",
        "Get your eligibility verified",
        "Receive your Ayushman Bharat card",
        "Use the card at empanelled hospitals for free treatment",
        "Coverage up to ₹5 lakhs per family per year"
      ]
    },
    housing: {
      eligible: income < 300000 && !userDetails.hasHouse,
      reason: (income < 300000 && !userDetails.hasHouse)
        ? "You are eligible for PM Awas Yojana as you don't own a pucca house and meet income criteria."
        : "You either own a house or your income exceeds the eligibility criteria.",
      requiredDocuments: ["Aadhaar Card", "Income Certificate", "Residence Proof", "Bank Account Details", "Caste Certificate (if applicable)"],
      nextSteps: [
        "Visit PM Awas Yojana portal (pmaymis.gov.in)",
        "Fill the online application form",
        "Get verification from local authorities",
        "Submit all required documents",
        "Wait for approval and subsidy disbursement"
      ]
    },
    employment: {
      eligible: age >= 18 && age <= 65,
      reason: (age >= 18 && age <= 65)
        ? "You are eligible for PM Mudra Yojana to start or expand your micro-enterprise."
        : "You do not meet the age criteria for PM Mudra Yojana.",
      requiredDocuments: ["Aadhaar Card", "PAN Card", "Business Plan/Proposal", "Bank Account Details", "Residence and Identity Proof"],
      nextSteps: [
        "Prepare a detailed business plan",
        "Visit nearest bank or NBFC offering Mudra loans",
        "Fill the loan application form",
        "Submit required documents and business plan",
        "Attend verification and receive loan approval"
      ]
    },
    women: {
      eligible: userDetails.gender === "female" && age >= 19 && age <= 45,
      reason: (userDetails.gender === "female" && age >= 19 && age <= 45)
        ? "You are eligible for PM Matru Vandana Yojana maternity benefits."
        : "You do not meet the eligibility criteria for women empowerment schemes.",
      requiredDocuments: ["Aadhaar Card", "Mother and Child Protection Card", "Bank Account Details", "Age Proof"],
      nextSteps: [
        "Register at your nearest Anganwadi Centre",
        "Fill Form 1A during pregnancy (before 150 days)",
        "Fill Form 1B after first antenatal check-up",
        "Fill Form 1C after child birth and vaccination",
        "Receive direct benefit transfer of ₹5,000 in installments"
      ]
    },
    senior: {
      eligible: age >= 60 && income < 100000,
      reason: (age >= 60 && income < 100000)
        ? "You are eligible for Indira Gandhi National Old Age Pension Scheme."
        : "You do not meet the age or income criteria for senior citizen pension.",
      requiredDocuments: ["Aadhaar Card", "Age Proof (Birth Certificate/School Certificate)", "Income Certificate", "Bank Account Details", "Residence Proof"],
      nextSteps: [
        "Visit your local Panchayat or Municipal office",
        "Fill the pension application form",
        "Submit required documents for verification",
        "Get approval from competent authority",
        "Receive monthly pension in your bank account"
      ]
    }
  };

  const schemeData = schemes[category] || {
    eligible: false,
    reason: "Unable to determine eligibility. Please visit your nearest CSC or government office.",
    requiredDocuments: ["Aadhaar Card", "Income Certificate", "Residence Proof"],
    nextSteps: ["Visit nearest Common Service Centre", "Consult with government officials"]
  };

  return {
    schemeName: getCategoryScheme(category),
    ...schemeData
  };
}

// Middleware to verify JWT token
function authenticateToken(req: Request, res: Response, next: Function) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // For development, create a mock user
    (req as any).user = { id: "mock-user-id", username: "demo" };
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      (req as any).user = { id: "mock-user-id", username: "demo" };
      return next();
    }
    (req as any).user = user;
    next();
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply authentication middleware to all API routes
  app.use("/api", authenticateToken);

  // ============= USER ROUTES =============
  app.get("/api/user/current", async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      
      // Try to get from database, but fallback to mock data if DB fails
      try {
        let user = await storage.getUser(userId);
        
        // Create demo user if doesn't exist
        if (!user) {
          user = await storage.createUser({
            username: "demo",
            password: await bcrypt.hash("demo123", 10),
            fullName: "Proud Indian",
            email: "demo@ai-sahayak.in",
            phone: "+91 9876543210",
          });
        }
        
        res.json(user);
      } catch (dbError) {
        // Database connection failed, use mock data
        console.warn("Database unavailable, using mock user data");
        res.json({
          id: 1,
          username: "demo",
          fullName: "Proud Indian",
          email: "demo@ai-sahayak.in",
          phone: "+91 9876543210",
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Save user language preference
  app.post("/api/user/language", async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      const { language } = req.body;

      if (!language) {
        return res.status(400).json({ error: "Language is required" });
      }

      // Validate language code
      const validLanguages = ['en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu', 'kn', 'ml', 'pa'];
      if (!validLanguages.includes(language)) {
        return res.status(400).json({ error: "Invalid language code" });
      }

      // Save to database if user is authenticated
      if (userId) {
        try {
          await storage.updateUserLanguage(userId, language);
        } catch (dbError) {
          console.warn("Failed to save language to database:", dbError);
          // Continue anyway - client-side localStorage will handle it
        }
      }

      res.json({ success: true, language });
    } catch (error) {
      console.error("Error saving language preference:", error);
      res.status(500).json({ error: "Failed to save language preference" });
    }
  });

  // ============= VOICE ROUTES =============
  app.post("/api/voice/transcribe", upload.single("audio"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No audio file provided" });
      }

      const transcript = await transcribeAudio(req.file.buffer, req.file.mimetype);
      
      // Get user's language preference
      const userId = (req as any).user.id;
      const user = await storage.getUser(userId);
      const language = user?.language || 'en';
      
      // Generate AI response for voice query
      const response = await generateVoiceResponse(transcript, language);
      
      // Generate TTS audio for response
      const audioBuffer = await synthesizeSpeech(response);
      const responseAudioUrl = `/api/audio/response-${Date.now()}.wav`;
      
      // Save voice query
      await storage.createVoiceQuery({
        userId,
        audioUrl: `/api/audio/input-${Date.now()}.wav`,
        transcript,
        response,
        responseAudioUrl,
      });

      res.json({ transcript, response, responseAudioUrl });
    } catch (error) {
      console.error("Transcription error:", error);
      res.status(500).json({ error: "Failed to transcribe audio" });
    }
  });

  app.post("/api/voice/synthesize", async (req: Request, res: Response) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: "No text provided" });
      }

      const audioBuffer = await synthesizeSpeech(text);
      
      // In production, save to S3 and return URL
      // For now, return a mock URL
      const audioUrl = `/api/audio/${Date.now()}.wav`;
      
      res.json({ audioUrl });
    } catch (error) {
      console.error("TTS error:", error);
      res.status(500).json({ error: "Failed to synthesize speech" });
    }
  });

  app.post("/api/audio/earcon", async (req: Request, res: Response) => {
    try {
      const { description } = req.body;
      const audioBuffer = await generateEarcon(description || "notification sound");
      
      const audioUrl = `/api/audio/earcon-${Date.now()}.wav`;
      res.json({ audioUrl });
    } catch (error) {
      console.error("Earcon error:", error);
      res.status(500).json({ error: "Failed to generate earcon" });
    }
  });

  // ============= CHAT ROUTES =============
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const { message, mode, conversationId } = req.body;
      const userId = (req as any).user.id;

      // Get user's language preference
      const user = await storage.getUser(userId);
      const language = user?.language || 'en';

      // Get or create conversation
      let conversation;
      if (conversationId) {
        const conversations = await storage.getConversations(userId);
        conversation = conversations.find(c => c.id === conversationId);
      }

      if (!conversation) {
        conversation = await storage.createConversation({
          userId,
          title: message.substring(0, 50),
          mode: mode || "text",
        });
      }

      // Get conversation history
      const history = await storage.getMessages(conversation.id);
      const historyFormatted = history.map(m => ({
        role: m.role,
        content: m.content,
      }));

      // Generate response
      const response = await chatWithHistory(historyFormatted, message, language);

      // Save user message
      await storage.createMessage({
        conversationId: conversation.id,
        role: "user",
        content: message,
      });

      // Save AI response
      await storage.createMessage({
        conversationId: conversation.id,
        role: "assistant",
        content: response,
      });

      res.json({ response, conversationId: conversation.id });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to process chat" });
    }
  });

  app.get("/api/conversations", async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const conversations = await storage.getConversations(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  app.get("/api/conversations/:id/messages", async (req: Request, res: Response) => {
    try {
      const messages = await storage.getMessages(req.params.id);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // ============= VOICE QUERY ROUTES =============
  app.get("/api/queries", async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const queries = await storage.getVoiceQueries(userId);
      res.json(queries);
    } catch (error) {
      console.error("Error fetching queries:", error);
      res.status(500).json({ error: "Failed to fetch queries" });
    }
  });

  app.post("/api/queries", async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const query = await storage.createVoiceQuery({
        ...req.body,
        userId,
      });
      res.json(query);
    } catch (error) {
      console.error("Error creating query:", error);
      res.status(500).json({ error: "Failed to create query" });
    }
  });

  // ============= ELIGIBILITY ROUTES =============
  app.post("/api/eligibility/check", async (req: Request, res: Response) => {
    try {
      const { category, userDetails } = req.body;
      const userId = (req as any).user.id;

      let result;
      try {
        // Use enhanced eligibility checker
        result = await checkEligibility("", category, userDetails);
      } catch (aiError) {
        console.warn("Gemini API failed, using fallback eligibility check:", aiError);
        // Fallback to rule-based eligibility
        result = checkEligibilityFallback(category, userDetails);
      }

      const check = await storage.createEligibilityCheck({
        userId,
        schemeName: result.schemeName || getCategoryScheme(category),
        schemeCategory: category,
        userDetails,
        eligible: result.eligible,
        eligibilityReason: result.reason,
        requiredDocuments: result.requiredDocuments,
        nextSteps: result.nextSteps,
      });

      res.json(check);
    } catch (error) {
      console.error("Eligibility check error:", error);
      res.status(500).json({ error: "Failed to check eligibility" });
    }
  });

  app.get("/api/eligibility/history", async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const checks = await storage.getEligibilityChecks(userId);
      res.json(checks);
    } catch (error) {
      console.error("Error fetching eligibility history:", error);
      res.status(500).json({ error: "Failed to fetch history" });
    }
  });

  // ============= MARKET DATA ROUTES =============
  app.get("/api/markets", async (req: Request, res: Response) => {
    try {
      const { commodity, state, district } = req.query;
      const userId = (req as any).user.id;
      
      // Use cache for market data (5 minute TTL)
      const cacheKey = `market:${commodity || 'all'}:${state || 'all'}:${district || 'all'}`;
      
      const rawMarketData = await getCached(
        cacheKey,
        () => getMarketPrices(
          commodity as string | undefined,
          state as string | undefined,
          district as string | undefined
        ),
        300 // 5 minutes
      );

      // Transform data to match frontend expectations
      const marketData = rawMarketData.map((item: any) => {
        const modalPrice = parseFloat(item.modal_price || item.price || "0");
        const minPrice = parseFloat(item.min_price || item.minPrice || String(modalPrice * 0.95));
        const maxPrice = parseFloat(item.max_price || item.maxPrice || String(modalPrice * 1.05));
        
        // Calculate trend based on price variance
        const variance = maxPrice - minPrice;
        const changePercent = modalPrice > 0 ? ((variance / modalPrice) * 100).toFixed(1) : "0.0";
        const trend = variance > modalPrice * 0.05 ? "up" : variance < -modalPrice * 0.05 ? "down" : "stable";
        
        return {
          commodity: item.commodity || "Unknown",
          market: item.market || `${item.district} Mandi`,
          state: item.state || "India",
          district: item.district || "",
          price: Math.round(modalPrice),
          minPrice: Math.round(minPrice),
          maxPrice: Math.round(maxPrice),
          unit: "Rs/Quintal",
          date: item.arrival_date || new Date().toISOString().split('T')[0],
          trend,
          change: parseFloat(changePercent),
        };
      });

      // Save search if user is filtering
      if (commodity || state || district) {
        await storage.createMarketSearch({
          userId,
          commodity: commodity as string || "",
          state: state as string,
          district: district as string,
          market: "",
          results: marketData,
        });
      }

      res.json(marketData);
    } catch (error) {
      console.error("Market data error:", error);
      res.status(500).json({ error: "Failed to fetch market data" });
    }
  });

  app.get("/api/markets/history", async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const searches = await storage.getMarketSearches(userId);
      res.json(searches);
    } catch (error) {
      console.error("Error fetching market history:", error);
      res.status(500).json({ error: "Failed to fetch history" });
    }
  });

  // ============= DOCUMENT ROUTES =============
  app.post("/api/documents/analyze", upload.single("document"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No document provided" });
      }

      const userId = (req as any).user.id;
      const { language } = req.body;

      // OCR using integrated API
      let extractedText = "";
      try {
        extractedText = await extractTextFromImage(req.file.buffer);
      } catch (ocrError) {
        console.error("OCR error:", ocrError);
        extractedText = "Sample extracted text from document. OCR processing failed.";
      }

      // Generate summary using Gemini
      const summary = await summarizeDocument(extractedText, language);

      // Optional translation
      let translation = null;
      if (language && language !== "en") {
        translation = await translateText(extractedText, language);
      }

      // Save document
      const document = await storage.createDocument({
        userId,
        fileName: req.file.originalname,
        fileUrl: `/uploads/${req.file.originalname}`,
        fileType: req.file.mimetype,
        extractedText,
        summary,
        translation,
        language,
      });

      res.json({
        ...document,
        extractedText,
        summary,
        translation,
      });
    } catch (error) {
      console.error("Document analysis error:", error);
      res.status(500).json({ error: "Failed to analyze document" });
    }
  });

  app.post("/api/documents/translate", async (req: Request, res: Response) => {
    try {
      const { text, targetLanguage } = req.body;
      
      const translation = await translateText(text, targetLanguage);

      res.json({ translation });
    } catch (error) {
      console.error("Translation error:", error);
      res.status(500).json({ error: "Failed to translate" });
    }
  });

  app.get("/api/documents", async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const docs = await storage.getDocuments(userId);
      res.json(docs);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  // ============= SERVICE DISCOVERY ROUTES =============
  app.post("/api/services/search", async (req: Request, res: Response) => {
    try {
      const { serviceType, location, coords } = req.body;
      const userId = (req as any).user.id;

      // Use OpenStreetMap Nominatim API for geocoding
      let lat = coords?.lat;
      let lon = coords?.lon;

      if (!coords && location) {
        // Geocode location
        const geocodeResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
          {
            headers: {
              "User-Agent": "AI-Sahayak/1.0",
            },
          }
        );
        const geocodeData: any = await geocodeResponse.json();
        if (geocodeData.length > 0) {
          lat = parseFloat(geocodeData[0].lat);
          lon = parseFloat(geocodeData[0].lon);
        }
      }

      // Search for nearby services
      let services = [];
      if (lat && lon) {
        services = await searchNearbyServices(serviceType, lat, lon);
        
        // Calculate distances
        services = services.map((service: any) => ({
          ...service,
          distance: calculateDistance(
            lat!,
            lon!,
            parseFloat(service.latitude),
            parseFloat(service.longitude)
          ).toFixed(2),
        }));
      }

      // Save search
      await storage.createServiceSearch({
        userId,
        serviceType,
        location: location || "Current Location",
        latitude: lat?.toString(),
        longitude: lon?.toString(),
        results: services,
      });

      res.json({ services });
    } catch (error) {
      console.error("Service search error:", error);
      res.status(500).json({ error: "Failed to search services" });
    }
  });

  // ============= DRAFT ROUTES =============
  app.post("/api/drafts/generate", async (req: Request, res: Response) => {
    try {
      const { draftType, purpose, details } = req.body;

      const content = await generateDraft(draftType, purpose, details || {});

      const title = `${draftType.charAt(0).toUpperCase() + draftType.slice(1)} - ${new Date().toLocaleDateString()}`;

      res.json({ content, title });
    } catch (error) {
      console.error("Draft generation error:", error);
      res.status(500).json({ error: "Failed to generate draft" });
    }
  });

  app.post("/api/drafts", async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const draft = await storage.createDraft({
        ...req.body,
        userId,
      });
      res.json(draft);
    } catch (error) {
      console.error("Error creating draft:", error);
      res.status(500).json({ error: "Failed to create draft" });
    }
  });

  app.get("/api/drafts", async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const drafts = await storage.getDrafts(userId);
      res.json(drafts);
    } catch (error) {
      console.error("Error fetching drafts:", error);
      res.status(500).json({ error: "Failed to fetch drafts" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
