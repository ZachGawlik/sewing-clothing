import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import imgUnderConstruction from '../public/under-construction-1.png';

/* eslint-disable @next/next/no-img-element */
const Home: NextPage = () => {
  return (
    <div className={`${styles.container} bg-gray-900 text-white`}>
      <Head>
        <title>sewing.clothing</title>
        <meta name="description" content="Sewing clothing - tools & thoughts" />
      </Head>

      <main className={styles.main}>
        <h1 className="font-mono text-4xl text-center">sewing.clothing</h1>
        <div className="prose prose-invert prose-a:text-slate-100">
          <div>
            <Image
              className="container mx-auto"
              src={imgUnderConstruction}
              alt="Under construction"
            />{' '}
          </div>
          <p>
            <Link href="/start">
              <a>🏁 Getting started with sewing clothing</a>
            </Link>
          </p>
          <p>
            <Link href="/tools/length">
              <a className="text-blue-400">
                📐 Length conversion. cm {'<->'} inch
              </a>
            </Link>
          </p>
          <p>
            <Link href="/references">
              <a>🔎 Resources</a>
            </Link>
          </p>
        </div>
        <div className="mt-16 text-center">
          <p>
            <img src="/under-construction-2.gif" alt="" className="inline" />{' '}
            This site is under active construction{' '}
            <img src="/under-construction-2.gif" alt="" className="inline" />
          </p>
        </div>
      </main>
    </div>
  );
};
/* eslint-enable @next/next/no-img-element */

export default Home;
