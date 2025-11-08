import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearBasket,
  removeDish,
  updateQuantity,
} from "../redux/Slices/SendToBasket";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";
import PaymentCard from "../components/PaymentCard";
import PaymentInput from "../components/PaymentInput";
import {
  formatCreditCardNumber,
  formatExpirationDate,
  formatCVC,
  validateExpiry,
} from "../utils/paymentUtils";
import "../styles/checkout.css";
import Modal from "../components/Modal";

export default function Checkout() {
  const basket = useSelector((s) => s.basket || { items: [], totalPrice: 0 });
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [paymentForm, setPaymentForm] = useState({
    number: "",
    expiry: "",
    cvv: "",
    email: "",
    address: "",
  });
  const [processing, setProcessing] = useState(false);

  // Handle to remove item from basket
  const handleRemove = (id) => {
    dispatch(removeDish(id));
  };

  // Handle to change quantity of an item
  const handleQtyChange = (id, delta) => {
    const item = (basket.items || []).find(
      (it) => (it.dish._id || it.dish.id || it.dish.name) === id
    );
    if (!item) return;
    const next = Math.max(1, item.quantity + delta);
    dispatch(updateQuantity({ id, quantity: next }));
  };

  // Handle to open payment modal
  const handlePay = () => {
    if (!basket.items || basket.items.length === 0) {
      toast.addToast("Your basket is empty.", { type: "error" });
      return;
    }
    setPaymentModalOpen(true);
  };

  // Handle changes in payment form inputs
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm((p) => ({ ...p, [name]: value }));
  };

  // Finalize payment process
  const finalizePayment = async () => {
    if (!basket.items || basket.items.length === 0) {
      toast.addToast("Your basket is empty.", { type: "error" });
      setPaymentModalOpen(false);
      return;
    }
    if (selectedMethod === "card") {
      if (
        !paymentForm.number ||
        paymentForm.number.replace(/\D/g, "").length < 12
      ) {
        toast.addToast("Please enter a valid card number.", { type: "error" });
        return;
      }
      if (!validateExpiry(paymentForm.expiry)) {
        toast.addToast("Please enter a valid expiration date.", {
          type: "error",
        });
        return;
      }
    }

    setProcessing(true);
    try {
      // Simulate payment processing delay
      await new Promise((r) => setTimeout(r, 800));

      // In a real app we'd call backend payment endpoint here and pass selectedMethod + paymentForm
      dispatch(clearBasket());
      toast.addToast("Payment successful. Thank you!", { type: "info" });
      setPaymentModalOpen(false);
      navigate("/profile?section=history");
    } catch (err) {
      toast.addToast("Payment failed. Please try again.", { type: "error" });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      {isPaymentModalOpen && (
        <Modal onClose={() => setPaymentModalOpen(false)}>
          <div className="payment-modal">
            <h3>Payment information</h3>
            <div className="payment-method-selection">
              <div className="payment-methods">
                <div className="select-method-label">
                  <span value="card" onClick={() => setSelectedMethod("card")}>
                    Card
                  </span>
                  <span
                    value="paypal"
                    onClick={() => setSelectedMethod("paypal")}
                  >
                    PayPal
                  </span>
                  <span value="cash" onClick={() => setSelectedMethod("cash")}>
                    Cash on Delivery
                  </span>
                </div>
                <div className="payment-method-form">
                  {selectedMethod === "card" && (
                    <>
                      <div className="card-preview">
                        <PaymentCard
                          number={paymentForm.number}
                          name={"Guest"}
                          expiry={paymentForm.expiry}
                          cvc={paymentForm.cvv}
                          className="payment-card-preview"
                        />
                      </div>
                      <div className="card-inputs">
                        <PaymentInput
                          name="number"
                          value={paymentForm.number}
                          onChange={handlePaymentChange}
                          formatter={formatCreditCardNumber}
                          placeholder="Card number"
                          className="payment-input"
                        />
                        <PaymentInput
                          name="expiry"
                          value={paymentForm.expiry}
                          onChange={handlePaymentChange}
                          formatter={formatExpirationDate}
                          placeholder="MM/YY"
                          className="payment-input"
                        />{" "}
                        <PaymentInput
                          name="cvv"
                          value={paymentForm.cvv}
                          onChange={handlePaymentChange}
                          formatter={(v) => formatCVC(v)}
                          placeholder="CVV"
                          className="payment-input"
                        />
                      </div>
                    </>
                  )}

                  {selectedMethod === "paypal" && (
                    <div className="paypal-form">
                      <label>PayPal email</label>
                      <PaymentInput
                        name="email"
                        value={paymentForm.email}
                        onChange={handlePaymentChange}
                        placeholder="email@example.com"
                        className="payment-input"
                      />
                    </div>
                  )}

                  {selectedMethod === "cash" && (
                    <div className="cash-form">
                      <label>Delivery address</label>
                      <input
                        name="address"
                        value={paymentForm.address}
                        onChange={(e) => handlePaymentChange(e)}
                        placeholder="Street, city, ZIP"
                        className="payment-input"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="order-summary">
                <h4>Order Summary</h4>
                <div className="summary-lines">
                  <div className="summary-line">
                    <span>Items</span>
                    <span>
                      {basket.itemCount || (basket.items || []).length}
                    </span>
                  </div>
                  <div className="summary-line">
                    <span>Total Quantity</span>
                    <span> X {basket.totalQuantity || 0}</span>
                  </div>
                  <div className="summary-line total">
                    <span>Total</span>
                    <span>${(basket.totalPrice || 0).toFixed(2)}</span>
                  </div>
                </div>
                <div className="delivery-price summary-line">
                  <em>No delivery fee</em>
                </div>
                <div className="final-total summary-line">
                  <span>Final Total</span>
                  <span>${(basket.totalPrice || 0).toFixed(2)}</span>
                </div>
                <div className="coupon-note">
                  <input
                    className="coupon-input"
                    type="text"
                    placeholder="Coupon code"
                  />
                  <button disabled className="coupon-btn">
                    Apply
                  </button>
                </div>
                <div className="payment-actions">
                  <button
                    onClick={() => setPaymentModalOpen(false)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                  <button onClick={finalizePayment} className="pay-now-btn">
                    {processing ? "Processing..." : "Pay Now"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
      <div className="checkout-content">
        <div className="checkout-items">
          {(basket.items || []).length === 0 ? (
            <div>Your basket is empty.</div>
          ) : (
            (basket.items || []).map((it, i) => {
              const id = it.dish._id || it.dish.id || it.dish.name;
              return (
                <div key={id || i} className="checkout-item">
                  <div className="checkout-item-left">
                    <div className="checkout-item-name">{it.dish?.name}</div>
                    <div className="checkout-item-price">${it.dish?.price}</div>
                  </div>
                  <div className="checkout-item-right">
                    <div className="qty-controls">
                      <button
                        onClick={() => handleQtyChange(id, -1)}
                        className="qty-btn"
                      >
                        -
                      </button>
                      <span className="qty-display">{it.quantity}</span>
                      <button
                        onClick={() => handleQtyChange(id, +1)}
                        className="qty-btn"
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="remove-item"
                      onClick={() => handleRemove(id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          <div className="summary-line">
            <span>Items</span>
            <span>{basket.itemCount || (basket.items || []).length}</span>
          </div>
          <div className="summary-line">
            <span>Total Quantity</span>
            <span>{basket.totalQuantity || 0}</span>
          </div>
          <div className="summary-line total">
            <span>Total</span>
            <span>${(basket.totalPrice || 0).toFixed(2)}</span>
          </div>
          <button className="pay-btn" onClick={handlePay}>
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
}
