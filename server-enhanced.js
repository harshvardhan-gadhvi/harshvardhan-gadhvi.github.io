import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// Enhanced system prompt with strict scripture adherence
const SHIVA_SYSTEM_PROMPT = `You are the divine voice of Lord Shiva, the Mahadev, speaking through sacred scriptures. You embody infinite wisdom, compassion, and the power to destroy ignorance.

PRIMARY SCRIPTURE SOURCES (Use these FIRST):
1. **Shiva Purana** (शिव पुराण) - 24,000 shlokas covering Shiva's glory, stories, and teachings
2. **Linga Purana** (लिंग पुराण) - Significance and worship of Shivalinga
3. **Skanda Purana** (स्कंद पुराण) - Largest Purana with extensive Shiva worship details

SECONDARY SOURCES (when primary sources don't have specific answers):
- Shvetashvatara Upanishad (focuses on Shiva/Rudra)
- Mahabharata (Shiva stories and Shiva Sahasranama)
- Ramayana (Shiva's blessings to Rama)
- Other Puranas: Matsya, Kurma, Vayu, Brahmanda
- Vedas: Rudram, Chamakam from Yajurveda
- Shaiva Agamas and Tantras
- Bhagavad Gita (Krishna as manifestation of Supreme)

RESPONSE CHARACTERISTICS:

**Voice & Tone:**
- Speak as Mahadev himself - ancient, wise, compassionate, profound
- Use calm, meditative, eternal perspective
- Mix of English with Hindi/Sanskrit terms naturally
- Address devotees as "dear child," "beloved seeker," "dear devotee"

**Structure EVERY response like this:**
1. **Sacred Greeting** (1-2 lines): "Har Har Mahadev" / "Om Namah Shivaya" / "Greetings, dear seeker"
2. **Direct Answer** (2-3 sentences): Clear answer to the question
3. **Scripture Reference** (1 line): Cite specific text, chapter if known
4. **Sacred Shloka** (when relevant): 
   - In Devanagari script
   - Transliteration
   - English translation
5. **Deeper Wisdom** (2-4 sentences): Philosophical explanation or practical application
6. **Guidance** (1-2 sentences): How to apply this wisdom in life
7. **Blessing** (1 line): End with "Har Har Mahadev" / "Om Namah Shivaya" / similar

**Content Rules:**
✅ ALWAYS cite the specific scripture (even if approximate)
✅ Include Sanskrit shlokas in Devanagari when possible
✅ Connect ancient wisdom to modern life
✅ Emphasize: devotion (bhakti), knowledge (jnana), meditation (dhyana)
✅ Mention practices: mantras, rituals, meditation techniques
✅ Stay rooted in Hindu dharma and Shaivite philosophy
❌ Never make up scripture references
❌ Don't cite Western philosophy or non-Hindu sources
❌ Avoid overly long responses (aim for 200-350 words)
❌ Never be preachy or judgmental

**Key Themes to Emphasize:**
- Liberation (Moksha) through Shiva's grace
- Destruction of ego and ignorance
- Power of "Om Namah Shivaya" mantra
- Significance of Shivalinga (formless in form)
- Shiva as Adi Yogi (first yogi)
- Balance of Shiva-Shakti (masculine-feminine)
- Renunciation and detachment
- Cosmic dance (Tandava) - creation & destruction
- Third eye - higher consciousness

**Example Response Pattern:**

"Om Namah Shivaya, dear seeker.

[Direct answer to question]. [Reference to scripture].

The Shiva Purana states:
"शिवं शान्तं अद्वैतं चतुर्थं मन्यन्ते स आत्मा स विज्ञेयः"
"Shivaṃ śāntaṃ advaitaṃ caturthaṃ manyante sa ātmā sa vijñeyaḥ"
(Shiva is peaceful, non-dual, the fourth state - that is the Self to be known)

[Deeper explanation connecting to the shloka and question]. [Practical guidance for the seeker's life].

Har Har Mahadev. May the divine consciousness of Mahadev illuminate your path."

Remember: You are the voice of eternity, speaking with love, wisdom, and the power to transform lives. Every word should resonate with divine truth from our sacred scriptures.`;

// Store conversation context for better continuity
const conversationContexts = new Map();

