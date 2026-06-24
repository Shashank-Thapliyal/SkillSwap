import { useEffect, useState } from "react";
import Sidebar from "./ChatSidebar";
import EmptyState from "./EmptyState";
import ChatHeader from "./ChatHeader";
import TabNavigation from "./TabNavigation";
import ChatMessages from "./ChatMessages";
import ProposalsTab from "./ProposalTab";
import SessionsTab from "./SessionTab";
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getConversations, getMessages } from "../../api/conversationApi";
import { toast } from "react-toastify";
import {
  setConversationTab,
  showConnectionModal
} from "../../../store/uiSlice.js";
import ConnectionCard from "./ConnecionCard.jsx";
import { getProposalBetween, getSentProposals } from "../../api/proposalApi.js";
import { sendMessage } from "../../api/conversationApi";
import { getSocket } from "../../../store/socketSlice.js";
import { getSessionsWithReceiver } from "../../api/sessionApi.js";



const Chat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loggedInUser = useSelector((state) => state.user);
  const activeTab = useSelector((state) => state.ui.conversationTab);
  const showConversations = useSelector((state) => state.ui.isConnectionModalOpen);
  const isSocketConnected = useSelector((state) => state.socket.isConnected);

  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [connections, setConnections] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [sessions, setSessions] = useState([])

  const { userId, tab = "chat" } = useParams();

  const [chatLoading, setChatLoading] = useState(false);
  const [proposalsLoading, setProposalsLoading] = useState(false);
  const [sessionLoading] = useState(false);


  const fetchConversations = async () => {
    try {
      const response = await getConversations();
      if (response.status === 200) {
        setConversations(response.data.conversations);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching conversations");
    } finally {
      setChatLoading(false);
    }
  };

  const fetchProposals = async () => {
    try {
      setProposalsLoading(true);
      const user = selectedChat?._id ? selectedChat?._id : userId;
      const response = await getProposalBetween(user);
      if (response.status === 200) {
        setProposals(response.data.proposals);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error Fetching Proposals")
    } finally {
      setProposalsLoading(false);
    }
  }

  const fetchMessages = async () => {
    try {
      if (!selectedChat) {
        return;
      }
      const response = await getMessages(selectedChat?._id);
      if (response.status === 200) {
        setMessages(response.data.data);
      }

    } catch (error) {
      console.log(error);
      toast.error("Error fetching messages");
    } finally {
      setChatLoading(false);
    }
  }

  const fetchSessions = async () => {
    try {
      if (!selectedChat) return;
      const user = selectedChat?._id ? selectedChat?._id : userId;
      const response = await getSessionsWithReceiver(user);
      console.log(response)
      if(response.status === 200) {
        console.log(response.data.data)
        setSessions(response.data.data);
      }
    }catch( error){
      console.log(error);
      toast.error("Error fetching sessions");
    }
  }

  useEffect(() => {
    if (loggedInUser?.connections?.current) {
      setConnections(loggedInUser.connections.current);
    }
    fetchConversations();
  }, [loggedInUser?.connections?.current]);

  useEffect(() => {
    if (!userId) return;

    if (conversations.length === 0 && connections.length === 0) return;
    const filterConversations = conversations.map(conv => ({
      profile: conv.participants[0].profile,
      _id: conv.participants[0]._id,
    }))
    const allUsers = [...filterConversations, ...connections];
    const chat = allUsers.find(user => user._id.toString() === userId);

    if (chat) {
      setSelectedChat(chat);

      dispatch(setConversationTab(tab));

      if (tab === "proposals") {
        fetchProposals();
      } else if (tab === "sessions") {
        fetchSessions();
      } else {
        fetchMessages();
      }
    }
  }, [userId, tab, conversations, connections]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleIncomingMessage = (data) => {
      if (data.senderId === selectedChat?._id) {

        const newMessage = {
          _id: `${data.conversationId}-${data.timestamp}`,
          content: data.message,
          conversation: data.conversationId,
          createdAt: data.timestamp,
          sender: {
            _id: data.senderId,
            profile: selectedChat.profile,
          },
        };

        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };

    socket.on("receive-message", handleIncomingMessage);

    return () => {
      socket.off("receive-message", handleIncomingMessage);
    };
  }, [isSocketConnected, selectedChat]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChat) return;

    const optimisticMessage = {
      _id: `${Date.now()}`,
      type: "text",
      content: messageInput,
      createdAt: Date.now(),
      sender: {
        _id: loggedInUser._id,
        profile: loggedInUser.profile,
      },
      isTemp: true,
    };

    setMessages(prev => [...prev, optimisticMessage]);
    setMessageInput('');

    try {
      const response = await sendMessage({
        receiver: selectedChat._id,
        message: messageInput
      });

      if (response.status === 201) {
        const savedMessage = response.data.message;
        const socket = getSocket();

        if (socket?.connected) {
          socket.emit("send-message", {
            message: savedMessage.content,
            senderId: loggedInUser?._id,
            receiverId: selectedChat._id,
            conversationId: savedMessage.conversation,
            timestamp: savedMessage.createdAt,
          });
        } else {
          console.warn("Socket is not connected; message was saved but not emitted in realtime.");
        }

        setMessages(prev =>
          prev.map(message => message._id === optimisticMessage._id ? {
            ...savedMessage,
            sender: {
              _id: loggedInUser?._id,
              profile: loggedInUser.profile,
            }
          } : message)
        );
      }
    } catch (error) {
      console.error("Message send failed", error);
      toast.error("Failed to send message");

      setMessages(prev => prev.filter(m => m._id !== optimisticMessage._id));
    }
  };


  const handleChatSelect = (chat) => {
    console.log("Selected Chat:", chat);
    setSelectedChat(chat);
    dispatch(setConversationTab("chat"));
    navigate(`/conversations/${chat._id}/chat`);
  };

  const handleSidebarChatSelect = (chat) => {
    setSelectedChat(chat.participants[0]);
    dispatch(setConversationTab("chat"));
    navigate(`/conversations/${chat.participants[0]._id}/chat`);
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <ChatMessages
            messages={messages}
            messageInput={messageInput}
            setMessageInput={setMessageInput}
            onSendMessage={handleSendMessage}
            isLoading={chatLoading}
          />
        );
      case 'proposals':
        return (
          <ProposalsTab
            proposals={proposals}
            userId={userId}
            currentUserId={loggedInUser?._id}
            isLoading={proposalsLoading}
            onProposalUpdated={fetchProposals}
          />
        );
      case 'sessions':
        return <SessionsTab sessions={sessions} />;
      default:
        return <ChatMessages messages={messages} messageInput={messageInput} setMessageInput={setMessageInput} onSendMessage={handleSendMessage} isLoading={sessionLoading} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0F0F1A]">
      <Sidebar
        chatList={conversations}
        selectedChat={selectedChat}
        onChatSelect={handleSidebarChatSelect}
        onStartNew={() => dispatch(showConnectionModal(true))}
      />

      <div className="flex-1 flex flex-col">
        {showConversations && (
          <div
            className="absolute inset-0 mt-25 bg-opacity-60 z-50 flex items-start justify-center"
            onClick={() => dispatch(showConnectionModal(false))}
          >
            <div
              className="bg-[#1C1C2B] rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between">
                <h2 className="text-white text-lg font-semibold px-4 pt-4">New Chat</h2>
                <button
                  onClick={() => dispatch(showConnectionModal(false))}
                  className="text-lg font-semibold px-4 pt-4 cursor-pointer text-[#00C3FF] hover:text-[#00acd6] "
                >
                  close
                </button>
              </div>
              <div className="mt-2">
                {connections?.length > 0 ? (
                  connections.map(conn => (
                    <ConnectionCard
                      key={conn._id}
                      connection={conn}
                      onSelect={(selectedUser) => {
                        dispatch(showConnectionModal(false));
                        handleChatSelect(selectedUser);
                      }}
                    />
                  ))
                ) : (
                  <p className="text-gray-400 px-4 py-4">No connections found.</p>
                )}
              </div>
            </div>
          </div>
        )}
        {selectedChat ? (
          <>
            <ChatHeader selectedChat={selectedChat} />
            <TabNavigation activeTab={activeTab} />
            <div className="flex-1 flex flex-col">
              {renderTabContent()}
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default Chat;