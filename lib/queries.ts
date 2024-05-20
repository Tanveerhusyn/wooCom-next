
import {Product, ProductsData} from '../types';
export async function fetchProducts(first: number, after?: string): Promise<ProductsData> {
  const query = `query GetProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        __typename
        ... on SimpleProduct {
          id
          name
          description
          averageRating
          catalogVisibility
          commentCount
          comments(first: 5) {
            nodes {
              content
              author {
                node {
                  name
                }
              }
              date
            }
          }
          date
          dateOnSaleFrom
          dateOnSaleTo
          featured
          featuredImage {
            node {
              sourceUrl
            }
          }
          galleryImages {
            nodes {
              sourceUrl
            }
          }
          metaData {
            key
            value
          }
          onSale
          price
          productCategories {
            nodes {
              name
            }
          }
          productTags {
            nodes {
              name
            }
          }
          related {
            nodes {
              name
            }
          }
          reviewCount
          reviews(first: 5) {
            nodes {
              content
              author {
                node {
                  name
                }
              }
              date
            }
          }
          shortDescription
          sku
          slug
          status
          title
          totalSales
          type
          upsell {
            nodes {
              name
            }
          }
        }
        ... on VariableProduct {
          id
          name
          description
          averageRating
          catalogVisibility
          commentCount
          comments(first: 5) {
            nodes {
              content
              author {
                node {
                  name
                }
              }
              date
            }
          }
          date
          dateOnSaleFrom
          dateOnSaleTo
          featured
          featuredImage {
            node {
              sourceUrl
            }
          }
          galleryImages {
            nodes {
              sourceUrl
            }
          }
          metaData {
            key
            value
          }
          onSale
          price
          productCategories {
            nodes {
              name
            }
          }
          productTags {
            nodes {
              name
            }
          }
          related {
            nodes {
              name
            }
          }
          reviewCount
          reviews(first: 5) {
            nodes {
              content
              author {
                node {
                  name
                }
              }
              date
            }
          }
          shortDescription
          sku
          slug
          status
          title
          totalSales
          type
          upsell {
            nodes {
              name
            }
          }
        }
        ... on ExternalProduct {
          id
          name
          description
          averageRating
          catalogVisibility
          commentCount
          comments(first: 5) {
            nodes {
              content
              author {
                node {
                  name
                }
              }
              date
            }
          }
          date
          dateOnSaleFrom
          dateOnSaleTo
          featured
          featuredImage {
            node {
              sourceUrl
            }
          }
          galleryImages {
            nodes {
              sourceUrl
            }
          }
          metaData {
            key
            value
          }
          onSale
          price
          productCategories {
            nodes {
              name
            }
          }
          productTags {
            nodes {
              name
            }
          }
          related {
            nodes {
              name
            }
          }
          reviewCount
          reviews(first: 5) {
            nodes {
              content
              author {
                node {
                  name
                }
              }
              date
            }
          }
          shortDescription
          sku
          slug
          status
          title
          totalSales
          type
          upsell {
            nodes {
              name
            }
          }
        }
        ... on GroupProduct {
          id
          name
          description
          averageRating
          catalogVisibility
          commentCount
          comments(first: 5) {
            nodes {
              content
              author {
                node {
                  name
                }
              }
              date
            }
          }
          date
          dateOnSaleFrom
          dateOnSaleTo
          featured
          featuredImage {
            node {
              sourceUrl
            }
          }
          galleryImages {
            nodes {
              sourceUrl
            }
          }
          metaData {
            key
            value
          }
          onSale
          price
          productCategories {
            nodes {
              name
            }
          }
          productTags {
            nodes {
              name
            }
          }
          related {
            nodes {
              name
            }
          }
          reviewCount
          reviews(first: 5) {
            nodes {
              content
              author {
                node {
                  name
                }
              }
              date
            }
          }
          shortDescription
          sku
          slug
          status
          title
          totalSales
          type
          upsell {
            nodes {
              name
            }
          }
        }
      }
    }
  }`;

  const variables = { first, after };

  try {
    const response = await fetch('https://backend.02xz.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result: { data: ProductsData; errors?: Array<{ message: string }> } = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map(error => error.message).join(', '));
    }

    console.log('result', result);

    // return result.data.products;
    return result.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      products: {
        pageInfo: { endCursor: '', hasNextPage: false },
        nodes: []
      }
    };
  }
}


export async function fetchProductById(id: string): Promise<Product> {
    const query = `
        query {
        product(id: "${id}") {
            id
            name
            description
            image {
            sourceUrl
            }
        }
        }
    `;
    
    try {
        const response = await fetch('https://backend.02xz.com/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
        });
    
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
    
        const result: { data: { product: Product }; errors?: Array<{ message: string }> } = await response.json();
    
        if (result.errors) {
        throw new Error(result.errors.map(error => error.message).join(', '));
        }
    
        return result.data.product;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
    }
