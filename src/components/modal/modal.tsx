import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { CloseIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import style from "./modal.module.scss";
import ModalOverlay from "../modal-overlay/modal-overlay";

interface ModalProps {
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [onClose]);

  const modalContent = (
    <>
      <ModalOverlay onClose={onClose} />
      <div className={style.modal}>
        <div className={style.header}>
          <h2 className="text text_type_main-large">{title}</h2>
          <button style={{ backgroundColor: "#1c1c21" }} onClick={onClose}>
            <CloseIcon type="primary" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </>
  );

  const modalRoot = document.getElementById("modals");
  if (!modalRoot) return null;

  return ReactDOM.createPortal(modalContent, modalRoot);
};

export default Modal;
