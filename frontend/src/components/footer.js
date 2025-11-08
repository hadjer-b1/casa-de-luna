import { Link } from "react-router-dom";
import { useState } from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailIcon from "@mui/icons-material/Email";
import TwitterIcon from "@mui/icons-material/Twitter";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import { useToast } from "./Toast";
import "../styles/layout.css";

function Footer() {
  const [email, setEmail] = useState("");
  const toast = useToast();

  // Function to send notification to user 
  const sendNotificationToUser = async (message, notifType = "info") => {
    try {
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      const newNotif = {
        message,
        type: notifType,
        read: false,
        meta: { source: "newsletter" },
        date: new Date().toISOString(),
      };
      stored.notifications = stored.notifications || [];
      stored.notifications.unshift(newNotif);
      localStorage.setItem("user", JSON.stringify(stored));

      window.dispatchEvent(new Event("authChanged"));

      const token = localStorage.getItem("token");
      if (token) {
        await fetch(`${process.env.REACT_APP_API_URL}/user/profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ notifications: stored.notifications }),
        });
      }
    } catch (err) {
      console.error("Failed to save notification:", err);
    }
  };

  // Function to send the email to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.trim()) {
      toast.addToast("Please enter a valid email address", { type: "error" });
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Subscription failed");
      }
      
      const data = await response.json();
      
       toast.addToast("Successfully subscribed to our newsletter!", { type: "success" });
      
       await sendNotificationToUser(
        "You've successfully subscribed to Casa De Luna newsletter!",
        "success"
      );
      
       setEmail("");
      
      console.log("Success:", data);
    } catch (error) {
      console.error("Error:", error);
      toast.addToast(error.message || "Failed to subscribe. Please try again.", { type: "error" });
    }
  };
  
  // making the clicking on the links scroll to top
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <footer>
      <div className="footer-top">
        <div className="footer-logo">
          <Link to="/" className="logo">
            <img
              src={require("../assets/logo.png")}
              alt="Casa de Luna Logo"
              className="logo-"
            />
          </Link>
          <p className="tagline">
            Celebrated as the number one destination for those with a taste for
            refined elegance and culinary brilliance, this establishment
            embodies a harmonious blend of tradition, artistry, and exquisite
            service that redefines the fine dining experience.
          </p>
        </div>
        <div className="newsletter">
          <h2>Subscribe to our Newsletter</h2>
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="footer-line"></div>

      <div className="footer-content">
        <div className="contact-info">
          <h2>Contact us </h2>
          <div className="location">
            <LocationOnIcon className="contact-icon" />
            <div className="location-details">
              <p className="hidden-info">
                Address: 123 Restaurant St, Food City
              </p>
              <p>Algeria, Touggourt, the Sahara 12345</p>
            </div>
          </div>

          <Link to="/contact" onClick={scrollToTop} className="link-contact">
            <EmailIcon className="contact-icon" />
            <div className="email">
              <p className="hidden-info">info@restaurant.com</p>
              <p>info@restaurant.com</p>
            </div>
          </Link>
          <div className="phone">
            <PhoneIcon className="contact-icon" />
            <div className="phone-numbers">
              <p className="hidden-info">Phone: +(123) 456-7890</p>
              <p>Phone: +(123) 456-7890</p>
            </div>
          </div>
        </div>
        <nav className="footer-nav-section">
          <h2 className="footer-heading">Quick Links</h2>
          <ul className="footer-nav">
            <li>
              <Link to="/" onClick={scrollToTop} className="nav-link">
                Home
              </Link>
            </li>
            <li>
              <Link to="/menu" onClick={scrollToTop} className="nav-link">
                Menu
              </Link>
            </li>
            <li>
              <Link to="/reservation" onClick={scrollToTop} className="nav-link">
                Reservations
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={scrollToTop} className="nav-link">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
        <div className="our-services">
          <h2>Our Services</h2>
          <ul>
            <li>
              <Link to="/services/catering" onClick={scrollToTop} className="service-link  ">
                Catering
              </Link>
            </li>
            <li>
              <Link to="/services/delivery" onClick={scrollToTop} className="service-link nav-link">
                Delivery
              </Link>
            </li>
            <li>
              <Link to="/services/events" onClick={scrollToTop} className="service-link nav-link">
                Events
              </Link>
            </li>
            <li>
              <Link to="/services/specials" onClick={scrollToTop} className="service-link nav-link">
                Specials
              </Link>
            </li>
          </ul>
        </div>
        <div className="Help-center footer-nav-section">
          <h2>Help Center</h2>
          <div className="help-links">
            <Link to="/helps/faq" onClick={scrollToTop} className="help-link nav-link">
              FAQ
            </Link>
            <Link to="/helps/support" onClick={scrollToTop} className="help-link nav-link">
              Support
            </Link>
            <Link to="/helps/testimonials" onClick={scrollToTop} className="help-link nav-link">
              Testimonials
            </Link>
            <Link to="/helps/restaurants" onClick={scrollToTop} className="help-link nav-link">
              Restaurant Shop
            </Link>
          </div>
        </div>
        <div className="social-media footer-nav-section">
          <h2>Follow us</h2>
          <ul>
            <li>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <FacebookIcon className="social-icon" />
              </a>
            </li>
            <li>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <TwitterIcon className="social-icon" />
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <InstagramIcon className="social-icon" />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p>&copy; 2023 Casa De Luna. All rights reserved.</p>
    </footer>
  );
}
export default Footer;
