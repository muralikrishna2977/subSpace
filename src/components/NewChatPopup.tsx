import Popup from "./Popup";

type Props = {
  openNewChatPopup: boolean;
  setOpenNewChatPopup: React.Dispatch<React.SetStateAction<boolean>>;
  newChatName: string;
  setNewChatName: React.Dispatch<React.SetStateAction<string>>;
  confirmCreateChat: () => void;
  align?: "left" | "right" | "topCenter";
};

function NewChatPopup(props: Props) {
    const { openNewChatPopup, setOpenNewChatPopup, newChatName, setNewChatName, confirmCreateChat, align} = props;


    return(
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
            align={align}
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
    );
}

export default NewChatPopup;