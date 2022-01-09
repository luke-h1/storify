import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import Link from 'next/link';
import { AiFillHeart } from 'react-icons/ai';
import Loader from '../../components/Loader';
import Page from '../../components/Page';
import {
  useProductsQuery,
  useLikeProductMutation,
} from '../../generated/graphql';
import { createurqlClient } from '../../utils/createUrqlClient';
import { isServer } from '../../utils/isServer';

const LikedProducts: NextPage = () => {
  const [{ data, fetching }] = useProductsQuery({
    pause: isServer(),
  });

  const [, likeProduct] = useLikeProductMutation();

  if (!data && fetching) {
    return <Loader />;
  }
  return (
    <Page title="your liked products" flex={false}>
      <section className="text-gray-600 body-font max-w-800">
        <div className="container px-5 py-24 mx-auto">
          <h1 className="text-4xl text-left mb-10">
            {data?.products &&
              data?.products.map(p =>
                p.liked === true ? 'Your liked products' : 'No liked products',
              )}
          </h1>
          <div className="flex flex-wrap -m-4">
            {data?.products &&
              data?.products.map(
                p =>
                  p.liked === true && (
                    <div className="p-4 md:w-1/3" key={p.id}>
                      <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                        <img
                          className="lg:h-48 md:h-36 w-full object-cover object-center"
                          src={p.image}
                          alt={p.name}
                        />
                        <div className="p-6">
                          <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                            <strong>£{p.price.toFixed(2)}</strong>
                          </h2>
                          <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                            {p.name}
                          </h1>
                          <AiFillHeart
                            style={{ cursor: 'pointer' }}
                            fontSize="25px"
                            fill={p.liked ? 'red' : 'black'}
                            onClick={async () => {
                              await likeProduct({
                                likeProductId: p.id,
                                value: !p.liked,
                              });
                            }}
                          />
                          <p className="leading-relaxed mb-3">
                            {p.descriptionSnippet}
                          </p>
                          <Link href={`/products/${p.id}`}>
                            <a className="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0 hover: cursor-pointer">
                              <div className="flex items-center flex-wrap ">
                                View Product
                                <svg
                                  className="w-4 h-4 ml-2"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M5 12h14" />
                                  <path d="M12 5l7 7-7 7" />
                                </svg>
                              </div>
                            </a>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ),
              )}
          </div>
        </div>
      </section>
    </Page>
  );
};

export default withUrqlClient(createurqlClient, { ssr: true })(LikedProducts);
