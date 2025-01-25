import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { 
  REMOVE_FROM_CART, 
  GET_CART, 
  UPDATE_CART, 
  CART_CHECKOUT_URL,
  UPDATE_CART_BUYER_IDENTITY 
} from "./Cart";
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import "./CartDrawer.css";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getCountryCode } from '../../utils/countryCode';

const CartDrawer = ({ isOpen, onClose }) => {
  const { isAuthenticated, customer, accessToken } = useAuth();
  const navigate = useNavigate();
  const [removeFromCart] = useMutation(REMOVE_FROM_CART);
  const [updateCartQuantity] = useMutation(UPDATE_CART);
  const [updateCartBuyerIdentity] = useMutation(UPDATE_CART_BUYER_IDENTITY);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const cartId = localStorage.getItem("cartId");

  const { data: checkoutUrlData, refetch: refetchCheckoutUrl } = useQuery(CART_CHECKOUT_URL, {
    variables: { cartId },
    skip: !cartId
  });

  const { loading, error, data } = useQuery(GET_CART, {
    variables: { cartId },
    skip: !cartId,
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

  const handleUpdateQuantity = async (lineId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;

    try {
      await updateCartQuantity({
        variables: {
          cartId,
          lines: [{
            id: lineId,
            quantity: newQuantity
          }]
        }
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const calculateSubtotal = () => {
    if (!data?.cart?.lines?.edges) return 0;
    return data.cart.lines.edges.reduce((total, { node }) => {
      return total + (parseFloat(node.merchandise.price.amount) * node.quantity);
    }, 0).toFixed(2);
  };

  const handleCheckout = async () => {
    if (!data?.cart?.lines?.edges?.length) {
      alert("Your cart is empty");
      return;
    }

    try {
      if (!isAuthenticated) {
        onClose();
        navigate('/login', { 
          state: { 
            redirect: '/checkout',
            cartData: data
          } 
        });
        return;
      }

      if (!customer?.defaultAddress) {
        onClose();
        navigate('/account', { 
          state: { 
            checkoutPending: true,
            message: "Please add a shipping address to continue checkout"
          } 
        });
        return;
      }

      setIsProcessing(true);

      // Update cart with customer information
      await updateCartBuyerIdentity({
        variables: {
          cartId,
          buyerIdentity: {
            email: customer.email,
            phone: customer.defaultAddress.phone,
            customerAccessToken: accessToken,
            countryCode: getCountryCode(customer.defaultAddress.country),
            deliveryAddressPreferences: [{
              deliveryAddress: {
                address1: customer.defaultAddress.address1,
                address2: customer.defaultAddress.address2,
                city: customer.defaultAddress.city,
                country: customer.defaultAddress.country,
                firstName: customer.firstName,
                lastName: customer.lastName,
                phone: customer.defaultAddress.phone,
                province: customer.defaultAddress.province,
                zip: customer.defaultAddress.zip
              }
            }]
          }
        }
      });

      // Refetch checkout URL after updating buyer identity
      const { data: checkoutData } = await refetchCheckoutUrl();

      if (checkoutData?.cart?.checkoutUrl) {
        const checkoutUrl = new URL(checkoutData.cart.checkoutUrl);
        
        // Add customer token to maintain session
        checkoutUrl.searchParams.append('customer_access_token', accessToken);
        
        // Add parameters to customize checkout experience
        checkoutUrl.searchParams.append('checkout[email]', customer.email);
        checkoutUrl.searchParams.append('checkout[shipping_address][first_name]', customer.firstName);
        checkoutUrl.searchParams.append('checkout[shipping_address][last_name]', customer.lastName);
        checkoutUrl.searchParams.append('checkout[shipping_address][address1]', customer.defaultAddress.address1);
        checkoutUrl.searchParams.append('checkout[shipping_address][city]', customer.defaultAddress.city);
        checkoutUrl.searchParams.append('checkout[shipping_address][province]', customer.defaultAddress.province);
        checkoutUrl.searchParams.append('checkout[shipping_address][country]', customer.defaultAddress.country);
        checkoutUrl.searchParams.append('checkout[shipping_address][zip]', customer.defaultAddress.zip);
        checkoutUrl.searchParams.append('checkout[shipping_address][phone]', customer.defaultAddress.phone);
        
        // Add parameters to customize checkout appearance
        checkoutUrl.searchParams.append('checkout_page_type', 'direct');
        checkoutUrl.searchParams.append('skip_shopping_cart', 'true');
        checkoutUrl.searchParams.append('skip_sidebar', 'true');

        // Add authentication parameters
        checkoutUrl.searchParams.append('logged_in', 'true');
        checkoutUrl.searchParams.append('customer_id', customer.id);

        // Redirect to the modified checkout URL
        window.location.href = checkoutUrl.toString();
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error("Error starting checkout:", error);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Close cart when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className={`cart-backdrop ${isOpen ? 'open' : ''}`}
      onClick={handleBackdropClick}
    >
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-content">
          <div className="cart-header">
            <h2>Cart ({data?.cart?.lines?.edges?.length || 0} items)</h2>
            <button onClick={onClose} className="close-button">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {loading && <p className="cart-message">Loading cart...</p>}
          {error && <p className="cart-message">Error loading cart!</p>}
          {!loading && !error && (!data?.cart?.lines?.edges?.length) && (
            <div className="empty-cart">
             
              <p className="cart-message">Your cart is empty</p>
            </div>
          )}

          <div className="cart-items">
            {data?.cart?.lines?.edges?.map(({ node }) => (
              <div key={node.id} className="cart-item">
                <div className="item-image">
                  <img 
                    src={node.merchandise.product.images.edges[0]?.node.url}
                    alt={node.merchandise.product.title}
                  />
                </div>
                <div className="item-details">
                  <h3>{node.merchandise.product.title}</h3>
                  <div className="item-options">
                    {node.merchandise.selectedOptions?.map((option) => (
                      <p key={option.name}>
                        {option.name}: {option.value}
                      </p>
                    ))}
                  </div>
                  <div className="item-controls">
                    <div className="quantity-controls">
                      <span>qty:</span>
                      <button 
                        className="qty-btn"
                        onClick={() => handleUpdateQuantity(node.id, node.quantity, -1)}
                      >
                        -
                      </button>
                      <span>{node.quantity}</span>
                      <button 
                        className="qty-btn"
                        onClick={() => handleUpdateQuantity(node.id, node.quantity, 1)}
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => handleRemoveFromCart(node.id)}
                      className="remove-button"
                    >
                      <TrashIcon className="h-4 w-4" />
                      remove
                    </button>
                  </div>
                  <p className="item-price">
                    $ {(parseFloat(node.merchandise.price.amount) * node.quantity).toFixed(2)} USD
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-footer">
            <div className="discount-code">
              <input type="text" placeholder="Discount code" />
              <button className="apply-button">APPLY</button>
            </div>
            
            <div className="cart-summary">
              <div className="subtotal">
                <span>SUBTOTAL</span>
                <span>$ {calculateSubtotal()} USD</span>
              </div>
              <p className="shipping-note">Taxes and shipping calculated at checkout</p>
              <button 
                className="checkout-button"
                onClick={handleCheckout}
              >
                {isProcessing ? "Processing..." : 
                 !isAuthenticated ? "LOGIN TO CHECKOUT" :
                 !customer?.defaultAddress ? "ADD SHIPPING ADDRESS" :
                 "PROCEED TO CHECKOUT"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer; 