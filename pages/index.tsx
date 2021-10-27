import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

/* eslint-disable @next/next/no-img-element */
const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>sewing.clothing</title>
        <meta name="description" content="Sewing clothing - tools & thoughts" />
      </Head>

      <main className={`{styles.main}`}>
        <h1 className="font-mono text-4xl text-center">sewing.clothing</h1>

        <p className="py-2">
          At some point this will have little web apps and maybe helpful
          resources for sewing clothing.
        </p>
        <div className="prose">
          <p>For now, this site is</p>
          <div>
            <img
              className="container mx-auto"
              src="/under-construction-1.gif"
              alt="Under construction"
            />{' '}
          </div>

          <p>Other pages:</p>
          <ul>
            <li>
              <Link href="/tools">
                <a>/tools</a>
              </Link>
            </li>
            <li>
              <Link href="/resources">
                <a>/resources</a>
              </Link>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Home;
