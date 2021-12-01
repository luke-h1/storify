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

export type MutationCreateProductArgs = {
  input: ProductCreateInput;
};

export type MutationDeleteProductArgs = {
  id: Scalars['Int'];
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
  input: ProductCreateInput;
};

export type Product = {
  __typename?: 'Product';
  brand: Scalars['String'];
  category: Scalars['String'];
  createdAt: Scalars['String'];
  creator: User;
  creatorId: Scalars['Float'];
  description: Scalars['String'];
  descriptionSnippet: Scalars['String'];
  id: Scalars['Int'];
  image: Scalars['String'];
  name: Scalars['String'];
  price: Scalars['Float'];
  publicId: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type ProductCreateInput = {
  brand: Scalars['String'];
  category: Scalars['String'];
  description: Scalars['String'];
  image: Scalars['String'];
  name: Scalars['String'];
  price: Scalars['Float'];
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
  product?: Maybe<Product>;
  products: Array<Product>;
};

export type QueryProductArgs = {
  id: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  fullName: Scalars['String'];
  id: Scalars['Int'];
  isAdmin: Scalars['String'];
  lastName: Scalars['String'];
  role: Scalars['String'];
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
};

export type UserResponseFragmentFragment = {
  __typename?: 'UserResponse';
  errors?:
    | Array<{ __typename?: 'FieldError'; field: string; message: string }>
    | null
    | undefined;
  user?:
    | { __typename?: 'User'; id: number; email: string; firstName: string }
    | null
    | undefined;
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
    category: string;
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
      | { __typename?: 'User'; id: number; email: string; firstName: string }
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
      | { __typename?: 'User'; id: number; email: string; firstName: string }
      | null
      | undefined;
  };
};

export type UpdateProductMutationVariables = Exact<{
  input: ProductCreateInput;
  updateProductId: Scalars['Int'];
}>;

export type UpdateProductMutation = {
  __typename?: 'Mutation';
  updateProduct?:
    | {
        __typename?: 'Product';
        id: number;
        image: string;
        brand: string;
        category: string;
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
    | { __typename?: 'User'; id: number; email: string; firstName: string }
    | null
    | undefined;
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
        category: string;
        description: string;
        image: string;
        price: number;
        name: string;
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
    category: string;
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
export const CreateProductDocument = gql`
  mutation CreateProduct($input: ProductCreateInput!) {
    createProduct(input: $input) {
      id
      image
      name
      price
      brand
      category
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
  mutation DeleteProduct($id: Int!) {
    deleteProduct(id: $id)
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
  mutation UpdateProduct($input: ProductCreateInput!, $updateProductId: Int!) {
    updateProduct(input: $input, id: $updateProductId) {
      id
      image
      brand
      category
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
export const ProductDocument = gql`
  query Product($id: Int!) {
    product(id: $id) {
      id
      brand
      category
      brand
      description
      image
      price
      name
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
      category
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
