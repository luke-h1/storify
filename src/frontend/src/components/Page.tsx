import Head from './Head';
import styles from './page.module.scss';

interface Props {
  children: React.ReactNode;
  description?: string;
  ogImage?: string;
  title: string;
}

const Page = ({ children, description, ogImage, title }: Props) => {
  return (
    <>
      {/* nav */}
      <Head title={title} description={description} ogImage={ogImage} />
      <div className={styles.container}>
        <div className={styles.content}>{children}</div>
      </div>
    </>
  );
};
export default Page;
