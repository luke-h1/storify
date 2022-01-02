import gql from 'graphql-tag';
import * as Urql from 'urql';

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Cart = {
  __typename?: 'Cart';
  createdAt: Scalars['String'];
  creator: User;
  creatorId: Scalars['Int'];
  id: Scalars['Int'];
  product: Product;
  productId: Scalars['Int'];
  quantity: Scalars['Int'];
  total: Scalars['Int'];
  updatedAt: Scalars['String'];
};

export type CartResponse = {
  __typename?: 'CartResponse';
  cart?: Maybe<Cart>;
  errors?: Maybe<Array<FieldError>>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type ImageSignature = {
  __typename?: 'ImageSignature';
  signature: Scalars['String'];
  timestamp: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  cancelOrder: Order;
  changePassword: UserResponse;
  createCart: Scalars['Boolean'];
  createImageSignature: ImageSignature;
  createOrder?: Maybe<Order>;
  createOrderDetails: OrderDetailsResponse;
  createPayment: Scalars['Int'];
  createProduct: Product;
  createWishlist: Scalars['Boolean'];
  deleteAllProducts: Scalars['Boolean'];
  deleteCart: Scalars['Boolean'];
  deleteMyAccount: Scalars['Boolean'];
  deleteProduct: Scalars['Boolean'];
  deleteProductAsAdmin: Scalars['Boolean'];
  deleteUser: Scalars['Boolean'];
  forgotPassword: Scalars['Boolean'];
  login: UserResponse;
  logout: Scalars['Boolean'];
  makeUserAdmin: Scalars['Boolean'];
  makeUserRegularUser: Scalars['Boolean'];
  register: UserResponse;
  updateCartQuantity: CartResponse;
  updateProduct?: Maybe<Product>;
};

export type MutationCancelOrderArgs = {
  orderId: Scalars['Int'];
};

export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};

export type MutationCreateCartArgs = {
  productId: Scalars['Int'];
  quantity: Scalars['Int'];
};

export type MutationCreateOrderArgs = {
  total: Scalars['Int'];
};

export type MutationCreateOrderDetailsArgs = {
  orderId: Scalars['Int'];
  productId: Scalars['Int'];
  quantity: Scalars['Int'];
};

export type MutationCreatePaymentArgs = {
  orderId: Scalars['Int'];
  token: Scalars['String'];
};

export type MutationCreateProductArgs = {
  input: ProductCreateInput;
};

export type MutationCreateWishlistArgs = {
  productId: Scalars['Int'];
};

export type MutationDeleteMyAccountArgs = {
  id: Scalars['Int'];
};

export type MutationDeleteProductArgs = {
  id: Scalars['Int'];
  stripeProductId: Scalars['String'];
};

export type MutationDeleteProductAsAdminArgs = {
  id: Scalars['Int'];
  stripeProductId: Scalars['String'];
};

export type MutationDeleteUserArgs = {
  id: Scalars['Int'];
};

export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};

export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type MutationMakeUserAdminArgs = {
  id: Scalars['Int'];
};

export type MutationMakeUserRegularUserArgs = {
  id: Scalars['Int'];
};

export type MutationRegisterArgs = {
  options: UserRegisterInput;
};

export type MutationUpdateCartQuantityArgs = {
  id: Scalars['Int'];
  quantity: Scalars['Int'];
};

export type MutationUpdateProductArgs = {
  id: Scalars['Int'];
  input: ProductUpdateInput;
};

export type Order = {
  __typename?: 'Order';
  createdAt: Scalars['String'];
  creatorId: Scalars['Int'];
  id: Scalars['Int'];
  orderDetails: Array<OrderDetails>;
  orderDetailsId: Scalars['Int'];
  paymentId: Scalars['Int'];
  status: Scalars['String'];
  total: Scalars['Int'];
  updatedAt: Scalars['String'];
};

export type OrderDetails = {
  __typename?: 'OrderDetails';
  createdAt: Scalars['String'];
  creatorId: Scalars['Int'];
  id: Scalars['Int'];
  orderId: Scalars['Int'];
  productId: Scalars['Int'];
  quantity: Scalars['Int'];
  updatedAt: Scalars['String'];
};

export type OrderDetailsResponse = {
  __typename?: 'OrderDetailsResponse';
  errors?: Maybe<Array<FieldError>>;
  orderDetails?: Maybe<OrderDetails>;
};

