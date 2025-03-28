const ChatFeed = ({ chatHistory, activeGroup }) => {
  return (
    <div className="bg-slate-300 flex-1 p-6 overflow-y-auto text-secondary">
      <h2 className="text-xl font-bold text-black mb-4">{activeGroup} Chat</h2>
      {chatHistory.length === 0 ? (
        <div className="text-center text-black font-bold text-3xl flex items-center justify-center">
          <div className="text-center text-2xl font-bold">
            No messages in {activeGroup} yet.
          </div>
        </div>
      ) : (
        chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`bg-black mb-4 p-3 rounded-lg max-w-xs ${
              msg.user === chatHistory[index - 1]?.user
                ? "ml-auto bg-slate-500 text-white text-right"
                : "bg-muted text-secondary"
            }`}
          >
            <div className="flex gap-2 items-center">
              <p>
                <img className="h-[40px] w-[40px] rounded-full" src={msg?.profilephoto} alt="" />
              </p>
              <p className="font-semibold">{msg.user}</p>
            </div>
            <p className="font-semibold">{msg.text}</p>
            <p className="text-xs text-gray-300">{msg.timestamp}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ChatFeed;
