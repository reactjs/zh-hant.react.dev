---
id: react-dom-server
title: ReactDOMServer
layout: docs
category: Reference
permalink: docs/react-dom-server.html
---

`ReactDOMServer` object 使你能將 component render 至靜態標記。它通常是用在 Node 伺服器上：

```js
// ES modules
import * as ReactDOMServer from 'react-dom/server';
// CommonJS
var ReactDOMServer = require('react-dom/server');
```

## 概觀 {#overview}

<<<<<<< HEAD
以下的方法在伺服器與瀏覽器兩種環境內都能被使用：
=======
These methods are only available in the **environments with [Node.js Streams](https://nodejs.dev/learn/nodejs-streams):**

- [`renderToPipeableStream()`](#rendertopipeablestream)
- [`renderToNodeStream()`](#rendertonodestream) (Deprecated)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

These methods are only available in the **environments with [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)** (this includes browsers, Deno, and some modern edge runtimes):

- [`renderToReadableStream()`](#rendertoreadablestream)

The following methods can be used in the environments that don't support streams:
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

- [`renderToString()`](#rendertostring)
- [`renderToStaticMarkup()`](#rendertostaticmarkup)

<<<<<<< HEAD
以下這些額外的方法需要一個**只能在伺服器端使用的**package (`stream`)，它們無法在瀏覽器端被使用。

- [`renderToNodeStream()`](#rendertonodestream)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

* * *

## 參考 {#reference}
=======
## Reference {#reference}
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

### `renderToPipeableStream()` {#rendertopipeablestream}

```javascript
ReactDOMServer.renderToPipeableStream(element, options)
```

<<<<<<< HEAD
這個方法將一個 React element render 至其初始的 HTML。React 將會回傳一個 HTML string。你可以使用這個方法在伺服器端產生 HTML，並在初次請求時傳遞 markup，以加快頁面載入速度，並讓搜尋引擎爬取你的頁面以達到 SEO 最佳化的效果。

如果你在一個已經有伺服器端 render markup 的 node 上呼叫 [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate)，React 將會保留這個 node 並只附上事件處理，這使你能有一個高效能的初次載入體驗。
=======
Render a React element to its initial HTML. Returns a stream with a `pipe(res)` method to pipe the output and `abort()` to abort the request. Fully supports Suspense and streaming of HTML with "delayed" content blocks "popping in" via inline `<script>` tags later. [Read more](https://github.com/reactwg/react-18/discussions/37)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

```javascript
let didError = false;
const stream = renderToPipeableStream(
  <App />,
  {
    onShellReady() {
      // The content above all Suspense boundaries is ready.
      // If something errored before we started streaming, we set the error code appropriately.
      res.statusCode = didError ? 500 : 200;
      res.setHeader('Content-type', 'text/html');
      stream.pipe(res);
    },
    onShellError(error) {
      // Something errored before we could complete the shell so we emit an alternative shell.
      res.statusCode = 500;
      res.send(
        '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>'
      );
    },
    onAllReady() {
      // If you don't want streaming, use this instead of onShellReady.
      // This will fire after the entire page content is ready.
      // You can use this for crawlers or static generation.

      // res.statusCode = didError ? 500 : 200;
      // res.setHeader('Content-type', 'text/html');
      // stream.pipe(res);
    },
    onError(err) {
      didError = true;
      console.error(err);
    },
  }
);
```

See the [full list of options](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-dom/src/server/ReactDOMFizzServerNode.js#L36-L46).

> Note:
>
> This is a Node.js-specific API. Environments with [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), like Deno and modern edge runtimes, should use [`renderToReadableStream`](#rendertoreadablestream) instead.
>
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

* * *

### `renderToReadableStream()` {#rendertoreadablestream}

```javascript
ReactDOMServer.renderToReadableStream(element, options);
```

<<<<<<< HEAD
這個方法和 [`renderToString`](#rendertostring) 很相似，不過這個方法不會建立那些額外 React 內部使用的 DOM attribute，像是 `data-reactroot`。這個方法在你想要用 React 作為一個簡單的靜態頁面生成器時很有用，因為去除一些額外的 attribute 可以省去一些位元組。

如果你打算在前端使用 React 以使得 markup 有互動性的話，請不要使用這個方法。請在伺服器端使用 [`renderToString`](#rendertostring)，並在前端使用 [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate)。
=======
Streams a React element to its initial HTML. Returns a Promise that resolves to a [Readable Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream). Fully supports Suspense and streaming of HTML. [Read more](https://github.com/reactwg/react-18/discussions/127)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

```javascript
let controller = new AbortController();
let didError = false;
try {
  let stream = await renderToReadableStream(
    <html>
      <body>Success</body>
    </html>,
    {
      signal: controller.signal,
      onError(error) {
        didError = true;
        console.error(error);
      }
    }
  );
  
  // This is to wait for all Suspense boundaries to be ready. You can uncomment
  // this line if you want to buffer the entire HTML instead of streaming it.
  // You can use this for crawlers or static generation:

  // await stream.allReady;

  return new Response(stream, {
    status: didError ? 500 : 200,
    headers: {'Content-Type': 'text/html'},
  });
} catch (error) {
  return new Response(
    '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>',
    {
      status: 500,
      headers: {'Content-Type': 'text/html'},
    }
  );
}
```

See the [full list of options](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-dom/src/server/ReactDOMFizzServerBrowser.js#L27-L35).

> Note:
>
> This API depends on [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API). For Node.js, use [`renderToPipeableStream`](#rendertopipeablestream) instead.
>
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

* * *

### `renderToNodeStream()`  (Deprecated) {#rendertonodestream}

```javascript
ReactDOMServer.renderToNodeStream(element)
```

<<<<<<< HEAD
這個方法會將一個 React element render 至其初始的 HTML。它會回傳一個 [Readable Stream](https://nodejs.org/api/stream.html#stream_readable_streams)並輸出為一個 HTML string。通過 Readable Stream 輸出的 HTML 和 [`ReactDOMServer.renderToString`](#rendertostring) 回傳的 HTML 完全相同。你可以使用這個方法在伺服器端產生 HTML，並在初次請求時傳遞 markup ，以加快頁面載入速度，並讓搜尋引擎爬取你的頁面以達到 SEO 最佳化的效果。

如果你在一個已經有伺服器端 render markup 的 node 上呼叫 [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate)，React 將會保留這個 node 並只附上事件處理，這使你能有一個高效能的初次載入體驗。
=======
Render a React element to its initial HTML. Returns a [Node.js Readable stream](https://nodejs.org/api/stream.html#stream_readable_streams) that outputs an HTML string. The HTML output by this stream is exactly equal to what [`ReactDOMServer.renderToString`](#rendertostring) would return. You can use this method to generate HTML on the server and send the markup down on the initial request for faster page loads and to allow search engines to crawl your pages for SEO purposes.

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b


> 注意：
>
> 這個 API 只在伺服器端有用。你無法在瀏覽器中使用此 API。
>
> 這個方法回傳的 stream 將會回傳一個由 utf-8 編碼的 byte stream。 如果你需要另一種編碼的 stream，請參考像是 [iconv-lite](https://www.npmjs.com/package/iconv-lite) 這種為轉換文本提供轉換 stream 的專案。

* * *

### `renderToStaticNodeStream()` {#rendertostaticnodestream}

```javascript
ReactDOMServer.renderToStaticNodeStream(element)
```

這個方法和 [`renderToNodeStream`](#rendertonodestream) 很相似，不過這個方法不會建立那些額外 React 內部使用的 DOM attribute，像是 `data-reactroot`。這個方法在你想要用 React 作為一個簡單的靜態頁面生成器時很有用，因為去除一些額外的 attribute 可以省去一些位元組。

通過這個 stream 輸出的 HTML 和 [`ReactDOMServer.renderToStaticMarkup`](#rendertostaticmarkup) 回傳的 HTML 完全相同。

<<<<<<< HEAD
如果你打算在前端使用 React 以使得 markup 有互動性的話，請不要使用這個方法。請在伺服器端使用 [`renderToNodeStream`](#rendertonodestream) 並在前端使用 [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate)。
=======
If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use [`renderToNodeStream`](#rendertonodestream) on the server and [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on the client.
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

> 注意：
>
> 這個 API 只在伺服器端使用。你無法在瀏覽器中使用此 API。
>
<<<<<<< HEAD
> 這個方法回傳的 stream 將會回傳一個由 utf-8 編碼的 byte stream。 如果你需要另一種編碼的 stream，請參考像是 [iconv-lite](https://www.npmjs.com/package/iconv-lite) 這種為轉換文本提供轉換 stream 的專案。
=======
> The stream returned from this method will return a byte stream encoded in utf-8. If you need a stream in another encoding, take a look at a project like [iconv-lite](https://www.npmjs.com/package/iconv-lite), which provides transform streams for transcoding text.

* * *

### `renderToString()` {#rendertostring}

```javascript
ReactDOMServer.renderToString(element)
```

Render a React element to its initial HTML. React will return an HTML string. You can use this method to generate HTML on the server and send the markup down on the initial request for faster page loads and to allow search engines to crawl your pages for SEO purposes.

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

> Note
>
> This API has limited Suspense support and does not support streaming.
>
> On the server, it is recommended to use either [`renderToPipeableStream`](#rendertopipeablestream) (for Node.js) or [`renderToReadableStream`](#rendertoreadablestream) (for Web Streams) instead.

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

Similar to [`renderToString`](#rendertostring), except this doesn't create extra DOM attributes that React uses internally, such as `data-reactroot`. This is useful if you want to use React as a simple static page generator, as stripping away the extra attributes can save some bytes.

If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use [`renderToString`](#rendertostring) on the server and [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on the client.
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b
