import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import Link from 'next/link';
import Loader from '../components/Loader';
import Page from '../components/Page';
import { useProductsQuery } from '../generated/graphql';
import { createurqlClient } from '../utils/createUrqlClient';
import { isServer } from '../utils/isServer';

const Home: NextPage = () => {
  const [{ data, fetching }] = useProductsQuery({
    pause: isServer(),
  });

  if (!data && fetching) {
    return <Loader />;
  }

  return (
    <Page title="Home | Storify" flex={false}>
      <section className="text-gray-600 body-font max-w-800">
        <div className="container px-5 py-24 mx-auto">
          <h1 className="text-4xl text-left mb-10">
            {data?.products && data.products.length > 0
              ? 'Latest products'
              : 'No products'}
          </h1>
          <div className="flex flex-wrap -m-4">
            {data?.products &&
              data?.products.map(p => (
                // eslint-disable-next-line @next/next/link-passhref
                <Link href={`/products/${p.id}`} key={p.id}>
                  <div className="p-4 md:w-1/3" key={p.id}>
                    <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden hover: cursor-pointer">
                      <img
                        className="lg:h-48 md:h-36 w-full object-cover object-center"
                        src={p.image}
                        alt={p.name}
                      />
                      <div className="p-6">
                        <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                          {p.name}
                        </h2>
                        <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                          {p.price}
                        </h1>
                        <p className="leading-relaxed mb-3">
                          {p.descriptionSnippet}
                        </p>
                        <div className="flex items-center flex-wrap ">
                          <a className="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0">
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
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </Page>
  );
};
export default withUrqlClient(createurqlClient, { ssr: true })(Home);
