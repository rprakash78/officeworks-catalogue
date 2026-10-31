export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
};

export type Enquiry = {
  productId: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
};

export type CategoryListing = {
  category: string;
  topRated: Product[];
  additional: Product[];
};
