import Head from './Head';
import styles from './page.module.scss';

interface Props {
  className?: string;
  children: React.ReactNode;
  description?: string;
  ogImage?: string;
  title: string;
}

const Page = ({
  children,
  description,
  ogImage,
  title,
  className = 'container',
}: Props) => {
  return (
    <>
      <Head title={title} description={description} ogImage={ogImage} />
      <div className={className}>
        <div className={styles.content}>{children}</div>
      </div>
    </>
  );
};
export default Page;
