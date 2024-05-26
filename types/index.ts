import { Icons } from "@/components/icons";

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

export interface SingleProduct {
  id: string;
  name: string;
  description: string;
  productCategories: {
    nodes: {
      id: string;
      name: string;
    }[];
  };
  image: {
    id: string;
    sourceUrl: string;
  };
  variations: {
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
    }[];
  };
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
