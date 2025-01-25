import React, { useEffect, useState } from "react";
import { useCart } from "./CartContext";

const CartView = () => {
  const { cart, fetchCart } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      try {
        await fetchCart();
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [fetchCart]);

  if (loading) return <p>Loading cart...</p>;

  if (!cart || cart.lines.edges.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div>
      <h1>Your Cart</h1>
      <ul>
        {cart.lines.edges.map(({ node }) => (
          <li key={node.id}>
            <p>{node.merchandise.title}</p>
            <p>Quantity: {node.quantity}</p>
          </li>
        ))}
      </ul>
      <p>
        <strong>Total:</strong> {cart.estimatedCost.totalAmount.amount}{" "}
        {cart.estimatedCost.totalAmount.currencyCode}
      </p>
    </div>
  );
};

export default CartView;
