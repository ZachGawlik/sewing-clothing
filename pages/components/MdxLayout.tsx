import * as React from 'react';
import Link from 'next/link';
import styles from '../../styles/Home.module.css';

// TODO: Head and meta and whatnot
const MdxLayout = ({ children }: { children: React.ReactElement }) => {
  return (
    <div className={`${styles.container} bg-gray-900 text-white`}>
      <header className="w-full max-w-prose lg:max-w-none">
        <Link href="/">
          <a className="text-blue-400 font-mono">sewing.clothing</a>
        </Link>
      </header>

      <main className={styles.main}>
        <div className="prose prose-invert bg-gray-900">{children}</div>
      </main>
    </div>
  );
};

export default MdxLayout;
