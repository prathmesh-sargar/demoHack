import { useState } from "react";
import { useSelector } from "react-redux";

const MessageInput = ({ addMessage }) => {
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.auth.user);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = {
        user: user.fullname,
        text: message,
        timestamp: new Date().toLocaleString(), // Store timestamp
        profilephoto: user.profile.profilephoto,
      };

      addMessage(newMessage); // Call function to update chat history
      setMessage(""); // Clear input field
    }
  };

  return (
    <div className="flex items-center p-4 bg-muted border-t border-muted gap-1">
      <input
        type="text"
        className="flex-1 p-3 rounded-lg bg-slate-700 text-white placeholder-secondary focus:outline-none"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        onClick={handleSend}
        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-700 transition duration-200"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
