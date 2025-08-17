import { useState } from "react";
import SubspaceLogo from "../assets/subspaceLogo.jpeg";
import "./IntroComponent.css";
import NewChatPopup from "./NewChatPopup";
import { createChat } from "../api/chat";
import type { Chat } from "../types";

type Props = {
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  onSelectChat: React.Dispatch<React.SetStateAction<string | null>>;
};

function IntroComponent(props: Props) {
  const { setChats, onSelectChat } = props;
  const [newChatName, setNewChatName] = useState<string>("");
  const [openNewChatPopup, setOpenNewChatPopup] = useState(false);

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

  return (
    <div className="intro">
      <img src={SubspaceLogo} height="100px" width="100px" />
      <h1>Welcome to Sub Space Chatbot</h1>
      <p className="empty">Select a chat or create a new one.</p>
      <NewChatPopup
        openNewChatPopup={openNewChatPopup}
        setOpenNewChatPopup={setOpenNewChatPopup}
        newChatName={newChatName}
        setNewChatName={setNewChatName}
        confirmCreateChat={confirmCreateChat}
        align="topCenter"
      />
    </div>
  );
}

export default IntroComponent;
