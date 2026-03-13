# 🕉️ Ask Shiva - Divine Wisdom Voice Assistant

An AI-powered voice assistant that embodies Lord Shiva's wisdom from sacred Indian scriptures including Shiva Purana, Linga Purana, and Skanda Purana. Features Indian voice support and OpenAI integration for authentic spiritual guidance.

## ✨ Features

- **Voice Input & Output**: Speak your questions and receive spoken wisdom
- **Indian Voice Support**: Configured for Hindi (hi-IN) and Indian English (en-IN) voices
- **Scripture-Based Responses**: Answers strictly from Shiva Purana, Linga Purana, Skanda Purana, and other Indian scriptures
- **Beautiful Spiritual UI**: Shiva-themed design with sacred symbols and colors
- **Real-time Transcription**: See your speech converted to text
- **OpenAI Integration**: Powered by GPT-4 for intelligent, contextual responses
- **Devanagari Script**: Supports Sanskrit shlokas in authentic Devanagari

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Web Speech API** for voice recognition and synthesis
- **GSAP** for animations

### Backend
- **Node.js** with Express
- **OpenAI API** (GPT-4)
- **CORS** enabled for frontend communication

## 📋 Prerequisites

- Node.js 20+ installed
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- Modern browser with Web Speech API support (Chrome, Edge, Safari recommended)
- Microphone access

## 🚀 Setup Instructions

### 1. Clone and Install

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

### 2. Configure Backend

```bash
# In the backend folder
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:
```env
OPENAI_API_KEY=sk-your-actual-api-key-here
PORT=3000
```

### 3. Start the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
npm start
# Or for development with auto-reload:
npm run dev
```

**Terminal 2 - Start Frontend:**
```bash
# From project root
npm run dev
```

The app will open at `http://localhost:5173`

## 🎤 Usage

1. **Click "Ask Shiva"** button to start voice recognition
2. **Speak your question** in Hindi or English
3. **Wait for transcription** to complete
4. **Receive divine wisdom** spoken back to you
5. **Stop Speaking** button to interrupt the response if needed

### Example Questions

- "What is the significance of the Shivalinga?"
- "How can I overcome fear and anxiety?"
- "What is the meaning of Om Namah Shivaya?"
- "How should I practice meditation according to Shiva?"
- "What does Shiva teach about detachment?"
- "Tell me about the tandava dance of Shiva"

## 🎨 UI Customization

### Colors (in `src/App.css`)
```css
--shiva-orange: #ff6b35;
--sacred-gold: #d4af37;
--holy-white: #fff5e6;
--deep-blue: #0d1b2a;
--flame-red: #e63946;
```

### Fonts
- **Devanagari**: Tiro Devanagari Sanskrit, Noto Sans Devanagari
- **English**: Cinzel (display), Inter (body)

## 🔧 Voice Configuration

### Indian Voice Selection
The app automatically tries to select Indian voices:
- Hindi (hi-IN)
- Indian English (en-IN)
- Any voice with "Indian" or "Hindi" in the name

### Voice Settings (in `src/App.tsx`)
```typescript
utterance.lang = 'hi-IN';
utterance.rate = 0.85;  // Slower, meditative pace
utterance.pitch = 0.8;  // Deeper voice
```

## 📚 Scripture Sources

The AI is configured to draw wisdom from:

**Primary Sources:**
1. Shiva Purana (शिव पुराण)
2. Linga Purana (लिंग पुराण)
3. Skanda Purana (स्कंद पुराण)

**Secondary Sources:**
- Vedas
- Upanishads
- Bhagavad Gita
- Other Puranas
- Mahabharata & Ramayana
- Tantric texts

## 🔐 Environment Variables

### Backend (.env)
```env
OPENAI_API_KEY=your_key_here
PORT=3000
```

## 🌐 Browser Compatibility

**Recommended Browsers:**
- ✅ Google Chrome (Best support)
- ✅ Microsoft Edge
- ✅ Safari (macOS/iOS)
- ⚠️ Firefox (Limited voice selection)

## 📱 Mobile Support

The app is fully responsive and works on mobile devices with:
- Touch-optimized controls
- Mobile voice recognition
- Responsive layout

## 🐛 Troubleshooting

### Voice Recognition Not Working
1. Ensure microphone permissions are granted
2. Use Chrome or Edge browser
3. Check if your browser supports Web Speech API

### No Indian Voice Available
1. Install Hindi language pack on your device
2. Install Indian English voice on your OS
3. Fallback to default voice if no Indian voice found

### Backend Connection Failed
1. Ensure backend is running on port 3000
2. Check CORS settings if using different ports
3. Verify OpenAI API key is valid

### OpenAI API Errors
1. Check API key is correctly set
2. Verify you have API credits
3. Check rate limits on your OpenAI account

## 🔄 API Endpoints

### POST `/api/ask-shiva`
Ask a question and receive wisdom

**Request:**
```json
{
  "question": "What is the meaning of life?"
}
```

**Response:**
```json
{
  "answer": "Har Har Mahadev, dear seeker...",
  "scripture": "Shiva Purana",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### GET `/api/health`
Health check endpoint

### GET `/api/examples`
Get example questions

## 🎯 Future Enhancements

- [ ] Multi-language support (Tamil, Telugu, Kannada, etc.)
- [ ] Save conversation history
- [ ] Offline scripture database
- [ ] Enhanced voice customization
- [ ] Mobile app version
- [ ] Mantra chanting feature
- [ ] Visual representations of stories

## 📄 License

MIT License - Feel free to use for spiritual and educational purposes

## 🙏 Credits

- **OpenAI** for GPT-4 API
- **Web Speech API** for voice capabilities
- **shadcn/ui** for beautiful components
- **Sacred scriptures** of Indian philosophy

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Verify all environment variables
3. Ensure backend server is running
4. Check OpenAI API status

---

**ॐ नमः शिवाय**

*May Lord Shiva's wisdom guide you on your spiritual journey*

**Har Har Mahadev** 🔱
