import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { CloseIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import style from "./modal.module.scss";
import ModalOverlay from "../modal-overlay/modal-overlay";

const Modal = ({ title, onClose, children }) => {
  useEffect(() => {
    const handleEscKey = (event) => {
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

  return ReactDOM.createPortal(modalContent, document.getElementById("modals"));
};

Modal.propTypes = {
  title: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;
