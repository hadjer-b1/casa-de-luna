import React from "react";
import "../styles/profile.css";
import { useState, useEffect } from "react";

export default function PaymentCard({
  number = "",
  name = "",
  expiry = "",
  cvc = "",
  brand = "",
  last4 = "",
  email = "",
  selectedPaymentMethod = "",
}) {
  const formatNumber = (num) => {
    if (!num) return "•••• •••• •••• ••••";
    const digits = String(num).replace(/\D/g, "");
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (e) => {
    if (!e) return "MM/YY";
    return String(e);
  };

  const displayName = name || "CARDHOLDER";
  const [PayPalMethod, setPayPalMethod] = useState(false);
  useEffect(() => {
    if (selectedPaymentMethod === "paypal") {
      setPayPalMethod(true);
    }
  }, [selectedPaymentMethod]);

  return (
    <div
      className={`payment-card-visual ${PayPalMethod ? "paypal-card" : ""}`}
      aria-hidden="true"
    >
      <div className="payment-card-chip" />
      {PayPalMethod ? (
        <div className="payment-card-paypal">
          <div className="payment-card-email">{displayName.toUpperCase()}</div>
        </div>
      ) : (
        <>
          <div className="payment-card-number">{formatNumber(number)}</div>
          <div className="payment-card-row">
            <div className="payment-card-name">{displayName.toUpperCase()}</div>
            <div className="payment-card-expiry">{formatExpiry(expiry)}</div>
          </div>
        </>
      )}
    </div>
  );
}
