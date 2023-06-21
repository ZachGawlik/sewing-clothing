import Head from 'next/head';
import styles from '../styles/Home.module.css';
import PageHeader from './components/PageHeader';

const FourOhFourPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>404 | sew.clothing</title>
      </Head>
      <PageHeader className="max-w-prose lg:max-w-none" />
      <main className="prose prose-invert">
        <h1>404</h1>
        <p>
          Page not found. Go back to <a href="/">home</a>.
        </p>
      </main>
    </div>
  );
};

export default FourOhFourPage;
