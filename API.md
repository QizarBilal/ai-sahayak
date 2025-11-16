# AI-SAHAYAK API Documentation

Complete API reference for all endpoints.

**Base URL:** `http://localhost:5000/api` (development)  
**Authentication:** JWT token in `Authorization: Bearer <token>` header  
*(Current implementation uses mock auth for demo)*

---

## Table of Contents

1. [Authentication](#authentication)
2. [User APIs](#user-apis)
3. [Voice APIs](#voice-apis)
4. [Chat APIs](#chat-apis)
5. [Query History APIs](#query-history-apis)
6. [Eligibility APIs](#eligibility-apis)
7. [Market Data APIs](#market-data-apis)
8. [Document APIs](#document-apis)
9. [Service Discovery APIs](#service-discovery-apis)
10. [Draft APIs](#draft-apis)

---

## Authentication

All API routes require authentication. For demo purposes, a mock user is auto-created.

### Get Current User

```http
GET /api/user/current
```

**Response:**
```json
{
  "id": "user-id",
  "username": "demo",
  "fullName": "Demo User",
  "email": "demo@ai-sahayak.in",
  "phone": "+91 9876543210",
  "createdAt": "2025-11-15T10:00:00.000Z"
}
```

---

## Voice APIs

### Transcribe Audio

Process audio file → Get transcript + AI response + TTS audio

```http
POST /api/voice/transcribe
Content-Type: multipart/form-data

{
  "audio": <File>  // Audio file (webm, mp3, wav)
}
```

**Response:**
```json
{
  "transcript": "What is the PM-KISAN scheme?",
  "response": "PM-KISAN is a central sector scheme providing income support of ₹6000 per year to farmer families...",
  "responseAudioUrl": "/api/audio/response-1731672000000.wav"
}
```

**Status Codes:**
- `200` - Success
- `400` - No audio file provided
- `500` - Processing error

**Notes:**
- Uses **Whisper-large-v3** for STT
- Uses **Bark** for TTS
- Automatically saves to voice queries history

---

### Synthesize Speech

Convert text to speech

```http
POST /api/voice/synthesize
Content-Type: application/json

{
  "text": "Hello, this is a test message"
}
```

**Response:**
```json
{
  "audioUrl": "/api/audio/1731672000000.wav"
}
```

**Status Codes:**
- `200` - Success
- `400` - No text provided
- `500` - TTS generation error

---

### Generate Earcon

Generate audio notification sound

```http
POST /api/audio/earcon
Content-Type: application/json

{
  "description": "notification sound"  // Optional
}
```

**Response:**
```json
{
  "audioUrl": "/api/audio/earcon-1731672000000.wav"
}
```

**Notes:**
- Uses **MusicGen** for audio generation
- Useful for illiterate user notifications

---

## Chat APIs

### Send Chat Message

Send message and get AI response

```http
POST /api/chat
Content-Type: application/json

{
  "message": "Tell me about government health schemes",
  "mode": "text",  // or "voice"
  "conversationId": "optional-conversation-id"
}
```

**Response:**
```json
{
  "response": "There are several government health schemes...",
  "conversationId": "conv-id-123"
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing message
- `500` - AI processing error

---

### Get Conversations

List all user conversations

```http
GET /api/conversations
```

**Response:**
```json
[
  {
    "id": "conv-id-1",
    "userId": "user-id",
    "title": "Health Schemes Discussion",
    "mode": "text",
    "createdAt": "2025-11-15T10:00:00.000Z",
    "updatedAt": "2025-11-15T10:30:00.000Z"
  }
]
```

---

### Get Conversation Messages

Get all messages in a conversation

```http
GET /api/conversations/:id/messages
```

**Response:**
```json
[
  {
    "id": "msg-1",
    "conversationId": "conv-id-1",
    "role": "user",
    "content": "Tell me about health schemes",
    "audioUrl": null,
    "createdAt": "2025-11-15T10:00:00.000Z"
  },
  {
    "id": "msg-2",
    "conversationId": "conv-id-1",
    "role": "assistant",
    "content": "There are several schemes...",
    "audioUrl": "/api/audio/response.wav",
    "createdAt": "2025-11-15T10:00:05.000Z"
  }
]
```

---

## Query History APIs

### Get Recent Queries

Get all voice query history

```http
GET /api/queries
```

**Response:**
```json
[
  {
    "id": "query-1",
    "userId": "user-id",
    "audioUrl": "/api/audio/input.wav",
    "transcript": "What is PM-KISAN?",
    "response": "PM-KISAN is...",
    "responseAudioUrl": "/api/audio/response.wav",
    "createdAt": "2025-11-15T10:00:00.000Z"
  }
]
```

---

### Create Query

Save a voice query (auto-called by transcribe endpoint)

```http
POST /api/queries
Content-Type: application/json

{
  "audioUrl": "/uploads/audio.wav",
  "transcript": "Text of query",
  "response": "AI response",
  "responseAudioUrl": "/uploads/response.wav"
}
```

---

## Eligibility APIs

### Check Eligibility

Check eligibility for a government scheme

```http
POST /api/eligibility/check
Content-Type: application/json

{
  "schemeName": "PM-KISAN",
  "schemeCategory": "Agriculture",
  "userDetails": {
    "age": 45,
    "income": 150000,
    "occupation": "Farmer",
    "state": "Punjab",
    "landOwnership": true
  }
}
```

**Response:**
```json
{
  "id": "check-1",
  "userId": "user-id",
  "schemeName": "PM-KISAN",
  "schemeCategory": "Agriculture",
  "userDetails": { ... },
  "eligible": true,
  "eligibilityReason": "You meet all the criteria for PM-KISAN...",
  "requiredDocuments": [
    "Aadhaar Card",
    "Land Ownership Certificate",
    "Bank Account Details"
  ],
  "nextSteps": [
    "Visit nearest CSC or agriculture office",
    "Fill out the application form",
    "Submit required documents",
    "Wait for verification (7-14 days)"
  ],
  "createdAt": "2025-11-15T10:00:00.000Z"
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing required fields
- `500` - AI processing error

---

### Get Eligibility History

Get past eligibility checks

```http
GET /api/eligibility/history
```

**Response:**
```json
[
  {
    "id": "check-1",
    "schemeName": "PM-KISAN",
    "eligible": true,
    "createdAt": "2025-11-15T10:00:00.000Z"
  }
]
```

---

## Market Data APIs

### Get Market Prices

Get commodity prices with optional filters

```http
GET /api/markets?commodity=Wheat&state=Punjab&district=Amritsar
```

**Query Parameters:**
- `commodity` (optional) - Filter by commodity name
- `state` (optional) - Filter by state
- `district` (optional) - Filter by district

**Response:**
```json
[
  {
    "commodity": "Wheat",
    "state": "Punjab",
    "district": "Amritsar",
    "market": "Amritsar Mandi",
    "min_price": "2000",
    "max_price": "2100",
    "modal_price": "2050",
    "arrival_date": "2025-11-15"
  }
]
```

**Notes:**
- Data cached for 5 minutes
- Fetches from data.gov.in API
- Falls back to mock data if API unavailable

---

### Get Market Search History

Get user's market search history

```http
GET /api/markets/history
```

**Response:**
```json
[
  {
    "id": "search-1",
    "userId": "user-id",
    "commodity": "Wheat",
    "state": "Punjab",
    "results": [ ... ],
    "createdAt": "2025-11-15T10:00:00.000Z"
  }
]
```

---

## Document APIs

### Analyze Document

Upload and analyze document (OCR + summarization)

```http
POST /api/documents/analyze
Content-Type: multipart/form-data

{
  "document": <File>,  // Image file
  "language": "en"     // Optional: target language for translation
}
```

**Response:**
```json
{
  "id": "doc-1",
  "userId": "user-id",
  "fileName": "aadhaar.jpg",
  "fileUrl": "/uploads/aadhaar.jpg",
  "fileType": "image/jpeg",
  "extractedText": "Full OCR extracted text...",
  "summary": "This is an Aadhaar card document containing...",
  "translation": "यह एक आधार कार्ड दस्तावेज़ है...",
  "language": "hi",
  "createdAt": "2025-11-15T10:00:00.000Z"
}
```

**Status Codes:**
- `200` - Success
- `400` - No document provided
- `500` - OCR or processing error

**Notes:**
- Uses **OCR.space** for text extraction
- Uses **Gemini** for summarization
- Optional translation to target language

---

### Translate Text

Translate text to target language

```http
POST /api/documents/translate
Content-Type: application/json

{
  "text": "This is a sample text",
  "targetLanguage": "Hindi"
}
```

**Response:**
```json
{
  "translation": "यह एक नमूना पाठ है"
}
```

---

### Get Documents

Get user's document history

```http
GET /api/documents
```

**Response:**
```json
[
  {
    "id": "doc-1",
    "fileName": "aadhaar.jpg",
    "summary": "Aadhaar card document...",
    "createdAt": "2025-11-15T10:00:00.000Z"
  }
]
```

---

## Service Discovery APIs

### Search Nearby Services

Find nearby government services

```http
POST /api/services/search
Content-Type: application/json

{
  "serviceType": "hospital",  // hospital, police, bank, etc.
  "location": "New Delhi",    // Location name
  "coords": {                 // Or use coordinates
    "lat": 28.6139,
    "lon": 77.2090
  }
}
```

**Response:**
```json
{
  "services": [
    {
      "name": "District Hospital",
      "type": "hospital",
      "address": "Main Road, City Center",
      "latitude": 28.6139,
      "longitude": 77.2090,
      "distance": "2.3",
      "phone": "+91-11-26589000"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing service type or location
- `500` - Search error

**Notes:**
- Uses **OpenStreetMap/Nominatim** API
- Calculates distances using Haversine formula
- Returns results sorted by distance

---

## Draft APIs

### Generate Draft

Generate official document draft

```http
POST /api/drafts/generate
Content-Type: application/json

{
  "draftType": "application",  // application, letter, complaint
  "purpose": "Applying for ration card",
  "details": {
    "name": "John Doe",
    "address": "123 Main St",
    "additional": "any additional info"
  }
}
```

**Response:**
```json
{
  "content": "To,\nThe District Collector...\n\nSubject: Application for Ration Card\n\nSir/Madam,\n\nI, John Doe...",
  "title": "Application - 11/15/2025"
}
```

**Notes:**
- Uses **Gemini** for generation
- Properly formatted official documents
- Follows Indian government format standards

---

### Save Draft

Save generated draft

```http
POST /api/drafts
Content-Type: application/json

{
  "title": "Ration Card Application",
  "draftType": "application",
  "content": "Full draft content...",
  "purpose": "Ration card application"
}
```

**Response:**
```json
{
  "id": "draft-1",
  "userId": "user-id",
  "title": "Ration Card Application",
  "draftType": "application",
  "content": "...",
  "version": 1,
  "createdAt": "2025-11-15T10:00:00.000Z",
  "updatedAt": "2025-11-15T10:00:00.000Z"
}
```

---

### Get Drafts

Get user's saved drafts

```http
GET /api/drafts
```

**Response:**
```json
[
  {
    "id": "draft-1",
    "title": "Ration Card Application",
    "draftType": "application",
    "version": 1,
    "createdAt": "2025-11-15T10:00:00.000Z"
  }
]
```

---

## Error Responses

All endpoints follow consistent error format:

```json
{
  "error": "Error message description"
}
```

**Common Status Codes:**
- `400` - Bad Request (missing/invalid parameters)
- `401` - Unauthorized (invalid/missing auth token)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

---

## Rate Limiting

*(To be implemented in production)*

Recommended limits:
- Voice transcription: 60 requests/hour per user
- AI generation: 100 requests/hour per user
- General API calls: 1000 requests/hour per user

---

## Caching

Some endpoints use caching:

| Endpoint | Cache TTL | Cache Key |
|----------|-----------|-----------|
| `/api/markets` | 5 minutes | `market:{params}` |
| Government data | 1 hour | `gov:{endpoint}` |

---

## WebSocket Support

*(Future feature)*

Real-time updates for:
- Live chat conversations
- Voice transcription progress
- Document processing status

---

## API Testing with cURL

### Example: Voice Transcription

```bash
curl -X POST http://localhost:5000/api/voice/transcribe \
  -H "Authorization: Bearer mock-token" \
  -F "audio=@recording.webm"
```

### Example: Chat

```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Authorization: Bearer mock-token" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is PM-KISAN?",
    "mode": "text"
  }'
```

### Example: Check Eligibility

```bash
curl -X POST http://localhost:5000/api/eligibility/check \
  -H "Authorization: Bearer mock-token" \
  -H "Content-Type: application/json" \
  -d '{
    "schemeName": "PM-KISAN",
    "schemeCategory": "Agriculture",
    "userDetails": {
      "age": 45,
      "income": 150000,
      "occupation": "Farmer",
      "state": "Punjab"
    }
  }'
```

---

## API Client Libraries

### JavaScript/TypeScript

```typescript
import { apiRequest } from './lib/queryClient';

// POST request
const response = await apiRequest('POST', '/api/chat', {
  message: 'Hello',
  mode: 'text'
});

// GET request
const conversations = await apiRequest('GET', '/api/conversations');
```

### Python

```python
import requests

base_url = "http://localhost:5000/api"
headers = {"Authorization": "Bearer mock-token"}

# POST request
response = requests.post(
    f"{base_url}/chat",
    json={"message": "Hello", "mode": "text"},
    headers=headers
)

# GET request
conversations = requests.get(
    f"{base_url}/conversations",
    headers=headers
)
```

---

## API Versioning

Current version: **v1** (implicit)

Future versions will use URL prefix: `/api/v2/...`

---

## Support

For API issues:
- Check network tab in browser DevTools
- Review error messages
- Verify API keys are set correctly
- Check server logs

---

**API Documentation Version:** 1.0.0

**Last Updated:** November 15, 2025
