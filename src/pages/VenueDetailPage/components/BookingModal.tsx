import React, { useState } from "react";
import { toast } from "react-toastify";
import Modal from "../../../components/ui/Modal";
import { formatDate } from "../../../utils/dateUtils";
import { formatCurrency } from "../../../utils/currencyUtils";
import Button from "../../../components/ui/Button";
import { CreditCard } from "lucide-react";

/**
 * Available payment methods for booking.
 */
type PaymentMethod = "Google Pay" | "Credit Card" | "Apple Pay";

/**
 * Props for the {@link BookingModal} component.
 */
interface BookingModalProps {
  /** Name of the venue being booked */
  venueName: string;
  /** Details of the booking, including dates, guests, and pricing */
  bookingDetails: {
    /** Start date of the booking */
    dateFrom: Date;
    /** End date of the booking */
    dateTo: Date;
    /** Number of guests */
    guests: number;
    /** Total booking cost */
    totalCost: number;
    /** Number of nights included */
    nights: number;
  };
  /** Callback to close the modal */
  onClose: () => void;
  /** Callback triggered when confirming the booking (e.g., API call) */
  onConfirm: () => Promise<void>;
  /** Callback triggered after a successful booking */
  onSuccess: () => void;
}

/**
 * A multi-step modal component for confirming and paying for a venue booking.
 *
 * Steps:
 * 1. Confirm booking details
 * 2. Choose payment method and pay
 * 3. Display booking confirmation
 *
 * @param {BookingModalProps} props - Component props
 * @returns {JSX.Element} A booking modal UI
 */
const BookingModal: React.FC<BookingModalProps> = ({ venueName, bookingDetails, onClose, onConfirm, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("Credit Card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmationId, setConfirmationId] = useState("");

  /**
   * Handles the "Pay Now" action.
   * Calls `onConfirm`, generates a confirmation ID,
   * and transitions to the success step.
   */
  const handlePayNow = async () => {
    setIsProcessing(true);
    try {
      await onConfirm();
      const randomId = `BK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      setConfirmationId(randomId);
      setStep(3);
      toast.success("Booking successful!");
    } catch (error) {
      let errorMessage = "Booking failed. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Renders available payment options as selectable buttons.
   *
   * @returns {JSX.Element} Payment method selection UI
   */
  const renderPaymentOptions = () => {
    const options: { name: PaymentMethod; icon: React.ReactNode }[] = [
      { name: "Credit Card", icon: <CreditCard size={40} /> },
      { name: "Google Pay", icon: <CreditCard size={40} /> },
      { name: "Apple Pay", icon: <CreditCard size={40} /> },
    ];

    return (
      <div className="flex justify-center gap-4 my-6">
        {options.map(({ name, icon }) => (
          <Button
            variant={"secondary"}
            key={name}
            onClick={() => setSelectedPayment(name)}
            className={`
              p-4 rounded-lg border-2 transition-all w-32 h-24 flex flex-col items-center justify-center gap-2 
              ${
                selectedPayment === name
                  ? "border-neutral-400 !bg-blue-500 !text-white scale-105 shadow-md"
                  : "border-neutral-300 hover:border-neutral-400"
              }
            `}
            aria-label={`Select ${name}`}
          >
            {icon}
            <span className="font-bold text-md">{name}</span>
          </Button>
        ))}
      </div>
    );
  };

  /**
   * Handles closing the modal.
   * - If the booking is incomplete, cancels the process.
   * - If the booking succeeded, calls `onSuccess` before closing.
   */
  const handleClose = () => {
    if (step < 3) {
      toast.info("Booking process canceled. Please restart to reserve your stay");
      onClose();
    } else {
      onSuccess();
      onClose();
    }
  };

  return (
    <Modal onClose={handleClose} modalTitle="Holidaze | Booking process">
      {/* --- Step 1: Confirmation --- */}
      {step === 1 && (
        <div>
          <h2 className="text-2xl font-bold">Confirm your booking</h2>
          <div className="my-6 space-y-2 text-lg">
            <p>
              <strong>Venue:</strong> {venueName}
            </p>
            <p>
              <strong>Dates:</strong> {formatDate(bookingDetails.dateFrom)} to {formatDate(bookingDetails.dateTo)}
            </p>
            <p>
              <strong>Guests:</strong> {bookingDetails.guests}
            </p>
            <div className="pt-4 mt-4 border-t">
              <p className="flex justify-between font-bold">
                <span>Total ({bookingDetails.nights} nights)</span>
                <span>{formatCurrency(bookingDetails.totalCost)}</span>
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={() => setStep(2)} className="primary">
              Confirm & Proceed
            </Button>
          </div>
        </div>
      )}

      {/* --- Step 2: Payment --- */}
      {step === 2 && (
        <div>
          <h2 className="text-2xl font-bold">Choose Payment Method</h2>
          {renderPaymentOptions()}
          <div className="flex justify-end gap-4 mt-6">
            <Button variant="secondary" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button onClick={handlePayNow} disabled={isProcessing}>
              {isProcessing ? "Processing..." : `Pay ${formatCurrency(bookingDetails.totalCost)} Now`}{" "}
            </Button>
          </div>
        </div>
      )}

      {/* --- Step 3: Success --- */}
      {step === 3 && (
        <div>
          <h2 className="text-3xl font-bold text-success text-center">Booking Confirmed!</h2>
          <p className="my-2 text-center text-neutral-600">A confirmation has been sent to your registered email.</p>
          <div className="my-6 p-4 bg-neutral-100 rounded-lg border space-y-2 text-lg">
            <p>
              <strong>Confirmation ID:</strong> <span className="font-mono">{confirmationId}</span>
            </p>
            <hr className="my-2" />
            <p>
              <strong>Venue:</strong> {venueName}
            </p>
            <p>
              <strong>Check-in:</strong> {formatDate(bookingDetails.dateFrom)}
            </p>
            <p>
              <strong>Check-out:</strong> {formatDate(bookingDetails.dateTo)}
            </p>
            <p>
              <strong>Guests:</strong> {bookingDetails.guests}
            </p>
            <hr className="my-2" />
            <p className="font-bold flex justify-between">
              <span>Total Paid:</span>
              <span>
                {formatCurrency(bookingDetails.totalCost)} (via {selectedPayment})
              </span>
            </p>
          </div>
          <div className="flex justify-end">
            <Button onClick={onSuccess} className="w-full" size="lg">
              Done
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default BookingModal;
