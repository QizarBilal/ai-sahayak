import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { transcribeAudio, synthesizeSpeech, generateEarcon } from "./bytez-client";
import { generateText, chatWithHistory, generateStructuredResponse } from "./gemini";
import multer from "multer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";

const upload = multer({ storage: multer.memoryStorage() });

const JWT_SECRET = process.env.JWT_SECRET || "ai-sahayak-secret-key-change-in-production";

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
      let user = await storage.getUser(userId);
      
      // Create demo user if doesn't exist
      if (!user) {
        user = await storage.createUser({
          username: "demo",
          password: await bcrypt.hash("demo123", 10),
          fullName: "Demo User",
          email: "demo@ai-sahayak.in",
          phone: "+91 9876543210",
        });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // ============= VOICE ROUTES =============
  app.post("/api/voice/transcribe", upload.single("audio"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No audio file provided" });
      }

      const transcript = await transcribeAudio(req.file.buffer, req.file.mimetype);
      res.json({ transcript });
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
      const response = await chatWithHistory(message, historyFormatted);

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

      const prompt = `Analyze eligibility for a government scheme in ${category} category for a user with these details:
Age: ${userDetails.age}
Income: ₹${userDetails.income}/year
Occupation: ${userDetails.occupation}
State: ${userDetails.state}

Determine:
1. A suitable government scheme in this category
2. Whether they are eligible (true/false)
3. Clear reason for eligibility/ineligibility
4. Required documents (array of strings)
5. Next steps to apply (array of strings)

Respond in JSON format.`;

      const schema = {
        type: "object",
        properties: {
          schemeName: { type: "string" },
          eligible: { type: "boolean" },
          eligibilityReason: { type: "string" },
          requiredDocuments: {
            type: "array",
            items: { type: "string" },
          },
          nextSteps: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: ["schemeName", "eligible", "eligibilityReason", "requiredDocuments", "nextSteps"],
      };

      const result = await generateStructuredResponse<any>(prompt, schema);

      const check = await storage.createEligibilityCheck({
        userId,
        schemeName: result.schemeName,
        schemeCategory: category,
        userDetails,
        eligible: result.eligible,
        eligibilityReason: result.eligibilityReason,
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
      // Mock market data - in production, fetch from data.gov.in API
      const mockMarketData = [
        { commodity: "Wheat", market: "Mandi, Punjab", state: "Punjab", price: 2100, unit: "quintal", date: new Date().toISOString(), trend: "up", change: 2.5 },
        { commodity: "Rice", market: "Karnal, Haryana", state: "Haryana", price: 2800, unit: "quintal", date: new Date().toISOString(), trend: "stable", change: 0 },
        { commodity: "Cotton", market: "Yavatmal, Maharashtra", state: "Maharashtra", price: 6500, unit: "quintal", date: new Date().toISOString(), trend: "down", change: -1.2 },
        { commodity: "Tomato", market: "Azadpur, Delhi", state: "Delhi", price: 45, unit: "kg", date: new Date().toISOString(), trend: "up", change: 15.3 },
        { commodity: "Onion", market: "Lasalgaon, Maharashtra", state: "Maharashtra", price: 32, unit: "kg", date: new Date().toISOString(), trend: "down", change: -8.7 },
        { commodity: "Potato", market: "Agra, UP", state: "Uttar Pradesh", price: 18, unit: "kg", date: new Date().toISOString(), trend: "stable", change: 0.5 },
        { commodity: "Sugarcane", market: "Muzaffarnagar, UP", state: "Uttar Pradesh", price: 3100, unit: "quintal", date: new Date().toISOString(), trend: "up", change: 3.2 },
      ];

      res.json(mockMarketData);
    } catch (error) {
      console.error("Market data error:", error);
      res.status(500).json({ error: "Failed to fetch market data" });
    }
  });

  // ============= DOCUMENT ROUTES =============
  app.post("/api/documents/analyze", upload.single("document"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No document provided" });
      }

      const userId = (req as any).user.id;

      // OCR using OCR.space API
      let extractedText = "";
      try {
        const formData = new FormData();
        formData.append("file", req.file.buffer, req.file.originalname);
        formData.append("apikey", process.env.OCR_API_KEY || "");
        formData.append("language", "eng");

        const ocrResponse = await fetch("https://api.ocr.space/parse/image", {
          method: "POST",
          body: formData as any,
        });

        const ocrData: any = await ocrResponse.json();
        extractedText = ocrData.ParsedResults?.[0]?.ParsedText || "Could not extract text";
      } catch (ocrError) {
        console.error("OCR error:", ocrError);
        extractedText = "Sample extracted text from document. OCR processing failed.";
      }

      // Generate summary using Gemini
      const summary = await generateText(
        `Summarize this document text in 2-3 clear sentences: ${extractedText}`,
        "You are a helpful assistant that creates clear, concise summaries."
      );

      // Save document
      const document = await storage.createDocument({
        userId,
        fileName: req.file.originalname,
        fileUrl: `/uploads/${req.file.originalname}`,
        fileType: req.file.mimetype,
        extractedText,
        summary,
      });

      res.json({
        ...document,
        extractedText,
        summary,
      });
    } catch (error) {
      console.error("Document analysis error:", error);
      res.status(500).json({ error: "Failed to analyze document" });
    }
  });

  app.post("/api/documents/translate", async (req: Request, res: Response) => {
    try {
      const { text, targetLanguage } = req.body;
      
      const translation = await generateText(
        `Translate this to ${targetLanguage === "hi" ? "Hindi" : targetLanguage}: ${text}`,
        "You are a professional translator. Provide only the translation, no explanations."
      );

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

      // Use OpenStreetMap Nominatim API for geocoding and searching
      let lat = coords?.lat;
      let lon = coords?.lon;

      if (!coords && location) {
        // Geocode location
        const geocodeResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`
        );
        const geocodeData: any = await geocodeResponse.json();
        if (geocodeData.length > 0) {
          lat = parseFloat(geocodeData[0].lat);
          lon = parseFloat(geocodeData[0].lon);
        }
      }

      // Mock service results - in production, use Overpass API or similar
      const mockServices = [
        { name: "District Hospital", type: serviceType, address: "Main Road, City Center", distance: 2.3, latitude: lat || 28.6139, longitude: lon || 77.2090, phone: "+91-11-26589000" },
        { name: "Community Health Center", type: serviceType, address: "Gandhi Nagar", distance: 4.1, latitude: lat ? lat + 0.01 : 28.6239, longitude: lon ? lon + 0.01 : 77.2190 },
        { name: "Government Dispensary", type: serviceType, address: "Sector 15", distance: 5.7, latitude: lat ? lat - 0.01 : 28.6039, longitude: lon ? lon - 0.01 : 77.1990, phone: "+91-11-26589100" },
      ];

      // Save search
      await storage.createServiceSearch({
        userId,
        serviceType,
        location: location || "Current Location",
        latitude: lat?.toString(),
        longitude: lon?.toString(),
        results: mockServices,
      });

      res.json({ services: mockServices });
    } catch (error) {
      console.error("Service search error:", error);
      res.status(500).json({ error: "Failed to search services" });
    }
  });

  // ============= DRAFT ROUTES =============
  app.post("/api/drafts/generate", async (req: Request, res: Response) => {
    try {
      const { draftType, purpose } = req.body;

      const prompt = `Generate a professional ${draftType} in English based on this purpose: ${purpose}
      
Make it formal, clear, and properly formatted. Include:
- Proper greeting and closing
- Clear subject line (if applicable)
- Professional language
- Appropriate structure for this document type

Provide only the draft content, no additional explanations.`;

      const content = await generateText(prompt, "You are a professional document writer helping Indian citizens create formal documents.");

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
