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

export type ChargeInput = {
  amount: Scalars['Int'];
  description: Scalars['String'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  productId: Scalars['Int'];
  productTitle: Scalars['String'];
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
  changePassword: UserResponse;
  charge: Order;
  createImageSignature: ImageSignature;
  createProduct: Product;
  deleteProduct: Scalars['Boolean'];
  forgotPassword: Scalars['Boolean'];
  login: UserResponse;
  logout: Scalars['Boolean'];
  register: UserResponse;
  updateProduct?: Maybe<Product>;
};

export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};

export type MutationChargeArgs = {
  options: ChargeInput;
};

export type MutationCreateProductArgs = {
  input: ProductCreateInput;
};

export type MutationDeleteProductArgs = {
  id: Scalars['Int'];
  stripeProductId: Scalars['String'];
};

export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};

export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type MutationRegisterArgs = {
  options: UserRegisterInput;
};

export type MutationUpdateProductArgs = {
  id: Scalars['Int'];
  input: ProductUpdateInput;
};

export type Order = {
  __typename?: 'Order';
  completed: Scalars['Boolean'];
  createdAt: Scalars['String'];
  creatorId: Scalars['Float'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  id: Scalars['Int'];
  lastName: Scalars['String'];
  price: Scalars['Int'];
  productTitle: Scalars['String'];
  qty: Scalars['Int'];
  transactionId: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Product = {
  __typename?: 'Product';
  brand: Scalars['String'];
  createdAt: Scalars['String'];
  creator: User;
  creatorId: Scalars['Float'];
  description: Scalars['String'];
  descriptionSnippet: Scalars['String'];
  id: Scalars['Int'];
  image: Scalars['String'];
  name: Scalars['String'];
  price: Scalars['Int'];
  publicId: Scalars['String'];
  stripePriceId: Scalars['String'];
  stripeProductId: Scalars['String'];
  updatedAt: Scalars['String'];
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
  me?: Maybe<User>;
  order: Order;
  orders: Array<Order>;
  product?: Maybe<Product>;
  products: Array<Product>;
  user?: Maybe<User>;
  users?: Maybe<Array<User>>;
};

export type QueryOrderArgs = {
  id: Scalars['Int'];
};

export type QueryProductArgs = {
  id: Scalars['Int'];
};

export type QueryUserArgs = {
  id: Scalars['Int'];
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

export type ErrorFragment = {
  __typename?: 'FieldError';
  field: string;
  message: string;
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

export type ChargeMutationVariables = Exact<{
  options: ChargeInput;
}>;

export type ChargeMutation = {
  __typename?: 'Mutation';
  charge: {
    __typename?: 'Order';
    id: number;
    productTitle: string;
    firstName: string;
    lastName: string;
    email: string;
    transactionId: string;
    creatorId: number;
    completed: boolean;
    price: number;
    qty: number;
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

export type DeleteProductMutationVariables = Exact<{
  id: Scalars['Int'];
  stripeProductId: Scalars['String'];
}>;

export type DeleteProductMutation = {
  __typename?: 'Mutation';
  deleteProduct: boolean;
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

export type QueryQueryVariables = Exact<{
  userId: Scalars['Int'];
}>;

export type QueryQuery = {
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
        __typename?: 'User';
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

export type OrderQueryVariables = Exact<{
  orderId: Scalars['Int'];
}>;

export type OrderQuery = {
  __typename?: 'Query';
  order: {
    __typename?: 'Order';
    id: number;
    completed: boolean;
    email: string;
    creatorId: number;
    firstName: string;
    lastName: string;
    productTitle: string;
  };
};

export type OrdersQueryVariables = Exact<{ [key: string]: never }>;

export type OrdersQuery = {
  __typename?: 'Query';
  orders: Array<{
    __typename?: 'Order';
    id: number;
    productTitle: string;
    firstName: string;
    lastName: string;
    qty: number;
    email: string;
    creatorId: number;
    completed: boolean;
    price: number;
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
    creator: { __typename?: 'User'; fullName: string };
  }>;
};

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
export const ChargeDocument = gql`
  mutation Charge($options: ChargeInput!) {
    charge(options: $options) {
      id
      productTitle
      firstName
      lastName
      email
      transactionId
      creatorId
      completed
      price
      qty
    }
  }
`;

export function useChargeMutation() {
  return Urql.useMutation<ChargeMutation, ChargeMutationVariables>(
    ChargeDocument,
  );
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
export const QueryDocument = gql`
  query Query($userId: Int!) {
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

export function useQueryQuery(
  options: Omit<Urql.UseQueryArgs<QueryQueryVariables>, 'query'> = {},
) {
  return Urql.useQuery<QueryQuery>({ query: QueryDocument, ...options });
}
export const UsersDocument = gql`
  query Users {
    users {
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
export const OrderDocument = gql`
  query Order($orderId: Int!) {
    order(id: $orderId) {
      id
      completed
      email
      creatorId
      firstName
      lastName
      productTitle
    }
  }
`;

export function useOrderQuery(
  options: Omit<Urql.UseQueryArgs<OrderQueryVariables>, 'query'> = {},
) {
  return Urql.useQuery<OrderQuery>({ query: OrderDocument, ...options });
}
export const OrdersDocument = gql`
  query Orders {
    orders {
      id
      productTitle
      firstName
      lastName
      qty
      email
      creatorId
      completed
      price
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
      id
      brand
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
  }
`;

export function useProductQuery(
  options: Omit<Urql.UseQueryArgs<ProductQueryVariables>, 'query'> = {},
) {
  return Urql.useQuery<ProductQuery>({ query: ProductDocument, ...options });
}
export const ProductsDocument = gql`
  query Products {
    products {
      id
      brand
      descriptionSnippet
      image
      name
      price
      creator {
        fullName
      }
    }
  }
`;

export function useProductsQuery(
  options: Omit<Urql.UseQueryArgs<ProductsQueryVariables>, 'query'> = {},
) {
  return Urql.useQuery<ProductsQuery>({ query: ProductsDocument, ...options });
}