export type Product = {
  __typename?: 'Product';
  brand: Scalars['String'];
  cart: Cart;
  createdAt: Scalars['String'];
  creator: User;
  creatorId: Scalars['Int'];
  description: Scalars['String'];
  descriptionSnippet: Scalars['String'];
  id: Scalars['Int'];
  image: Scalars['String'];
  name: Scalars['String'];
  orderDetails: OrderDetails;
  price: Scalars['Int'];
  publicId: Scalars['String'];
  stripePriceId: Scalars['String'];
  stripeProductId: Scalars['String'];
  updatedAt: Scalars['String'];
  wishlist: Wishlist;
};

export type ProductCreateInput = {
  brand: Scalars['String'];
  description: Scalars['String'];
  image: Scalars['String'];
  name: Scalars['String'];
  price: Scalars['Float'];
};

export type ProductUpdateInput = {
  brand: Scalars['String'];
  description: Scalars['String'];
  image: Scalars['String'];
  name: Scalars['String'];
  price: Scalars['Float'];
  stripePriceId: Scalars['String'];
  stripeProductId: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  OrderDetail?: Maybe<OrderDetails>;
  carts: Array<Cart>;
  me?: Maybe<User>;
  orders: Array<Order>;
  product?: Maybe<Product>;
  products: Array<Product>;
  user?: Maybe<User>;
  users?: Maybe<Array<User>>;
  wishlist: Wishlist;
  wishlists: Array<Wishlist>;
};

export type QueryOrderDetailArgs = {
  orderId: Scalars['Int'];
};

export type QueryProductArgs = {
  id: Scalars['Int'];
};

export type QueryUserArgs = {
  id: Scalars['Int'];
};

export type QueryWishlistArgs = {
  productId: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  fullName: Scalars['String'];
  id: Scalars['Int'];
  isAdmin: Scalars['Boolean'];
  lastName: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type UserRegisterInput = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type Wishlist = {
  __typename?: 'Wishlist';
  creatorId: Scalars['Int'];
  id: Scalars['Int'];
  product: Product;
  productId: Scalars['Int'];
};

export type ErrorFragment = {
  __typename?: 'FieldError';
  field: string;
  message: string;
};

export type ProductFragmentFragment = {
  __typename?: 'Product';
  id: number;
  brand: string;
  description: string;
  image: string;
  price: number;
  name: string;
  stripePriceId: string;
  stripeProductId: string;
  creator: { __typename?: 'User'; id: number };
};

export type ProductsFragmentFragment = {
  __typename?: 'Product';
  id: number;
  brand: string;
  descriptionSnippet: string;
  image: string;
  name: string;
  price: number;
  description: string;
  stripeProductId: string;
  creator: { __typename?: 'User'; id: number; fullName: string };
};

export type UserFragmentFragment = {
  __typename?: 'User';
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
};

export type UserResponseFragmentFragment = {
  __typename?: 'UserResponse';
  errors?:
    | Array<{ __typename?: 'FieldError'; field: string; message: string }>
    | null
    | undefined;
  user?:
    | {
        __typename?: 'User';
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        isAdmin: boolean;
      }
    | null
    | undefined;
};

export type CartsQueryVariables = Exact<{ [key: string]: never }>;

export type CartsQuery = {
  __typename?: 'Query';
  carts: Array<{
    __typename?: 'Cart';
    id: number;
    quantity: number;
    creatorId: number;
    productId: number;
    total: number;
    product: {
      __typename?: 'Product';
      name: string;
      image: string;
      brand: string;
      price: number;
    };
  }>;
};

export type ChangePasswordMutationVariables = Exact<{
  newPassword: Scalars['String'];
  token: Scalars['String'];
}>;

export type ChangePasswordMutation = {
  __typename?: 'Mutation';
  changePassword: {
    __typename?: 'UserResponse';
    errors?:
      | Array<{ __typename?: 'FieldError'; message: string; field: string }>
      | null
      | undefined;
  };
};

export type CreateCartMutationVariables = Exact<{
  quantity: Scalars['Int'];
  productId: Scalars['Int'];
}>;

export type CreateCartMutation = {
  __typename?: 'Mutation';
  createCart: boolean;
};

export type CreateOrderMutationVariables = Exact<{
  total: Scalars['Int'];
}>;

export type CreateOrderMutation = {
  __typename?: 'Mutation';
  createOrder?: { __typename?: 'Order'; id: number } | null | undefined;
};

export type CreateOrderDetailsMutationVariables = Exact<{
  productId: Scalars['Int'];
  orderId: Scalars['Int'];
  quantity: Scalars['Int'];
}>;

export type CreateOrderDetailsMutation = {
  __typename?: 'Mutation';
  createOrderDetails: {
    __typename?: 'OrderDetailsResponse';
    errors?:
      | Array<{ __typename?: 'FieldError'; message: string; field: string }>
      | null
      | undefined;
  };
};

export type CreateProductMutationVariables = Exact<{
  input: ProductCreateInput;
}>;

export type CreateProductMutation = {
  __typename?: 'Mutation';
  createProduct: {
    __typename?: 'Product';
    id: number;
    image: string;
    name: string;
    price: number;
    brand: string;
    descriptionSnippet: string;
  };
};

export type CreateSignatureMutationVariables = Exact<{ [key: string]: never }>;

export type CreateSignatureMutation = {
  __typename?: 'Mutation';
  createImageSignature: {
    __typename?: 'ImageSignature';
    signature: string;
    timestamp: number;
  };
};

export type CreateWishListMutationVariables = Exact<{
  productId: Scalars['Int'];
}>;

export type CreateWishListMutation = {
  __typename?: 'Mutation';
  createWishlist: boolean;
};

export type DeleteMyAccountMutationVariables = Exact<{
  id: Scalars['Int'];
}>;

export type DeleteMyAccountMutation = {
  __typename?: 'Mutation';
  deleteMyAccount: boolean;
};

export type DeleteProductMutationVariables = Exact<{
  id: Scalars['Int'];
  stripeProductId: Scalars['String'];
}>;

export type DeleteProductMutation = {
  __typename?: 'Mutation';
  deleteProduct: boolean;
};

export type DeleteProductAsAdminMutationVariables = Exact<{
  stripeProductId: Scalars['String'];
  id: Scalars['Int'];
}>;

export type DeleteProductAsAdminMutation = {
  __typename?: 'Mutation';
  deleteProductAsAdmin: boolean;
};

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['Int'];
}>;

