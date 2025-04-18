import React from "react";
import style from "./modal-overlay.module.scss";

interface ModalOverlayProps {
  onClose: () => void;
}

const ModalOverlay: React.FC<ModalOverlayProps> = ({ onClose }) => {
  return (
    <div
      className={style.overlay}
      onClick={onClose}
      data-testid="modal-overlay"
    />
  );
};

export default ModalOverlay;
