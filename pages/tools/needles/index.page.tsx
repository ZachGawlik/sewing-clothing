import type { NextPage } from 'next';
import Head from 'next/head';

const MetricPage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Metric Imperial Converter - Inches and Centimeters</title>
        <meta name="description" content="Sewing needle identifier" />
        <meta name="theme-color" content="rgb(17,24,39)" />
      </Head>
      <main className="bg-gray-900 text-white min-h-screen space-y-8 py-4">
        <section>
          <p>Needle identification for common brands:</p>
        </section>
        <section>
          <h2 className="text-2xl">
            <a id="schmetz" href="#schmetz">
              Schmetz
            </a>
          </h2>
          <img src="/needle-id-schmetz.png" alt="" />
        </section>
        <section>
          <h2 className="text-2xl">
            <a id="schmetz" href="#singer">
              Singer
            </a>
          </h2>
          <img src="/needle-id-singer.png" alt="" />
          <p className="text-xs text-gray-300 text-right">
            <a href="https://www.reddit.com/r/sewing/comments/q3yfy9/singer_sewing_needle_reference/">
              (image credit)
            </a>
          </p>
        </section>
      </main>
    </div>
  );
};

export default MetricPage;
