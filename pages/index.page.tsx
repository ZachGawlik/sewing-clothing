import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Global, css } from '@emotion/react';

import styles from '../styles/Home.module.css';

const HomePageLink = ({
  emoji,
  text,
  href,
}: {
  emoji: string;
  text: string;
  href: string;
}) => {
  return (
    <p key={text}>
      {emoji}
      <Link href={href} className="pl-2 hover:underline hover:text-sky-300">
        {text}
      </Link>
    </p>
  );
};

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
      <main className="prose prose-invert prose-a:text-sky-100 prose-a:no-underline md:px-4 lg:px-8">
        <h1 className="font-mono text-4xl text-center">sew.clothing</h1>
        <div>
          <div>
            <img src="/under-construction-1.png" alt="" />
            {[
              {
                emoji: '📄',
                text: 'Getting started with sewing clothing',
                href: '/start',
              },
              {
                emoji: '📄',
                text: 'Sewing with Vinyl',
                href: '/sewing-with-vinyl',
              },
              {
                emoji: '📄',
                text: 'NYC Garment District Stores',
                href: '/nyc-stores',
              },
              {
                emoji: '📐',
                text: 'Length converter. inch ↔ cm',
                href: '/tools/length',
              },
            ].map((props) => (
              <HomePageLink key={props.href} {...props} />
            ))}
          </div>
          <div>
            <h2>My Own Sewing:</h2>
            {[
              {
                emoji: '📄',
                text: 'VikiSews Bernard Coat',
                href: '/makes/vikisews-bernard-coat',
              },
              {
                emoji: '📄',
                text: 'Y2K Blue Vinyl Jacket',
                href: '/makes/y2k-vinyl-jacket',
              },
            ].map((props) => (
              <HomePageLink key={props.href} {...props} />
            ))}
            <img src="/under-construction-1.png" alt="" />
          </div>
        </div>
      </main>
    </div>
  );
};
/* eslint-enable @next/next/no-img-element */

export default Home;
