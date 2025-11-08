import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import store from "./redux/store";
import reportWebVitals from "./reportWebVitals";
import { ToastProvider } from "./components/Toast";
import { setBasket } from "./redux/Slices/SendToBasket";
import { setUser } from "./redux/Slices/userSlice";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();

// listen to storage events and update auth UI and basket in other tabs
window.addEventListener("storage", (e) => {
  try {
    if (!e) return;
    if (e.key === "basket") {
      const parsed = JSON.parse(e.newValue || "null");
      if (parsed) {
        store.dispatch(setBasket(parsed));
      } else {
        store.dispatch(
          setBasket({
            items: [],
            itemCount: 0,
            totalQuantity: 0,
            totalPrice: 0,
          })
        );
      }
    }

    if (e.key === "token" || e.key === "tokenExpiry" || e.key === "user") {
      window.dispatchEvent(new Event("authChanged"));
    }
  } catch (err) {
    // ignore errors
  }
});

// Sync auth state from localStorage into Redux when auth changes (or on load)
const syncAuthToStore = () => {
  try {
    const token = localStorage.getItem("token");
    const tokenExpiry =
      parseInt(localStorage.getItem("tokenExpiry") || "0", 10) || null;
    let profile = null;
    try {
      profile = JSON.parse(localStorage.getItem("user") || "null");
    } catch (e) {
      profile = null;
    }
    const role = (profile && profile.role) || null;
    window.store &&
      window.store.dispatch &&
      window.store.dispatch(setUser({ token, tokenExpiry, role, profile }));
  } catch (e) {
    // ignore
  }
};

// expose store on window for the sync helper
try {
  window.store = store;
  syncAuthToStore();
  window.addEventListener("authChanged", syncAuthToStore);
} catch (e) {}
