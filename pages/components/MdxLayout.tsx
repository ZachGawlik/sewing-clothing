import * as React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { css } from '@emotion/react';
import styles from '../../styles/Home.module.css';
import PageHeader from './PageHeader';
import { MDXProvider } from '@mdx-js/react';

type HProps = { id?: string };

const Heading = ({
  as,
  id,
  ...rest
}: {
  as: React.ElementType;
  id?: string;
}) => {
  const HeadingComponent = as;
  return (
    <div className="relative">
      <Link href={`#${id}`}>
        <div
          className="absolute not-prose"
          css={{ transform: 'translateX(-20px)', top: 'calc(50% - 6px)' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-link"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        </div>
      </Link>
      <HeadingComponent id={id} {...rest} />
    </div>
  );
};

const components = {
  h2: (props: HProps) => <Heading as="h2" {...props} />,
  h3: (props: HProps) => <Heading as="h3" {...props} />,
  h4: (props: HProps) => <Heading as="h4" {...props} />,
};

export type MdxLayoutProps = {
  children: React.ReactElement;
  showFooter?: boolean;
  meta: {
    title: string;
    description: string;
  };
};

const MdxLayout = ({ children, showFooter, meta }: MdxLayoutProps) => {
  return (
    <div className={`${styles.container}`}>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
      </Head>
      <PageHeader className="max-w-prose lg:max-w-none" />

      <MDXProvider components={components}>
        <main className={`${styles.main} prose prose-invert`}>
          <h1>{meta.title}</h1>
          {children}
        </main>
      </MDXProvider>
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
