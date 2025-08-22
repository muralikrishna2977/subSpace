import { useEffect, useRef, useState } from "react";
import {
  fetchMessages,
  subscribeMessages,
  sendMessageFlow,
  changeName,
} from "../api/chat";
import type { Chat, Message } from "../types";
import "./ChatWindow.css";

import ProfileIcon from "../assets/profile2.png";
import SendIcon from "../assets/send.svg";
import Popup from "./Popup";
import { useSignOut } from "@nhost/react";
import { useNavigate } from "react-router-dom";
import IntroComponent from "./IntroComponent";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import { createChat } from "../api/chat";

const convertDate = (date: string) => {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

type Props = {
  chatId: string | null;
  selectedChatName?: string;
  displayName?: string;
  email?: string;
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  onSelectChat: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function ChatWindow({
  displayName,
  email,
  selectedChatName,
  chatId,
  setChats,
  onSelectChat,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  const disposeRef = useRef<() => void>(null);
  const scrollReff = useRef<HTMLDivElement | null>(null);
  const { signOut, isSuccess, error } = useSignOut();
  const navigate = useNavigate();

  useEffect(() => {
    if (!chatId || chatId === "123") {
      setMessages([]);
      return;
    }
    let dispose: any;
    (async () => {
      setMessages(await fetchMessages(chatId));
      dispose = subscribeMessages(
        chatId,
        (msgs) => setMessages(msgs),
        (e) => console.error("subscription error", e),
      );
      disposeRef.current = dispose;
    })();
    return () => {
      dispose?.();
    };
  }, [chatId]);

  useEffect(() => {
    if (scrollReff.current) {
      scrollReff.current.scrollTop = scrollReff.current.scrollHeight;
    }
  }, [messages]);

  async function onSend() {
    if (!input.trim()) return;

    const text = input.trim();
    setInput("");

    try {
      if (!chatId || chatId === "123") {
        const c = await createChat(text);
        setChats((prev) => [c, ...prev]);
        onSelectChat(c.id);
        await sendMessageFlow(c.id, text);
        return;
      }

      if (messages.length === 0) {
        await changeName(chatId, text);
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === chatId
              ? { ...chat, title: text, updated_at: new Date().toISOString() }
              : chat,
          ),
        );
      }

      await sendMessageFlow(chatId, text);
    } catch (e: any) {
      console.log(e.message ? `emessage:- ${e.message}` : "Failed to send");
    }
  }

  const handleLogout = async () => {
    await signOut();
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/");
    } else if (error) {
      alert(`Logout failed: ${error?.message || "Unknown error"}`);
    }
  }, [isSuccess, error, navigate]);

  useEffect(() => {
    if (messages.length === 0) {
      setThinking(false);
      return;
    }

    const lastMsg = messages[messages.length - 1];
    const isUserWaiting = lastMsg.role !== "assistant";
    setThinking(isUserWaiting);

    let timer: ReturnType<typeof setTimeout> | null = null;
    if (isUserWaiting) {
      timer = setTimeout(() => setThinking(false), 30000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [messages]);

  return (
    <main className="chat-window">
      <div className="headerContainer">
        <div className="renameDeleteContainer">
          <p title={selectedChatName} className="chat-title">
            {selectedChatName}
          </p>
        </div>

        <Popup
          content={
            <div className="profile">
              <h4>{displayName}</h4>
              <p>{email}</p>
              <button className="logoutButton" onClick={handleLogout}>
                LogOut
              </button>
            </div>
          }
        >
          <img src={ProfileIcon} height="40px" width="40px" />
        </Popup>
      </div>
      {!chatId ? (
        <IntroComponent setChats={setChats} onSelectChat={onSelectChat} />
      ) : (
        <>
          <div ref={scrollReff} className="messages">
            {messages.map((m, i) => (
              <div key={m.id} className={`bubble ${m.role} ${i === messages.length - 1 ? "avoidMarginForForLastMessage" : ""}`}>
                <div className="bubble-role">
                  {m.role === "user" ? "You" : "Assistant"}
                </div>
                <ReactMarkdown
                  remarkPlugins={[remarkMath, remarkGfm]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {m.content}
                </ReactMarkdown>
                <div className="bubble-time">{convertDate(m.created_at)}</div>
              </div>
            ))}
          </div>
          <div className="composer">
            <div className="composerInput">
              <input
                disabled={thinking}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={thinking ? "Processing..." : "Type a message"}
                onKeyDown={(e) => e.key === "Enter" && onSend()}
              />

              <button
                disabled={!input || thinking}
                className="sendButton"
                onClick={onSend}
              >
                {thinking ? (
                  <div className="spinner" />
                ) : (
                  <img src={SendIcon} height="40px" width="40px" />
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
