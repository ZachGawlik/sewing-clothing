import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    return initialProps;
  }
  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="icon"
            href="data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzMwMHB4JyB3aWR0aD0nMzAwcHgnICBmaWxsPSIjMDAwMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwMCAxMDAwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMDAwIDEwMDA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj48Zz48cGF0aCBkPSJNODcxLjEsNzA4di0xMS45YzAtMTI0LjQsMC0yNDguNy0wLjItMzczLjFjMC04LjQtMC42LTE2LjgtMi4xLTI1LjFjLTEzLjctNzQuMS03My44LTEyNC4xLTE0OS4zLTEyNC4xICAgYy0xMTkuOSwwLTIzOS44LDAtMzU5LjYsMGMtNTYuOSwwLTExMy43LDAtMTcwLjYsMGMtMjUuMywwLTQ1LjgsOS45LTYwLjIsMzAuOGMtMTAsMTQuNC0xNi4xLDI5LjgtMTUuMSw0OC41ICAgYzEuNCwyNy40LDAsNTQuOSwwLjQsODIuM2MwLjYsNTAuMiwyMS4yLDg5LjYsNjQuMSwxMTYuNmMzLjgsMi40LDguOCwzLjYsMTMuMywzLjdjMjcuNCwwLjMsNTQuOSwwLjMsODIuMywwICAgYzQuNS0wLjEsOS41LTEuMywxMy4zLTMuNmMzNy4xLTIyLjcsNTcuMy01Ni4zLDYzLjctMTAwLjJoNy44YzYwLjgsMCwxMjEuNi0wLjEsMTgyLjMsMGMyOS4xLDAsNDcuNywxOC41LDQ3LjgsNDcuOCAgIGMwLjEsNjYuNywwLjEsMTMzLjMtMC4xLDIwMGMwLDQuNC0xLjEsOC45LTIuNiwxM2MtMTEuOSwzMi43LTI5LjYsNjItNTIuNCw4OC4zYy00LjQsNS4xLTguOCw3LjItMTUuNiw3LjIgICBjLTEzNS44LTAuMi0yNzEuNy0wLjItNDA3LjUtMC4ySDEwMHYxMThoODAwVjcwOEg4NzEuMXogTTY0OC45LDY0OC4zVjUwMC43aDE2MnYxNDcuNkg2NDguOXogTTczMC45LDI2Mi45ICAgYzQ0LjYsMC4zLDgwLjcsMzcsODAuNSw4MS45Yy0wLjIsNDUuNC0zNi41LDgxLjUtODEuOSw4MS4yYy00NS4yLTAuMy04MS4zLTM2LjgtODEuMi04Mi4yQzY0OC4zLDI5OS4zLDY4NS44LDI2Mi42LDczMC45LDI2Mi45eiI+PC9wYXRoPjxwYXRoIGQ9Ik0yODEuNSw0NjkuM3YxOC45YzAsMy42LTIuOSw2LjUtNi41LDYuNWgtOS43djkuMmMwLDMuNi0yLjksNi41LTYuNSw2LjVoLTIwLjJ2OTYuOUwyMjcsNjM0LjVWNTEwLjVoLTIxLjMgICBjLTMuNiwwLTYuNS0yLjktNi41LTYuNXYtOS4yaC04LjZjLTMuNiwwLTYuNS0yLjktNi41LTYuNXYtMTguOWMwLTMuNiwyLjktNi41LDYuNS02LjVIMjc1QzI3OC42LDQ2Mi44LDI4MS41LDQ2NS44LDI4MS41LDQ2OS4zeiI+PC9wYXRoPjwvZz48L3N2Zz4="
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
