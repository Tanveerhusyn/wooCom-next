
import {Product, ProductsData, WordPressMedia} from '../types';
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
          date
          dateOnSaleFrom
          dateOnSaleTo
          featured
          featuredImage {
            node {
              id
              sourceUrl
            }
          }
          galleryImages {
            nodes {
              id
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
              id
              sourceUrl
            }
          }
          galleryImages {
            nodes {
              id
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
              id
              sourceUrl
            }
          }
          galleryImages {
            nodes {
              id
              sourceUrl
            }
          }
          metaData {
            key
            value
          }
          onSale
          price
         
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
          
          date
          dateOnSaleFrom
          dateOnSaleTo
          featured
          featuredImage {
            node {
              id
              sourceUrl
            }
          }
          galleryImages {
            nodes {
              id
              sourceUrl
            }
          }
          
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


    }
  );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result: { data: ProductsData; errors?: Array<{ message: string }> } = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map(error => error.message).join(', '));
    }

    console.log('result', result.data.products.nodes);

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
            id
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


export async function getWordPressMedia():Promise<WordPressMedia[]> {
  try{
    // fetch wordpress media using Rest API

    const response = await fetch('https://backend.02xz.com/wp-json/wp/v2/media?per_page=30');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    //
    const data = await response.json();
      const images: WordPressMedia[] = data.map((item: any) => ({
    id: item.id,
    source_url: item.source_url,
  }));

    return images;

  }
  catch(error){
    console.error('Error fetching wordpress media:', error);
    return null;
  }
 
} 

 
export interface User {
  id: string;
  name: string;
  email: string;
  accessToken: string;
}

export async function authenticate(username: string, password: string): Promise<User | null> {
  try {
    const response = await fetch('https://backend.02xz.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation LoginUser($username: String!, $password: String!) {
            login(input: { username: $username, password: $password }) {
              authToken
            }
          }
        `,
        variables: { username, password },
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result: { data: { login: { authToken: string } }; errors?: Array<{ message: string }> } = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map(error => error.message).join(', '));
    }

    const authToken = result.data.login.authToken;
    console.log('authToken', authToken);

    // Fetch user details using the authToken
    const userResponse = await fetch('https://backend.02xz.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        query: `
          query GetUser {
            viewer {
              id
              name
              email
            }
          }
        `,
      }),
    });

    if (!userResponse.ok) {
      throw new Error('Network response was not ok');
    }

    const userResult: { data: { viewer: { id: string, name: string, email: string } }; errors?: Array<{ message: string }> } = await userResponse.json();

    if (userResult.errors) {
      throw new Error(userResult.errors.map(error => error.message).join(', '));
    }

    return {
      ...userResult.data.viewer,
      accessToken:authToken,
    };
  } catch (error) {
    console.error('Error authenticating:', error);
    return null;
  }
}



//upload image to wordpress gallery
export async function uploadImage(file: File, token: string): Promise<WordPressMedia> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('https://backend.02xz.com/wp-json/wp/v2/media', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return {
      id: data.id,
      source_url: data.source_url,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

export async function updateProductImage(productId: string, imageId: string, token: string): Promise<boolean> {
  const mutation = `
    mutation UpdateProductImage($productId: ID!, $imageId: ID!) {
      updateProductImage(input: { productId: $productId, imageId: $imageId }) {
        product {
          id
          name
          description
          image {
            id
            sourceUrl
          }
        }
      }
    }
  `;

  try {
    const response = await fetch('https://backend.02xz.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: mutation,
        variables: { 
          productId, 
          imageId,
        },
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Product update failed: ${errorDetails}`);
    }

    const result: { data: { updateProductImage: { product: Product } }; errors?: Array<{ message: string }> } = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map(error => error.message).join(', '));
    }

    return !!result.data.updateProductImage.product;
  } catch (error) {
    console.error('Error updating product image:', error);
    return false;
  }
}