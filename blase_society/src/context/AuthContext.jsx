import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';

export const AuthContext = createContext(null);

// GraphQL Queries and Mutations
const CUSTOMER_ACCESS_TOKEN_CREATE = gql`
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_QUERY = gql`
  query getCustomer($customerAccessToken: String!) {
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
      orders(first: 5) {
        edges {
          node {
            id
            orderNumber
            processedAt
            totalPrice {
              amount
              currencyCode
            }
            lineItems(first: 5) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    image {
                      src
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('customerAccessToken'));
  const [customer, setCustomer] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Login mutation
  const [loginMutation] = useMutation(CUSTOMER_ACCESS_TOKEN_CREATE);

  // Customer query
  const { data: customerData, refetch: refetchCustomer } = useQuery(CUSTOMER_QUERY, {
    variables: { customerAccessToken: accessToken || '' },
    skip: !accessToken,
  });

  // Update customer data when query results change
  useEffect(() => {
    if (customerData?.customer) {
      setCustomer(customerData.customer);
      setIsAuthenticated(true);
    }
  }, [customerData]);

  // Check token expiration
  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem('customerAccessToken');
      if (!token) {
        setIsAuthenticated(false);
        setCustomer(null);
        return;
      }
    };

    checkTokenExpiration();
    // Check every hour
    const interval = setInterval(checkTokenExpiration, 3600000);
    return () => clearInterval(interval);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await loginMutation({
        variables: {
          input: {
            email,
            password,
          },
        },
      });

      const { customerAccessToken, customerUserErrors } = data.customerAccessTokenCreate;

      if (customerUserErrors.length > 0) {
        throw new Error(customerUserErrors[0].message);
      }

      if (customerAccessToken) {
        localStorage.setItem('customerAccessToken', customerAccessToken.accessToken);
        setAccessToken(customerAccessToken.accessToken);
        await refetchCustomer();
        return true;
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('customerAccessToken');
    setAccessToken(null);
    setCustomer(null);
    setIsAuthenticated(false);
  };

  const refreshCustomer = async () => {
    if (accessToken) {
      await refetchCustomer();
    }
  };

  const value = {
    accessToken,
    isAuthenticated,
    customer,
    login,
    logout,
    refreshCustomer,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
