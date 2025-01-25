import axios from "axios";

const SHOPIFY_API_URL = "https://2499d0-e9.myshopify.com/api/2023-01/graphql.json";
const SHOPIFY_ACCESS_TOKEN = "352164320ac49e869c945f919a199a85";

// Customer Login
export const customerLogin = async (email, password) => {
    const query = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
    const variables = { input: { email, password } };

    try {
        const response = await axios.post(
            SHOPIFY_API_URL,
            { query, variables },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Storefront-Access-Token": SHOPIFY_ACCESS_TOKEN,
                },
            }
        );
        return response.data.data.customerAccessTokenCreate;
    } catch (error) {
        console.error("Login Error:", error);
        return null;
    }
};

// Customer Signup
export const customerSignup = async (email, password, firstName, lastName) => {
    const query = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
          email
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
    const variables = { input: { email, password, firstName, lastName } };

    try {
        const response = await axios.post(
            SHOPIFY_API_URL,
            { query, variables },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Storefront-Access-Token": SHOPIFY_ACCESS_TOKEN,
                },
            }
        );
        return response.data.data.customerCreate;
    } catch (error) {
        console.error("Signup Error:", error);
        return null;
    }
};

// Fetch Customer Orders
export const fetchCustomerOrders = async (accessToken) => {
    const query = `
    query {
      customer {
        orders(first: 10) {
          edges {
            node {
              id
              name
              lineItems(first: 5) {
                edges {
                  node {
                    title
                    quantity
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

    try {
        const response = await axios.post(
            SHOPIFY_API_URL,
            { query },
            {
                headers: {
                    "X-Shopify-Storefront-Access-Token": accessToken,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data.data.customer.orders.edges;
    } catch (error) {
        console.error("Fetch Orders Error:", error);
        return null;
    }
};
