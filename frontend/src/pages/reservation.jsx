import { useState } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import "../styles/reservation.css";

const Reservation = () => {
  const [form, setForm] = useState({
    name: "",
    contactEmail: "",
    contactPhone: "",
    Type: "",
    date: "",
    time: "",
    guests: 1,
    specialRequests: "",
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "pending", message: "Sending reservation..." });
    try {
      const payload = {
        name: form.name,
        Type: form.Type,
        date: form.date,
        time: form.time,
        numberOfPeople: Number(form.guests),
        specialRequests: form.specialRequests,
        contactInfo: { email: form.contactEmail, phone: form.contactPhone },
      };

  const res = await fetch(`${process.env.REACT_APP_API_URL}/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setStatus({
          type: "error",
          message: data?.message || "Reservation failed",
        });
        return;
      }

      setStatus({
        type: "success",
        message:
          "Reservation confirmed — a confirmation was sent to your email if provided.",
      });
      setForm({
        name: "",
        contactEmail: "",
        contactPhone: "",
        Type: "",
        date: "",
        time: "",
        guests: 1,
        specialRequests: "",
      });
    } catch (err) {
      console.error("Reservation error", err);
      setStatus({
        type: "error",
        message: "Network error while sending reservation.",
      });
    }
  };

  return (
    <div className="reservation-page">
      <div className="reservation-banner">
        <h1 className="reservation-title">Make a Reservation</h1>
        <div className="reservation-header">
          <div className="reservation-header-item">
            <span className="reservation-icon-container">
              <LocationOnIcon className="reservation-icon" />
            </span>
            <h3 className="reservation-header-text">Location</h3>
            <span className="reservation-header-text">
              123 Mystic Lane, Flavor Town
            </span>
          </div>
          <div className="reservation-header-item">
            <span className="reservation-icon-container">
              <AccessTimeIcon className="reservation-icon" />
            </span>
            <h3 className="reservation-header-text">Opening Hours</h3>
            <span className="reservation-header-text">
              Monday-Sunday <br /> 06:00 AM - 1:00 AM
            </span>
          </div>
          <div className="reservation-header-item">
            <span className="reservation-icon-container">
              <PhoneIcon className="reservation-icon" />
            </span>
            <h3 className="reservation-header-text">Contact Us</h3>
            <span className="reservation-header-text">+(1) 234 567 890</span>
            <span className="reservation-header-text">+(213) 234 567 891</span>
          </div>
          <div className="reservation-header-item">
            <span className="reservation-icon-container">
              <EmailIcon className="reservation-icon" />
            </span>
            <h3 className="reservation-header-text">Email Address</h3>
            <span className="reservation-header-text">info@casadeluna.com</span>
            <span className="reservation-header-text">info@casadeluna.com</span>
          </div>
        </div>
      </div>

      <form className="reservation-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Kindly enter your full name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contactEmail">Contact Email</label>
          <input
            type="email"
            id="contactEmail"
            name="contactEmail"
            placeholder="you@example.com"
            value={form.contactEmail}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="contactPhone">Contact Phone</label>
          <input
            type="tel"
            id="contactPhone"
            name="contactPhone"
            placeholder="Optional phone number"
            value={form.contactPhone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="reservation-type">Reservation Type</label>
          <select
            id="Type"
            name="Type"
            value={form.Type}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select reservation type
            </option>
            <option value="dine-in">Dine-In</option>
            <option value="private-event">Private Event</option>
            <option value="outdoor-seating">Outdoor Seating</option>
            <option value="special-occasion">Special Occasion</option>
            <option value="business-meeting">Business Meeting</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="time-group">
          <label htmlFor="date" className="preferred-date">
            Preferred Date
          </label>
          <div className="form-group-time">
            <input
              type="date"
              id="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
            <input
              type="time"
              id="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="guests">Party Size</label>
          <input
            type="number"
            id="guests"
            name="guests"
            min="1"
            max="20"
            placeholder="Kindly indicate number of guests"
            value={form.guests}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="specialRequests">Additional Notes</label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            placeholder="Please share any preferences or special requests"
            rows="4"
            value={form.specialRequests}
            onChange={handleChange}
          ></textarea>
        </div>

        <button type="submit" className="reservation-button">
          Confirm Reservation
        </button>
      </form>

      {status && (
        <div
          className={`reservation-status ${status.type}`}
          role="status"
          style={{ marginTop: 12 }}
        >
          {status.message}
        </div>
      )}

      <div className="reservation-info">
        <p>
          For any inquiries, please contact us at{" "}
          <a href="mailto:info@casadeluna.com">info@casadeluna.com</a>
        </p>
      </div>
    </div>
  );
};

export default Reservation;
