import React, { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { MdClose } from "react-icons/md";

export interface ModalProps {
  /**
   * The content to be displayed inside the modal.
   */
  children: React.ReactNode;
  /**
   * A function to be called to close the modal.
   * Triggered by the close button, Escape key, or overlay click.
   */
  onClose: () => void;
  /**
   * Optional custom CSS classes for the modal content container.
   */
  className?: string;
}

/**
 * A reusable and accessible modal component that renders its children in a portal.
 * It includes features like closing on Escape key, closing on overlay click,
 * and focus management for a professional user experience.
 */
const Modal: React.FC<ModalProps> = ({ children, onClose, className = "" }) => {
  const titleId = useId();
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const modalRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previouslyFocusedElement = document.activeElement as HTMLElement;

    modalRef.current?.focus();

    return () => {
      previouslyFocusedElement?.focus();
    };
  }, []);

  const handleOverlayClick = () => {
    onClose();
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return createPortal(
    <div
      className="fixed top- inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`bg-white p-6 rounded-lg shadow-2xl w-full max-w-3xl relative -top-20 sm:top-0 mx-4 ${className}`}
        onClick={handleContentClick}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-neutral-500 hover:text-neutral-800 transition-colors"
          aria-label="Close modal"
        >
          <MdClose size={24} />
        </button>

        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
