import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

// var favIcon = "data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzMwMHB4JyB3aWR0aD0nMzAwcHgnICBmaWxsPSIjMDAwMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwMCAxMDAwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMDAwIDEwMDA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj48Zz48cGF0aCBkPSJNODcxLjEsNzA4di0xMS45YzAtMTI0LjQsMC0yNDguNy0wLjItMzczLjFjMC04LjQtMC42LTE2LjgtMi4xLTI1LjFjLTEzLjctNzQuMS03My44LTEyNC4xLTE0OS4zLTEyNC4xICAgYy0xMTkuOSwwLTIzOS44LDAtMzU5LjYsMGMtNTYuOSwwLTExMy43LDAtMTcwLjYsMGMtMjUuMywwLTQ1LjgsOS45LTYwLjIsMzAuOGMtMTAsMTQuNC0xNi4xLDI5LjgtMTUuMSw0OC41ICAgYzEuNCwyNy40LDAsNTQuOSwwLjQsODIuM2MwLjYsNTAuMiwyMS4yLDg5LjYsNjQuMSwxMTYuNmMzLjgsMi40LDguOCwzLjYsMTMuMywzLjdjMjcuNCwwLjMsNTQuOSwwLjMsODIuMywwICAgYzQuNS0wLjEsOS41LTEuMywxMy4zLTMuNmMzNy4xLTIyLjcsNTcuMy01Ni4zLDYzLjctMTAwLjJoNy44YzYwLjgsMCwxMjEuNi0wLjEsMTgyLjMsMGMyOS4xLDAsNDcuNywxOC41LDQ3LjgsNDcuOCAgIGMwLjEsNjYuNywwLjEsMTMzLjMtMC4xLDIwMGMwLDQuNC0xLjEsOC45LTIuNiwxM2MtMTEuOSwzMi43LTI5LjYsNjItNTIuNCw4OC4zYy00LjQsNS4xLTguOCw3LjItMTUuNiw3LjIgICBjLTEzNS44LTAuMi0yNzEuNy0wLjItNDA3LjUtMC4ySDEwMHYxMThoODAwVjcwOEg4NzEuMXogTTY0OC45LDY0OC4zVjUwMC43aDE2MnYxNDcuNkg2NDguOXogTTczMC45LDI2Mi45ICAgYzQ0LjYsMC4zLDgwLjcsMzcsODAuNSw4MS45Yy0wLjIsNDUuNC0zNi41LDgxLjUtODEuOSw4MS4yYy00NS4yLTAuMy04MS4zLTM2LjgtODEuMi04Mi4yQzY0OC4zLDI5OS4zLDY4NS44LDI2Mi42LDczMC45LDI2Mi45eiI+PC9wYXRoPjxwYXRoIGQ9Ik0yODEuNSw0NjkuM3YxOC45YzAsMy42LTIuOSw2LjUtNi41LDYuNWgtOS43djkuMmMwLDMuNi0yLjksNi41LTYuNSw2LjVoLTIwLjJ2OTYuOUwyMjcsNjM0LjVWNTEwLjVoLTIxLjMgICBjLTMuNiwwLTYuNS0yLjktNi41LTYuNXYtOS4yaC04LjZjLTMuNiwwLTYuNS0yLjktNi41LTYuNXYtMTguOWMwLTMuNiwyLjktNi41LDYuNS02LjVIMjc1QzI3OC42LDQ2Mi44LDI4MS41LDQ2NS44LDI4MS41LDQ2OS4zeiI+PC9wYXRoPjwvZz48L3N2Zz4="

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
        <div className={styles.images}>
          <img src="/under-construction-2.gif" alt="" />{' '}
          <img src="/under-construction-1.gif" alt="Under construction" />{' '}
          <img src="/under-construction-2.gif" alt="" />
        </div>
      </main>
    </div>
  )
}

export default Home
