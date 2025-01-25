// src/graphql/client.js
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const SHOPIFY_API_URL = "https://2499d0-e9.myshopify.com/api/2023-01/graphql.json";
const SHOPIFY_ACCESS_TOKEN = "352164320ac49e869c945f919a199a85";

const client = new ApolloClient({
  link: new HttpLink({
    uri: SHOPIFY_API_URL,
    headers: {
      "X-Shopify-Storefront-Access-Token": SHOPIFY_ACCESS_TOKEN,
      "Content-Type": "application/json",
    },
  }),
  cache: new InMemoryCache(),
});

export default client;
