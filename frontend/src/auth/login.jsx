import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../utils/firebaseConfig";
import { useToast } from "../components/Toast";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/Slices/userSlice";
import Modal from "../components/Modal";
import GoogleIcon from "@mui/icons-material/Google";
import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useDispatch();
  const [idUser, setIdUser] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("");
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [code, setCode] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect to profile if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiry = parseInt(localStorage.getItem("tokenExpiry") || "0", 10);

    if (token && expiry && Date.now() < expiry) {
      navigate("/profile");
    }
  }, [navigate]);

  // Handle form submission for login
  const handleLogin = (e) => {
    e.preventDefault();
    (async () => {
      setLoading(true);
      setError("");
      try {
        const payload = idUser.includes("@")
          ? { email: idUser, password }
          : { username: idUser, password };
        const res = await fetch("http://localhost:5000/user/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = await res.json();
          const token = data.token;
          if (token) {
            localStorage.setItem("token", token);
            // store expiry timestamp (2h from now)
            const expiry = Date.now() + 2 * 60 * 60 * 1000;
            localStorage.setItem("tokenExpiry", String(expiry));

            try {
              const prof = await fetch("http://localhost:5000/user/profile", {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (prof.ok) {
                const u = await prof.json();
                localStorage.setItem("user", JSON.stringify(u));
                dispatch(
                  setUser({
                    token,
                    tokenExpiry: expiry,
                    role: u.role,
                    profile: u,
                  })
                );
              }
            } catch (e) {}
            window.dispatchEvent(new Event("authChanged"));
            navigate("/profile");
            return;
          }
        } else {
          // show backend error
          let txt = "Login failed";
          try {
            const body = await res.json();
            txt = body.message || txt;
          } catch (e) {
            txt = await res.text().catch(() => txt);
          }
          setError(txt);
          toast.addToast(txt, { type: "error" });
          return;
        }
      } catch (err) {
        console.error("Login failed:", err.message || err);
        const msg = "Login failed: network or server error.";
        setError(msg + (err?.message ? ` (${err.message})` : ""));
        toast.addToast(msg, {
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    })();
  };

  // Handle Google social login
  const handleSocialLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();

      // Save the token and user info locally
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(result.user));

      window.dispatchEvent(new Event("authChanged"));

      navigate("/profile");
    } catch (error) {
      console.error("Google login failed:", error.message);
    }
  };

  //Case forget password
  const handleSendCode = async () => {
    try {
      setMessage("Sending code...");
      const resp = await fetch("/request-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      let generated = null;
      try {
        generated = await resp.json();
      } catch (e) {
        generated = await resp.text().catch(() => null);
      }

      if (generated && typeof generated === "object" && generated.code) {
        setCode(String(generated.code));
      } else if (typeof generated === "string" && generated.trim()) {
        setCode(generated);
      } else {
        // setup for server-side verification
      }

      setShowEmailModal(false);
      setShowCodeModal(true);
      setMessage(
        resp.ok ? "Code sent to your email!" : `Send failed (${resp.status})`
      );
    } catch (err) {
      setMessage(err?.message || String(err));
    }
  };

  // Verify the code entered by the user
  const handleVerifyCode = async () => {
    try {
      setMessage("Verifying...");
      const res = await fetch("/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // send the email + code to let the server validate
        body: JSON.stringify({ email, code }),
      });

      if (res.ok) {
        setShowCodeModal(false);
        setShowResetModal(true);
        setMessage("Code verified! You can now reset your password.");
      } else {
        const txt = await res.text().catch(() => "");
        setMessage(txt || `Verification failed (${res.status})`);
      }
    } catch (err) {
      setMessage(err?.message || String(err));
    }
  };

  // Reset the password
  const handleResetPassword = async () => {
    try {
      setMessage("Resetting password...");
      const res = await fetch("/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
      });
      setShowResetModal(false);
      if (res.ok) {
        const data = await res.json().catch(() => null);
        setMessage((data && data.message) || "Password reset successfully.");
      } else {
        const text = await res.text().catch(() => "");
        setMessage(text || `Reset failed (${res.status})`);
      }
    } catch (err) {
      setMessage(err?.message || String(err));
    }
  };


  return (
    <div className="login-container">
      <div className="login">
        <h2>Login</h2>
        <form
          onSubmit={handleLogin}
          className="login-form"
          aria-busy={loading ? "true" : "false"}
        >
          {error && (
            <div className="auth-error" role="alert" aria-live="assertive">
              {error}
            </div>
          )}
          <input
            type="text"
            id="identifier"
            name="identifier"
            className="login-username"
            value={idUser}
            onChange={(e) => setIdUser(e.target.value)}
            placeholder="Enter your email"
            autoComplete="username"
            required
          />
          <input
            type="password"
            id="password"
            name="password"
            className="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing in…" : "Login"}
          </button>
          <div
            onClick={() => {
              if (!loading) handleSocialLogin();
            }}
            className="google-login"
            role="button"
            tabIndex={0}
            aria-disabled={loading}
          >
            <GoogleIcon className="GoogleIcon" />
          </div>
          <button
            type="button"
            className="forgot-password-link"
            onClick={() => setShowEmailModal(true)}
            aria-haspopup="dialog"
           >
            Forgot Password?
          </button>
          {message && <div className="auth-message">{message}</div>}
          {showEmailModal && (
            <Modal onClose={() => setShowEmailModal(false)}>
              <h3>Reset Password</h3>
              <div className="email-modal-content">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
                <button onClick={handleSendCode}>Send Code</button>
              </div>
              {message && <div className="auth-message">{message}</div>}
            </Modal>
          )}
          {showCodeModal && (
            <Modal onClose={() => setShowCodeModal(false)}>
              <h3>Enter Verification Code</h3>
              <div className="email-modal-content">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter code"
                />
                <button onClick={handleVerifyCode}>Verify</button>
              </div>
              {message && <div className="auth-message">{message}</div>}
            </Modal>
          )}
          {showResetModal && (
            <Modal onClose={() => setShowResetModal(false)}>
              <h3>Set New Password</h3>
              <div className="email-modal-content">
                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button onClick={handleResetPassword}>Reset</button>
              </div>
              {message && <div className="auth-message">{message}</div>}
            </Modal>
          )}
          <div>
            Don't have an account?
            <Link to="/register" className="register-link">
              Register here.
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Login;
