import SubspaceLogo from "../assets/subspaceLogo.jpeg";
import "./IntroComponent.css";

const IntroComponent = () => {
  return (
    <div className="intro">
      <img src={SubspaceLogo} height="100px" width="100px" />
      <h1>Welcome to Sub Space Chatbot</h1>
      <p className="empty">Select a chat or create a new one.</p>
    </div>
  );
};

export default IntroComponent;
