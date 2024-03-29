import Link from 'next/link';
import * as React from 'react';

const PageHeader = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactElement;
}) => (
  <header className={`pt-2 w-full ${className}`}>
    <Link href="/" className="text-blue-400 font-mono">
      sew.clothing
    </Link>
    {children}
  </header>
);

export default PageHeader;
