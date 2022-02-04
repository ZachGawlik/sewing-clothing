import * as React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import MetricApp from './MetricApp';

const MetricPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Length Converter - inch to cm</title>
        <meta
          name="description"
          content="Metric & Imperial length conversion for sewing. cm to inch, inch to cm"
        />
        <meta name="theme-color" content="rgb(17,24,39)" />
      </Head>
      <MetricApp />
    </>
  );
};

export default MetricPage;
