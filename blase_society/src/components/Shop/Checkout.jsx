import React from "react";
import { useCart } from "./CartContext";
import Navbar from "../Navbar";
import Footer from "../Footer";
import '../CSS/Checkout.css'

const Checkout = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();

  if (!cart) {
    return <></>;
  }

  const cartTotal = cart.reduce((total, item) => total + (item.price ?? 0) * (item.quantity ?? 0), 0);

  return (
    <>
      <Navbar />
      <div className="checkout-container">
        <h1>Checkout</h1>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item, index) => (
                <div key={index} className="cart-item">
                  <img src={item?.image1 ?? ""} alt={item?.name ?? ""} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h4>{item?.name ?? ""}</h4>
                    <p>Size: {item?.size ?? ""}</p>
                    <p>${(item?.price ?? 0).toFixed(2)}</p>
                    <div className="quantity-changer">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item?.id ?? "",
                            item?.size ?? "",
                            (item?.quantity ?? 0) - 1
                          )
                        }
                      >
                        -
                      </button>
                      <span>{item?.quantity ?? 0}</span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item?.id ?? "",
                            item?.size ?? "",
                            (item?.quantity ?? 0) + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item?.id ?? "", item?.size ?? "")}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <h3>Total: ${(cartTotal ?? 0).toFixed(2)}</h3>
            <form className="checkout-form">
              <h2>Delivery Information</h2>
              <input type="text" placeholder="Full Name" required />
              <input type="text" placeholder="Address" required />
              <input type="text" placeholder="City" required />
              <input type="text" placeholder="State" required />
              <input type="text" placeholder="Zip Code" required />
              <input type="text" placeholder="Phone Number" required />
              <button type="submit">Place Order</button>
            </form>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Checkout;

