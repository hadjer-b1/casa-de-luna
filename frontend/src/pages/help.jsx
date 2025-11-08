import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import Rating from "@mui/material/Rating";
import RestaurantShop from "../assets/image/restaurant.jpg";
import "../styles/help.css";

function Services() {
  const [currentHelp, setCurrentHelp] = useState(null);
  const { help } = useParams();
  const [activeQuestion, setActiveQuestion] = useState(null);

  // update currentHelp when URL param changes
  useEffect(() => {
    setCurrentHelp(help);
  }, [help]);

  // toggle FAQ question
  const toggleQuestion = (index) => {
    if (activeQuestion === index) {
      setActiveQuestion(null);
    } else {
      setActiveQuestion(index);
    }
  };

  

  return (
    <div className="help-container">
      {currentHelp === "faq" && (
        <div className="help-section">
          <h2>FAQs</h2>
          <p>
            Have questions? We’re here to help. Below are answers to the most
            common inquiries about our services, policies, and process.
          </p>
          <ul>
            <li onClick={() => toggleQuestion(0)}>
              <strong className="question">How do I book a service?</strong>
              {activeQuestion === 0 && (
                <p className="answer">
                  Visit our booking page and select the service you need. You’ll
                  receive a confirmation shortly after.
                </p>
              )}
            </li>
            <li onClick={() => toggleQuestion(1)}>
              <strong className="question">Can I customize my service?</strong>
              {activeQuestion === 1 && (
                <p className="answer">
                  Absolutely. Most of our offerings are fully customizable to
                  match your preferences and event type.
                </p>
              )}
            </li>
            <li onClick={() => toggleQuestion(2)}>
              <strong className="question">What areas do you serve?</strong>
              {activeQuestion === 2 && (
                <p className="answer">
                  We currently operate in select cities, with expanding
                  coverage. Contact us to check availability in your location.
                </p>
              )}
            </li>
            <li onClick={() => toggleQuestion(3)}>
              <strong className="question">
                What is your cancellation policy?
              </strong>
              {activeQuestion === 3 && (
                <p className="answer">
                  Cancellations made 48 hours prior are fully refundable. Late
                  cancellations may incur charges.
                </p>
              )}
            </li>
            <li onClick={() => toggleQuestion(4)}>
              <strong className="question">
                How do I get in touch with support?
              </strong>
              {activeQuestion === 4 && (
                <p className="answer">
                  Use the Support section below or email us directly at{" "}
                  <em>support@casadeluna.com</em>.
                </p>
              )}
            </li>
          </ul>
        </div>
      )}

      {currentHelp === "support" && (
        <div className="help-section support-section">
          <h2>Event Service Support</h2>
          <p>
            Need assistance with planning or managing your event? Our support
            team is here to ensure your occasion runs smoothly from start to
            finish. Whether you're coordinating vendors, managing guest lists,
            or handling last-minute changes, we're ready to help.
          </p>
          <p className="info-text-1">
            For urgent requests, please contact our live support or call our
            helpline. We respond to all queries within 24 hours.
          </p>
          <div className="help-section support-section-2">
            <h2>Delivery Service Support</h2>
            <p>
              Having trouble tracking an order, rescheduling delivery, or
              ensuring your items arrive in perfect condition? We’re committed
              to making every delivery seamless and secure.
            </p>
            <ul>
              <li>
                <strong className="info-text">Track your delivery:</strong>
                <p>Use the tracking ID in your confirmation email.</p>
              </li>
              <li>
                <strong className="info-text">Reschedule:</strong>
                <p>Reach out at least 2 hours before your delivery window.</p>
              </li>
              <li>
                <strong className="info-text">Issues with your order:</strong>
                <p>
                  Our support team will assist with replacements, refunds, or
                  any concern you may have.
                </p>
              </li>
            </ul>
          </div>
        </div>
      )}

      {currentHelp === "testimonials" && (
        <div className="testimonials-section">
          <h2>What Our Noble Customers Say</h2>
          <p>
            Don’t just take our word for it—hear from those who have experienced
            our services firsthand.
          </p>
          <div className="testimonial-list">
            <div className="testimonial-item">
              <div className="quote-icon">
                <img
                  src="https://media.istockphoto.com/id/2185972445/photo/confident-senior-businesswoman-sitting-in-office-lobby.jpg?s=612x612&w=0&k=20&c=n5p66lFsePGkA4DSfFf4-g83TA6mZEOKulHPej6b0KM="
                  alt="Customer 1"
                />
                <FormatQuoteIcon />
              </div>
              <div className="testimonial-content">
                <p>
                  "The service was exceptional! Highly recommend. The attention
                  to detail was fantastic."
                </p>
                <span>- Happy Customer</span>
                <div className="testimonial-rating">
                  <Rating name="read-only" value={4} readOnly />
                </div>
              </div>
            </div>
            <div className="testimonial-item">
              <div className="quote-icon">
                <img
                  src="https://media.istockphoto.com/id/2214930187/photo/businessman-smiling-and-looking-at-camera-while-working-on-laptop-in-office.jpg?s=612x612&w=0&k=20&c=wUU9_PPA1C5vijaQtgAMzSZF-TCMY4xqr0KjyLWr8tM="
                  alt="Customer 2"
                />
                <FormatQuoteIcon />
              </div>

              <div className="testimonial-content">
                <p>
                  "A seamless experience from start to finish. The incredible
                  support made all the difference."
                </p>
                <span>- Satisfied Client</span>
                <div className="testimonial-rating">
                  <Rating name="read-only" value={4.5} readOnly />
                </div>
              </div>
            </div>
            <div className="testimonial-item">
              <div className="quote-icon">
                <img
                  src="https://media.istockphoto.com/id/2240704183/photo/smiling-asian-woman-holding-pen-and-folding-arms-over-notebook-aside-laptop-on-wooden-table.jpg?s=612x612&w=0&k=20&c=x3MCwYmoDeH9EQ8QpvHyKzay9nJIyR6CV8Z3Pplz2Q0="
                  alt="Customer 3"
                />
                <FormatQuoteIcon />
              </div>

              <div className="testimonial-content">
                <p>
                  "Professional and reliable service every time. I always feel
                  valued as a customer."
                </p>
                <span>- Loyal Patron</span>
                <div className="testimonial-rating">
                  <Rating name="read-only" value={4.5} readOnly />
                </div>
              </div>
            </div>
            <div className="testimonial-item">
              <div className="quote-icon">
                <img
                  src="https://media.istockphoto.com/id/1193307707/photo/woman-with-coffee-and-smartphone-smiling-at-camera.jpg?s=612x612&w=0&k=20&c=6pFuCv8aGRiK4ZV26aruRFD0iF9dbHQFirEj07dKfiM="
                  alt="Customer 4"
                />
                <FormatQuoteIcon />
              </div>

              <div className="testimonial-content">
                <p>
                  "Exceeded my expectations in every way. The team was attentive
                  and went above and beyond."
                </p>
                <span>- Grateful User</span>
                <div className="testimonial-rating">
                  <Rating name="read-only" value={4.8} readOnly />
                </div>
              </div>
            </div>
            <div className="testimonial-item">
              <div className="quote-icon">
                <img
                  src="https://media.istockphoto.com/id/2218333130/photo/confident-businessman-smiling-in-a-casual-suit-and-glasses-indoors.jpg?s=612x612&w=0&k=20&c=55XTe0b4HfkJfq_yq_ksnl9xYWKRUCgmPMdwcssWOL0="
                  alt="Customer 5"
                />
                <FormatQuoteIcon />
              </div>

              <div className="testimonial-content">
                <p>
                  "A truly outstanding experience from beginning to end. I
                  couldn't be happier!"
                </p>
                <span>- Appreciative Client</span>
                <div className="testimonial-rating">
                  <Rating name="read-only" value={4.9} readOnly />
                </div>
              </div>
            </div>
            <div className="testimonial-item">
              <div className="quote-icon">
                <img
                  src="https://media.istockphoto.com/id/1298586676/photo/handsome-middle-aged-man-in-suit-posing-against-grey-background.jpg?s=612x612&w=0&k=20&c=iKNHHxBwmFn5sWv28W-PnN_gffs2X55cKGF6F43TW6s="
                  alt="Customer 6"
                />
                <FormatQuoteIcon />
              </div>

              <div className="testimonial-content">
                <p>
                  "Their attention to detail is unmatched. The view was
                  breathtaking and no music was needed. It was natural."
                </p>
                <span>- Delighted Customer</span>
                <div className="testimonial-rating">
                  <Rating name="read-only" value={4.4} readOnly />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentHelp === "restaurants" && (
        <div className="restaurant-section">
          <h2>Restaurant Shop</h2>
          <div className="info-text-container">
            <p>
              It all began with finding the perfect location for our restaurant
              — a place that’s not only easy to reach but also surrounded by a
              vibrant atmosphere that invites people in.
            </p>
            <p>
              Welcome to our Royal Restaurant, where the natural sea view
              enhances every dining experience.
            </p>
            <p>
              The breathtaking sunset is our most beloved feature, and you can
              enjoy it all at the address below. The picture shows our beautiful
              Casa De Luna restaurant.
            </p>
          </div>

          <p className="info-text">Address: 123 Ocean Drive, Beach City</p>
          <img
            src={RestaurantShop}
            alt="Casa De Luna Restaurant"
            className="restaurant-image"
          />
        </div>
      )}
    </div>
  );
}
export default Services;
