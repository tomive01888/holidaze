import React, { useState, useMemo } from "react";
import { apiClient } from "../../../api/apiClient";
import { endpoints } from "../../../constants/endpoints";
import { useAuth } from "../../../hooks/useAuth";
import type { BookingFormData, FullVenue } from "../../../types";
import { calculateNumberOfNights, generateBookedDateArray, isRangeOverlapping } from "../../../utils/dateUtils";
import { formatCurrency } from "../../../utils/currencyUtils";
import Button from "../../../components/ui/Button";
import DatePicker from "react-datepicker";
import BookingModal from "./BookingModal";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";

/**
 * Props for the {@link BookingSection} component.
 */
interface BookingSectionProps {
  /** Venue object containing details and availability */
  venue: FullVenue;
  /** Callback when booking succeeds */
  onBookingSuccess: () => void;
}

/**
 * Booking section component that allows users to:
 * - Select a date range
 * - Specify number of guests
 * - Preview cost calculation
 * - Complete the booking via modal confirmation
 *
 * @param {BookingSectionProps} props - Component props
 */
const BookingSection: React.FC<BookingSectionProps> = ({ venue, onBookingSuccess }) => {
  const { user, openLoginModal } = useAuth();
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [guests, setGuests] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, endDate] = dateRange;
  const nights = calculateNumberOfNights(startDate, endDate);
  const totalCost = nights * venue.price;

  /**
   * Pre-computed list of dates that are already booked for this venue.
   * Memoized to avoid recalculation on re-renders.
   */
  const bookedDates = useMemo(() => generateBookedDateArray(venue.bookings), [venue.bookings]);

  /**
   * Returns a custom CSS class for a given day in the date picker.
   * Marks days as "booked" if they are already taken.
   *
   * @param {Date} date - The date to check
   * @returns {string} CSS class name for the day
   */
  const getDayClassName = (date: Date) => {
    const isBooked = bookedDates.some((bookedDate: Date) => bookedDate.toDateString() === date.toDateString());
    return isBooked ? "booked-day" : "";
  };

  /**
   * Handles the "Book Now" button click:
   * - Validates dates and guest count
   * - Checks for overlapping bookings
   * - Opens the booking modal if valid
   */
  const handleBookingClick = () => {
    if (!startDate || !endDate) {
      toast.error("Please select a start and end date for your stay.");
      return;
    }
    if (guests <= 0) {
      toast.error("Please specify at least 1 guest.");
      return;
    }
    if (isRangeOverlapping(startDate, endDate, bookedDates)) {
      toast.error("Your selected date range includes days that are already booked.");
      return;
    }
    setIsModalOpen(true);
  };

  /**
   * Confirms the booking by sending a POST request to the API.
   * Constructs a {@link BookingFormData} payload with user input.
   */
  const handleConfirmBooking = async () => {
    if (!startDate || !endDate || !venue.id) return;

    const payload: BookingFormData = {
      dateFrom: startDate.toISOString(),
      dateTo: endDate.toISOString(),
      guests: guests,
      venueId: venue.id,
    };

    await apiClient.post(endpoints.bookings.all, payload);
  };

  return (
    <aside className="sticky top-24 p-6 rounded-lg shadow-lg bg-white bg-linear-to-bl from-teal-400/30 from-10% to-gray-800/40 text-black border-4 border-teal-500 ">
      <div className="flex justify-between items-baseline">
        <h2 className="text-3xl font-bold">Book your stay</h2>
        <p className="text-xl">
          <span className="font-bold">{formatCurrency(venue.price)}</span> / night
        </p>
      </div>

      <div className="mt-4">
        <p className="font-semibold text-lg mb-2">Select your dates:</p>
        <div className="flex justify-center datepicker-custom-class">
          <DatePicker
            selected={startDate}
            onChange={(update) => setDateRange(update)}
            startDate={startDate}
            endDate={endDate}
            excludeDates={bookedDates}
            selectsRange
            inline
            monthsShown={1}
            calendarStartDay={1}
            minDate={new Date()}
            dayClassName={getDayClassName}
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="guests" className="block font-bold">
          Guests:
        </label>
        <input
          id="guests"
          type="number"
          value={guests}
          min="1"
          max={venue.maxGuests}
          onChange={(e) => setGuests(Math.min(venue.maxGuests, Math.max(1, parseInt(e.target.value) || 1)))}
          className="p-2 border rounded bg-white w-full mt-1"
        />
      </div>

      {nights > 0 && (
        <div className="mt-4 pt-4 border-t space-y-2">
          <div className="flex justify-between">
            <span>
              {formatCurrency(venue.price)} x {nights} nights
            </span>{" "}
            <span>{formatCurrency(totalCost)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span> <span>{formatCurrency(totalCost)}</span>
          </div>
        </div>
      )}

      <div className="mt-6">
        {user ? (
          <Button onClick={handleBookingClick} className="w-full bg-blue-500" size="lg">
            Book Now
          </Button>
        ) : (
          <p className="text-center p-4 bg-neutral-100 rounded text-lg">
            <button
              onClick={openLoginModal}
              className="font-bold cursor-pointer text-blue-500 underline hover:text-blue-700"
            >
              Log in
            </button>{" "}
            to book this venue.
          </p>
        )}
      </div>

      {isModalOpen && startDate && endDate && (
        <BookingModal
          venueName={venue.name}
          bookingDetails={{
            dateFrom: startDate,
            dateTo: endDate,
            guests: guests,
            totalCost: totalCost,
            nights: nights,
          }}
          onClose={() => {
            setIsModalOpen(false);
          }}
          onConfirm={handleConfirmBooking}
          onSuccess={onBookingSuccess}
        />
      )}
    </aside>
  );
};

export default BookingSection;
