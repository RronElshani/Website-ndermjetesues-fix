import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { messagesAPI } from '../services/api';
import './Messages.css';

const Messages = () => {
    const { userId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (userId) {
            setSelectedConversation(parseInt(userId));
            fetchMessages(userId);
        }
    }, [userId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchConversations = async () => {
        try {
            const response = await messagesAPI.getConversations();
            setConversations(response.data.data || []);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (partnerId) => {
        try {
            const response = await messagesAPI.getMessages(partnerId);
            const data = response.data.data;

            // Handle the response structure: {messages, otherUser}
            if (data.messages) {
                setMessages(data.messages);
                setSelectedPartner(data.otherUser);
            } else {
                // Fallback if data is directly an array
                setMessages(data || []);
            }

            // Mark as read
            await messagesAPI.markAsRead(partnerId);
            // Update unread count in conversations
            setConversations(prev =>
                prev.map(c =>
                    c.partner_id === parseInt(partnerId)
                        ? { ...c, unread_count: 0 }
                        : c
                )
            );
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSelectConversation = (partnerId) => {
        setSelectedConversation(partnerId);
        navigate(`/messages/${partnerId}`);
        fetchMessages(partnerId);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        setSending(true);
        try {
            await messagesAPI.sendMessage({
                receiver_id: selectedConversation,
                mesazhi: newMessage.trim()
            });
            setNewMessage('');
            fetchMessages(selectedConversation);
            fetchConversations(); // Refresh conversation list
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Gabim gjatë dërgimit të mesazhit');
        } finally {
            setSending(false);
        }
    };

    const formatTime = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now - date;
        const oneDay = 24 * 60 * 60 * 1000;

        if (diff < oneDay) {
            return date.toLocaleTimeString('sq-AL', { hour: '2-digit', minute: '2-digit' });
        } else if (diff < 7 * oneDay) {
            return date.toLocaleDateString('sq-AL', { weekday: 'short' });
        } else {
            return date.toLocaleDateString('sq-AL', { day: 'numeric', month: 'short' });
        }
    };

    const getPartnerInfo = () => {
        // First check selectedPartner from API response
        if (selectedPartner) {
            return selectedPartner;
        }
        // Fallback to finding in conversations list
        return conversations.find(c => c.partner_id === selectedConversation);
    };

    if (!user) {
        return (
            <div className="messages-page">
                <div className="messages-login-prompt">
                    <h2>Kyçuni për të parë mesazhet</h2>
                    <button onClick={() => navigate('/login')}>Kyçu</button>
                </div>
            </div>
        );
    }

    const partner = getPartnerInfo();

    return (
        <div className="messages-page">
            <div className="messages-container">
                {/* Conversations Sidebar */}
                <div className="conversations-sidebar">
                    <div className="sidebar-header">
                        <h2>Mesazhet</h2>
                    </div>

                    {loading ? (
                        <div className="sidebar-loading">Duke ngarkuar...</div>
                    ) : conversations.length === 0 ? (
                        <div className="no-conversations">
                            <p>Asnjë bisedë ende</p>
                            <small>Kontaktoni një profesionist nga marketplace</small>
                        </div>
                    ) : (
                        <div className="conversations-list">
                            {conversations.map(conv => (
                                <div
                                    key={conv.partner_id}
                                    className={`conversation-item ${selectedConversation === conv.partner_id ? 'active' : ''}`}
                                    onClick={() => handleSelectConversation(conv.partner_id)}
                                >
                                    <div className="conversation-avatar">
                                        {conv.profile_picture ? (
                                            <img src={conv.profile_picture} alt="" />
                                        ) : (
                                            <div className="avatar-placeholder">
                                                {conv.emri?.[0]}{conv.mbiemri?.[0]}
                                            </div>
                                        )}
                                        {conv.unread_count > 0 && (
                                            <span className="unread-badge">{conv.unread_count}</span>
                                        )}
                                    </div>
                                    <div className="conversation-info">
                                        <div className="conversation-header">
                                            <span className="conversation-name">
                                                {conv.emri} {conv.mbiemri}
                                            </span>
                                            <span className="conversation-time">
                                                {formatTime(conv.created_at)}
                                            </span>
                                        </div>
                                        <p className="conversation-preview">
                                            {conv.sender_id === user.id ? 'Ti: ' : ''}
                                            {conv.mesazhi?.substring(0, 40)}
                                            {conv.mesazhi?.length > 40 ? '...' : ''}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Chat Area */}
                <div className="chat-area">
                    {selectedConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="chat-header">
                                {partner ? (
                                    <>
                                        <div className="chat-partner-avatar">
                                            {partner.profile_picture ? (
                                                <img src={partner.profile_picture} alt="" />
                                            ) : (
                                                <div className="avatar-placeholder">
                                                    {partner.emri?.[0]}
                                                    {partner.mbiemri?.[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div className="chat-partner-info">
                                            <h3>{partner.emri} {partner.mbiemri}</h3>
                                        </div>
                                    </>
                                ) : (
                                    <div className="chat-partner-info">
                                        <h3>Duke ngarkuar...</h3>
                                    </div>
                                )}
                            </div>

                            {/* Messages */}
                            <div className="messages-list">
                                {messages.length === 0 ? (
                                    <div className="no-messages">
                                        <p>Asnjë mesazh ende. Filloni bisedën!</p>
                                    </div>
                                ) : (
                                    messages.map(msg => (
                                        <div
                                            key={msg.id}
                                            className={`message ${msg.sender_id === user.id ? 'sent' : 'received'}`}
                                        >
                                            <div className="message-content">
                                                <p>{msg.mesazhi}</p>
                                                <span className="message-time">
                                                    {formatTime(msg.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input */}
                            <form onSubmit={handleSendMessage} className="message-input-form">
                                <input
                                    type="text"
                                    placeholder="Shkruaj mesazhin..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    disabled={sending}
                                />
                                <button type="submit" disabled={sending || !newMessage.trim()}>
                                    {sending ? 'Duke dërguar...' : 'Dërgo'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="no-chat-selected">
                            <div className="no-chat-icon">💬</div>
                            <h3>Zgjidhni një bisedë</h3>
                            <p>Zgjidhni një bisedë nga lista ose filloni një të re nga marketplace</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;
