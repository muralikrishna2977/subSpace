import { useEffect, useRef, useState } from "react";
import { fetchMessages, subscribeMessages, sendMessageFlow } from "../api/chat";
import type { Chat, Message } from "../types";
import "./ChatWindow.css";

import ProfileIcon from "../assets/profile.svg";
import SendIcon from "../assets/send.svg";
import Popup from "./Popup";
import { useSignOut } from "@nhost/react";
import { useNavigate } from "react-router-dom";
import IntroComponent from "./IntroComponent";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
// import "katex/dist/katex.min.css";

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
  const disposeRef = useRef<() => void>(null);
  const scrollReff = useRef<HTMLDivElement | null>(null);
  const { signOut, isSuccess, error } = useSignOut();
  const navigate = useNavigate();

  useEffect(() => {
    if (!chatId) {
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
    if (!chatId || !input.trim()) return;
    const text = input.trim();
    setInput("");
    try {
      await sendMessageFlow(chatId, text);
    } catch (e: any) {
      alert(e.message || "Failed to send");
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

  return (
    <main className="chat-window">
      <div className="headerContainer">
        <p>{selectedChatName}</p>
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
          <img src={ProfileIcon} height="30px" width="30px" />
        </Popup>
      </div>
      {!chatId ? (
        <IntroComponent setChats={setChats} onSelectChat={onSelectChat} />
      ) : (
        <>
          <div ref={scrollReff} className="messages">
            {messages.map((m) => (
              <div key={m.id} className={`bubble ${m.role}`}>
                <div className="bubble-role">
                  {m.role === "user" ? "You" : "Assistant"}
                </div>
                {/* <div style={{ whiteSpace: "pre-wrap" }}>{m.content}</div> */}
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
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message…"
                onKeyDown={(e) => e.key === "Enter" && onSend()}
              />
              {input && (
                <img
                  className="sendButton"
                  onClick={onSend}
                  src={SendIcon}
                  height="40px"
                  width="40px"
                />
              )}
            </div>

          </div>
        </>
      )}
    </main>
  );
}