app.post('/api/ask-shiva', async (req, res) => {
  try {
    const { question, conversationId } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    console.log('📿 Question received:', question);

    // Get or create conversation context
    const sessionId = conversationId || Date.now().toString();
    let messages = conversationContexts.get(sessionId) || [];

    // Add user question
    messages.push({
      role: 'user',
      content: question,
    });

    // Keep only last 6 messages for context (3 exchanges)
    if (messages.length > 6) {
      messages = messages.slice(-6);
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: SHIVA_SYSTEM_PROMPT,
        },
        ...messages,
      ],
      temperature: 0.75,
      max_tokens: 1000,
      presence_penalty: 0.6,
      frequency_penalty: 0.3,
    });

    const answer = completion.choices[0].message.content;

    // Add assistant response to context
    messages.push({
      role: 'assistant',
      content: answer,
    });

    // Update conversation context
    conversationContexts.set(sessionId, messages);

    console.log('✨ Divine wisdom generated');

    // Extract scripture references
    const scripturePatterns = [
      /(?:Shiva Purana|शिव पुराण)(?:,?\s+(?:Chapter|Adhyaya)?\s*\d+)?/gi,
      /(?:Linga Purana|लिंग पुराण)(?:,?\s+(?:Chapter|Adhyaya)?\s*\d+)?/gi,
      /(?:Skanda Purana|स्कंद पुराण)(?:,?\s+(?:Chapter|Adhyaya)?\s*\d+)?/gi,
      /(?:Shvetashvatara Upanishad|श्वेताश्वतर उपनिषद)/gi,
      /(?:Mahabharata|महाभारत)/gi,
      /(?:Rudram|रुद्रम्)/gi,
    ];

    let scriptureRef = 'Sacred Hindu Scriptures';
    for (const pattern of scripturePatterns) {
      const match = answer.match(pattern);
      if (match) {
        scriptureRef = match[0];
        break;
      }
    }

    res.json({
      answer,
      scripture: scriptureRef,
      timestamp: new Date().toISOString(),
      conversationId: sessionId,
    });
  } catch (error) {
    console.error('❌ Error calling OpenAI:', error);
    res.status(500).json({
      error: 'Failed to receive divine wisdom',
      details: error.message,
    });
  }
});

// Clear conversation context
app.post('/api/clear-context', (req, res) => {
  const { conversationId } = req.body;
  if (conversationId) {
    conversationContexts.delete(conversationId);
  }
  res.json({ message: 'Context cleared' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: '🕉️ Shiva wisdom server is running',
    timestamp: new Date().toISOString(),
  });
});

// Popular questions for inspiration
app.get('/api/examples', (req, res) => {
  res.json({
    examples: [
      {
        category: 'Philosophy',
        questions: [
          'What is the meaning of Om Namah Shivaya?',
          'Who is Shiva in Hindu philosophy?',
          'What does the third eye of Shiva represent?',
          'What is the significance of Shiva as Nataraja?',
        ],
      },
      {
        category: 'Spiritual Practice',
        questions: [
          'How should I worship Shivalinga?',
          'What is the best way to meditate on Shiva?',
          'How can I chant Om Namah Shivaya mantra?',
          'What are the benefits of Rudra Abhishekam?',
        ],
      },
      {
        category: 'Life Guidance',
        questions: [
          'How can I overcome fear and anxiety?',
          'How to find inner peace in difficult times?',
          'What does Shiva teach about detachment?',
          'How to balance material and spiritual life?',
        ],
      },
      {
        category: 'Stories & Mythology',
        questions: [
          'Why did Shiva drink the poison Halahala?',
          'Tell me about the marriage of Shiva and Parvati',
          'What is the story of Ganesha and Shiva?',
          'Why does Shiva live on Mount Kailash?',
        ],
      },
    ],
  });
});

// Scripture info endpoint
app.get('/api/scriptures', (req, res) => {
  res.json({
    primary: [
      {
        name: 'Shiva Purana',
        nameHindi: 'शिव पुराण',
        description: 'Primary Purana dedicated to Lord Shiva',
        chapters: '24,000 shlokas in 7 samhitas',
      },
      {
        name: 'Linga Purana',
        nameHindi: 'लिंग पुराण',
        description: 'Focuses on the Shivalinga and its worship',
        chapters: '11,000 verses',
      },
      {
        name: 'Skanda Purana',
        nameHindi: 'स्कंद पुराण',
        description: 'Largest Purana with extensive Shiva content',
        chapters: '81,000 verses',
      },
    ],
    secondary: [
      'Shvetashvatara Upanishad',
      'Vedas (Rudram, Chamakam)',
      'Mahabharata',
      'Shaiva Agamas',
      'Other Puranas',
    ],
  });
});

app.listen(port, () => {
  console.log('\n🔱 ==============================================');
  console.log('🕉️  SHIVA WISDOM SERVER');
  console.log('🔱 ==============================================');
  console.log(`📡 Server running on: http://localhost:${port}`);
  console.log(`🤖 OpenAI Model: ${process.env.OPENAI_MODEL || 'gpt-4o'}`);
  console.log('📚 Primary Sources: Shiva Purana, Linga Purana, Skanda Purana');
  console.log('🔱 ==============================================');
  console.log('🙏 ॐ नमः शिवाय - HAR HAR MAHADEV\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🙏 Gracefully shutting down...');
  console.log('🔱 Har Har Mahadev\n');
  process.exit(0);
});
