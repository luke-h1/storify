import { Image } from 'cloudinary-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Product,
  useCreateProductMutation,
  useCreateSignatureMutation,
  User,
  useUpdateProductMutation,
} from '../generated/graphql';
import { useIsAuth } from '../hooks/useIsAuth';

interface IUploadImageResponse {
  // eslint-disable-next-line camelcase
  secure_url: string;
}

async function uploadImage(
  image: File,
  signature: string,
  timestamp: number,
): Promise<IUploadImageResponse> {
  const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
  const formData = new FormData();
  formData.append('file', image);
  formData.append('signature', signature);
  formData.append('timestamp', timestamp.toString());
  formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_KEY);

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });
  return response.json();
}
interface IFormData {
  name: string;
  image: FileList;
  brand: string;
  category: string;
  description: string;
  price: number;
}

interface IProps {
  product?: Product;
}

export default function HouseForm({ product }: IProps) {
  const [, createProduct] = useCreateProductMutation();
  const [, updateProduct] = useUpdateProductMutation();
  const [, createSignature] = useCreateSignatureMutation();

  const router = useRouter();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const { register, handleSubmit, setValue, errors, watch } =
    useForm<IFormData>({
      defaultValues: product
        ? {
            name: product.name,
            image: product.image,
            brand: product.brand,
            category: product.category,
            description: product.description,
            price: product.price,
          }
        : {},
    });

  useEffect(() => {
    register({ name: 'name' }, { required: 'Please enter the product name' });
    register({ name: 'image' }, { required: 'Please upload at least 1 image' });
    register({ name: 'brand' }, { required: 'Please enter the product brand' });
    register(
      { name: 'category' },
      { required: 'Please enter the product category' },
    );
    register(
      { name: 'description' },
      { required: 'Please enter the product description' },
    );
    register({ name: 'price' }, { required: 'Please enter the product price' });
  }, [register]);

  const handleCreate = async (data: IFormData) => {
    const { data: signatureData } = await createSignature();
    if (signatureData) {
      const { signature, timestamp } = signatureData.createSignature;
      const imageData = await uploadImage(data.image[0], signature, timestamp);
      const { data: productData } = await createProduct({
        input: {
          name: data.name,
          image: imageData.secure_url,
          brand: data.brand,
          category: data.category,
          description: data.description,
          price: data.price,
        },
      });
      if (productData?.createProduct) {
        router.push(`/products/${productData.createProduct.id}`);
      }
    }
  };

  const handleUpdate = async (currentProduct: Product, data: IFormData) => {
    let { image } = currentProduct; // secure URL

    // user wants to update image
    if (data.image[0]) {
      const { data: signatureData } = await createSignature();
      if (signatureData) {
        const { signature, timestamp } = signatureData.createSignature;
        const imageData = await uploadImage(
          data.image[0],
          signature,
          timestamp,
        );
        image = imageData.secure_url;
      }
    }
    const { data: productData } = await updateProduct({
      id: currentProduct.id,
      input: {
        name: data.name,
        image,
        brand: data.brand,
        category: data.category,
        description: data.description,
        price: data.price,
      },
    });
    if (productData?.updateProduct) {
      router.push(`/products/${currentProduct.id}`);
    }
  };

  const onSubmit = (data: IFormData) => {
    setSubmitting(true);
    if (product) {
      // we're updating a product
      handleUpdate(product, data);
    } else {
      // we're creating a product for the first time
      handleCreate(data);
    }
  };

  return <>hello</>;
}
