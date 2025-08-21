import { useEffect, useMemo, useState } from "react";
import { fetchChats } from "../api/chat";
import type { Chat } from "../types";

import verticalDots from "../assets/virticalDots.svg";
import reName from "../assets/rename.svg";
import deleteChatImg from "../assets/delete.png";
import Modal from "./Modal";

import "./ChatList.css";
import noChats from "../assets/noChats.svg";
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
  const [search, setSearch] = useState("");
  const [modalType, setModalType] = useState<"rename" | "delete" | null>(null);
  const [chatId, setChatId] = useState<string>("");

  useEffect(() => {
    (async () => setChats(await fetchChats()))();
  }, [setChats]);

  async function confirmCreateChat() {
    const placeholder: Chat = {
      id: "123",
      title: "New Chat",
      user_id: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    onSelectChat(placeholder.id);
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
          <button className="newChatButton" onClick={confirmCreateChat}>
            New Chat
          </button>
        </div>

        <input
          className="searchInput"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search chats..."
        />
      </div>

      {chats.length === 0 ? (
        <div className="no-chats">
          <img src={noChats} height="100px" width="100px" />
          <p>No chats yet</p>
          <p>Create a new chat to get started</p>
        </div>
      ) : (
        <ul className="chat-list">
          {filteredChats.map((c) =>
            c.id !== "dummy" ? (
              <li key={c.id} title={c.title || "(untitled)"}>
                <div
                  className={`chat-item ${c.id === selectedChatId ? "active" : ""}`}
                >
                  <button
                    className="chat-left"
                    onClick={() => handleChattSelect(c.id)}
                  >
                    <div className="chat-title">{c.title || "(untitled)"}</div>
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
                  </button>

                  <div
                    className="chat-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Popup
                      content={
                        <div className="renameDeletePopup">
                          <p
                            onClick={() => {
                              setModalType("rename");
                              setChatId(c.id);
                            }}
                          >
                            <img src={reName} height="15px" width="15px" />
                            Rename chat
                          </p>
                          <p
                            onClick={() => {
                              setModalType("delete");
                              setChatId(c.id);
                            }}
                          >
                            <img
                              src={deleteChatImg}
                              height="15px"
                              width="15px"
                            />
                            Delete chat
                          </p>
                        </div>
                      }
                      align="right"
                    >
                      <div className="renameDelete">
                        <img src={verticalDots} height="15px" width="15px" />
                      </div>
                    </Popup>
                  </div>
                </div>
              </li>
            ) : null,
          )}
        </ul>
      )}

      <Modal
        type={modalType}
        isOpen={modalType !== null && chatId !== ""}
        onClose={() => setModalType(null)}
        id={chatId}
        setChats={setChats}
        onSelectChat={onSelectChat}
      />
    </aside>
  );
}
