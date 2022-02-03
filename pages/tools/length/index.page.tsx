import * as React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import MetricApp from './MetricApp';

const MetricPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Metric Imperial Converter - Inches and Centimeters</title>
        <meta name="description" content="Sewing length converter, cm & inch" />
        <meta name="theme-color" content="rgb(17,24,39)" />
      </Head>
      <MetricApp />
    </>
  );
};

export default MetricPage;
