import React, { useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_CART, CART_CHECKOUT_URL, UPDATE_CART_BUYER_IDENTITY } from "./Cart";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getCountryCode } from '../../utils/countryCode';

const CheckoutPage = () => {
  const { isAuthenticated, customer, accessToken } = useAuth();
  const navigate = useNavigate();
  const cartId = localStorage.getItem("cartId");

  const { loading, data: cartData } = useQuery(GET_CART, {
    variables: { cartId },
    skip: !cartId,
  });

  const { data: checkoutUrlData, refetch: refetchCheckoutUrl } = useQuery(CART_CHECKOUT_URL, {
    variables: { cartId },
    skip: !cartId
  });

  const [updateCartBuyerIdentity] = useMutation(UPDATE_CART_BUYER_IDENTITY);

  useEffect(() => {
    const initiateCheckout = async () => {
      if (!isAuthenticated) {
        navigate('/login', { state: { redirect: '/checkout' } });
        return;
      }

      if (!customer?.defaultAddress) {
        navigate('/account', {
          state: {
            checkoutPending: true,
            message: "Please add a shipping address to continue checkout"
          }
        });
        return;
      }

      if (!cartId || !cartData?.cart?.lines?.edges?.length) {
        navigate('/cart', {
          state: { message: "Your cart is empty" }
        });
        return;
      }

      try {
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

          window.location.href = checkoutUrl.toString();
        } else {
          throw new Error('No checkout URL received');
        }
      } catch (error) {
        console.error("Checkout error:", error);
        navigate('/cart', {
          state: { error: "Failed to start checkout. Please try again." }
        });
      }
    };

    if (!loading && cartData) {
      initiateCheckout();
    }
  }, [loading, cartData, isAuthenticated, customer, cartId]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">Initiating Checkout...</h2>
        <p className="text-gray-600">Please wait while we prepare your checkout.</p>
      </div>
    </div>
  );
};

export default CheckoutPage;
