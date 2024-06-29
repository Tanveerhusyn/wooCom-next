import {
  Product,
  ProductCategoryNode,
  ProductData,
  ProductProductTagsInput,
  ProductsData,
  SingleProduct,
  UpdateProductInput,
  WordPressMedia,
} from "../types";
import { Buffer } from "buffer";
export async function fetchProducts(
  first: number,
  after?: string,
): Promise<ProductsData> {
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
    const response = await fetch("https://backend.02xz.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 0 },
    });

    const result: { data: ProductsData; errors?: Array<{ message: string }> } =
      await response.json();

    if (result.errors) {
      throw new Error(result.errors.map((error) => error.message).join(", "));
    }

    console.log("result", result.data.products.nodes);

    // return result.data.products;
    return result.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      products: {
        pageInfo: { endCursor: "", hasNextPage: false },
        nodes: [],
      },
    };
  }
}
``;

function decodeBase64Id(encodedString) {
  try {
    // Decode the URL-encoded string
    const decodedUrlString = decodeURIComponent(encodedString);

    // Validate the Base64 encoded string
    if (!/^[A-Za-z0-9+/=]+$/.test(decodedUrlString)) {
      throw new Error("Invalid Base64 string");
    }

    // Decode the Base64 encoded string
    const decodedString = atob(decodedUrlString);

    // The decoded string is in the format `product:97`, split it to get the ID
    const parts = decodedString.split(":");
    if (parts.length !== 2 || parts[0] !== "product") {
      throw new Error("Invalid format after decoding");
    }

    return parts[1];
  } catch (error) {
    console.error("Failed to decode Base64 string:", error);
    return null; // or handle the error as needed
  }
}

export async function updateProductTableData(productId, tableData, token) {
  const decodedId = decodeBase64Id(productId);
  const tableQuery = `mutation UpdateProductTableData($productId: ID!, $tableData: String!) {
  updateProductTableData(input: { productId: $productId, tableData: $tableData }) {
    success
    product {
      id
      tableData {
        tableData
      }
    }
  }
}
`;
  try {
    const response = await fetch("https://backend.02xz.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: tableQuery,
        variables: { productId: decodedId, tableData },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map((error) => error.message).join(", "));
    }

    return result.data.updateProductTableData;
  } catch (error) {
    console.error("Error updating product table data:", error);
    return null;
  }
}

export async function fetchProductById(id: string): Promise<ProductData> {
  const decodedid = decodeBase64Id(id);
  console.log("decodedid", decodedid);

  const query = `
    query GetProduct($productId: ID!) {
  product(id: $productId, idType: DATABASE_ID) {
    id
    name
    description
     imagePool{
      imagePool{
				nodes{
					sourceUrl
        }
      }
    }
    tableData{
      tableData
    }
    productCategories {
      nodes {
        id
        name
      }
    }
    attributes {
      edges{
        node{
          name
					options
        }
      }
    }
    productTags {
      nodes {
        id
        name
      }
    }
    image {
      id
      sourceUrl
    }
    ... on VariableProduct {
      id
      name
      variations {
        nodes {
          id
          name
          price
          attributes {
            nodes {
              name
              value
            }
          }
          image {
            id
            sourceUrl
          }
        }
      }
      price
      stockStatus
      galleryImages {
        nodes {
          sourceUrl
        }
      }
    }
    allPaColour {
      nodes {
        name
      }
    }
    allPaSize {
      nodes {
        name
      }
    }
    allPaGender {
      nodes {
        name
      }
    }
    allPaCollection {
      nodes {
        name
      }
    }
    seo {
      title
      metaDesc
      breadcrumbs {
        text
        url
      }
    }
    slug
  }
  globalColors: allPaColour {
    nodes {
      name
    }
  }
  globalCollections: allPaCollection {
    nodes {
      name
    }
  }
  globalGenders: allPaGender {
    nodes {
      name
    }
  }
  globalSizes: allPaSize {
    nodes {
      name
    }
  }
}
  `;

  try {
    const response = await fetch("https://backend.02xz.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { productId: decodedid },
      }),
      next: {
        revalidate: 0,
        tags: ["refreshProduct"],
      },
    });

    const result: {
      data: any;
      errors?: Array<{ message: string }>;
    } = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map((error) => error.message).join(", "));
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function updateProduct(
  id: string,
  title: string,
  content: string,
  slug: string,
  token: string,
  productTags: ProductProductTagsInput,
): Promise<ProductData> {
  const query = `
    mutation UpdateProduct($id: ID!, $title: String!, $content: String!, $slug: String!, $productTags: ProductProductTagsInput!) {
      updateProduct(input: { id: $id, title: $title, content: $content, slug: $slug, productTags: $productTags }) {
        product {
          id
          title
          content
          slug
          seo {
            title
            metaDesc
          }
          productTags {
            nodes {
              name
            }
          }
        }
      }
    }
  `;

  const decodedId = decodeBase64Id(id);

  const variables = {
    id: decodedId,
    title,
    content,
    slug,
    productTags,
  };

  try {
    const response = await fetch("https://backend.02xz.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      cache: "no-cache",
      next: {
        revalidate: 0,
      },
    });

    const result: {
      data: any;
      errors?: Array<{ message: string }>;
    } = await response.json();
    console.log("Update Product", result);

    if (result.errors) {
      throw new Error(result.errors.map((error) => error.message).join(", "));
    }

    return result.data.updateProduct.product;
  } catch (error) {
    console.error("Error updating product:", error);
    return null;
  }
}

