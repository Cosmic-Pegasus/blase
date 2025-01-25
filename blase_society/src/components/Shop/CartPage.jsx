import React from "react";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_CART, ADD_TO_CART, REMOVE_FROM_CART, UPDATE_CART, GET_CART } from "./Cart";

const CartPage = () => {
  const [removeFromCart] = useMutation(REMOVE_FROM_CART);
  
  // Use useQuery instead of manual fetching
  const cartId = localStorage.getItem("cartId");
  const { loading, error, data } = useQuery(GET_CART, {
    variables: { cartId },
    skip: !cartId, // Skip the query if there's no cartId
  });

  const handleRemoveFromCart = async (lineId) => {
    try {
      await removeFromCart({
        variables: {
          cartId,
          lineIds: [lineId],
        },
      });
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p>Error loading cart!</p>;
  if (!cartId) return <p>Your cart is empty.</p>;

  const cart = data?.cart;

  return (
    <div>
      <h1>Your Cart</h1>

      {cart?.lines?.edges?.length ? (
        cart.lines.edges.map(({ node }) => (
          <div key={node.id}>
            <img 
              src={node.merchandise.product.images.edges[0]?.node.url} 
              alt={node.merchandise.product.title}
              style={{ width: 100 }}
            />
            <p>
              {node.merchandise.product.title}
              <br />
              Quantity: {node.quantity}
              <br />
              Price: ${node.merchandise.price.amount}
            </p>
            <button onClick={() => handleRemoveFromCart(node.id)}>Remove</button>
          </div>
        ))
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartPage;