export type DeleteUserMutation = {
  __typename?: 'Mutation';
  deleteUser: boolean;
};

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;

export type ForgotPasswordMutation = {
  __typename?: 'Mutation';
  forgotPassword: boolean;
};

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;

export type LoginMutation = {
  __typename?: 'Mutation';
  login: {
    __typename?: 'UserResponse';
    errors?:
      | Array<{ __typename?: 'FieldError'; field: string; message: string }>
      | null
      | undefined;
    user?:
      | {
          __typename?: 'User';
          id: number;
          email: string;
          firstName: string;
          lastName: string;
          isAdmin: boolean;
        }
      | null
      | undefined;
  };
};

export type LogoutMutationVariables = Exact<{ [key: string]: never }>;

export type LogoutMutation = { __typename?: 'Mutation'; logout: boolean };

export type MakeUserAdminMutationVariables = Exact<{
  id: Scalars['Int'];
}>;

export type MakeUserAdminMutation = {
  __typename?: 'Mutation';
  makeUserAdmin: boolean;
};

export type MakeUserRegularUserMutationVariables = Exact<{
  id: Scalars['Int'];
}>;

export type MakeUserRegularUserMutation = {
  __typename?: 'Mutation';
  makeUserRegularUser: boolean;
};

export type RegisterMutationVariables = Exact<{
  options: UserRegisterInput;
}>;

export type RegisterMutation = {
  __typename?: 'Mutation';
  register: {
    __typename?: 'UserResponse';
    errors?:
      | Array<{ __typename?: 'FieldError'; field: string; message: string }>
      | null
      | undefined;
    user?:
      | {
          __typename?: 'User';
          id: number;
          email: string;
          firstName: string;
          lastName: string;
          isAdmin: boolean;
        }
      | null
      | undefined;
  };
};

export type UpdateCartQuantityMutationVariables = Exact<{
  quantity: Scalars['Int'];
  id: Scalars['Int'];
}>;

export type UpdateCartQuantityMutation = {
  __typename?: 'Mutation';
  updateCartQuantity: {
    __typename?: 'CartResponse';
    errors?:
      | Array<{ __typename?: 'FieldError'; field: string; message: string }>
      | null
      | undefined;
  };
};

export type UpdateProductMutationVariables = Exact<{
  input: ProductUpdateInput;
  id: Scalars['Int'];
}>;

export type UpdateProductMutation = {
  __typename?: 'Mutation';
  updateProduct?:
    | {
        __typename?: 'Product';
        id: number;
        image: string;
        brand: string;
        description: string;
        price: number;
        publicId: string;
        creator: { __typename?: 'User'; fullName: string };
      }
    | null
    | undefined;
};

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = {
  __typename?: 'Query';
  me?:
    | {
        __typename?: 'User';
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        isAdmin: boolean;
      }
    | null
    | undefined;
};