export async function triggerImagePoolUpdate(
  id: string,
  token: string,
): Promise<ProductData> {
  console.log("triggerImagePoolUpdate", id, token);
  const query = `
    mutation UpdateProductImagePoolFromGallery($id: ID!) {
      updateProductImagePoolFromGallery(input: { productId: $id }) {
        success
        product {
          id
          imagePool {
            imagePool{
              nodes{
                sourceUrl
              }
            }
          }
        }
      }
    }
  `;

  const decodedId = decodeBase64Id(id);

  const variables = {
    id: decodedId,
  };

  try {
    const response = await fetch("https://backend.02xz.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      cache: "no-cache",
      next: {
        revalidate: 0,
      },
    });

    const result: {
      data: any;
      errors?: Array<{ message: string }>;
    } = await response.json();
    console.log("Update Product Image Pool", result);

    if (result.errors) {
      throw new Error(result.errors.map((error) => error.message).join(", "));
    }

    return result.data.updateProductImagePoolFromGallery.product;
  } catch (error) {
    console.error("Error updating product image pool:", error);
    return null;
  }
}

export async function updateProductAttributes(
  id: string,
  colours: string[],
  sizes: string[],
  token: string,
): Promise<ProductData> {
  const query = `
    mutation UpdateProductAttributes($productId: ID!, $attributes: [AttributeInput]!) {
  updateProductAttributes(input: {productId: $productId, attributes: $attributes}) {
    success
    message
  }
}
  `;

  const decodedId = decodeBase64Id(id);

  const variables = {
    productId: decodedId,
    attributes: [
      {
        name: "colour",
        values: [...colours],
      },
      {
        name: "size",
        values: [...sizes],
      },
    ],
  };
  console.log("Attributes", variables);

  try {
    const response = await fetch("https://backend.02xz.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      cache: "no-cache",
      next: {
        revalidate: 0,
      },
    });

    const result: {
      data: any;
      errors?: Array<{ message: string }>;
    } = await response.json();
    console.log("Update Product Attributes", result);

    if (result.errors) {
      throw new Error(result.errors.map((error) => error.message).join(", "));
    }

    return result.data.updateProductAttributes.success;
  } catch (error) {
    console.error("Error updating product attributes:", error);
    return null;
  }
}

