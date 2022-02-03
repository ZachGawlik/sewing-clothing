import type { NextPage } from 'next';
import Head from 'next/head';
import imgSerger from '../../public/serger.jpg';
import imgNeedleSchmetz from '../../public/needle-id-schmetz.png';
import imgNeedleSinger from '../../public/needle-id-singer.png';
import PageHeader from '../components/PageHeader';
import styles from '../../styles/Home.module.css';

const ResourcesPage: NextPage = () => {
  return (
    <div className={`${styles.container}`}>
      <Head>
        <title>Resources - Sewing Clothing</title>
        <meta name="description" content="Sewing resources" />
      </Head>

      <PageHeader />
      <main
        className={`${styles.main} prose prose-invert prose-a:text-sky-200 w-full`}
      >
        <h1 className="text-center">Resources</h1>
        <div>
          <p>Quick infographic resources</p>
          <ul>
            <li>
              <details>
                <summary>Serger Tension</summary>
                <div>
                  <img
                    src={imgSerger}
                    alt="Chart for identifying serger tension issues. Too high of tension pulls other threads out of position, while too low causes extra loops"
                  />
                </div>
                <p className="text-xs text-gray-300 text-right mt-0">
                  (via the excellent{' '}
                  <a href="https://doitbetteryourself.club/blog/serger-tension-made-easy/">
                    doitbetteryourself.club
                  </a>
                  )
                </p>
              </details>
            </li>
            <li>
              <details>
                <summary>Needle Identification - Schmetz</summary>
                <img
                  src={imgNeedleSchmetz}
                  alt="Schmetz needles have a bespoke two-band color-coded system based off needle type and size. These color codes do not apply to other needle brands."
                />
              </details>
            </li>
            <li>
              <details>
                <summary>Needle Identification - Singer</summary>
                <img
                  src={imgNeedleSinger}
                  alt="Like Schemtz, Singer needles have a bespoke two-band color-coded system based off needle type and size. These color codes do not apply to other needle brands."
                />
                <p className="text-xs text-gray-300 text-right mt-0">
                  <a href="https://www.reddit.com/r/sewing/comments/q3yfy9/singer_sewing_needle_reference/">
                    (image credit)
                  </a>
                </p>
              </details>
            </li>
          </ul>
        </div>
        <div>
          <p>Reference links</p>
          <ul>
            <li>
              <a href="https://growyourownclothes.files.wordpress.com/2021/01/gutermann-thread-retail-wholesale-conversion-chart-v2.pdf">
                Gutermann Thread Retail vs Wholesale chart.
              </a>{' '}
              <span className="text-xs text-gray-300">
                (via{' '}
                <a href="https://growyourownclothes.com/">
                  growyourownclothes.com
                </a>
                )
              </span>
            </li>
            <li>
              <a href="http://www.burieddiamond.com/blog/2021/10/5/my-fabric-bled-color-everywhere-how-to-save-fabric-when-the-color-is-bleeding">
                Fabric color bleeding - when to use oxiclean & color catchers &
                more
              </a>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default ResourcesPage;
