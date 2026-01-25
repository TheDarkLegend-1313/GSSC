import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { chatbotAPI } from '../services/api.js'
import Cookies from 'js-cookie'
import { FiSend } from 'react-icons/fi'

const AIChatbotPage = () => {
  // Authentication check (commented out for dev testing)
  // useEffect(() => {
  //   const checkAuth = () => {
  //     const jwtToken = Cookies.get('access_token') // Adjust cookie name as needed
  //     if (!jwtToken) {
  //       window.location.href = '/login'
  //       return
  //     }
  //   }
  //   checkAuth()
  // }, [])

  const [messages, setMessages] = useState([])
  const [userQuery, setUserQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingOldChat, setLoadingOldChat] = useState(true)
  const [error, setError] = useState(null)
  const [chatLoaded, setChatLoaded] = useState(false)
  const chatEndRef = useRef(null)

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Load old chat on component mount (only once)
  useEffect(() => {
    if (!chatLoaded) {
      loadOldChat()
      setChatLoaded(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Load old chat from backend
  const loadOldChat = async () => {
    setLoadingOldChat(true)
    setError(null)
    try {
      const response = await chatbotAPI.getOldChat()
      
      // Check if response contains chat data
      if (response && typeof response === 'object') {
        // Convert response object to array of messages
        const chatMessages = []
        const responseKeys = Object.keys(response).sort((a, b) => {
          // Extract numbers from keys like "response1", "response2", etc.
          const numA = parseInt(a.replace(/\D/g, '')) || 0
          const numB = parseInt(b.replace(/\D/g, '')) || 0
          return numA - numB
        })

        responseKeys.forEach((key) => {
          const chatItem = response[key]
          if (chatItem && chatItem.userresponse && chatItem.airesponse) {
            chatMessages.push({
              type: 'user',
              content: chatItem.userresponse,
            })
            chatMessages.push({
              type: 'bot',
              content: chatItem.airesponse,
            })
          }
        })

        if (chatMessages.length > 0) {
          setMessages(chatMessages)
        } else {
          // No valid chat data, show start message
          setMessages([
            {
              type: 'bot',
              content: 'Start a new Chat',
            },
          ])
        }
      } else {
        // No chat data, show start message
        setMessages([
          {
            type: 'bot',
            content: 'Start a new Chat',
          },
        ])
      }
    } catch (err) {
      // If error, show start message
      setMessages([
        {
          type: 'bot',
          content: 'Start a new Chat',
        },
      ])
      // Only set error if it's not a 404 or similar (no chat exists)
      if (err.response?.status !== 404) {
        setError(
          err.response?.data?.detail ||
            err.response?.data?.message ||
            err.message ||
            'Failed to load chat history.'
        )
      }
    } finally {
      setLoadingOldChat(false)
    }
  }

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    if (!userQuery.trim() || loading) {
      return
    }

    const query = userQuery.trim()
    setUserQuery('')
    
    // Add user message to chat immediately
    const userMessage = {
      type: 'user',
      content: query,
    }
    setMessages((prev) => [...prev, userMessage])
    setLoading(true)
    setError(null)

    try {
      // Send only the user query to backend
      const response = await chatbotAPI.sendMessage(query)
      
      // Add AI response to chat
      const aiMessage = {
        type: 'bot',
        content: response.airesponse || response.response || response.message || 'No response received.',
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          err.message ||
          'Failed to send message. Please try again.'
      )
      // Remove user message if error occurred (optional - you might want to keep it)
      // setMessages((prev) => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page page-with-hero">
      <section className="page-hero">
        <div className="page-hero-content">
          <h1>AI Solar Copilot</h1>
          <p>
            Ask questions about solar systems, sizing, pricing, and get intelligent answers from
            our AI assistant.
          </p>
        </div>
      </section>

      <section className="page-content-grid single-column">
        <motion.div
          className="panel panel-primary chatbot-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {error && (
            <div className="auth-error" style={{ marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          {loadingOldChat ? (
            <div className="chat-window" style={{ minHeight: '300px', justifyContent: 'center', alignItems: 'center' }}>
              <p style={{ color: '#6b7280' }}>Loading chat history...</p>
            </div>
          ) : (
            <div className="chat-window" style={{ minHeight: '300px', maxHeight: '500px', overflowY: 'auto' }}>
              {messages.length === 0 ? (
                <div className="chat-message chat-message-bot">
                  <p>Start a new Chat</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`chat-message ${
                      message.type === 'user' ? 'chat-message-user' : 'chat-message-bot'
                    }`}
                  >
                    <p>{message.content}</p>
                  </div>
                ))
              )}
              {loading && (
                <div className="chat-message chat-message-bot">
                  <p>Thinking...</p>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}

          <form className="chat-input-row" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Type a solar question…"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              disabled={loading || loadingOldChat}
            />
            <button type="submit" disabled={loading || loadingOldChat || !userQuery.trim()}>
              <FiSend className="icon" style={{ width: '16px', height: '16px' }} />
            </button>
          </form>
        </motion.div>
      </section>
    </div>
  )
}

export default AIChatbotPage