export async function getAllProductCategories(
  token: string,
): Promise<{ id: string; name: string }[]> {
  const query = `
    query MyQuery {
      productCategories {
        nodes {
          name
          children {
            nodes {
              id
              name
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch("https://backend.02xz.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Add authorization header if needed
      },
      body: JSON.stringify({ query }),
      cache: "no-cache",
      next: {
        revalidate: 0,
      },
    });

    const result: {
      data: any;
      errors?: Array<{ message: string }>;
    } = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map((error) => error.message).join(", "));
    }

    const categories = result.data.productCategories.nodes;
    let childrenCategories = [];

    categories.forEach((category) => {
      if (category.children && category.children.nodes.length > 0) {
        childrenCategories = childrenCategories.concat(category.children.nodes);
      }
    });

    return childrenCategories;
  } catch (error) {
    console.error("Error fetching or processing product categories:", error);
    return [];
  }
}

export async function updateProductCategory(
  productId: string,
  categoryId: string,
  token: string,
): Promise<{
  id: string;
  name: string;
  productCategories: ProductCategoryNode[];
} | null> {
  const mutation = `
    mutation UpdateProductCategoriesAndCheckParents($input: UpdateProductCategoriesAndCheckParentsInput!) {
      updateProductCategoriesAndCheckParents(input: $input) {
        product {
          id
          name
        }
      }
    }
  `;

  const input = {
    productId,
    categoryId,
  };

  console.log("input", input);

  try {
    const response = await fetch("https://backend.02xz.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: mutation,
        variables: { input },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(
        result.errors.map((error: any) => error.message).join(", "),
      );
    }

    return result.data.updateProductCategoriesAndCheckParents.product;
  } catch (error) {
    console.error("Error updating product category:", error);
    return null;
  }
}

export async function updateSeoFields(
  id: string,
  seoTitle: string,
  seoMetaDesc: string,
): Promise<{ success: boolean; message: string }> {
  const query = `
    mutation UpdateSeoFields($id: ID!, $seoTitle: String!, $seoMetaDesc: String!) {
      updateSeoFields(input: { id: $id, seoTitle: $seoTitle, seoMetaDesc: $seoMetaDesc }) {
        success
        message
      }
    }
  `;

  const decodedId = decodeBase64Id(id);
  const variables = {
    id: decodedId,
    seoTitle,
    seoMetaDesc,
  };

  try {
    const response = await fetch("https://backend.02xz.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      cache: "no-cache",
      next: {
        revalidate: 0,
      },
    });

    const result: {
      data: any;
      errors?: Array<{ message: string }>;
    } = await response.json();

    console.log("Update SEO", result);
    if (result.errors) {
      throw new Error(result.errors.map((error) => error.message).join(", "));
    }

    return result.data.updateSeoFields;
  } catch (error) {
    console.error("Error updating SEO fields:", error);
    return null;
  }
}

export async function updateProductMetaData(
  id: string,
  metaData: { key: string; value: string },
): Promise<ProductData> {
  const decodedId = decodeBase64Id(id);
  console.log("decodedId", decodedId);

  const mutation = `
    mutation UpdateProduct($input: UpdateProductInput!) {
      updateProduct(input: $input) {
        product {
          id
          name
          metaData {
            key
            value
          }
        }
      }
    }
  `;

  try {
    const response = await fetch("https://backend.02xz.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          input: {
            id: decodedId,
            metaData: [
              {
                key: metaData.key,
                value: metaData.value,
              },
            ],
          },
        },
      }),
      cache: "no-cache",
      next: {
        revalidate: 0,
      },
    });

    const result: {
      data: ProductData;
      errors?: Array<{ message: string }>;
    } = await response.json();

    console.log("result", result);
    if (result.errors) {
      throw new Error(result.errors.map((error) => error.message).join(", "));
    }

    return result.data;
  } catch (error) {
    console.error("Error updating product:", error);
    return null;
  }
}
export async function getWordPressMedia(): Promise<WordPressMedia[]> {
  try {
    // fetch wordpress media using Rest API

    const response = await fetch(
      "https://backend.02xz.com/wp-json/wp/v2/media?per_page=30",
    );

    //
    const data = await response.json();
    const images: WordPressMedia[] = data.map((item: any) => ({
      id: item.id,
      source_url: item.source_url,
    }));

    return images;
  } catch (error) {
    console.error("Error fetching wordpress media:", error);
    return null;
  }
}

export interface User {
  id: string;
  name: string;
  email: string;
  accessToken: string;
}

export async function authenticate(
  username: string,
  password: string,
): Promise<User | null> {
  try {
    // const response = await fetch("https://backend.02xz.com/graphql", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     query: `
    //       mutation LoginUser($username: String!, $password: String!) {
    //         login(input: { username: $username, password: $password }) {
    //           authToken
    //         }
    //       }
    //     `,
    //     variables: { username, password },
    //   }),
    // });

    const response = await fetch("https://backend.02xz.com/graphql", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
              mutation LoginUser {
                login( input: {
                  clientMutationId: "uniqueId",
                  username: "${username}",
                  password: "${password}"
                }){
                  authToken
                }
              }
            `,
      }),
    });

    const { data } = await response.json();

    const authToken = data.login.authToken;

    console.log("authToken", authToken);

    // Fetch user details using the authToken
    const userResponse = await fetch("https://backend.02xz.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
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

    const userResult: {
      data: { viewer: { id: string; name: string; email: string } };
      errors?: Array<{ message: string }>;
    } = await userResponse.json();

    console.log("userResult", userResult);
    if (userResult.errors) {
      throw new Error(
        userResult.errors.map((error) => error.message).join(", "),
      );
    }

    return {
      ...userResult.data.viewer,
      accessToken: authToken,
    };
  } catch (error) {
    console.error("Error authenticating:", error);
    return null;
  }
}

export async function updateGalleryImages(
  productId: string,
  galleryImages: string[],
  token: string,
): Promise<boolean> {
  const decodeBase64ProductId = decodeBase64Id(productId);

  const mutation = `
    mutation UpdateGalleryImages($productId: ID!, $galleryImages: [String!]!) {
      updateProductGalleryImages(
        productId: $productId,
        galleryImages: $galleryImages
      ) {
        id
        galleryImages {
          nodes {
            id
            sourceUrl
          }
        }
      }
    }
  `;

  try {
    const response = await fetch("https://backend.02xz.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          productId: decodeBase64ProductId,
          galleryImages,
        },
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Gallery images update failed: ${errorDetails}`);
    }

    const result: {
      data: {
        updateProductGalleryImages: {
          id: string;
          galleryImages: { nodes: Array<{ id: string; sourceUrl: string }> };
        };
      };
      errors?: Array<{ message: string }>;
    } = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map((error) => error.message).join(", "));
    }

    return !!result.data.updateProductGalleryImages;
  } catch (error) {
    console.error("Error updating gallery images:", error);
    return false;
  }
}

