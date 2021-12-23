import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import { css } from '@emotion/react';

const ResourcesPage: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>sewing resources</title>
        <meta name="description" content="Sewing resources" />
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
          /resources
        </h1>
        <p>Aka links and book recommendations</p>
        <ul>
          <li>
            <a href="http://www.burieddiamond.com/blog/2021/10/5/my-fabric-bled-color-everywhere-how-to-save-fabric-when-the-color-is-bleeding">
              Buried Diamond on fabric color bleeding - when to use oxiclean &
              color catchers & more
            </a>
          </li>
          <li></li>
          <li></li>
        </ul>
        <div>
          <p>Images</p>
          <p>Serger tension</p>
          <img src="/serger.jpg" alt="" />
        </div>
      </main>
    </div>
  );
};

export default ResourcesPage;
