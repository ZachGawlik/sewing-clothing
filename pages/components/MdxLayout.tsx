import * as React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { css } from '@emotion/react';
import styles from '../../styles/Home.module.css';
import PageHeader from './PageHeader';

// TODO: Head and meta and whatnot
const MdxLayout = ({
  children,
  showFooter,
  meta,
}: {
  children: React.ReactElement;
  showFooter?: boolean;
  meta: {
    title: string;
    description: string;
  };
}) => {
  return (
    <div className={`${styles.container}`}>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
      </Head>
      <PageHeader className="max-w-prose lg:max-w-none" />
      <main className={`${styles.main} prose prose-invert`}>
        <h1>{meta.title}</h1>
        {children}
      </main>
      {showFooter && (
        <footer
          className="w-full max-w-prose lg:max-w-none"
          css={css`
            padding-bottom: calc(env(safe-area-inset-bottom, 0) + 0.5em);
          `}
        >
          <Link href="/" className="text-blue-400 font-mono">
            sew.clothing
          </Link>
        </footer>
        // TODO: iphone safe spadding
      )}
    </div>
  );
};

export default MdxLayout;
