import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Global, css } from '@emotion/react';

import styles from '../styles/Home.module.css';

/* eslint-disable @next/next/no-img-element */
const Home: NextPage = () => {
  return (
    <div className={`${styles.container} justify-center`}>
      <Head>
        <title>Sewing clothing</title>
        <meta
          name="description"
          content="Helpful tools & info for garment sewing"
        />
        <meta name="theme-color" content="#111827" />
      </Head>
      <Global
        styles={css`
          body {
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
        `}
      />
      <main className={styles.main}>
        <div className="prose prose-invert prose-a:text-sky-200 prose-a:no-underline">
          <img src="/under-construction-1.png" alt="" />
          <h1 className="font-mono text-4xl text-center">sewing.clothing</h1>
          {[
            {
              emoji: '📄',
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
              <Link href={href} className="pl-2 hover:underline hover:text-sky-300">

                {text}

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
