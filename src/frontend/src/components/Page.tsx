import Head from './Head';

interface Props {
  children: React.ReactNode;
  description?: string;
  ogImage?: string;
  title: string;
  flex?: boolean;
}

const Page = ({
  children,
  description,
  ogImage,
  title,
  flex = true,
}: Props) => {
  return (
    <>
      <Head title={title} description={description} ogImage={ogImage} />
      <div
        className={`max-w-800 w-full ${
          flex && 'flex flex-col align-center items-center'
        }`}
      >
        {children}
      </div>
    </>
  );
};
export default Page;
