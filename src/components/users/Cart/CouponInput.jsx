// src/components/users/Cart/CouponInput.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  applyCoupon,
  removeCoupon,
  clearCouponError,
  fetchAvailableCoupons,
  COUPON_ERROR_MESSAGES,
} from "../../../store/couponSlice";
import "./CouponInput.css";

export default function CouponInput({ apiurl, access_token }) {
  const dispatch = useDispatch();
  const {
    appliedCoupon,
    discountAmount,
    loading,
    error,
    errorMessage,
    availableCoupons,
    loadingAvailable,
  } = useSelector((s) => s.coupon);

  const { items: cartData } = useSelector((s) => s.cart);
  const cartTotal = cartData?.discounted_total_price || 0;
  const [code, setCode] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Fetch available coupons when component mounts or cart total / applied coupon changes
  useEffect(() => {
    if (access_token) {
      dispatch(fetchAvailableCoupons({ apiurl, access_token }));
    }
  }, [dispatch, apiurl, access_token, cartTotal, appliedCoupon?.code]);

  const handleApply = () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    dispatch(clearCouponError());
    dispatch(applyCoupon({ apiurl, access_token, code: trimmed }));
  };

  const handleRemove = () => {
    dispatch(removeCoupon({ apiurl, access_token }));
    setCode("");
  };

  const handleInputChange = (e) => {
    setCode(e.target.value);
    if (error) dispatch(clearCouponError());
  };

  const handleSuggestionClick = (couponCode) => {
    setCode(couponCode);
    setShowSuggestions(false);
    dispatch(clearCouponError());
    dispatch(applyCoupon({ apiurl, access_token, code: couponCode }));
  };

  const errorText =
    COUPON_ERROR_MESSAGES[error] || errorMessage || "Invalid coupon code.";

  return (
    <div className="coupon-wrapper">
      {/* ── Applied state ── */}
      {appliedCoupon ? (
        <div className="coupon-applied-banner">
          <div className="coupon-applied-left">
            <span className="coupon-tick">✓</span>
            <div className="coupon-applied-info">
              <span className="coupon-applied-code">{appliedCoupon.code}</span>
              <span className="coupon-applied-savings">
                You save ₹{discountAmount.toFixed(0)}
              </span>
            </div>
          </div>
          <button
            id="remove-coupon-btn"
            className="coupon-remove-btn"
            onClick={handleRemove}
            disabled={loading}
          >
            {loading ? "..." : "Remove"}
          </button>
        </div>
      ) : (
        /* ── Input state ── */
        <div className="coupon-input-section">
          <div className="coupon-input-row">
            <div className="coupon-input-wrapper">
              <span className="coupon-icon">🏷️</span>
              <input
                id="coupon-code-input"
                type="text"
                className={`coupon-input ${error ? "coupon-input--error" : ""}`}
                placeholder="Enter coupon code"
                value={code}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === "Enter" && handleApply()}
                autoComplete="off"
                spellCheck="false"
              />
            </div>
            <button
              id="apply-coupon-btn"
              className="coupon-apply-btn"
              onClick={handleApply}
              disabled={loading || !code.trim()}
            >
              {loading ? (
                <span className="coupon-spinner" />
              ) : (
                "Apply"
              )}
            </button>
          </div>

          {/* Error message */}
          {error && (
            <p className="coupon-error-msg">
              <span className="coupon-error-icon">⚠️</span> {errorText}
            </p>
          )}
        </div>
      )}

      {/* Available coupons suggestions */}
      {availableCoupons.length > 0 && (
        <div className="coupon-suggestions">
          <button
            className="coupon-suggestions-toggle"
            onClick={() => setShowSuggestions((v) => !v)}
          >
            <span className="coupon-title-text">Available Coupons</span>
            <span className="coupon-count-badge">
              {availableCoupons.length}
            </span>
            <span className="coupon-arrow-icon">{showSuggestions ? "▲" : "▼"}</span>
          </button>

          {showSuggestions && (
            <ul className="coupon-suggestions-list">
              {availableCoupons.map((c) => {
                const isCurrentlyApplied = appliedCoupon?.code === c.code;
                return (
                  <li key={c.code} className="coupon-suggestion-item">
                    <div className="coupon-suggestion-info">
                      <span className="coupon-suggestion-code">{c.code}</span>
                      <span className="coupon-suggestion-desc">
                        {c.description || c.name}
                      </span>
                      <span className="coupon-suggestion-savings">
                        Save ₹{parseFloat(c.discount_amount).toFixed(0)}
                      </span>
                    </div>
                    {isCurrentlyApplied ? (
                      <span className="coupon-suggestion-applied-label">
                        Applied
                      </span>
                    ) : (
                      <button
                        className="coupon-suggestion-apply-btn"
                        onClick={() => handleSuggestionClick(c.code)}
                        disabled={loading}
                      >
                        Apply
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
