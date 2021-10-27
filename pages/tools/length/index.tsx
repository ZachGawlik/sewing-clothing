import type { NextPage } from 'next';
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
      <main className="bg-gray-900 text-white min-h-screen">
        <MetricApp />
      </main>
    </div>
  );
};

export default MetricPage;
