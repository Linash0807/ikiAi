import React, { useState, useEffect, useRef } from 'react';
import { useApi } from '../hooks/useApi';
import { ChatSession, ChatMessage, ChatInput } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { 
  MessageSquare, 
  Plus, 
  Send, 
  Bot, 
  User,
  Calendar,
  Clock,
  Trash2,
  MoreVertical
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import toast from 'react-hot-toast';

const Chat: React.FC = () => {
  const api = useApi();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (currentSession) {
      loadSessionMessages(currentSession.id);
    }
  }, [currentSession]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadSessions = async () => {
    try {
      setLoading(true);
      const sessionsData = await api.getChatSessions();
      setSessions(sessionsData);
      if (sessionsData.length > 0 && !currentSession) {
        setCurrentSession(sessionsData[0]);
      }
    } catch (error) {
      toast.error('Failed to load chat sessions');
    } finally {
      setLoading(false);
    }
  };

  const loadSessionMessages = async (sessionId: string) => {
    try {
      const messagesData = await api.getChatSession(sessionId);
      setMessages(messagesData);
    } catch (error) {
      toast.error('Failed to load messages');
    }
  };

  const createNewSession = async () => {
    try {
      const response = await api.createChatSession();
      const newSession: ChatSession = {
        id: response.sessionId,
        title: 'New Chat',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messageCount: 0,
      };
      setSessions([newSession, ...sessions]);
      setCurrentSession(newSession);
      setMessages([]);
      toast.success('New chat session created');
    } catch (error) {
      toast.error('Failed to create new session');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentSession) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: newMessage.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setSendingMessage(true);

    try {
      const response = await api.sendChatMessage(currentSession.id, { content: userMessage.content });
      setMessages(prev => [...prev, response.reply]);
    } catch (error) {
      toast.error('Failed to send message');
      setMessages(prev => prev.slice(0, -1)); // Remove the user message on error
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-200px)] flex bg-white rounded-lg shadow-sm border border-secondary-200">
      {/* Sidebar */}
      <div className="w-80 border-r border-secondary-200 flex flex-col">
        <div className="p-4 border-b border-secondary-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-secondary-900">Chat Sessions</h2>
            <Button size="sm" onClick={createNewSession}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="p-4 text-center text-secondary-500">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No chat sessions yet</p>
              <p className="text-xs mt-1">Start a new conversation</p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => setCurrentSession(session)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    currentSession?.id === session.id
                      ? 'bg-primary-50 border border-primary-200'
                      : 'hover:bg-secondary-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-secondary-900 truncate">
                        {session.title}
                      </h3>
                      <div className="flex items-center space-x-2 text-xs text-secondary-500 mt-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(session.updatedAt)}</span>
                        <span>•</span>
                        <span>{session.messageCount} messages</span>
                      </div>
                    </div>
                    <MoreVertical className="h-4 w-4 text-secondary-400 opacity-0 group-hover:opacity-100" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentSession ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-secondary-200">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-secondary-900">{currentSession.title}</h3>
                  <p className="text-sm text-secondary-500">
                    AI Career Assistant • {messages.length} messages
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-secondary-900 mb-2">
                      Start a conversation
                    </h3>
                    <p className="text-secondary-600">
                      Ask me anything about your career, skills, or job search!
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={message.createdAt ? `${message.role}-${message.createdAt}` : index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-3xl ${
                        message.role === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-secondary-100 text-secondary-900'
                      } rounded-lg p-4`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.role === 'ai' && (
                          <Bot className="h-4 w-4 mt-1 flex-shrink-0" />
                        )}
                        {message.role === 'user' && (
                          <User className="h-4 w-4 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          {message.role === 'ai' ? (
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              className="prose prose-sm max-w-none"
                            >
                              {message.content}
                            </ReactMarkdown>
                          ) : (
                            <p className="whitespace-pre-wrap">{message.content}</p>
                          )}
                        </div>
                      </div>
                      {message.createdAt && (
                        <div className="text-xs opacity-70 mt-2">
                          {formatDate(message.createdAt)}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              {sendingMessage && (
                <div className="flex justify-start">
                  <div className="bg-secondary-100 text-secondary-900 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4" />
                      <LoadingSpinner size="sm" />
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-secondary-200">
              {currentSession ? (
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about your career..."
                      className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm placeholder-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
                      rows={2}
                      disabled={sendingMessage}
                    />
                  </div>
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sendingMessage}
                    loading={sendingMessage}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center text-secondary-500">
                  <p className="mb-2">Select or create a chat session to start messaging.</p>
                  <Button onClick={createNewSession}>
                    <Plus className="h-4 w-4 mr-2" />
                    Start New Chat
                  </Button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">
                Select a chat session
              </h3>
              <p className="text-secondary-600 mb-6">
                Choose an existing conversation or start a new one
              </p>
              <Button onClick={createNewSession}>
                <Plus className="h-4 w-4 mr-2" />
                Start New Chat
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
