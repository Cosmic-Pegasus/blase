import Client from "shopify-buy";

const buyclient = Client.buildClient({
  domain: "2499d0-e9.myshopify.com", // Remove the full URL, just use the domain
  storefrontAccessToken: "352164320ac49e869c945f919a199a85", // Replace with your Storefront API token
});

export default buyclient;
