import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import styles from '../styles/Home.module.css';

/* eslint-disable @next/next/no-img-element */
const Home: NextPage = () => {
  return (
    <div
      className={`${styles.container} bg-gray-900 text-white justify-center`}
    >
      <Head>
        <title>sewing.clothing</title>
        <meta name="description" content="Sewing clothing - tools & thoughts" />
      </Head>
      <main className={styles.main}>
        <div className="prose prose-invert prose-a:text-sky-200 prose-a:no-underline">
          <img src="/under-construction-1.png" alt="" />
          <h1 className="font-mono text-4xl text-center">sewing.clothing</h1>
          {[
            {
              emoji: '🏁',
              text: 'Getting started with sewing clothing',
              href: '/start',
            },
            {
              emoji: '📐',
              text: 'Length converter. inch ↔ cm',
              href: '/tools/length',
            },
            { emoji: '🔎', text: 'Resources', href: '/resources' },
          ].map(({ emoji, text, href }) => (
            <p key={text}>
              {emoji}
              <Link href={href}>
                <a className="pl-2 hover:underline hover:text-sky-300">
                  {text}
                </a>
              </Link>
            </p>
          ))}
          <img src="/under-construction-1.png" alt="" />
        </div>
      </main>
    </div>
  );
};
/* eslint-enable @next/next/no-img-element */

export default Home;
