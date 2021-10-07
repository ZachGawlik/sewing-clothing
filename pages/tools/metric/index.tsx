import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import { css } from '@emotion/react';
import styles from '../../../styles/Home.module.css';
import MetricApp from './MetricApp';

const MetricPage: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>sewing tools</title>
        <meta
          name="description"
          content="Sewing tools - Metric Imperial length converter"
        />
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
          <Link href="/">sewing.clothing</Link>
          <Link href="/tools">/tools</Link>
          <br />
          /metric
        </h1>
        <MetricApp />
      </main>
    </div>
  );
};

export default MetricPage;