export type OrdersQueryVariables = Exact<{ [key: string]: never }>;

export type OrdersQuery = {
  __typename?: 'Query';
  orders: Array<{
    __typename?: 'Order';
    id: number;
    status: string;
    total: number;
    creatorId: number;
    orderDetailsId: number;
    paymentId: number;
  }>;
};

export type ProductQueryVariables = Exact<{
  id: Scalars['Int'];
}>;

export type ProductQuery = {
  __typename?: 'Query';
  product?:
    | {
        __typename?: 'Product';
        id: number;
        brand: string;
        description: string;
        image: string;
        price: number;
        name: string;
        stripePriceId: string;
        stripeProductId: string;
        creator: { __typename?: 'User'; id: number };
      }
    | null
    | undefined;
};

export type ProductsQueryVariables = Exact<{ [key: string]: never }>;

export type ProductsQuery = {
  __typename?: 'Query';
  products: Array<{
    __typename?: 'Product';
    id: number;
    brand: string;
    descriptionSnippet: string;
    image: string;
    name: string;
    price: number;
    description: string;
    stripeProductId: string;
    creator: { __typename?: 'User'; id: number; fullName: string };
  }>;
};

export type UserQueryVariables = Exact<{
  userId: Scalars['Int'];
}>;

export type UserQuery = {
  __typename?: 'Query';
  user?:
    | {
        __typename?: 'User';
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        isAdmin: boolean;
        createdAt: string;
        updatedAt: string;
      }
    | null
    | undefined;
};

export type UsersQueryVariables = Exact<{ [key: string]: never }>;

export type UsersQuery = {
  __typename?: 'Query';
  users?:
    | Array<{
        __typename: 'User';
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        isAdmin: boolean;
        createdAt: string;
        updatedAt: string;
      }>
    | null
    | undefined;
};

export type WishlistQueryVariables = Exact<{
  productId: Scalars['Int'];
}>;

export type WishlistQuery = {
  __typename?: 'Query';
  wishlist: {
    __typename?: 'Wishlist';
    id: number;
    productId: number;
    creatorId: number;
  };
};

export type QueryQueryVariables = Exact<{ [key: string]: never }>;

export type QueryQuery = {
  __typename?: 'Query';
  wishlists: Array<{ __typename?: 'Wishlist'; id: number; productId: number }>;
};

export const ProductFragmentFragmentDoc = gql`
  fragment ProductFragment on Product {
    id
    brand
    description
    image
    price
    name
    stripePriceId
    stripeProductId
    creator {
      id
    }
  }
`;
export const ProductsFragmentFragmentDoc = gql`
  fragment ProductsFragment on Product {
    id
    brand
    descriptionSnippet
    image
    name
    price
    description
    stripeProductId
    creator {
      id
      fullName
    }
  }
`;
export const ErrorFragmentDoc = gql`
  fragment Error on FieldError {
    field
    message
  }
`;
export const UserFragmentFragmentDoc = gql`
  fragment UserFragment on User {
    id
    email
    firstName
    lastName
    isAdmin
  }
`;
export const UserResponseFragmentFragmentDoc = gql`
  fragment UserResponseFragment on UserResponse {
    errors {
      ...Error
    }
    user {
      ...UserFragment
    }
  }
  ${ErrorFragmentDoc}
  ${UserFragmentFragmentDoc}
`;
export const CartsDocument = gql`
  query Carts {
    carts {
      id
      quantity
      creatorId
      productId
      total
      product {
        name
        image
        brand
        price
      }
    }
  }
`;

export function useCartsQuery(
  options: Omit<Urql.UseQueryArgs<CartsQueryVariables>, 'query'> = {},
) {
  return Urql.useQuery<CartsQuery>({ query: CartsDocument, ...options });
}
export const ChangePasswordDocument = gql`
  mutation ChangePassword($newPassword: String!, $token: String!) {
    changePassword(newPassword: $newPassword, token: $token) {
      errors {
        message
        field
      }
    }
  }
`;

export function useChangePasswordMutation() {
  return Urql.useMutation<
    ChangePasswordMutation,
    ChangePasswordMutationVariables
  >(ChangePasswordDocument);
}
export const CreateCartDocument = gql`
  mutation CreateCart($quantity: Int!, $productId: Int!) {
    createCart(quantity: $quantity, productId: $productId)
  }
`;

