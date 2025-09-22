import React, { useState, useMemo } from "react";
import { apiClient } from "../../../api/apiClient";
import { endpoints } from "../../../constants/endpoints";
import { useAuth } from "../../../hooks/useAuth";
import type { BookingFormData, FullVenue } from "../../../types";
import { calculateNumberOfNights, generateBookedDateArray, isRangeOverlapping } from "../../../utils/dateUtils";
import { formatCurrency } from "../../../utils/currencyUtils";
import Button from "../../../components/ui/Button";
import ShareButton from "./ShareButton";
import DatePicker from "react-datepicker";
import BookingModal from "./BookingModal";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";

interface BookingSectionProps {
  venue: FullVenue;
  showStickyShare: boolean;
  onBookingSuccess: () => void;
}

const BookingSection: React.FC<BookingSectionProps> = ({ venue, onBookingSuccess, showStickyShare }) => {
  const { user, openLoginModal } = useAuth();
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [guests, setGuests] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [startDate, endDate] = dateRange;
  const nights = calculateNumberOfNights(startDate, endDate);
  const totalCost = nights * venue.price;

  const bookedDates = useMemo(() => generateBookedDateArray(venue.bookings), [venue.bookings]);

  const getDayClassName = (date: Date) => {
    const isBooked = bookedDates.some((bookedDate: Date) => bookedDate.toDateString() === date.toDateString());
    return isBooked ? "booked-day" : "";
  };

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
    <aside className="sticky top-24 p-6 border rounded-lg shadow-lg bg-white text-black">
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

      <div
        className={`
            transition-opacity duration-300 hidden lg:block  absolute right-0 -bottom-16
            ${showStickyShare ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
      >
        <ShareButton />
      </div>
    </aside>
  );
};

export default BookingSection;
