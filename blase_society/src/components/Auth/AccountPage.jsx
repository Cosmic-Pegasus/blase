import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, gql } from "@apollo/client";
import { getCountryCode } from '../../utils/countryCode';

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

  return (
    <div className="my-20 px-4 md:px-8 max-w-7xl mx-auto">
      {message && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <p className="text-blue-700">{message}</p>
        </div>
      )}

      {/* Account Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {customer.firstName || "Guest"}!
          </h1>
          <p className="text-gray-600">{customer.email}</p>
        </div>
        <button 
          onClick={logout}
          className="px-6 py-2 text-red-600 border border-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all duration-300"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Current Address */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Current Shipping Address</h2>
          {customer.defaultAddress ? (
            <div className="space-y-2">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-900">{customer.firstName} {customer.lastName}</p>
                <p className="text-gray-600">{customer.defaultAddress.address1}</p>
                <p className="text-gray-600">
                  {customer.defaultAddress.city}, {customer.defaultAddress.province}
                </p>
                <p className="text-gray-600">
                  {customer.defaultAddress.zip}, {customer.defaultAddress.country}
                </p>
                <p className="text-gray-600 mt-2">{customer.defaultAddress.phone}</p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg text-gray-500">
              No shipping address added yet. Please add one using the form.
            </div>
          )}
        </div>

        {/* Right Column - Address Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {customer?.defaultAddress ? 'Shipping Address' : 'Add Shipping Address'}
            </h2>
            {customer?.defaultAddress && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-indigo-600 hover:text-indigo-800"
              >
                Edit Address
              </button>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          <form onSubmit={handleAddressSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Street Address"
              value={address.address1}
              onChange={(e) => setAddress({...address, address1: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="City"
                value={address.city}
                onChange={(e) => setAddress({...address, city: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                placeholder="Province/State"
                value={address.province}
                onChange={(e) => setAddress({...address, province: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Postal/ZIP Code"
                value={address.zip}
                onChange={(e) => setAddress({...address, zip: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                placeholder="Country"
                value={address.country}
                onChange={(e) => setAddress({...address, country: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            <input
              type="tel"
              placeholder="Phone Number"
              value={address.phone}
              onChange={(e) => setAddress({...address, phone: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
            >
              {customer.defaultAddress ? 'Update Address' : 'Add Address'}
            </button>
          </form>
        </div>
      </div>

      {/* Orders Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
        <h2 className="text-xl font-semibold mb-6">Order History</h2>
        {customer.orders?.edges?.length > 0 ? (
          <div className="space-y-4">
            {customer.orders.edges.map(({ node: order }) => (
              <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <p className="font-medium">Order #{order.orderNumber}</p>
                  <p className="text-gray-600">{new Date(order.processedAt).toLocaleDateString()}</p>
                </div>
                <p className="text-indigo-600 font-medium">${order.totalPrice.amount}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No orders yet.</p>
        )}
      </div>
    </div>
  );
};

export default AccountPage;