export function useCreateCartMutation() {
  return Urql.useMutation<CreateCartMutation, CreateCartMutationVariables>(
    CreateCartDocument,
  );
}
export const CreateOrderDocument = gql`
  mutation CreateOrder($total: Int!) {
    createOrder(total: $total) {
      id
    }
  }
`;

export function useCreateOrderMutation() {
  return Urql.useMutation<CreateOrderMutation, CreateOrderMutationVariables>(
    CreateOrderDocument,
  );
}
export const CreateOrderDetailsDocument = gql`
  mutation CreateOrderDetails(
    $productId: Int!
    $orderId: Int!
    $quantity: Int!
  ) {
    createOrderDetails(
      productId: $productId
      orderId: $orderId
      quantity: $quantity
    ) {
      errors {
        message
        field
      }
    }
  }
`;

export function useCreateOrderDetailsMutation() {
  return Urql.useMutation<
    CreateOrderDetailsMutation,
    CreateOrderDetailsMutationVariables
  >(CreateOrderDetailsDocument);
}
export const CreateProductDocument = gql`
  mutation CreateProduct($input: ProductCreateInput!) {
    createProduct(input: $input) {
      id
      image
      name
      price
      brand
      descriptionSnippet
    }
  }
`;

export function useCreateProductMutation() {
  return Urql.useMutation<
    CreateProductMutation,
    CreateProductMutationVariables
  >(CreateProductDocument);
}
export const CreateSignatureDocument = gql`
  mutation CreateSignature {
    createImageSignature {
      signature
      timestamp
    }
  }
`;

export function useCreateSignatureMutation() {
  return Urql.useMutation<
    CreateSignatureMutation,
    CreateSignatureMutationVariables
  >(CreateSignatureDocument);
}
export const CreateWishListDocument = gql`
  mutation CreateWishList($productId: Int!) {
    createWishlist(productId: $productId)
  }
`;

export function useCreateWishListMutation() {
  return Urql.useMutation<
    CreateWishListMutation,
    CreateWishListMutationVariables
  >(CreateWishListDocument);
}
export const DeleteMyAccountDocument = gql`
  mutation DeleteMyAccount($id: Int!) {
    deleteMyAccount(id: $id)
  }
`;

export function useDeleteMyAccountMutation() {
  return Urql.useMutation<
    DeleteMyAccountMutation,
    DeleteMyAccountMutationVariables
  >(DeleteMyAccountDocument);
}
export const DeleteProductDocument = gql`
  mutation DeleteProduct($id: Int!, $stripeProductId: String!) {
    deleteProduct(id: $id, stripeProductId: $stripeProductId)
  }
`;

export function useDeleteProductMutation() {
  return Urql.useMutation<
    DeleteProductMutation,
    DeleteProductMutationVariables
  >(DeleteProductDocument);
}
export const DeleteProductAsAdminDocument = gql`
  mutation DeleteProductAsAdmin($stripeProductId: String!, $id: Int!) {
    deleteProductAsAdmin(stripeProductId: $stripeProductId, id: $id)
  }
`;

export function useDeleteProductAsAdminMutation() {
  return Urql.useMutation<
    DeleteProductAsAdminMutation,
    DeleteProductAsAdminMutationVariables
  >(DeleteProductAsAdminDocument);
}
export const DeleteUserDocument = gql`
  mutation DeleteUser($id: Int!) {
    deleteUser(id: $id)
  }
`;

export function useDeleteUserMutation() {
  return Urql.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(
    DeleteUserDocument,
  );
}
export const ForgotPasswordDocument = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;

export function useForgotPasswordMutation() {
  return Urql.useMutation<
    ForgotPasswordMutation,
    ForgotPasswordMutationVariables
  >(ForgotPasswordDocument);
}
export const LoginDocument = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ...UserResponseFragment
    }
  }
  ${UserResponseFragmentFragmentDoc}
`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
}
export const LogoutDocument = gql`
  mutation Logout {
    logout
  }
`;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(
    LogoutDocument,
  );
}
export const MakeUserAdminDocument = gql`
  mutation MakeUserAdmin($id: Int!) {
    makeUserAdmin(id: $id)
  }
`;

export function useMakeUserAdminMutation() {
  return Urql.useMutation<
    MakeUserAdminMutation,
    MakeUserAdminMutationVariables
  >(MakeUserAdminDocument);
}
export const MakeUserRegularUserDocument = gql`
  mutation MakeUserRegularUser($id: Int!) {
    makeUserRegularUser(id: $id)
  }
