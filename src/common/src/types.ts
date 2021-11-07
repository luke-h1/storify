export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  matchPassword: (password: string) => boolean;
}

export interface Review {
  name: string;
  rating: number;
  comment: string;
  user: User;
}

export interface Product {
  user: User;
  name: string;
  image: string;
  brand: string;
  category: string;
  description: string;
  reviews: Review[];
  rating: number;
  numReviews: number;
  price: number;
  countInStock: number;
}

export interface Order {
  user: User;
  orderItems: {
    name: string;
    qty: number;
    image: string;
    price: number;
    product: Product;
  }[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentResult: {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
  };
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt: Date;
  isDelivered: boolean;
  deliveredAt: Date;
}

