import axios from 'axios';

const storeDomain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_API_TOKEN;

const shopifyClient = axios.create({
    baseURL: `https://${storeDomain}/api/2023-01/graphql.json`,
    headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    },
});

export const fetchShopifyData = async (query, variables = {}) => {
    try {
        const response = await shopifyClient.post('', { query, variables });
        return response.data.data;
    } catch (error) {
        console.error('Shopify API Error:', error);
        throw error;
    }
};
