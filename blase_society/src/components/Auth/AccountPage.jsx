import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, gql } from "@apollo/client";
import { getCountryCode } from '../../utils/countryCode';
import { motion, AnimatePresence } from "framer-motion";
import "./AccountPage.css";

// Query to get customer details including addresses
const GET_CUSTOMER_DETAILS = gql`
  query getCustomerDetails($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
      defaultAddress {
        id
        address1
        city
        country
        province
        zip
        phone
      }
      addresses(first: 5) {
        edges {
          node {
            id
            address1
            city
            country
            province
            zip
            phone
          }
        }
      }
    }
  }
`;

// Mutation to create a new address
const CREATE_CUSTOMER_ADDRESS = gql`
  mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
    customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
      customerAddress {
        id
        address1
        city
        country
        province
        zip
        phone
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

// Mutation to update an existing address
const UPDATE_CUSTOMER_ADDRESS = gql`
  mutation customerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
    customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
      customerAddress {
        id
        address1
        city
        country
        province
        zip
        phone
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

// Mutation to set default address
const SET_DEFAULT_ADDRESS = gql`
  mutation customerDefaultAddressUpdate($customerAccessToken: String!, $addressId: ID!) {
    customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {
      customer {
        id
        defaultAddress {
          id
        }
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const AccountPage = () => {
  const { customer: authCustomer, logout, accessToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const checkoutPending = location.state?.checkoutPending;
  const message = location.state?.message;

  // State for form and UI
  const [address, setAddress] = useState({
    address1: '',
    city: '',
    country: '',
    province: '',
    zip: '',
    phone: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  // Query customer details
  const { data: customerData, loading: customerLoading, refetch: refetchCustomer } = useQuery(GET_CUSTOMER_DETAILS, {
    variables: { customerAccessToken: accessToken },
    skip: !accessToken,
  });

  // Mutations
  const [createAddress] = useMutation(CREATE_CUSTOMER_ADDRESS);
  const [updateAddress] = useMutation(UPDATE_CUSTOMER_ADDRESS);
  const [setDefaultAddress] = useMutation(SET_DEFAULT_ADDRESS);

  // Load existing address into form when editing
  useEffect(() => {
    if (customerData?.customer?.defaultAddress && isEditing) {
      const defaultAddress = customerData.customer.defaultAddress;
      setAddress({
        address1: defaultAddress.address1 || '',
        city: defaultAddress.city || '',
        country: defaultAddress.country || '',
        province: defaultAddress.province || '',
        zip: defaultAddress.zip || '',
        phone: defaultAddress.phone || ''
      });
    }
  }, [customerData, isEditing]);

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (customerData?.customer?.defaultAddress) {
        // Update existing address
        const { data } = await updateAddress({
          variables: {
            customerAccessToken: accessToken,
            address: {
              address1: address.address1,
              city: address.city,
              country: address.country,
              province: address.province,
              zip: address.zip,
              phone: address.phone
            }
          }
        });

        if (data.customerAddressUpdate.customerUserErrors.length > 0) {
          setError(data.customerAddressUpdate.customerUserErrors[0].message);
          return;
        }
      } else {
        // Create new address
        const { data } = await createAddress({
          variables: {
            customerAccessToken: accessToken,
            address: address
          }
        });

        if (data.customerAddressCreate.customerUserErrors.length > 0) {
          setError(data.customerAddressCreate.customerUserErrors[0].message);
          return;
        }

        // Set as default address if it's the first one
        if (data.customerAddressCreate.customerAddress) {
          await setDefaultAddress({
            variables: {
              customerAccessToken: accessToken,
              addressId: data.customerAddressCreate.customerAddress.id
            }
          });
        }
      }

      // Refetch customer data to update the UI
      await refetchCustomer();
      setSuccess('Address updated successfully!');
      setIsEditing(false);

      if (checkoutPending) {
        navigate('/checkout');
      }
    } catch (error) {
      console.error("Error updating address:", error);
      setError('Failed to update address. Please try again.');
    }
  };

  if (!authCustomer) {
    return <p className="my-20 text-center text-lg">Please log in to view your account.</p>;
  }

  if (customerLoading) {
    return <div className="my-20 text-center">Loading...</div>;
  }

  const customer = customerData?.customer;

  const tabs = {
    profile: {
      icon: "👤",
      title: "Profile"
    },
    orders: {
      icon: "📦",
      title: "Orders"
    },
    addresses: {
      icon: "📍",
      title: "Addresses"
    },
    settings: {
      icon: "⚙️",
      title: "Settings"
    }
  };

  const TabContent = ({ tab }) => {
    switch(tab) {
      case 'profile':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="tab-content profile-content"
          >
            <div className="profile-header">
              <div className="profile-avatar">
                {customer.firstName?.[0]}{customer.lastName?.[0]}
              </div>
              <h2>{customer.firstName} {customer.lastName}</h2>
              <p>{customer.email}</p>
            </div>
            
            <div className="profile-stats">
              <div className="stat-card">
                <h3>Orders</h3>
                <p>{customer.orders?.edges?.length || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Addresses</h3>
                <p>{customer.addresses?.edges?.length || 0}</p>
              </div>
            </div>
          </motion.div>
        );

      case 'orders':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="tab-content orders-content"
          >
            {customer.orders?.edges?.length > 0 ? (
              <div className="orders-grid">
                {customer.orders.edges.map(({ node: order }) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <span>Order #{order.orderNumber}</span>
                      <span className="order-date">
                        {new Date(order.processedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="order-items">
                      {order.lineItems.edges.map(({ node: item }) => (
                        <div key={item.id} className="order-item">
                          {item.variant?.image && (
                            <img 
                              src={item.variant.image.src} 
                              alt={item.variant.image.altText} 
                            />
                          )}
                          <div className="item-details">
                            <p>{item.title}</p>
                            <span>Qty: {item.quantity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="order-footer">
                      <span className="order-total">
                        Total: ${order.totalPrice.amount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>No orders yet</h3>
                <p>Your order history will appear here</p>
              </div>
            )}
          </motion.div>
        );

      case 'addresses':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="tab-content addresses-content"
          >
            <div className="addresses-header">
              <h2>Your Addresses</h2>
              <motion.button
                className="add-address-btn"
                onClick={() => setIsEditing(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add New Address
              </motion.button>
            </div>

            {isEditing && (
              <motion.div 
                className="address-form-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <form onSubmit={handleAddressSubmit} className="address-form">
                  <div className="form-grid">
                    <div className="input-group">
                      <label>Street Address</label>
                      <input
                        type="text"
                        name="address1"
                        value={address.address1}
                        onChange={(e) => setAddress({...address, address1: e.target.value})}
                        required
                      />
                    </div>
                    <div className="input-group">
                      <label>City</label>
                      <input
                        type="text"
                        name="city"
                        value={address.city}
                        onChange={(e) => setAddress({...address, city: e.target.value})}
                        required
                      />
                    </div>
                    <div className="input-group">
                      <label>Province/State</label>
                      <input
                        type="text"
                        name="province"
                        value={address.province}
                        onChange={(e) => setAddress({...address, province: e.target.value})}
                        required
                      />
                    </div>
                    <div className="input-group">
                      <label>Postal/ZIP Code</label>
                      <input
                        type="text"
                        name="zip"
                        value={address.zip}
                        onChange={(e) => setAddress({...address, zip: e.target.value})}
                        required
                      />
                    </div>
                    <div className="input-group">
                      <label>Country</label>
                      <input
                        type="text"
                        name="country"
                        value={address.country}
                        onChange={(e) => setAddress({...address, country: e.target.value})}
                        required
                      />
                    </div>
                    <div className="input-group">
                      <label>Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={address.phone}
                        onChange={(e) => setAddress({...address, phone: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-actions">
                    <motion.button
                      type="submit"
                      className="save-address-btn"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Save Address
                    </motion.button>
                    <motion.button
                      type="button"
                      className="cancel-btn"
                      onClick={() => setIsEditing(false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}

            <div className="addresses-grid">
              {customer.addresses?.edges.map(({ node: addr }) => (
                <motion.div
                  key={addr.id}
                  className="address-card"
                  whileHover={{ y: -5 }}
                >
                  <div className="address-content">
                    <p>{addr.address1}</p>
                    <p>{addr.city}, {addr.province} {addr.zip}</p>
                    <p>{addr.country}</p>
                    <p>{addr.phone}</p>
                  </div>
                  <div className="address-actions">
                    <motion.button
                      onClick={() => handleEditAddress(addr)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      onClick={() => handleSetDefaultAddress(addr.id)}
                      className={addr.id === customer.defaultAddress?.id ? 'default' : ''}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {addr.id === customer.defaultAddress?.id ? 'Default' : 'Set as Default'}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      // ... Continue with other tabs
    }
  };

  return (
    <div className="account-container">
      <motion.div 
        className="account-sidebar"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="sidebar-header">
          <img src="/logobig.avif" alt="Logo" className="account-logo" />
        </div>
        
        <nav className="sidebar-nav">
          {Object.entries(tabs).map(([key, { icon, title }]) => (
            <motion.button
              key={key}
              className={`nav-item ${activeTab === key ? 'active' : ''}`}
              onClick={() => setActiveTab(key)}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="nav-icon">{icon}</span>
              {title}
            </motion.button>
          ))}
        </nav>

        <motion.button
          className="logout-button"
          onClick={logout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Logout
        </motion.button>
      </motion.div>

      <div className="account-content">
        <AnimatePresence mode="wait">
          <TabContent tab={activeTab} />
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AccountPage;
