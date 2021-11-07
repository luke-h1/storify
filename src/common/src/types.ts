export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  matchPassword: (password: string) => boolean;
  token: string;
}

export interface Review {
  name: string;
  rating: number;
  comment: string;
  user: string; // only need user id for reviews;
}

export interface Product {
  _id: string;
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
export interface PaymentResult {
  id: string;
  status: string;
  update_time: string;
  email_address: string;
}
export interface Order {
  _id: string;
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
  paymentResult: PaymentResult;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt: number;
  isDelivered: boolean;
  deliveredAt: number;
}

export type UserResponse = User | { message: string }

export type ProductResponse = { products: Product[], page: string; pages: string }

export type OrderResponse = Order | { message: string }
