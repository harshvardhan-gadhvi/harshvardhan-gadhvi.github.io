import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Volume2, VolumeX, Flame, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import './App.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'hi-IN'; // Hindi language
      
      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);

        if (finalTranscript) {
          handleUserMessage(finalTranscript);
          setTranscript('');
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast.error('Voice recognition error. Please try again.');
        setIsListening(false);
      };
    }

    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
        toast.success('Listening... Speak your question');
      } catch (error) {
        console.error('Error starting recognition:', error);
        toast.error('Could not start voice recognition');
      }
    }
  };

  const stopSpeaking = () => {
    synthRef.current?.cancel();
    setIsSpeaking(false);
  };

  const handleUserMessage = async (text: string) => {
    const userMessage: Message = {
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsListening(false);
    recognitionRef.current?.stop();
    setIsProcessing(true);

    try {
      // Call your backend API
      const response = await fetch('http://localhost:3000/api/ask-shiva', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: text }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Shiva');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.answer,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Speak the response
      speakResponse(data.answer, data.scripture);
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to receive divine wisdom. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const speakResponse = (text: string, scripture?: string) => {
    if (!synthRef.current) return;

    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to get Indian English or Hindi voice
    const voices = synthRef.current.getVoices();
    const indianVoice = voices.find(voice => 
      voice.lang.includes('hi-IN') || 
      voice.lang.includes('en-IN') ||
      voice.name.includes('Indian') ||
      voice.name.includes('Hindi')
    );
    
    if (indianVoice) {
      utterance.voice = indianVoice;
    }
    
    utterance.lang = 'hi-IN';
    utterance.rate = 0.85; // Slower, more meditative pace
    utterance.pitch = 0.8; // Deeper voice
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      toast.error('Speech synthesis error');
    };

    synthRef.current.speak(utterance);
  };

  return (
    <div className="app-container">
      {/* Sacred Background */}
      <div className="sacred-bg">
        <div className="om-symbol">ॐ</div>
        <div className="trishul-pattern"></div>
      </div>

      {/* Main Content */}
      <div className="content-wrapper">
        {/* Header */}
        <header className="app-header">
          <div className="header-content">
            <div className="title-section">
              <Flame className="flame-icon" />
              <h1 className="app-title">महादेव का ज्ञान</h1>
              <Flame className="flame-icon" />
            </div>
            <p className="app-subtitle">Ask Shiva - Wisdom from Sacred Scriptures</p>
            <p className="app-description">
              शिव पुराण | लिंग पुराण | स्कंद पुराण
            </p>
          </div>
        </header>

        {/* Messages Container */}
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="welcome-screen">
              <div className="shiva-icon">🕉️</div>
              <h2 className="welcome-title">Har Har Mahadev</h2>
              <p className="welcome-text">
                Ask your questions about life, dharma, and spirituality.
                <br />
                Lord Shiva's wisdom from the sacred Puranas awaits you.
              </p>
              <div className="scripture-badges">
                <span className="badge">शिव पुराण</span>
                <span className="badge">लिंग पुराण</span>
                <span className="badge">स्कंद पुराण</span>
              </div>
            </div>
          ) : (
            <div className="messages-list">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
                >
                  <div className="message-icon">
                    {message.role === 'user' ? '🙏' : '🔱'}
                  </div>
                  <div className="message-content">
                    <p className="message-text">{message.content}</p>
                    <span className="message-time">
                      {message.timestamp.toLocaleTimeString('en-IN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="message assistant-message">
                  <div className="message-icon">🔱</div>
                  <div className="message-content">
                    <div className="processing-indicator">
                      <Loader2 className="processing-spinner" />
                      <span>Consulting the sacred scriptures...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Current Transcript */}
        {transcript && (
          <Card className="transcript-card">
            <p className="transcript-text">{transcript}</p>
          </Card>
        )}

        {/* Voice Controls */}
        <div className="controls-container">
          <Button
            onClick={toggleListening}
            disabled={isProcessing || isSpeaking}
            className={`voice-button ${isListening ? 'listening' : ''}`}
            size="lg"
          >
            {isListening ? (
              <>
                <MicOff className="button-icon" />
                Stop Listening
              </>
            ) : (
              <>
                <Mic className="button-icon" />
                Ask Shiva
              </>
            )}
          </Button>

          {isSpeaking && (
            <Button
              onClick={stopSpeaking}
              variant="destructive"
              className="stop-speaking-button"
              size="lg"
            >
              <VolumeX className="button-icon" />
              Stop Speaking
            </Button>
          )}
        </div>

        {/* Status Indicators */}
        <div className="status-bar">
          {isListening && (
            <div className="status-item listening">
              <div className="pulse-dot"></div>
              Listening...
            </div>
          )}
          {isSpeaking && (
            <div className="status-item speaking">
              <Volume2 className="status-icon" />
              Shiva is speaking...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
