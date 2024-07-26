import { Icons } from "@/components/icons";
import { any, string } from "zod";

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
}

interface Image {
  sourceUrl: string;
}

interface PaColour {
  name: string;
}

interface PaSize {
  name: string;
}

interface CommentAuthor {
  name: string;
}

interface Comment {
  content: string;
  author: {
    node: CommentAuthor;
  };
  date: string;
  rating?: number;
}

interface Category {
  name: string;
}

interface Tag {
  name: string;
}

interface MetaData {
  key: string;
  value: string;
}

interface ProductBase {
  id: string;
  name: string;
  description: string;
  averageRating: number;
  catalogVisibility: string;
  commentCount: number;
  comments: {
    nodes: Comment[];
  };
  date: string;
  dateOnSaleFrom: string;
  dateOnSaleTo: string;
  featured: boolean;
  featuredImage: {
    node: Image;
  };
  galleryImages: {
    nodes: Image[];
  };
  metaData: MetaData[];
  onSale: boolean;
  price: string;
  productCategories: {
    nodes: Category[];
  };
  productTags: {
    nodes: Tag[];
  };
  related: {
    nodes: Product[];
  };
  reviewCount: number;
  reviews: {
    nodes: Comment[];
  };
  shortDescription: string;
  sku: string;
  slug: string;
  status: string;
  title: string;
  totalSales: number;
  type: string;
  upsell: {
    nodes: Product[];
  };
}

interface SimpleProduct extends ProductBase {
  __typename: "SimpleProduct";
}

interface VariableProduct extends ProductBase {
  __typename: "VariableProduct";
}

interface ExternalProduct extends ProductBase {
  __typename: "ExternalProduct";
}

interface GroupProduct extends ProductBase {
  __typename: "GroupProduct";
}

export type Product =
  | SimpleProduct
  | VariableProduct
  | ExternalProduct
  | GroupProduct;
export interface PageInfo {
  endCursor: string;
  hasNextPage: boolean;
}
export interface ProductsData {
  products: {
    pageInfo: PageInfo;
    nodes: Product[];
  };
}
export interface WordPressMedia {
  id: number;
  source_url: string;
}

interface SingleProduct {
  id: string;
  name: string;
  description: string;

  extras: {
    name: string;
    value: string;
  }[];
  colorImages: {
    colorImages: any;
    fieldGroupName: any;
  }[];
  imagePool: {
    imagePool: {
      nodes: {
        id: any;
        sourceUrl: string;

        acfImageMetadata: {
          imageType: string;
          gender: string;
          skinColor: string;
        }[];
      }[];
    };
  };
  tableData: {
    tableData: any;
  };
  productCategories: {
    nodes: {
      id: string;
      name: string;
    }[];
  };
  productTags: {
    nodes: {
      id: string;
      name: string;
    }[];
  };
  image: {
    id: string;
    sourceUrl: string;
    acfImageMetadata: {
      imageType: string;
      gender: string;
      skinColor: string;
    }[];
  };
  variations?: {
    nodes: {
      id: string;
      name: string;
      price: string;
      attributes: {
        nodes: {
          name: string;
          value: string;
        }[];
      };
      image: {
        id: string;
        sourceUrl: string;
      };
    }[];
  };
  price: string;
  stockStatus: string;
  galleryImages: {
    nodes: {
      id: string;
      sourceUrl: string;
      acfImageMetadata: {
        imageType: string;
        gender: string;
        skinColor: string;
      }[];
    }[];
  };
  allPaColour: {
    nodes: {
      name: string;
    }[];
  };
  allPaSize: {
    nodes: {
      name: string;
    }[];
  };
  allPaGender: {
    nodes: {
      name: string;
    }[];
  };
  allPaCollection: {
    nodes: {
      name: string;
    }[];
  };
  seo: {
    title: string;
    metaDesc: string;
    breadcrumbs: {
      text: string;
      url: string;
    }[];
  };
  slug: string;
}

export interface ProductProductTagsInput {
  nodes: {
    name: string;
  }[];
}

export interface ProductCategoryNode {
  id: string;
  name: string;
}

export interface UpdateProductInput {
  id: string;
  productCategories: {
    append: boolean;
    nodes: ProductCategoryNode[];
  };
}

interface GlobalAttributes {
  globalColors: {
    nodes: {
      name: string;
    }[];
  };
  globalCollections: {
    nodes: {
      name: string;
    }[];
  };
  globalGenders: {
    nodes: {
      name: string;
    }[];
  };
  globalSizes: {
    nodes: {
      name: string;
    }[];
  };
}

export interface ProductData {
  product: SingleProduct;
  globalColors: GlobalAttributes["globalColors"];
  globalCollections: GlobalAttributes["globalCollections"];
  globalGenders: GlobalAttributes["globalGenders"];
  globalSizes: GlobalAttributes["globalSizes"];
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;
