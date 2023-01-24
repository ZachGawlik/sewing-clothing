import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';

const ToolsPage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>sewing tools</title>
        <meta name="description" content="Sewing tools" />
      </Head>
      <main className="min-h-screen space-y-8 py-4 px-4">
        <h1 className="font-mono">
          <Link href="/" className="text-blue-400">
            sew.clothing
          </Link>
          /tools
        </h1>
        <div className="space-y-8">
          <section>
            <p>This will have all the future tools</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                <Link href="/tools/length" className="text-blue-400">
                  Length conversion. cm{'<->'}inch
                </Link>
              </li>
              <li>GSM / Oz converter and reference</li>
              <li>circle skirt calculator</li>
              <li>bias strip calculator</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ToolsPage;
