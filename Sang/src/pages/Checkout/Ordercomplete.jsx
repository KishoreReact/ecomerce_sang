import React, { useEffect, useState } from "react";
import "./Ordercomplete.css";
import { getOrderSummary } from "../../redux/services/productService"; // adjust import path

const OrderComplete = ({ orderId ,viewOrder}) => {
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getOrderSummary(orderId);
        const parsed = JSON.parse(response.result); // ✅ parse result
        setOrderData(parsed);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId]);

  if (!orderData) {
    return <p>Loading order details...</p>;
  }

  const header = orderData.Header[0];
  const items = orderData.Body;

  const subtotal = items.reduce((sum, item) => sum + item.Rate * item.Quantity, 0);
  const vat = items.reduce((sum, item) => sum + ((item.Rate * item.Quantity) * (item.Vat / 100)), 0);
  const total = subtotal + vat;

  return (
    <div className="order-complete-container">
      {/* Thank You Message */}
      {!viewOrder && (
        <>
          <div className="thank-you-box">
            <p>Thank you. Your order has been received.</p>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <div className="summary-row">
              <div className="summary-item">
                <span className="label">Order number:</span>
                <span className="value">{header.DocNo}</span>
              </div>
              <div className="summary-item">
                <span className="label">Date:</span>
                <span className="value">
                  {new Date(header.Date).toDateString()}
                </span>
              </div>
              <div className="summary-item">
                <span className="label">Email:</span>
                <span className="value">{header.Email || "N/A"}</span>
              </div>
              <div className="summary-item">
                <span className="label">Total:</span>
                <span className="value">{total.toFixed(2)} AED</span>
              </div>
              <div className="summary-item">
                <span className="label">Payment method:</span>
                <span className="value">
                  {header.PayTerms === 1 ? "Cash on delivery" : "Credit"}
                </span>
              </div>
            </div>
          </div>

          <p className="payment-note">Pay with cash upon delivery.</p>
        </>
      )}

      {/* Order Details */}
      <div className="order-details">
        <h2>ORDER DETAILS</h2>

        <div className="order-table">
          <div className="table-header">
            <div className="product-col">PRODUCT</div>
            <div className="total-col4">TOTAL</div>
          </div>

          {items.map((item, idx) => (
            <div className="table-row4" key={idx}>
              <div className="product-info">
                <div className="product-name">{item.Product_Name}</div>
                <div className="quantity">× {item.Quantity}</div>
              </div>
              <div className="price">{(item.Rate * item.Quantity).toFixed(2)} AED</div>
            </div>
          ))}

          <div className="table-row4 subtotal-row">
            <div className="product-info">
              <strong>Subtotal:</strong>
            </div>
            <div className="price">{subtotal.toFixed(2)} AED</div>
          </div>

          <div className="table-row4">
            <div className="product-info">
              <strong>Shipping:</strong>
            </div>
            <div className="price">Free shipping</div>
          </div>

          <div className="table-row4">
            <div className="product-info">
              <strong>VAT:</strong>
            </div>
            <div className="price orange">{vat.toFixed(2)} AED</div>
          </div>

          <div className="table-row4">
            <div className="product-info">
              <strong>Payment method:</strong>
            </div>
            <div className="price">{header.PayTerms == "1" ? "Cash on delivery" : "Credit"}</div>
          </div>

          <div className="table-row4 total-row">
            <div className="product-info">
              <strong>TOTAL:</strong>
            </div>
            <div className="price total-price">{total.toFixed(2)} AED</div>
          </div>
        </div>

        {/* Actions */}
        <div className="actions-section">
          <h3>ACTIONS:</h3>
          <div className="action-buttons">
            <button className="track-order-btn">TRACK ORDER</button>
            <button className="invoice-btn">INVOICE</button>
          </div>
        </div>

        {/* Note */}
        <div className="note-section">
          <p><strong>Note:</strong></p>
          <p>Click The Below To Track Your Order</p>
          <button className="track-order-main-btn">TRACK ORDER</button>
        </div>
      </div>

      {/* Addresses */}
      <div className="addresses-section">
        <div className="address-container">
          <div className="billing-address">
            <h3>BILLING ADDRESS</h3>
            <div className="address-details">
              <p>{header.Customer_Name || "N/A"}</p>
              <p>{header.DeliveryAddress || "N/A"}</p>
              <p>{header.Remarks || "N/A"}</p>
              <p>{header.MobileNo || ""}</p>
              <p>{header.Email || ""}</p>
            </div>
          </div>

          <div className="shipping-address">
            <h3>SHIPPING ADDRESS</h3>
            <div className="address-details">
              <p>{header.Customer_Name || "N/A"}</p>
              <p>{header.DeliveryAddress || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderComplete;
