import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Sewing clothing - tools & thoughts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <pre><code>sewing.clothing</code></pre>
        </h1>

        <p className={styles.description}>
          At some point this will have little web apps and maybe helpful resources for sewing clothing.
        </p>
        <p>
          For now, this site is
          </p>
        <div>
          <img src="/under-construction-2.gif" alt="" />{' '}
          <img src="/under-construction-1.gif" alt="Under construction" />{' '}
          <img src="/under-construction-2.gif" alt="" />
        </div>
      </main>
    </div>
  )
}

export default Home
