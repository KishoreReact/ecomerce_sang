import React, { useState, useEffect } from "react";
import "./Checkout.css";
import CONFIG from "../../config";
import { getCustomerAddress, getCustomerOverdue } from "../../redux/services/productService";
import { showError } from "../../utils/alert";

const Checkout = ({ details = [], onPlaceOrder, goToCart }) => {
  // ✅ Items from transaction details
  const items = details.flatMap(d => d.Header || []);

  // ✅ Totals
  const subtotal = items.reduce((sum, item) => sum + (item.TotalRate || 0), 0);
  const vat = subtotal * 0.05;
  const total = subtotal + vat;
  const isBelowMinimum = total < CONFIG.MIN_ORDER_AMOUNT;

  // ✅ Billing info state
  const [billingInfo, setBillingInfo] = useState({
    firstName: "",
    lastName: "",
    company: "",
    country: "United Arab Emirates",
    address1: "",
    address2: "",
    city: "",
    state: "",
    phone: "",
    email: "",
    notes: "",
    customer: 0,
    payTerms: 1,
  });
  const [showCreditInputs, setShowCreditInputs] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('cash');
  const [isCreditTermsValid, setIsCreditTermsValid] = useState(true);


  // Fetch customer address on mount
  useEffect(() => {
    const customerId = details[0]?.Header[0].Customer
    
    const fetchCustomerAddress = async () => {
      try {
        const res = await getCustomerAddress(customerId);
        const parsedResult = JSON.parse(res.result);
        if (parsedResult && parsedResult.length > 0) {
          const address = parsedResult[0];
          setBillingInfo(prev => ({
            ...prev,
            firstName: address.Name || "",
            lastName: "",
            company: address.Name || "",
            address1: address.BillingAddress || "",
            address2: address.DeliveryAddress || "",
            city: address.BillingCity || "",
            state: "",
            phone: address.BillTelNo || "",
            email: address.Email || "",
            customer: address.Id || 0,
          }));
        }
      } catch (error) {
        console.error("Error fetching customer address:", error);
      }
    };

    fetchCustomerAddress();
  }, []);
  // ✅ Update billing info on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Handle place order with billing info
  const handlePlace = () => {
    const updatedBillingInfo = {
      ...billingInfo,
      payTerms: selectedPayment === 'cash' ? 1 : 2,
    };
    onPlaceOrder(updatedBillingInfo);
  };

  return (
    <div className="checkout-container">
      {isBelowMinimum && (
        <div className="min-order-warning">
          Your current order total is <strong>{total.toFixed(2)} AED</strong> — 
          you must have an order with a minimum of <strong>{CONFIG.MIN_ORDER_AMOUNT}.00 AED</strong> to place your order
        </div>
      )}

      <div className="coupon-banner">Have a coupon?</div>

      <div className="checkout-content">
        {/* Billing Section */}
        <div className="billing-section">
          <h2>BILLING DETAILS</h2>

          <div className="form-row">
            <div className="form-group">
              <label>First name <span className="required">*</span></label>
              <input name="firstName" value={billingInfo.firstName} onChange={handleChange} readOnly />
            </div>
            <div className="form-group">
              <label>Last name <span className="required">*</span></label>
              <input name="lastName" value={billingInfo.lastName} onChange={handleChange} readOnly />
            </div>
          </div>

          <div className="form-group">
            <label>Company name (optional)</label>
            <input name="company" value={billingInfo.company} onChange={handleChange} readOnly />
          </div>

          <div className="form-group">
            <label>Country / Region <span className="required">*</span></label>
            <div className="select-wrapper">
              <select name="country" value={billingInfo.country} onChange={handleChange} disabled>
                <option>United Arab Emirates</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Street address <span className="required">*</span></label>
            <input name="address1" value={billingInfo.address1} onChange={handleChange} readOnly />
            <input name="address2" value={billingInfo.address2} onChange={handleChange} className="address-line-2" readOnly />
          </div>

          <div className="form-group">
            <label>Town / City <span className="required">*</span></label>
            <input name="city" value={billingInfo.city} onChange={handleChange} readOnly />
          </div>

          <div className="form-group">
            <label>State / County (optional)</label>
            <input name="state" value={billingInfo.state} onChange={handleChange} readOnly />
          </div>

          <div className="form-group">
            <label>Phone <span className="required">*</span></label>
            <input name="phone" value={billingInfo.phone} onChange={handleChange} readOnly />
          </div>

          <div className="form-group">
            <label>Email address <span className="required">*</span></label>
            <input name="email" value={billingInfo.email} onChange={handleChange} readOnly />
          </div>

          {/* <div className="checkbox-group">
            <input type="checkbox" id="different-address" />
            <label htmlFor="different-address">Ship to a different address?</label>
          </div> */}

          <div className="form-group">
            <label>Order notes (optional)</label>
            <textarea name="notes" value={billingInfo.notes} onChange={handleChange} placeholder="Notes about your order, e.g. special notes for delivery." />
          </div>
        </div>

        {/* Order Section */}
        <div className="order-section">
          <h2>YOUR ORDER</h2>

          <div className="order-header">
            <span>PRODUCT</span>
            <span>SUBTOTAL</span>
          </div>

          {items.map((item, idx) => (
            <div key={idx} className="order-item">
              <div className="product-info">
                {item.Product_Name}
                <span className="quantity">× {item.Quantity}</span>
              </div>
              <div className="price">
                {(item.TotalRate || 0).toFixed(2)} AED
              </div>
            </div>
          ))}

          <div className="order-row subtotal">
            <span>Subtotal</span>
            <span className="price-red">{subtotal.toFixed(2)} AED</span>
          </div>

          <div className="order-row">
            <span>Shipping</span>
            <span>Free shipping</span>
          </div>

          <div className="order-row">
            <span>VAT (5%)</span>
            <span className="price-red">{vat.toFixed(2)} AED</span>
          </div>

          <div className="order-row total">
            <span>Total</span>
            <span className="price-red total-price">{total.toFixed(2)} AED</span>
          </div>

          {/* Payment Methods */}
          <div className="payment-methods">
            <div className="payment-option">
              <input type="radio" id="ccavenue" name="payment" />
              <label htmlFor="ccavenue">CCAvenue</label>
            </div>

            <div className="payment-option selected">
              <input type="radio" id="cash-delivery" name="payment" defaultChecked onChange={() => { setSelectedPayment('cash'); setIsCreditTermsValid(true); }} />
              <label htmlFor="cash-delivery">Cash on delivery</label>
            </div>

            <div className="payment-description">Pay with cash upon delivery.</div>

            <div className="payment-option">
              <input
                type="radio"
                id="credit-terms"
                name="payment"
                onChange={async () => {
                  setSelectedPayment('credit');
                  setShowCreditInputs(false);

                  try {
                    const response = await getCustomerOverdue();
                    const parsedData = JSON.parse(response.result);

                    if (parsedData.status === "Failure") {
                      setIsCreditTermsValid(false);
                    } else {
                      setIsCreditTermsValid(true);
                    }
                  } catch (error) {
                    console.error("Error checking customer overdue:", error);
                    setIsCreditTermsValid(false);
                  }
                }}
              />
              <label htmlFor="credit-terms">Agreed Credit Terms</label>
            </div>

            {/* Credit terms inputs */}
            {showCreditInputs && (
              <div className="credit-inputs">
                <input
                  type="text"
                  name="notes"
                  placeholder="Username"
                  value={""}
                  onChange={handleChange}
                  className="credit-field"
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={billingInfo.phone}
                  onChange={handleChange}
                  className="credit-field"
                />
              </div>
            )}
          </div>

          <div className="privacy-notice">
            Your personal data will be used to process your order, support your
            experience throughout this website, and for other purposes described
            in our <a href="#" className="privacy-link">privacy policy</a>.
          </div>

          <button
            className="place-order-btn"
            onClick={handlePlace}
            disabled={isBelowMinimum || !isCreditTermsValid}
            style={{
              opacity: (isBelowMinimum || !isCreditTermsValid) ? 0.6 : 1,
              cursor: (isBelowMinimum || !isCreditTermsValid) ? "not-allowed" : "pointer"
            }}
          >
            PLACE ORDER
          </button>

          <button
            className="place-order-btn"
            style={{ marginTop: "10px", background: "#999" }}
            onClick={goToCart}
          >
            BACK TO CART
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
