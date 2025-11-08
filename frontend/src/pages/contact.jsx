import "../styles/contact.css";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Server returned ${res.status}`);
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      // clear success after a short delay
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      console.error("Error sending contact form:", err);
      setStatus("error");
      setErrorMsg(err.message || "Failed to send message");
    }
  };

  return (
    <div className="contact">
      <h2>Contact Us</h2>
      <p>If you have a question or feedback, please send us a message below.</p>
      <form
        className="contact-form"
        onSubmit={handleSubmit}
        aria-label="Contact form"
      >
        <input
          name="name"
          type="text"
          placeholder="Kindly inscribe your noble name"
          className="contact-input"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Kindly inscribe your noble email"
          className="contact-input"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Your most distinguished message, if you please"
          className="contact-input message"
          value={formData.message}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="contact-btn"
          disabled={status === "sending"}
        >
          {status === "sending" ? "Dispatching..." : "Dispatch Thy Message"}
        </button>
        {status === "success" && (
          <div role="status" style={{ color: "#c6bb46", textAlign: "center" }}>
            Message dispatched — our sincere thanks.
          </div>
        )}
        {status === "error" && (
          <div role="alert" style={{ color: "#ff7b7b", textAlign: "center" }}>
            Alas — an error occurred: {errorMsg}
          </div>
        )}
      </form>
    </div>
  );
};

export default Contact;
