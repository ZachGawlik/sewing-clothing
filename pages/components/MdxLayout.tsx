import * as React from 'react';
import Link from 'next/link';
import { css } from '@emotion/react';
import styles from '../../styles/Home.module.css';
import PageHeader from './PageHeader';

// TODO: Head and meta and whatnot
const MdxLayout = ({
  children,
  showFooter,
}: {
  children: React.ReactElement;
  showFooter?: boolean;
}) => {
  return (
    <div className={`${styles.container}`}>
      <PageHeader className="max-w-prose lg:max-w-none" />
      <main className={styles.main}>
        <div className="prose prose-invert">{children}</div>
      </main>
      {showFooter && (
        <footer
          className="w-full max-w-prose lg:max-w-none"
          css={css`
            padding-bottom: calc(env(safe-area-inset-bottom, 0) + 0.5em);
          `}
        >
          <Link href="/">
            <a className="text-blue-400 font-mono">sewing.clothing</a>
          </Link>
        </footer>
        // TODO: iphone safe spadding
      )}
    </div>
  );
};

export default MdxLayout;
