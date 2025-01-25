import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query {
    products(first: 20) {
      edges {
        node {
          id
          title
          images(first: 2) {
            edges {
              node {
                src
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

