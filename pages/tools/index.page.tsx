import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';

const ToolsPage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>sewing tools</title>
        <meta name="description" content="Sewing tools" />
      </Head>

      <main className="bg-gray-900 text-white min-h-screen space-y-8 py-4 px-4">
        <h1 className="font-mono">
          <Link href="/">
            <a className="text-blue-400">sewing.clothing</a>
          </Link>
          /tools
        </h1>
        <div className="space-y-8">
          <section>
            <p>This will have all the future tools</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                <Link href="/tools/length">
                  <a className="text-blue-400">
                    Length conversion. cm {'<->'} inch
                  </a>
                </Link>
              </li>
              <li>circle skirt calculator</li>
              <li>bias strip calculator</li>
              <li>
                Gutermann thread retail vs wholesale lookup. And
                colorblind-friendly color names
              </li>
              <li>GSM / Oz converter and reference</li>
            </ul>
          </section>
          <section>
            <p>More static resources</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Gutermann Mara x Needle size reference</li>
              <li>
                <Link href="/tools/needles">
                  <a className="text-blue-400">
                    Dritz / Schmetz / Organ needle identification
                  </a>
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ToolsPage;
