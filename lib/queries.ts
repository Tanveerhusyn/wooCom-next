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
    // Remove any URL encoding if present
    const decodedUrlString = decodeURIComponent(encodedString);

    // Decode the Base64 encoded string
    const decodedString = atob(decodedUrlString);

    // Split the decoded string
    const parts = decodedString.split(":");

    // Check if we have at least two parts
    if (parts.length < 2) {
      throw new Error("Invalid format after decoding");
    }

    // The ID should be the last part
    const id = parts[parts.length - 1];

    // Ensure the ID is a number
    if (isNaN(id)) {
      throw new Error("Decoded ID is not a number");
    }

    return id;
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
interface ImageMetadata {
  imageType: "product" | "person";

  gender?: string;

  skinColor?: string;
}

export async function updateImageMetadata(
  imageId: string,

  metadata: ImageMetadata,

  token: string,
): Promise<boolean> {
  const mutation = `

    mutation UpdateImageMetadata($id: ID!, $imageType: String, $gender: String, $skinColor: String) {

      updateACFImageMetadata(input: {

        id: $id,

        imageType: $imageType,

        gender: $gender,

        skinColor: $skinColor

      }) {

        success

        

      }

    }

  `;

  const variables = {
    id: imageId,

    ...metadata,
  };

  try {
    const response = await fetch("https://backend.02xz.com/graphql", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        query: mutation,

        variables,
      }),
      next: {
        tags: ["refreshProduct"],
      },
    });

    const result = await response.json();

    if (result.errors) {
      console.error("GraphQL errors:", result.errors);

      return false;
    }

    return result.data?.updateACFImageMetadata?.success || false;
  } catch (error) {
    console.error("Error updating image metadata:", error);

    return false;
  }
}
export async function fetchProductById(id: string): Promise<ProductData> {
  const decodedid = decodeBase64Id(id);
  console.log("decodedid", decodedid);

  const query = `query GetProduct($productId: ID!) {
  product(id: $productId, idType: DATABASE_ID) {
    id
    name
    extras{
      fit
      style
      materialcare}
    colorImages {
        colorImages
        fieldGroupName
      }
    description
     imagePool{
      imagePool(first: 100){
				nodes{
          id
					sourceUrl
            acfImageMetadata {
            imageType
            gender
            skinColor
          }
          
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
       acfImageMetadata {
            imageType
            gender
            skinColor
          }
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
        id
          sourceUrl
            acfImageMetadata {
            imageType
            gender
            skinColor
          }
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
   globalFeatures:allPaFeatures{
      nodes{
        name
      }
    }
   globalFit: allPaFit{
      nodes{
        name
      }
    }
    globalPrint:allPaPrint{
      nodes{
        name
      }
    }
    globalMaterial:allPaMaterial{
      nodes{
        name
      }
    }
   globalNeckline: allPaNeckline{
      nodes{
        name
      }
    }
   globalSleeveLength: allPaSleeveLength{
      nodes{
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

export async function updateProductExtras(
  id: string,
  fit: string,
  style: string,
  materialcare: string,
  feature: string,
  neckline: string,
  print: string,
  sleevelength: string,
  token: string,
): Promise<boolean> {
  const query = `
    mutation UpdateProductExtras(
      $productId: ID!, 
      $fit: String, 
      $style: String, 
      $materialcare: String,
      $feature: String,
      $neckline: String,
      $print: String,
      $sleevelength: String
    ) {
      updateProductExtras(input: {
        productId: $productId
        fit: $fit
        style: $style
        materialcare: $materialcare
        feature: $feature
        neckline: $neckline
        print: $print
        sleevelength: $sleevelength
      }) {
        success
        product {
          id
          name
          extras {
            fit
            style
            materialcare
            feature
            neckline
            print
            sleevelength
          }
        }
      }
    }
  `;

  const decodedId = decodeBase64Id(id);

  const variables = {
    productId: decodedId,
    fit,
    style,
    materialcare,
    feature,
    neckline,
    print,
    sleevelength,
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
      data: {
        updateProductExtras: {
          success: boolean;
          product: {
            id: string;
            name: string;
            extras: {
              fit: string;
              style: string;
              materialcare: string;
              feature: string;
              neckline: string;
              print: string;
              sleevelength: string;
            };
          };
        };
      };
      errors?: Array<{ message: string }>;
    } = await response.json();

    console.log("Update Product", result);

    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      return false;
    }

    return result.data.updateProductExtras.success;
  } catch (error) {
    console.error("Error updating product:", error);
    return false;
  }
}

export async function updateProductColorImages(
  id: string,
  colorImages: string,
  token: string,
): Promise<boolean | null> {
  const query = `
    mutation UpdateProductColorImages($productId: ID!, $colorImages: String!) {
  updateProductColorImages(
    input: {productId: $productId, colorImages: $colorImages}
  ) {
    success
    product {
      id
      name
      colorImages {
        colorImages
        fieldGroupName
      }
    }
  }
}
  `;

  const decodedId = decodeBase64Id(id);

  const variables = {
    productId: decodedId,
    colorImages: colorImages,
  };

  console.log(variables);
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
      data?: {
        updateProductColorImages: {
          success: boolean;
          product: {
            id: string;
            name: string;
            colorImages: object;
          };
        };
      };
      errors?: Array<{ message: string }>;
    } = await response.json();

    console.log("Update Product Color Images", result);

    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      return null;
    }

    return result.data?.updateProductColorImages.success ?? null;
  } catch (error) {
    console.error("Error updating product color images:", error);
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

export async function addImageToProductPoolByUrl(
  id: string,
  token: string,
  imageUrl: string,
): Promise<ProductData> {
  console.log("addImageToProductPoolByUrl", id, imageUrl);
  const query = `
    mutation AddImageToProductPoolByUrl($id: ID!, $imageUrl: String!) {
      addImageToProductPoolByUrl(input: { productId: $id, imageUrl: $imageUrl }) {
        success
        product {
          id
          imagePool {
            imagePool {
              nodes {
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
    imageUrl: imageUrl,
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
    console.log("Add Image to Product Pool by URL", result);

    if (result.errors) {
      throw new Error(result.errors.map((error) => error.message).join(", "));
    }

    return result.data.addImageToProductPoolByUrl.product;
  } catch (error) {
    console.error("Error adding image to product pool by URL:", error);
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
    logs
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
   mutation UpdateProductGalleryImages($productId: ID!, $galleryImages: [String]!) {
  updateProductGalleryImages(input: { productId: $productId, galleryImages: $galleryImages }) {
    product {
      id
      name
      galleryImages {
        nodes {
          id
          sourceUrl
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

    const result: {
      data: {
        updateProductGalleryImages: {
          id: string;
          galleryImages: { nodes: Array<{ id: string; sourceUrl: string }> };
        };
      };
      errors?: Array<{ message: string }>;
    } = await response.json();

    return result.data ? true : false;
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
  console.log("updateProductImage", productId, imageId, source_url);
  const decodeBase64ProductId = decodeBase64Id(productId);
  const encodedId = imageId;
  const decodedId = atob(encodedId);
  console.log("ATOB", decodedId); // This will output: "post:7065"
  const decodeBase64ImageId = decodeBase64Id(imageId);
  console.log(
    "decodeBase64ImageId",
    decodeBase64ProductId,
    decodeBase64ImageId,
  );

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

    const result: {
      data: { updateProductImage: { product: Product } };
      errors?: Array<{ message: string }>;
    } = await response.json();

    return result.data ? true : false;
  } catch (error) {
    console.error("Error updating product image:", error);
    return false;
  }
}
