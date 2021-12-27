import NextHead from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

interface Props {
  children?: React.ReactNode;
  description?: string;
  ogImage?: string;
  title?: string;
}

const Head = ({
  children,
  title = 'storify, fake ecommerce store',
  description = 'storify',
  ogImage = `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
}: Props) => {
  const router = useRouter();
  return (
    <NextHead>
      <meta charSet="UTF-8" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="twitter:site"
        content={`${process.env.NEXT_PUBLIC_SITE_URL}${router.pathname}`}
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={ogImage} />
      <meta property="og:image" content={ogImage} />
      {children}
    </NextHead>
  );
};
export default Head;
