import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
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
      <main>
        <div className="mb-8 px-12">
          <div>
            <Link href="/">
              <a>sewing.clothing</a>
            </Link>
            <Link href="/tools">
              <a>/tools</a>
            </Link>
            /length
          </div>
          <h1 className="font-mono text-2xl">
            Metric Imperial length converter
          </h1>
        </div>
        <MetricApp />
      </main>
    </div>
  );
};

export default MetricPage;
