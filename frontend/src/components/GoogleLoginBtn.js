import GoogleIcon from "@mui/icons-material/Google";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../utils/firebaseConfig";

function GoogleLoginButton() {
  const handleLogin = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        console.log("User signed in:", result.user);
      })
      .catch((error) => {
        console.error("Google login error:", error);
      });
  };

  return (
    <button className="google-login-btn google-login" onClick={handleLogin}>
      <GoogleIcon />
    </button>
  );
}

export default GoogleLoginButton;
