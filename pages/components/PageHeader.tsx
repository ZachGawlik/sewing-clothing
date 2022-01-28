import Link from 'next/link';

const PageHeader = () => (
  <header className="w-full max-w-prose lg:max-w-none">
    <Link href="/">
      <a className="text-sky-200 hover:text-sky-300 font-mono">
        sewing.clothing
      </a>
    </Link>
  </header>
);

export default PageHeader;