//upload image to wordpress gallery
export async function uploadImage(
  file: File,
  token: string,
): Promise<WordPressMedia> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      "https://backend.02xz.com/wp-json/wp/v2/media",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    const data = await response.json();
    return {
      id: data.id,
      source_url: data.source_url,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
}

export async function updateProductImage(
  productId: string,
  imageId: string,
  source_url: string,
  token: string,
): Promise<boolean> {
  const decodeBase64ProductId = decodeBase64Id(productId);
  const decodeBase64ImageId = decodeBase64Id(imageId);

  const mutation = `
   mutation UpdateProductImage($productId: ID!, $imageId: ID!, $sourceUrl: String!) {
  updateProductImage(input: { productId: $productId, imageId: $imageId, sourceUrl: $sourceUrl }) {
    product {
      id
      title
      image {
        sourceUrl
      }
    }
    image {
      id
      sourceUrl
    }
  }
}`;

  try {
    const response = await fetch("https://backend.02xz.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          productId: decodeBase64ProductId,
          imageId: decodeBase64ImageId,
          sourceUrl: source_url,
        },
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Product update failed: ${errorDetails}`);
    }

    const result: {
      data: { updateProductImage: { product: Product } };
      errors?: Array<{ message: string }>;
    } = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map((error) => error.message).join(", "));
    }

    return !!result.data.updateProductImage.product;
  } catch (error) {
    console.error("Error updating product image:", error);
    return false;
  }
}
