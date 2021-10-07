import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import { css } from '@emotion/react';
import styles from '../../../styles/Home.module.css';
import MetricApp from './MetricApp';

const MetricPage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Metric Imperial Converter - Inches and Centimeters</title>
        <meta
          name="description"
          content="Sewing tools - Metric Imperial length converter"
        />
      </Head>
      <main className={styles.main}>
        <div>
          <Link href="/">sewing.clothing</Link>
          <Link href="/tools">/tools</Link>/metric
        </div>
        <h1
          css={css`
            color: #0070f3;
            line-height: 1.15;
            font-size: 2em;
            text-align: center;
            font-family: Menlo, Monaco, 'Courier New', Courier, monospace;
          `}
        >
          Metric Imperial length converter
        </h1>
        <MetricApp />
      </main>
    </div>
  );
};

export default MetricPage;
