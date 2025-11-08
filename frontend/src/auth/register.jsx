import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import GoogleLoginButton from "../components/GoogleLoginBtn";
import "../styles/auth.css";

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (newUser.password !== newUser.confirmPassword) {
      alert("Passwords do not match!");
      setLoading(false);
      return;
    }

    const response = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullname: newUser.fullname,
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
        phone: newUser.phone,
      }),
    });
    if (response.ok) {
      // Optionally, you can log the user in directly here by calling the login API
      // For now, just redirect to login page
      setLoading(false);
      setNewUser({
        fullname: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
      });
      navigate("/login");
    } else {
      const errorData = await response.json();
      alert(`Registration failed: ${errorData.message}`);
    }
  };

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="register-container">
      <div className="register">
        <h2>Register</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="text"
            id="fullname"
            name="fullname"
            value={newUser.fullname}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter Your Full Name"
            required
          />
          <input
            type="text"
            id="username"
            value={newUser.username}
            onChange={handleChange}
            name="username"
            className="form-control"
            placeholder=" Enter YourUsername"
            required
          />
          <input
            type="email"
            id="email"
            name="email"
            value={newUser.email}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter Your Email"
            required
          />
          <input
            type="password"
            id="password"
            name="password"
            value={newUser.password}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter Password"
            required
          />
          <input
            type="password"
            id="confirm-password"
            name="confirmPassword"
            value={newUser.confirmPassword}
            onChange={handleChange}
            className="form-control"
            required
            placeholder="Confirm Password"
          />
          <input
            type="text"
            id="phone"
            name="phone"
            value={newUser.phone}
            onChange={handleChange}
            className="form-control"
            placeholder="Phone Number"
            required
          />
          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <div className="alternative-login">
          <span>Or</span>
          <GoogleLoginButton />
        </div>
        <p className="login-verify">
          Already have an account?
          <Link to="/login" className="login-link">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
export default Register;
