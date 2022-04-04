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
import ReactDOMServer from 'react-dom/server';
// CommonJS
var ReactDOMServer = require('react-dom/server');
```

## 概觀 {#overview}

以下的方法在伺服器與瀏覽器兩種環境內都能被使用：

- [`renderToString()`](#rendertostring)
- [`renderToStaticMarkup()`](#rendertostaticmarkup)

以下這些額外的方法需要一個**只能在伺服器端使用的**package (`stream`)，它們無法在瀏覽器端被使用。

- [`renderToPipeableStream()`](#rendertopipeablestream)
- [`renderToReadableStream()`](#rendertoreadablestream)
- [`renderToNodeStream()`](#rendertonodestream) (Deprecated)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

* * *

## 參考 {#reference}

### `renderToString()` {#rendertostring}

```javascript
ReactDOMServer.renderToString(element)
```

這個方法將一個 React element render 至其初始的 HTML。React 將會回傳一個 HTML string。你可以使用這個方法在伺服器端產生 HTML，並在初次請求時傳遞 markup，以加快頁面載入速度，並讓搜尋引擎爬取你的頁面以達到 SEO 最佳化的效果。

<<<<<<< HEAD
如果你在一個已經有伺服器端 render markup 的 node 上呼叫 [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate)，React 將會保留這個 node 並只附上事件處理，這使你能有一個高效能的初次載入體驗。
=======
If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

這個方法和 [`renderToString`](#rendertostring) 很相似，不過這個方法不會建立那些額外 React 內部使用的 DOM attribute，像是 `data-reactroot`。這個方法在你想要用 React 作為一個簡單的靜態頁面生成器時很有用，因為去除一些額外的 attribute 可以省去一些位元組。

<<<<<<< HEAD
如果你打算在前端使用 React 以使得 markup 有互動性的話，請不要使用這個方法。請在伺服器端使用 [`renderToString`](#rendertostring)，並在前端使用 [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate)。
=======
If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use [`renderToString`](#rendertostring) on the server and [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on the client.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

* * *

### `renderToPipeableStream()` {#rendertopipeablestream}

```javascript
ReactDOMServer.renderToPipeableStream(element, options)
```

Render a React element to its initial HTML. Returns a [Control object](https://github.com/facebook/react/blob/3f8990898309c61c817fbf663f5221d9a00d0eaa/packages/react-dom/src/server/ReactDOMFizzServerNode.js#L49-L54) that allows you to pipe the output or abort the request. Fully supports Suspense and streaming of HTML with "delayed" content blocks "popping in" later through javascript execution. [Read more](https://github.com/reactwg/react-18/discussions/37)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

> Note:
>
> This is a Node.js specific API and modern server environments should use renderToReadableStream instead.
>

```
const {pipe, abort} = renderToPipeableStream(
  <App />,
  {
    onAllReady() {
      res.statusCode = 200;
      res.setHeader('Content-type', 'text/html');
      pipe(res);
    },
    onShellError(x) {
      res.statusCode = 500;
      res.send(
        '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>'
      );
    }
  }
);
```

* * *

### `renderToReadableStream()` {#rendertoreadablestream}

```javascript
    ReactDOMServer.renderToReadableStream(element, options);
```

Streams a React element to its initial HTML. Returns a [Readable Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream). Fully supports Suspense and streaming of HTML. [Read more](https://github.com/reactwg/react-18/discussions/127)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

```
let controller = new AbortController();
try {
  let stream = await renderToReadableStream(
    <html>
      <body>Success</body>
    </html>,
    {
      signal: controller.signal,
    }
  );
  
  // This is to wait for all suspense boundaries to be ready. You can uncomment
  // this line if you don't want to stream to the client
  // await stream.allReady;

  return new Response(stream, {
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
* * *

### `renderToNodeStream()` {#rendertonodestream} (Deprecated)

```javascript
ReactDOMServer.renderToNodeStream(element)
```

這個方法會將一個 React element render 至其初始的 HTML。它會回傳一個 [Readable Stream](https://nodejs.org/api/stream.html#stream_readable_streams)並輸出為一個 HTML string。通過 Readable Stream 輸出的 HTML 和 [`ReactDOMServer.renderToString`](#rendertostring) 回傳的 HTML 完全相同。你可以使用這個方法在伺服器端產生 HTML，並在初次請求時傳遞 markup ，以加快頁面載入速度，並讓搜尋引擎爬取你的頁面以達到 SEO 最佳化的效果。

<<<<<<< HEAD
如果你在一個已經有伺服器端 render markup 的 node 上呼叫 [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate)，React 將會保留這個 node 並只附上事件處理，這使你能有一個高效能的初次載入體驗。
=======
If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1


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
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

> 注意：
>
> 這個 API 只在伺服器端使用。你無法在瀏覽器中使用此 API。
>
> 這個方法回傳的 stream 將會回傳一個由 utf-8 編碼的 byte stream。 如果你需要另一種編碼的 stream，請參考像是 [iconv-lite](https://www.npmjs.com/package/iconv-lite) 這種為轉換文本提供轉換 stream 的專案。
