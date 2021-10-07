import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { css } from '@emotion/react';

/* eslint-disable @next/next/no-img-element */
const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>sewing.clothing</title>
        <meta name="description" content="Sewing clothing - tools & thoughts" />
      </Head>

      <main className={styles.main}>
        <h1
          css={css`
            color: #0070f3;
            line-height: 1.15;
            font-size: 7vw;
            text-align: center;
            font-family: Menlo, Monaco, 'Courier New', Courier, monospace;
          `}
        >
          sewing.clothing
        </h1>

        <p
          css={css`
            line-height: 1.5;
            font-size: 1.3rem;
            padding: 1em;
            max-width: 100vw;
          `}
        >
          At some point this will have little web apps and maybe helpful
          resources for sewing clothing.
        </p>
        <p>For now, this site is</p>
        <div>
          <img src="/under-construction-1.gif" alt="Under construction" />{' '}
        </div>

        <p>Other pages:</p>
        <ul>
          <li>
            <Link href="/tools">/tools</Link>
          </li>
          <li>
            <Link href="/resources">/resources</Link>
          </li>
        </ul>
      </main>
    </div>
  );
};

export default Home;