`;

export function useMakeUserRegularUserMutation() {
  return Urql.useMutation<
    MakeUserRegularUserMutation,
    MakeUserRegularUserMutationVariables
  >(MakeUserRegularUserDocument);
}
export const RegisterDocument = gql`
  mutation Register($options: UserRegisterInput!) {
    register(options: $options) {
      ...UserResponseFragment
    }
  }
  ${UserResponseFragmentFragmentDoc}
`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(
    RegisterDocument,
  );
}
export const UpdateCartQuantityDocument = gql`
  mutation UpdateCartQuantity($quantity: Int!, $id: Int!) {
    updateCartQuantity(quantity: $quantity, id: $id) {
      errors {
        field
        message
      }
    }
  }
`;

export function useUpdateCartQuantityMutation() {
  return Urql.useMutation<
    UpdateCartQuantityMutation,
    UpdateCartQuantityMutationVariables
  >(UpdateCartQuantityDocument);
}
export const UpdateProductDocument = gql`
  mutation UpdateProduct($input: ProductUpdateInput!, $id: Int!) {
    updateProduct(input: $input, id: $id) {
      id
      image
      brand
      description
      price
      publicId
      creator {
        fullName
      }
    }
  }
`;

export function useUpdateProductMutation() {
  return Urql.useMutation<
    UpdateProductMutation,
    UpdateProductMutationVariables
  >(UpdateProductDocument);
}
export const MeDocument = gql`
  query Me {
    me {
      ...UserFragment
    }
  }
  ${UserFragmentFragmentDoc}
`;

export function useMeQuery(
  options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {},
) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
}
export const OrdersDocument = gql`
  query Orders {
    orders {
      id
      status
      total
      creatorId
      orderDetailsId
      paymentId
    }
  }
`;

export function useOrdersQuery(
  options: Omit<Urql.UseQueryArgs<OrdersQueryVariables>, 'query'> = {},
) {
  return Urql.useQuery<OrdersQuery>({ query: OrdersDocument, ...options });
}
export const ProductDocument = gql`
  query Product($id: Int!) {
    product(id: $id) {
      ...ProductFragment
    }
  }
  ${ProductFragmentFragmentDoc}
`;

export function useProductQuery(
  options: Omit<Urql.UseQueryArgs<ProductQueryVariables>, 'query'> = {},
) {
  return Urql.useQuery<ProductQuery>({ query: ProductDocument, ...options });
}
export const ProductsDocument = gql`
  query Products {
    products {
      ...ProductsFragment
    }
  }
  ${ProductsFragmentFragmentDoc}
`;

export function useProductsQuery(
  options: Omit<Urql.UseQueryArgs<ProductsQueryVariables>, 'query'> = {},
) {
  return Urql.useQuery<ProductsQuery>({ query: ProductsDocument, ...options });
}
export const UserDocument = gql`
  query User($userId: Int!) {
    user(id: $userId) {
      id
      firstName
      lastName
      email
      isAdmin
      createdAt
      updatedAt
    }
  }
`;

export function useUserQuery(
  options: Omit<Urql.UseQueryArgs<UserQueryVariables>, 'query'> = {},
) {
  return Urql.useQuery<UserQuery>({ query: UserDocument, ...options });
}
export const UsersDocument = gql`
  query Users {
    users {
      __typename
      id
      email
      firstName
      lastName
      isAdmin
      createdAt
      updatedAt
    }
  }
`;

export function useUsersQuery(
  options: Omit<Urql.UseQueryArgs<UsersQueryVariables>, 'query'> = {},
) {
  return Urql.useQuery<UsersQuery>({ query: UsersDocument, ...options });
}
export const WishlistDocument = gql`
  query Wishlist($productId: Int!) {
    wishlist(productId: $productId) {
      id
      productId
      creatorId
    }
  }
`;

export function useWishlistQuery(
  options: Omit<Urql.UseQueryArgs<WishlistQueryVariables>, 'query'> = {},
) {
  return Urql.useQuery<WishlistQuery>({ query: WishlistDocument, ...options });
}
export const QueryDocument = gql`
  query Query {
    wishlists {
      id
      productId
    }
  }
`;

export function useQueryQuery(
  options: Omit<Urql.UseQueryArgs<QueryQueryVariables>, 'query'> = {},
) {
  return Urql.useQuery<QueryQuery>({ query: QueryDocument, ...options });
}
