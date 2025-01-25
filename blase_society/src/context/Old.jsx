import React, { createContext, useState, useContext, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [customer, setCustomer] = useState(null); // Stores logged-in customer data
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || null); // Retrieves access token from localStorage

    useEffect(() => {
        // If an access token exists in localStorage, fetch customer data on load
        if (accessToken) {
            fetchCustomerData(accessToken);
        }
    }, [accessToken]);

    const login = async (email, password) => {
        if (!email || !password) {
            console.error("Email and password are required.");
            return;
        }

        const query = `
      mutation {
        customerAccessTokenCreate(input: { email: "${email}", password: "${password}" }) {
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

        try {
            const response = await fetch("https://2499d0-e9.myshopify.com/api/2023-01/graphql.json", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Storefront-Access-Token": "352164320ac49e869c945f919a199a85",
                },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                throw new Error("Failed to login");
            }

            const data = await response.json();
            console.log(data);
            const token = data.data?.customerAccessTokenCreate?.customerAccessToken;

            if (token) {
                setAccessToken(token.accessToken);
                localStorage.setItem('accessToken', token.accessToken); // Store the token in localStorage
                fetchCustomerData(token.accessToken); // Fetch customer data after login
            } else {
                console.error(data.data?.customerAccessTokenCreate?.userErrors);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const signup = async (email, password, firstName, lastName) => {
        if (!email || !password || !firstName || !lastName) {
            console.error("All fields are required.");
            return;
        }

        const query = `
      mutation {
        customerCreate(input: {
          email: "${email}",
          password: "${password}",
          firstName: "${firstName}",
          lastName: "${lastName}"
        }) {
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

        try {
            const response = await fetch("https://2499d0-e9.myshopify.com/api/2023-01/graphql.json", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Storefront-Access-Token": "352164320ac49e869c945f919a199a85",
                },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                throw new Error("Failed to signup");
            }

            const data = await response.json();
            console.log(data);

            if (data.data?.customerCreate?.customer) {
                // Signup successful, fetch access token for the new user
                const customerId = data.data.customerCreate.customer.id;

                // Use the customer ID to create an access token (or fetch it if necessary)
                const loginQuery = `
                    mutation {
                        customerAccessTokenCreate(input: { id: "${customerId}" }) {
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

                const loginResponse = await fetch("https://2499d0-e9.myshopify.com/api/2023-01/graphql.json", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Shopify-Storefront-Access-Token": "352164320ac49e869c945f919a199a85",
                    },
                    body: JSON.stringify({ query: loginQuery }),
                });

                const loginData = await loginResponse.json();
                const token = loginData.data?.customerAccessTokenCreate?.customerAccessToken;

                if (token) {
                    setAccessToken(token.accessToken);
                    localStorage.setItem('accessToken', token.accessToken); // Store the token in localStorage
                    fetchCustomerData(token.accessToken); // Fetch customer data after signup
                } else {
                    console.error(loginData.data?.customerAccessTokenCreate?.userErrors);
                }
            } else {
                console.error(data.data?.customerCreate?.userErrors);
            }

        } catch (error) {
            console.error(error);
        }
    };

    const fetchCustomerData = async (accessToken) => {
        if (!accessToken) {
            console.error("AccessToken is required.");
            return;
        }

        const query = `
           {
             customer(customerAccessToken: "${accessToken}") {
               firstName
               lastName
               email
               orders(first: 10) {
               edges {
                 node {
                    orderNumber
                    totalPrice {
                    amount
                    currencyCode
                    }
                    processedAt
                   }
                 }
               }
             }
           }
         `;

      


        try {
            const response = await fetch("https://2499d0-e9.myshopify.com/api/2023-01/graphql.json", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Storefront-Access-Token": "352164320ac49e869c945f919a199a85",
                },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch customer data");
            }

            const data = await response.json();
            console.log(data);
            setCustomer(data.data?.customer);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AuthContext.Provider value={{ customer, login, signup, accessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
