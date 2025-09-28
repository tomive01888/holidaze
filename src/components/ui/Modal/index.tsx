import { useEffect, useId, useRef, type ReactNode, type FC } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

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
  /**
   * Optional description text for screen readers, describing the modal.
   * This will be connected via aria-describedby.
   */
  description?: string;
  /**
   * Optional temporary document title to set while the modal is open.
   * When the modal closes, the original title will be restored.
   */
  modalTitle?: string;
  /**
   * If true, clicking the semi-transparent backdrop outside the modal content
   * will trigger the `onClose` function. Defaults to `false`.
   */
  closeOnBackdropClick?: boolean;
}

/**
 * @component Modal
 * @description
 * A fully accessible, reusable modal component with:
 * - Focus trap (keyboard users cannot tab outside)
 * - Escape key closes the modal
 * - Scroll lock while open
 * - Restores focus to the previously focused element on close
 * - Optional temporary document title while open
 * - ARIA roles and labels for screen readers
 * - Optional screen-reader-only description
 * - Close button with accessible label
 *
 * The modal is rendered in a React portal (`document.body`) and ensures the rest
 * of the app is hidden from assistive technologies while open.
 *
 * @param {ModalProps} props - Props for the modal component.
 * @returns {React.ReactPortal} A portal rendering the modal content.
 *
 * @example
 * <Modal
 *   onClose={() => setShowModal(false)}
 *   modalTitle="My Modal"
 *   description="This modal allows users to perform important actions."
 * >
 *   <p>Modal content goes here.</p>
 * </Modal>
 */
const Modal: FC<ModalProps> = ({
  children,
  onClose,
  className = "",
  description,
  modalTitle,
  closeOnBackdropClick = false,
}) => {
  const titleId = useId();
  const descId = useId();
  const modalRef = useRef<HTMLDivElement>(null);

  // --- Dynamic Document Title ---
  useEffect(() => {
    if (!modalTitle) return;

    const originalTitle = document.title;
    document.title = modalTitle;

    return () => {
      document.title = originalTitle;
    };
  }, [modalTitle]);

  // --- Escape Key to Close ---
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // --- Focus Trap & Restore Focus ---
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const previouslyFocusedElement = document.activeElement as HTMLElement;
    const focusableSelectors = ["a[href]", "button", "textarea", "input", "select", "[tabindex]:not([tabindex='-1'])"];
    const focusableEls = Array.from(modal.querySelectorAll<HTMLElement>(focusableSelectors.join(",")));
    focusableEls[0]?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab" && focusableEls.length > 0) {
        if (e.shiftKey && document.activeElement === focusableEls[0]) {
          e.preventDefault();
          focusableEls[focusableEls.length - 1].focus();
        } else if (!e.shiftKey && document.activeElement === focusableEls[focusableEls.length - 1]) {
          e.preventDefault();
          focusableEls[0].focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedElement?.focus();
    };
  }, []);

  // --- Lock Scroll & ARIA Hidden ---
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const appRoot = document.getElementById("root");
    const previousAriaHidden = appRoot?.getAttribute("aria-hidden");

    document.body.style.overflow = "hidden";
    if (appRoot) appRoot.setAttribute("aria-hidden", "true");

    const previouslyFocusedElement = document.activeElement as HTMLElement;
    modalRef.current?.focus();

    return () => {
      document.body.style.overflow = originalOverflow;
      if (appRoot) {
        if (previousAriaHidden) {
          appRoot.setAttribute("aria-hidden", previousAriaHidden);
        } else {
          appRoot.removeAttribute("aria-hidden");
        }
      }
      previouslyFocusedElement?.focus();
    };
  }, []);

  return createPortal(
    <div
      onClick={closeOnBackdropClick ? onClose : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm min-h-[110vh] -top-[5vh]"
      role="presentation"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`bg-white p-6 rounded-lg shadow-2xl w-full max-w-4xl relative mx-4 text-black ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 text-neutral-500 hover:text-neutral-800 transition-colors rounded-full"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        {description && (
          <p id={descId} className="sr-only">
            {description}
          </p>
        )}

        <div className="modal-body" id={titleId}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
