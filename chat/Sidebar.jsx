const Sidebar = ({ setActiveGroup }) => {
  const groups = ["Web Development", "App Development", "AR VR", "React JS", "MERN Stack", "Block Chain","AI ML Technology "];

  return (
    <div className="bg-slate-700 rounded-lg text-secondary w-1/4 p-4 border-r border-muted font-bold">
      <h2 className="text-white text-xl font-semibold mb-4">Groups</h2>
      <ul>
        {groups.map((group) => (
          <li
            key={group}
            className="mb-2 p-2 rounded cursor-pointer text-white hover:bg-primary hover:text-white transition duration-200 border-b border-b-black"
            onClick={() => setActiveGroup(group)}
          >
            {group}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
