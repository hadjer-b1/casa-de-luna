import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useToast } from "../components/Toast";
import {
  maskCard,
  validateExpiry,
  formatCreditCardNumber,
  formatExpirationDate,
  formatCVC,
} from "../utils/paymentUtils";
import PaymentInput from "../components/PaymentInput";
import PaymentCard from "../components/PaymentCard";
import VIPModal from "../modals/VIPModal";
import VIPSymbol from "../assets/image/vip-symbol.png";
import "../styles/profile.css";

const getToken = () => localStorage.getItem("token");

const ProfilePage = () => {
  const [user, setUser] = useState({
    fullname: "",
    email: "",
    username: "",
    phone: "",
    role: "",
    address: "",
    paymentMethods: {
      credit: {
        number: "",
        expiry: "",
        cvv: "",
      },
      debit: {
        number: "",
        expiry: "",
        cvv: "",
      },
      paypal: {
        email: "",
      },
      cash: {
        address: "",
      },
    },
    favorites: [],
    history: [],
    notifications: [],
  });
  const [form, setForm] = useState({
    fullname: user.fullname,
    email: user.email,
    phone: user.phone,
    role: user.role,
    address: user.address,
  });
  const [editMode, setEditMode] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [selectedSection, setSelectedSection] = useState("personal");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [paymentForm, setPaymentForm] = useState({});
  const [savingPayment, setSavingPayment] = useState(false);
  const [isVIPModalOpen, setVIPModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");
  const [addressForm, setAddressForm] = useState({});
  const token = getToken();
  const location = useLocation();
  const toast = useToast();

  // fetch user info from backend or localStorage
  const fetchUser = async () => {
    const token = getToken();
    if (!token) {
      try {
        const stored = JSON.parse(localStorage.getItem("user") || "null");
        if (stored) {
          setUser((u) => ({
            ...u,
            fullname: stored.fullname || stored.name || "",
            email: stored.email || "",
            username: stored.username || stored.username || "",
            phone: stored.phone || "",
            favorites: stored.favorites || stored.Favorites || [],
            history: stored.history || stored.orderItems || [],
            notifications: stored.notifications || [],
            paymentMethods: stored.paymentMethods || {},
            address: stored.address || "",
            role: stored.role || "",
            vipMembership: stored.vipMembership || {},
          }));
        }
      } catch (e) {
        // ignore parse errors
      }
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/user/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        let mergedFavorites = data.favorites || [];
        try {
          const local = JSON.parse(localStorage.getItem("user") || "{}");
          if (
            (!mergedFavorites || mergedFavorites.length === 0) &&
            local.favorites
          ) {
            mergedFavorites = local.favorites;
          }
        } catch (e) {
          // ignore
        }

        setUser({
          fullname: data.fullname,
          email: data.email,
          username: data.username,
          phone: data.phone,
          favorites: mergedFavorites,
          history: data.history || [],
          notifications: data.notifications || [],
          paymentMethods: data.paymentMethods || {},
          address: data.address,
          role: data.role,
          vipMembership: data.vipMembership || {},
        });
        setForm({
          fullname: data.fullname,
          email: data.email,
          phone: data.phone,
          role: data.role,
        });
      }
    } catch (err) {
      // handle error
    }
  };

  // handle delete favorite
  const handleDeleteFavorite = async (idx) => {
    try {
      const newFavorites = user.favorites.filter((_, i) => i !== idx);
      setUser({ ...user, favorites: newFavorites });

      // Update localStorage
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      stored.favorites = newFavorites;
      localStorage.setItem("user", JSON.stringify(stored));

      // Persist to backend
      const token = localStorage.getItem("token");
      if (!token) return;

      const serverFavIds = newFavorites.map((f) => f._id || f.itemId || f);
      await fetch("http://localhost:5000/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ favorites: serverFavIds }),
      });

      toast.addToast("Favorite removed.", { type: "info" });
    } catch (err) {
      console.error("Failed to delete favorite:", err);
    }
  };

  // clear notifications
  const handleClearNotifications = async () => {
    try {
      // Clear locally
      setUser({ ...user, notifications: [] });

      // Clear in localStorage
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      stored.notifications = [];
      localStorage.setItem("user", JSON.stringify(stored));

      // Persist to backend
      const token = localStorage.getItem("token");
      if (!token) return;

      await fetch("http://localhost:5000/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notifications: [] }),
      });

      toast.addToast("Notifications cleared.", { type: "info" });
    } catch (err) {
      console.error("Failed to clear notifications:", err);
    }
  };

  // clear history
  const handleClearHistory = async () => {
    try {
      setUser({ ...user, history: [] });

      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      stored.history = [];
      localStorage.setItem("user", JSON.stringify(stored));

      const token = localStorage.getItem("token");
      if (!token) return;

      await fetch("http://localhost:5000/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ history: [] }),
      });

      toast.addToast("History cleared.", { type: "info" });
    } catch (err) {
      console.error("Failed to clear history:", err);
    }
  };

  // initial fetch and event listeners
  useEffect(() => {
    fetchUser();

    const vipHandler = () => fetchUser();
    const authHandler = () => fetchUser();
    window.addEventListener("vipJoined", vipHandler);
    window.addEventListener("authChanged", authHandler);
    return () => {
      window.removeEventListener("vipJoined", vipHandler);
      window.removeEventListener("authChanged", authHandler);
    };
  }, []);

  // prefer query param then fall back to location.state
  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search || "");
      const fromQuery = params.get("section");
      if (fromQuery) {
        setSelectedSection(fromQuery);
        const url = new URL(window.location.href);
        url.searchParams.delete("section");
        window.history.replaceState(
          {},
          document.title,
          url.pathname + url.search + url.hash
        );
        return;
      }
    } catch (e) {
      // ignore
    }
    if (location && location.state && location.state.section) {
      setSelectedSection(location.state.section);
      try {
        window.history.replaceState({}, document.title);
      } catch (e) {}
    }
  }, [location]);

  // handle profile edit
  const handleEdit = () => {
    if (!editMode) {
      setForm({
        fullname: user.fullname || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
      setEditMode(true);
      return;
    }
    setUser((prev) => ({ ...prev, ...form }));
    setEditMode(false);
  };

  // handle form change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // section selection
  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  // Select payment metho and toggle display
  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod((prev) => (prev === method ? null : method));
  };

  // payment helpers
  const startEditPayment = (method) => {
    setEditingMethod(method);
    const pm = user.paymentMethods || {};
    const current = pm[method] || {};
    setPaymentForm({ ...current });
  };

  // handle payment form change
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm((p) => ({ ...p, [name]: value }));
  };

  // save payment method
  const savePayment = async () => {
    if (!editingMethod) return;
    if (editingMethod === "credit" || editingMethod === "debit") {
      if (
        !paymentForm.number ||
        paymentForm.number.replace(/\D/g, "").length < 12
      ) {
        toast.addToast("Please enter a valid card number.", { type: "error" });
        return;
      }
      if (!validateExpiry(paymentForm.expiry || paymentForm.expirationDate)) {
        toast.addToast("Please enter a valid expiration date (MM/YY).", {
          type: "error",
        });
        return;
      }
    }
    setSavingPayment(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.addToast("You must be logged in to update payment methods.", {
          type: "error",
        });
        setSavingPayment(false);
        return;
      }

      const updatedPaymentMethods = { ...(user.paymentMethods || {}) };
      updatedPaymentMethods[editingMethod] = { ...paymentForm };

      const res = await fetch("http://localhost:5000/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentMethods: updatedPaymentMethods }),
      });

      if (res.ok) {
        const data = await res.json().catch(() => null);
        setUser((u) => ({
          ...u,
          paymentMethods: updatedPaymentMethods,
          ...data,
        }));
        toast.addToast("Payment method updated.", { type: "info" });
        setEditingMethod(null);
      } else {
        const txt = await res.text().catch(() => "Update failed");
        toast.addToast(`Update failed: ${txt}`, { type: "error" });
      }
    } catch (err) {
      toast.addToast(err?.message || "Network error", { type: "error" });
    } finally {
      setSavingPayment(false);
    }
  };
  // handlemembership
  const handleMembership = () => {
    setVIPModalOpen(true);
  };

  // handle change password
  const handleChangePassword = async () => {
    if (newPassword !== repeatNewPassword) {
      toast.addToast("Passwords do not match.", { type: "error" });
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast.addToast("Password must be at least 6 characters long.", {
        type: "error",
      });
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/user/profile/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: newPassword }),
      });
      if (res.ok) {
        toast.addToast("Password changed successfully.", { type: "info" });
        setNewPassword("");
      } else {
        const txt = await res.text().catch(() => "Update failed");
        toast.addToast(`Update failed: ${txt}`, { type: "error" });
      }
    } catch (err) {
      toast.addToast(err?.message || "Network error", { type: "error" });
    }
  };

  // handle manage addresses
  const handleManageAddresses = async () => {
    try {
      const res = await fetch("http://localhost:5000/user/profile/address", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ address: addressForm }),
      });
      if (res.ok) {
        toast.addToast("Address updated successfully.", { type: "info" });
        setAddressForm({});
        fetchUser();
      } else {
        const txt = await res.text().catch(() => "Update failed");
        toast.addToast(`Update failed: ${txt}`, { type: "error" });
      }
    } catch (err) {
      toast.addToast(err?.message || "Network error", { type: "error" });
    }
  };

  // handle payment methods
  const handlePaymentMethods = () => {
    setSelectedSection("billing");
  };

  return (
    <div className="profile-container">
      <main className="profile-main">
        <h1 className="profile-title">
          <span className="profile-title-highlight">
            {user.fullname ? `${user.fullname} ` : "User Profile"}
          </span>
           
        </h1>

        {!token && process.env.NODE_ENV !== "development" ? (
          <div className="profile-cta">
            <p>Please log in to view your profile.</p>
            <Link to="/login" className="btn-link">
              Login
            </Link>
          </div>
        ) : (
          <>
            <section className="profile-info">
              <div className="profile-header">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullname || "User"}
                    className="profile-avatar"
                  />
                ) : (
                  <div className="profile-avatar initials" aria-hidden="true">
                    {(() => {
                      const name = user.fullname || user.username || "User";
                      const parts = name.split(" ").filter(Boolean);
                      const initials =
                        parts.length === 1
                          ? parts[0].slice(0, 2)
                          : parts[0][0] + parts[1][0];
                      return initials.toUpperCase();
                    })()}
                  </div>
                )}
                <div className="profile-meta">
                  <h2>{user.username}</h2>
                  <p>{user.email}</p>
                </div>
                <div className="profile-nav">
                  <button
                    onClick={() => handleSectionChange("personal")}
                    aria-current={selectedSection === "personal"}
                    className={`profile-nav-btn ${
                      selectedSection === "personal" ? "active-info" : ""
                    }`}
                  >
                    Personal Information
                  </button>
                  <button
                    onClick={() => handleSectionChange("billing")}
                    aria-current={selectedSection === "billing"}
                    className={`profile-nav-btn ${
                      selectedSection === "billing" ? "active-pay" : ""
                    }`}
                  >
                    Billing & Payments
                  </button>
                  <button
                    onClick={() => handleSectionChange("history")}
                    aria-current={selectedSection === "history"}
                    className={`profile-nav-btn ${
                      selectedSection === "history" ? "active-history" : ""
                    }`}
                  >
                    Order History
                  </button>
                  <button
                    onClick={() => handleSectionChange("membership")}
                    aria-current={selectedSection === "membership"}
                    className={`profile-nav-btn ${
                      selectedSection === "membership" ? "active-vip" : ""
                    }`}
                  >
                    VIP Membership
                  </button>
                  <button
                    onClick={() => handleSectionChange("favorites")}
                    aria-current={selectedSection === "favorites"}
                    className={`profile-nav-btn ${
                      selectedSection === "favorites" ? "active-fav" : ""
                    }`}
                  >
                    Favorites
                  </button>
                  <button
                    onClick={() => handleSectionChange("notifications")}
                    aria-current={selectedSection === "notifications"}
                    className={`profile-nav-btn ${
                      selectedSection === "notifications"
                        ? "profile-notify"
                        : ""
                    }`}
                  >
                    Notifications
                  </button>
                  <button
                    onClick={() => handleSectionChange("settings")}
                    aria-current={selectedSection === "settings"}
                    className={`profile-nav-btn ${
                      selectedSection === "settings" ? "active-settings" : ""
                    }`}
                  >
                    Account Settings
                  </button>
                </div>
              </div>
              <div className="profile-details">
                {selectedSection === "personal" && (
                  <>
                    <h2>Personal Information</h2>
                    <p>
                      Manage your personal information and account settings.
                    </p>

                    <>
                      <div className="profile-info-items">
                        <div className="profile-info-item">
                          <strong>Username</strong>
                          <p>{user.username || "-"}</p>
                        </div>
                        <div className="profile-info-item">
                          <strong>Full Name</strong>
                          {editMode ? (
                            <input
                              name="fullname"
                              value={form.fullname || ""}
                              className="edit-input"
                              onChange={handleChange}
                            />
                          ) : (
                            <p>{user.fullname || "-"}</p>
                          )}
                        </div>
                        <div className="profile-info-item">
                          <strong>Email</strong>
                          {editMode ? (
                            <input
                              name="email"
                              value={form.email || ""}
                              className="edit-input"
                              onChange={handleChange}
                            />
                          ) : (
                            <p>{user.email || "-"}</p>
                          )}
                        </div>
                        <div className="profile-info-item">
                          <strong>Phone</strong>
                          {editMode ? (
                            <input
                              name="phone"
                              value={form.phone || ""}
                              className="edit-input"
                              onChange={handleChange}
                            />
                          ) : (
                            <p>{user.phone || "-"}</p>
                          )}
                        </div>
                        <div className="profile-info-item">
                          <strong>Role</strong>
                          {editMode ? (
                            <input
                              name="role"
                              value={form.role || ""}
                              className="edit-input"
                              onChange={handleChange}
                            />
                          ) : (
                            <p>{user.role || "-"}</p>
                          )}
                        </div>
                        <div className="profile-info-item">
                          <strong>Address</strong>
                          {editMode ? (
                            <input
                              name="address"
                              value={form.address || ""}
                              className="edit-input"
                              onChange={handleChange}
                            />
                          ) : (
                            <p>{user.address || "-"}</p>
                          )}
                        </div>
                      </div>
                      <div className="profile-info-actions">
                        <button
                          onClick={handleEdit}
                          className="edit-profile-btn"
                        >
                          {editMode ? "Save" : "Edit Info"}
                        </button>
                        {editMode && (
                          <button
                            onClick={() => setEditMode(false)}
                            className="cancel-edit-profile-btn"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </>
                  </>
                )}
                {selectedSection === "billing" && (
                  <div className="profile-billing">
                    <h2>Billing & Payments</h2>
                    <p>Manage your billing information and payment methods.</p>
                    <div className="billing-methods">
                      <div className="billing-method payment-card">
                        <span
                          onClick={() => handlePaymentMethodChange("credit")}
                        >
                          <p className="payment-method-label">
                            <img
                              src="https://cdn-icons-png.flaticon.com/128/9334/9334539.png"
                              alt="Credit Card"
                              className="payment-method-img"
                            />
                            Credit Card
                          </p>
                          <img
                            src={
                              selectedPaymentMethod === "credit"
                                ? "https://cdn-icons-png.flaticon.com/128/271/271239.png"
                                : "https://cdn-icons-png.flaticon.com/128/32/32195.png"
                            }
                            alt="arrow"
                            className="arrow-icon"
                          />
                        </span>

                        {selectedPaymentMethod === "credit" && (
                          <div className="payment-details">
                            <PaymentCard
                              number={user.paymentMethods?.credit?.number}
                              name={user.fullname || user.username}
                              expiry={
                                user.paymentMethods?.credit?.expiry ||
                                user.paymentMethods?.credit?.expirationDate
                              }
                            />
                            <div className="payment-detail">
                              <p>
                                <strong>Card Number:</strong>
                                {maskCard(user.paymentMethods?.credit?.number)}
                              </p>
                              <p>
                                <strong>Expiration Date:</strong>{" "}
                                {user.paymentMethods?.credit?.expiry ||
                                  user.paymentMethods?.credit?.expirationDate ||
                                  "-"}
                              </p>
                              {editingMethod === "credit" ? (
                                <div className="payment-edit-form">
                                  <PaymentInput
                                    name="number"
                                    value={paymentForm.number || ""}
                                    onChange={handlePaymentChange}
                                    formatter={formatCreditCardNumber}
                                    placeholder="Card number"
                                  />
                                  <PaymentInput
                                    name="expiry"
                                    value={
                                      paymentForm.expiry ||
                                      paymentForm.expirationDate ||
                                      ""
                                    }
                                    onChange={handlePaymentChange}
                                    formatter={formatExpirationDate}
                                    placeholder="MM/YY"
                                  />
                                  <PaymentInput
                                    name="cvv"
                                    value={
                                      paymentForm.cvv || paymentForm.cvc || ""
                                    }
                                    onChange={handlePaymentChange}
                                    formatter={formatCVC}
                                    placeholder="CVV"
                                  />
                                  <div className="payment-edit-actions">
                                    <button
                                      onClick={savePayment}
                                      disabled={savingPayment}
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingMethod(null)}
                                      className="cancel-btn"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => startEditPayment("credit")}
                                  className="edit-payment-btn"
                                >
                                  Edit
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="billing-method payment-card">
                        <span
                          onClick={() => handlePaymentMethodChange("debit")}
                        >
                          <p className="payment-method-label">
                            <img
                              src="https://cdn-icons-png.flaticon.com/128/311/311147.png"
                              alt="Debit Card"
                              className="payment-method-img"
                            />
                            Debit Card
                          </p>
                          <img
                            src={
                              selectedPaymentMethod === "debit"
                                ? "https://cdn-icons-png.flaticon.com/128/271/271239.png"
                                : "https://cdn-icons-png.flaticon.com/128/32/32195.png"
                            }
                            alt="arrow"
                            className="arrow-icon"
                          />
                        </span>
                        {selectedPaymentMethod === "debit" && (
                          <div className="payment-details">
                            <PaymentCard
                              number={user.paymentMethods?.debit?.number}
                              name={user.fullname || user.username}
                              expiry={
                                user.paymentMethods?.debit?.expiry ||
                                user.paymentMethods?.debit?.expirationDate
                              }
                            />
                            <div className="payment-detail">
                              <p>
                                <strong>Card Number:</strong>
                                {maskCard(user.paymentMethods?.debit?.number)}
                              </p>
                              <p>
                                <strong>Expiration Date:</strong>
                                {user.paymentMethods?.debit?.expiry ||
                                  user.paymentMethods?.debit?.expirationDate ||
                                  "-"}
                              </p>
                              {editingMethod === "debit" ? (
                                <div className="payment-edit-form">
                                  <PaymentInput
                                    name="number"
                                    value={paymentForm.number || ""}
                                    onChange={handlePaymentChange}
                                    formatter={formatCreditCardNumber}
                                    placeholder="Card number"
                                  />
                                  <PaymentInput
                                    name="expiry"
                                    value={
                                      paymentForm.expiry ||
                                      paymentForm.expirationDate ||
                                      ""
                                    }
                                    onChange={handlePaymentChange}
                                    formatter={formatExpirationDate}
                                    placeholder="MM/YY"
                                  />
                                  <PaymentInput
                                    name="cvv"
                                    value={
                                      paymentForm.cvv || paymentForm.cvc || ""
                                    }
                                    onChange={handlePaymentChange}
                                    formatter={formatCVC}
                                    placeholder="CVV"
                                  />
                                  <div className="payment-edit-actions">
                                    <button
                                      onClick={savePayment}
                                      disabled={savingPayment}
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingMethod(null)}
                                      className="cancel-btn"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => startEditPayment("debit")}
                                  className="edit-payment-btn"
                                >
                                  Edit
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="billing-method paypal-method ">
                        <span
                          onClick={() => handlePaymentMethodChange("paypal")}
                        >
                          <p className="payment-method-label">
                            <img
                              src="https://cdn-icons-png.flaticon.com/128/14881/14881340.png"
                              alt="PayPal"
                              className="payment-method-img"
                            />
                            PayPal
                          </p>
                          <img
                            src={
                              selectedPaymentMethod === "paypal"
                                ? "https://cdn-icons-png.flaticon.com/128/271/271239.png"
                                : "https://cdn-icons-png.flaticon.com/128/32/32195.png"
                            }
                            alt="arrow"
                            className="arrow-icon"
                          />
                        </span>
                        {selectedPaymentMethod === "paypal" && (
                          <div className="payment-details">
                            <PaymentCard
                              brand={user.paymentMethods?.paypal?.brand}
                              last4={user.paymentMethods?.paypal?.last4}
                              email={user.paymentMethods?.paypal?.email}
                            ></PaymentCard>
                            <div className="payment-detail">
                              <p>
                                <strong>Email:</strong>
                                {user.paymentMethods?.paypal?.email || "-"}
                              </p>
                              {editingMethod === "paypal" ? (
                                <div className="payment-edit-form">
                                  <input
                                    name="email"
                                    placeholder="PayPal email"
                                    value={paymentForm.email || ""}
                                    onChange={handlePaymentChange}
                                  />
                                  <div className="payment-edit-actions">
                                    <button
                                      onClick={savePayment}
                                      disabled={savingPayment}
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingMethod(null)}
                                      className="cancel-btn"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => startEditPayment("paypal")}
                                  className="edit-payment-btn"
                                >
                                  Edit
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="billing-method cash-on-delivery">
                        <span onClick={() => handlePaymentMethodChange("cash")}>
                          <p className="payment-method-label">
                            <img
                              src="https://cdn-icons-png.flaticon.com/128/1019/1019607.png"
                              alt="Cash on Delivery"
                              className="payment-method-img"
                            />
                            Cash on Delivery
                          </p>
                          <img
                            src={
                              selectedPaymentMethod === "cash"
                                ? "https://cdn-icons-png.flaticon.com/128/271/271239.png"
                                : "https://cdn-icons-png.flaticon.com/128/32/32195.png"
                            }
                            alt="arrow"
                            className="arrow-icon"
                          />
                        </span>
                        {selectedPaymentMethod === "cash" && (
                          <div className="payment-details">
                            <img
                              src="https://cdn-icons-png.flaticon.com/128/1057/1057485.png"
                              alt="Cash on Delivery"
                              className="payment-card-cash"
                            />
                            <div className="payment-detail">
                              <p>
                                <strong>Address:</strong>{" "}
                                {user.paymentMethods?.cash?.address || "-"}
                              </p>

                              {editingMethod === "cash" ? (
                                <div className="payment-edit-form">
                                  <input
                                    name="address"
                                    placeholder="Address"
                                    value={paymentForm.address || ""}
                                    onChange={handlePaymentChange}
                                  />
                                  <div className="payment-edit-actions">
                                    <button
                                      onClick={savePayment}
                                      disabled={savingPayment}
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingMethod(null)}
                                      className="cancel-btn"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => startEditPayment("cash")}
                                  className="edit-payment-btn"
                                >
                                  Edit
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {selectedSection === "history" && (
                  <div className="profile-history">
                    <h2>History</h2>
                    <ul className="history-list">
                      {user.history.length === 0 ? (
                        <li className="history-item empty">
                          No history available.
                        </li>
                      ) : (
                        user.history.map((item) => (
                          <li
                            key={item.id || item.type + Math.random()}
                            className="history-item"
                          >
                            {item.type}: {item.details}
                          </li>
                        ))
                      )}
                    </ul>
                    <button
                      onClick={handleClearHistory}
                      style={{ marginBottom: "1rem" }}
                    >
                      Clear History
                    </button>
                  </div>
                )}
                {selectedSection === "favorites" && (
                  <div className="profile-favorites">
                    <h2>Favorite Dishes</h2>
                    <div className="favorites-list">
                      {user.favorites.length === 0 ? (
                        <span>No favorite dishes.</span>
                      ) : (
                        user.favorites.map((fav, idx) => (
                          <div className="favorite-card" key={idx}>
                            {fav.img ? (
                              <img
                                src={fav.img}
                                alt={fav.name}
                                className="favorite-img"
                              />
                            ) : (
                              <div className="favorite-img" />
                            )}
                            <span>{fav.name}</span>
                            <button
                              onClick={() => handleDeleteFavorite(idx)}
                              className="delete-fav-btn"
                            >
                              Delete
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
                {selectedSection === "notifications" && (
                  <div className="profile-notifications">
                    <h2>Notifications</h2>
                    <ul className="notification-list">
                      {(user.notifications || []).length === 0 ? (
                        <li className="notification-item empty">
                          No notifications available.
                        </li>
                      ) : (
                        (user.notifications || []).map((item) => (
                          <li
                            key={
                              item._id || item.date || item.type + Math.random()
                            }
                            className="notification-item"
                          >
                            <div className="notification-header">
                              <strong>{item.type}</strong>
                              <span
                                className="notification-date"
                                style={{
                                  marginLeft: "8px",
                                  color: "#666",
                                }}
                              >
                                {new Date(
                                  item.date || Date.now()
                                ).toLocaleString()}
                              </span>
                            </div>
                            <div className="notification-message">
                              {item.message || item.details || ""}
                            </div>
                          </li>
                        ))
                      )}
                    </ul>
                    <button
                      onClick={handleClearNotifications}
                      style={{ marginBottom: "1rem", width: "fit-content" }}
                      className="notify-btn"
                    >
                      Clear Notifications
                    </button>
                  </div>
                )}
                {selectedSection === "membership" && (
                  <div className="profile-vip">
                    <h2>VIP Membership</h2>
                    <p>Join our VIP Membership for exclusive benefits!</p>
                    <div className="membership-benefits">
                      <img
                        src={VIPSymbol}
                        className="vip-symbol"
                        alt="vip symbol"
                      />
                      <div className="benefit-item">
                        <h3>
                          <img
                            src="https://cdn-icons-png.flaticon.com/128/14763/14763752.png"
                            alt="Exclusive Discounts"
                            className="benefit-icon"
                          />
                          Priority Service
                        </h3>
                        <p>
                          Enjoy priority service on all orders, and 100% table
                          availability.
                        </p>
                      </div>
                      <div className="benefit-item">
                        <h3>
                          <img
                            src="https://cdn-icons-png.flaticon.com/128/14763/14763752.png"
                            alt="Exclusive Discounts"
                            className="benefit-icon"
                          />
                          Exclusive Discounts
                        </h3>
                        <p>
                          Get special discounts on selected dishes and combos.
                        </p>
                      </div>
                      <div className="benefit-item">
                        <h3>
                          {" "}
                          <img
                            src="https://cdn-icons-png.flaticon.com/128/14763/14763752.png"
                            alt="Exclusive Discounts"
                            className="benefit-icon"
                          />{" "}
                          Early Access
                        </h3>
                        <p>
                          Be the first to try our new menu items and seasonal
                          specials.
                        </p>
                      </div>
                      <div className="benefit-item">
                        <h3>
                          <img
                            src="https://cdn-icons-png.flaticon.com/128/14763/14763752.png"
                            alt="Exclusive Discounts"
                            className="benefit-icon"
                          />
                          Free Delivery
                        </h3>
                        <p>Enjoy free delivery on all orders above $50.</p>
                      </div>
                    </div>
                    <button
                      className="join-membership-btn"
                      onClick={handleMembership}
                    >
                      Join VIP Membership
                    </button>
                    <VIPModal
                      isOpen={isVIPModalOpen}
                      onClose={() => setVIPModalOpen(false)}
                    />
                  </div>
                )}
                {selectedSection === "settings" && (
                  <div className="profile-settings">
                    <h2>Account Settings</h2>
                    <nav className="settings-nav">
                      <div className="settings-nav-section">
                        <h4>Change Password</h4>
                        <input
                          type="password"
                          placeholder="New Password"
                          className="settings-input"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <input
                          type="password"
                          placeholder="Repeat New Password"
                          className="settings-input"
                          value={repeatNewPassword}
                          onChange={(e) => setRepeatNewPassword(e.target.value)}
                        />
                        <button
                          className="settings-nav-btn"
                          onClick={handleChangePassword}
                        >
                          Change Password
                        </button>
                      </div>
                      <div className="settings-nav-section">
                        <h4>Manage Addresses</h4>
                        <input
                          type="text"
                          placeholder="New Address"
                          className="settings-input"
                          value={addressForm}
                          onChange={(e) => setAddressForm(e.target.value)}
                        />
                        <button
                          className="settings-nav-btn"
                          onClick={handleManageAddresses}
                        >
                          Manage Addresses
                        </button>
                      </div>
                      <div className="settings-nav-section">
                        <h4>Payment Methods</h4>

                        <button
                          className="settings-nav-btn"
                          onClick={handlePaymentMethods}
                        >
                          Payment Methods
                        </button>
                      </div>
                    </nav>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
