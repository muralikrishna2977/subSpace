import SubspaceLogo from "../assets/subspaceLogo.jpeg";
import "./IntroComponent.css";
import type { Chat } from "../types";

type Props = {
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  onSelectChat: React.Dispatch<React.SetStateAction<string | null>>;
};

function IntroComponent(props: Props) {
  const { onSelectChat } = props;

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

  return (
    <div className="intro">
      <img src={SubspaceLogo} height="100px" width="100px" />
      <h1>Welcome to Sub Space Chatbot</h1>
      <p className="empty">Select a chat or create a new one.</p>
      <button className="newChatButton" onClick={confirmCreateChat}>
        New Chat
      </button>
    </div>
  );
}

export default IntroComponent;
