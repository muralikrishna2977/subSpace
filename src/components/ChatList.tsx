import { useEffect, useMemo, useState } from "react";
import { fetchChats, createChat } from "../api/chat";
import type { Chat } from "../types";
import "./ChatList.css";
import Popup from "./Popup";

type Props = {
  selectedChatId: string | null;
  onSelectChat: (id: string) => void;
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  chats: Chat[];
};

export default function ChatList({
  chats,
  setChats,
  selectedChatId,
  onSelectChat,
}: Props) {
  const [newChatName, setNewChatName] = useState<string>("");
  const [openNewChatPopup, setOpenNewChatPopup] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => setChats(await fetchChats()))();
  }, [setChats]);

  async function confirmCreateChat() {
    setOpenNewChatPopup(false);

    try {
      const capsName =
        newChatName.charAt(0).toUpperCase() + newChatName.slice(1);
      const c = await createChat(capsName);
      setChats((prev) => [c, ...prev]);
      onSelectChat(c.id);
      setNewChatName("");
    } catch (e: any) {
      alert(e.message || "Failed to create chat");
    }
  }

  const filteredChats = useMemo(() => {
    return chats.filter((c) =>
      c.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [chats, search]);

  const handleChattSelect = (chatId: string) => {
    onSelectChat(chatId);
    setSearch("");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="chatListHeader">
          <h3>Chats</h3>
          <Popup
            content={
              <div className="newChattInput">
                <input
                  type="text"
                  placeholder="Chat Name"
                  value={newChatName}
                  onChange={(e) => setNewChatName(e.target.value)}
                />

                <div className="confirmCancel">
                  <button
                    onClick={confirmCreateChat}
                    disabled={!newChatName.trim()}
                  >
                    Create
                  </button>
                </div>
              </div>
            }
            align="right"
            triggerClassName="newChatTrigger"
            openProp={openNewChatPopup}
            setOpenProp={setOpenNewChatPopup}
          >
            <button
              className="newChatButton"
              onClick={() => setOpenNewChatPopup(true)}
            >
              New Chat
            </button>
          </Popup>
        </div>
        <input
          className="searchInput"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
        />
      </div>
      <ul className="chat-list">
        {filteredChats.map((c) => (
          <li key={c.id}>
            <button
              className={`chat-item ${c.id === selectedChatId ? "active" : ""}`}
              onClick={() => handleChattSelect(c.id)}
            >
              <div className="chat-title">{c.title || "(untitled)"}</div>
              <div className="chat-time">
                {new Date(c.updated_at).toLocaleString()}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
