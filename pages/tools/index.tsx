import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import { css } from '@emotion/react';

const ToolsPage: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>sewing tools</title>
        <meta name="description" content="Sewing tools" />
      </Head>

      <main className={`${styles.main} prose`}>
        <h1
          css={css`
            color: #0070f3;
            line-height: 1.15;
            font-size: 7vw;
            text-align: center;
            font-family: Menlo, Monaco, 'Courier New', Courier, monospace;
          `}
        >
          <Link href="/">
            <a>sewing.clothing</a>
          </Link>
          /tools
        </h1>
        <p>This will have all the future tools</p>
        <ul>
          <li>
            <Link href="/tools/length">
              <a> cm {'<->'} inch , Metric & Imperial Conversion</a>
            </Link>
          </li>
          <li>GSM / Oz converter and reference</li>
          <li>circle skirt calculator</li>
          <li>bias strip calculator</li>
          <li>
            Gutermann thread retail vs wholesale lookup. And colorblind-friendly
            color names
          </li>
        </ul>
        <p>More static resources</p>
        <ul>
          <li>Gutermann Mara x Needle size reference</li>
          <li>Dritz / Schmetz / Organ needle identification</li>
        </ul>
      </main>
    </div>
  );
};

export default ToolsPage;
