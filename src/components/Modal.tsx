import React, { useState } from "react";
import { changeName } from "../api/chat.ts";
import "./Modal.css";
import type { Chat } from "../types";
import { deleteChat } from "../api/chat.ts";

type ModalType = "rename" | "delete" | "logout" | null;

interface ModalProps {
  type: ModalType;
  isOpen: boolean;
  onClose: () => void;
  id: string;
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  onSelectChat: (id: string) => void;
}

const Modal: React.FC<ModalProps> = ({
  type,
  isOpen,
  onClose,
  id,
  setChats,
  onSelectChat,
}) => {
  const [inputValue, setInputValue] = useState("");
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        {type === "rename" && (
          <>
            <h2>Rename Chat</h2>
            <input
              type="text"
              placeholder="Enter new name"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={onClose}>Cancel</button>
              <button
                onClick={() => {
                  changeName(id, inputValue);
                  setChats((prev) =>
                    prev.map((c) =>
                      c.id === id ? { ...c, title: inputValue } : c,
                    ),
                  );
                  onClose();
                  onSelectChat("");
                }}
              >
                OK
              </button>
            </div>
          </>
        )}

        {type === "delete" && (
          <>
            <h2>Delete Chat</h2>
            <p>Are you sure you want to delete this chat?</p>
            <div className="modal-actions">
              <button onClick={onClose}>No</button>
              <button
                onClick={() => {
                  deleteChat(id);
                  setChats((prev) => prev.filter((c) => c.id !== id));
                  onClose();
                  onSelectChat("");
                }}
              >
                Yes
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;
