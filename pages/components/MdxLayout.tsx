import * as React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { css } from '@emotion/react';
import styles from '../../styles/Home.module.css';
import PageHeader from './PageHeader';
import { MDXProvider } from '@mdx-js/react';

type HProps = {
  id?: string;
  children?: React.ReactNode;
  as: React.ElementType;
};

const Heading = ({ as, id, children, ...rest }: HProps) => {
  const HeadingComponent = as;
  return (
    <div
      css={css`
        & a {
          opacity: 0;
          transition: 0.3s ease-in;
        }
        &:hover a {
          opacity: 1;
        }
      `}
    >
      <HeadingComponent id={id} {...rest}>
        {children}&nbsp;
        <Link href={`#${id}`}>
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
            className="feather feather-link inline-block ml-2"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        </Link>
      </HeadingComponent>
    </div>
  );
};

const components = {
  h2: (props: Omit<HProps, 'as'>) => <Heading as="h2" {...props} />,
  h3: (props: Omit<HProps, 'as'>) => <Heading as="h3" {...props} />,
  h4: (props: Omit<HProps, 'as'>) => <Heading as="h4" {...props} />,
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
    <div className={styles.container}>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
      </Head>
      <PageHeader className="max-w-prose lg:max-w-none" />

      <MDXProvider components={components}>
        <main className="prose prose-invert">
          <h1>{meta.title}</h1>
          {children}
        </main>
      </MDXProvider>
      {showFooter && (
        <footer
          className="w-full max-w-prose lg:max-w-none border-t-2 border-blue-400 pt-0 mt-4"
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
