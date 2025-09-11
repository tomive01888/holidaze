import { useEffect, useId, useRef, type ReactNode, type FC } from "react";
import { createPortal } from "react-dom";
import { MdClose } from "react-icons/md";

export interface ModalProps {
  /**
   * The content to be displayed inside the modal's body.
   */
  children: ReactNode;
  /**
   * A function to be called to close the modal.
   */
  onClose: () => void;
  /**
   * Optional custom CSS classes for the modal content container.
   */
  className?: string;
}

/**
 * A reusable and highly accessible modal component that renders its children in a portal.
 * It includes robust focus management and keyboard accessibility (Escape key).
 * The modal is closed via the dedicated close button or the Escape key.
 */
const Modal: FC<ModalProps> = ({ children, onClose, className = "" }) => {
  const titleId = useId();
  const modalRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const previouslyFocusedElement = document.activeElement as HTMLElement;
    modalRef.current?.focus();
    return () => {
      previouslyFocusedElement?.focus();
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm min-h-[110vh] -top-[5vh]">
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`bg-white p-6 rounded-lg shadow-2xl w-full max-w-xl relative mx-4 text-black ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 text-neutral-500 hover:text-neutral-800 transition-colors rounded-full"
          aria-label="Close modal"
        >
          <MdClose size={24} />
        </button>
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
