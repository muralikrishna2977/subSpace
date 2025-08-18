import { useEffect, useMemo, useState } from "react";
import { fetchChats, createChat } from "../api/chat";
import type { Chat } from "../types";
import "./ChatList.css";
import NewChatPopup from "./NewChatPopup";
import noChats from "../assets/noChats.svg";

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
      const capsName = newChatName.charAt(0).toUpperCase() + newChatName.slice(1);
      const c = await createChat(capsName);
      setChats((prev) => [c, ...prev]);
      onSelectChat(c.id);
      setNewChatName("");
    } catch (e: any) {
      console.log(e?.message);
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
          <NewChatPopup
            openNewChatPopup={openNewChatPopup}
            setOpenNewChatPopup={setOpenNewChatPopup}
            align="right"
            newChatName={newChatName}
            setNewChatName={setNewChatName}
            confirmCreateChat={confirmCreateChat}
          />
        </div>
        <input
          className="searchInput"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search chats..."
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
                <div className="chat-time">
                  <div>
                    {(() => {
                      const date = new Date(c.updated_at);
                      const today = new Date();
                      const yesterday = new Date();
                      yesterday.setDate(today.getDate() - 1);

                      const format = (d: Date) =>
                        d.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        });

                      if (format(date) === format(today)) {
                        return "Today";
                      } else if (format(date) === format(yesterday)) {
                        return "Yesterday";
                      } else {
                        return date.toLocaleDateString("en-US", {
                          month: "numeric",
                          day: "numeric",
                          year: "2-digit",
                        });
                      }
                    })()}
                  </div>

                  <div>
                    {new Date(c.updated_at).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>
                </div>
              </div>
            </button>
          </li>
        ))}

      </ul>

      {chats.length===0 &&
        <div className="no-chats">
          <img src={noChats} height="100px" width="100px" />
          <p>No chats yet</p>
          <p>Create a new chat to get started</p>
        </div>
      }
    
    </aside>
  );
}
