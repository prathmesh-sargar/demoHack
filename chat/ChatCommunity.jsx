import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ChatFeed from "./ChatFeed";
import MessageInput from "./MessageInput";

function CommunityChat() {
  const [activeGroup, setActiveGroup] = useState("Web Development");
  const [messages, setMessages] = useState({}); // Store messages for each group separately

  // Load messages from localStorage when the component mounts
  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem("chatMessages")) || {};
    setMessages(storedMessages);
  }, []);

  // Function to add new messages to the active group
  const addMessage = (newMessage) => {
    const updatedMessages = {
      ...messages,
      [activeGroup]: [...(messages[activeGroup] || []), newMessage], // Append message to the correct group
    };
    
    setMessages(updatedMessages); // Update state
    localStorage.setItem("chatMessages", JSON.stringify(updatedMessages)); // Save to localStorage
  };

  return (
    <>
      <div className="mt-2"></div>
      <div className="flex h-screen bg-background text-secondary mt-2">
        <Sidebar setActiveGroup={setActiveGroup} />
        <div className="flex flex-col flex-1">
          <ChatFeed chatHistory={messages[activeGroup] || []} activeGroup={activeGroup} />
          <MessageInput addMessage={addMessage} />
        </div>
      </div>
    </>
  );
}

export default CommunityChat;
