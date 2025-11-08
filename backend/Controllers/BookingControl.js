const Booking = require("../Models/Booking");
const sendEmail = require("../services/emailService");

// Get all bookings
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ date: -1 }).lean();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a booking by ID
exports.deleteBooking = async (req, res) => {
  try {
    const id = req.params.id;
    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid booking id" });
    }
    const b = await Booking.findById(id);
    if (!b) return res.status(404).json({ message: "Booking not found" });
    await b.remove();
    res.json({ message: "Booking removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const {
      name,
      Type,
      date,
      time,
      numberOfPeople,
      specialRequests,
      contactInfo,
    } = req.body || {};

    if (!name || !contactInfo || !date || !time || !numberOfPeople) {
      return res
        .status(400)
        .json({ message: "Missing required booking fields" });
    }

    const newBooking = new Booking({
      name,
      Type,
      date,
      time,
      numberOfPeople,
      specialRequests,
      contactInfo,
    });

    // Save the booking to the database
    const saved = await newBooking.save();

    // Send a simple confirmation email to the guest if email available
    try {
      console.log(
        `[Booking] Attempting to send confirmation email to: ${contactInfo?.email}`
      );
      if (contactInfo && contactInfo.email) {
        const html = `
          <div style="font-family: Georgia, serif; padding: 20px; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; border: 1px solid #ddd;">
            <div style="background-color: #2c1810; color: #d4af37; padding: 20px; text-align: center;">
              <h2 style="margin: 0; font-family: Georgia, serif;">Casa De Luna</h2>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #c9a961;">A Taste of Shadows</p>
            </div>
            <div style="padding: 30px 20px; background-color: white;">
              <h3 style="color: #2c1810; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">Reservation Confirmation</h3>
              <p style="color: #333; font-size: 16px;">Dear <strong>${name}</strong>,</p>
              <p style="color: #555; line-height: 1.6;">Your reservation has been successfully confirmed. We look forward to welcoming you.</p>
              
              <div style="background-color: #f9f5ec; padding: 15px; margin: 20px 0; border-left: 4px solid #d4af37;">
                <p style="margin: 5px 0; color: #2c1810;"><strong>Date:</strong> ${date}</p>
                <p style="margin: 5px 0; color: #2c1810;"><strong>Time:</strong> ${time}</p>
                <p style="margin: 5px 0; color: #2c1810;"><strong>Party Size:</strong> ${numberOfPeople} ${
          numberOfPeople > 1 ? "guests" : "guest"
        }</p>
                ${
                  specialRequests
                    ? `<p style="margin: 5px 0; color: #2c1810;"><strong>Special Requests:</strong> ${specialRequests}</p>`
                    : ""
                }
              </div>

              <p style="color: #555; line-height: 1.6;">Should you need to modify or cancel your reservation, please contact us at least 24 hours in advance.</p>
              <p style="color: #555; line-height: 1.6; margin-top: 20px;">We look forward to providing you with an unforgettable dining experience.</p>
            </div>
            <div style="background-color: #2c1810; color: #c9a961; padding: 15px; text-align: center; font-size: 14px;">
              <p style="margin: 0;">Best regards,</p>
              <p style="margin: 5px 0; font-weight: bold;">Casa De Luna Team</p>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">1234 Elm Street, Springfield, USA | +1 (555) 123-4567</p>
            </div>
          </div>
        `;
        await sendEmail({
          to: contactInfo.email,
          subject: "Your Reservation at Casa De Luna",
          html,
        });
        console.log(
          `[Booking] Confirmation email sent successfully to ${contactInfo.email}`
        );
      } else {
        console.log(
          `[Booking] No email address provided in contactInfo - skipping email`
        );
      }
    } catch (e) {
      console.error("[Booking] Failed to send booking email:", e.message);
      console.error("[Booking] Full error:", e);
      // Don't fail the booking if email fails - still return success
    }

    try {
      if (contactInfo && contactInfo.email) {
        const Users = require("../Models/UsersModel");
        // use a case-insensitive search for the email
        const emailEscaped = contactInfo.email.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        );
        const found = await Users.findOne({
          email: new RegExp(`^${emailEscaped.trim()}$`, "i"),
        });
        if (found) {
          const note = {
            message: `Your reservation for ${date} at ${time} has been confirmed.`,
            type: "reservation",
            read: false,
            meta: { bookingId: saved._id },
            date: new Date().toISOString(),
          };
          found.notifications = found.notifications || [];
          found.notifications.unshift(note);
          await found.save();
        }
      }
    } catch (noteErr) {
      console.error(
        "Failed to save user notification for booking:",
        noteErr.message
      );
    }

    res.status(201).json({ message: "Reservation created", booking: saved });
  } catch (error) {
    console.error("createBooking error", error.message);
    res.status(500).json({ message: error.message });
  }
};
