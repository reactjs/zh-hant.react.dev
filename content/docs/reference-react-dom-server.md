---
id: react-dom-server
title: ReactDOMServer
layout: docs
category: Reference
permalink: docs/react-dom-server.html
---

`ReactDOMServer` object 使你能將 component render 至靜態標記（markup）。它通常是用在 Node 伺服器上：

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

- [`renderToNodeStream()`](#rendertonodestream)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

* * *

## 參考 {#reference}

### `renderToString()` {#rendertostring}

```javascript
ReactDOMServer.renderToString(element)
```

將一個 React element render 至其初始的 HTML。React 將會返回一個 HTML string。你可以使用這個方法在伺服器端生成 HTML 並在初次請求時將標記下傳，以加快頁面下載速度，並讓搜尋引擎爬取你的頁面以達到 SEO 優化的效果。

如果你在一個已經有伺服器端 render 標誌的 node 上呼叫 [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate)，React 將會保留這個 node 並只附上事件處理，這使你能有一個高效能的初次下載體驗。

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

Similar to [`renderToString`](#rendertostring), except this doesn't create extra DOM attributes that React uses internally, such as `data-reactroot`. This is useful if you want to use React as a simple static page generator, as stripping away the extra attributes can save some bytes.

If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use [`renderToString`](#rendertostring) on the server and [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) on the client.

* * *

### `renderToNodeStream()` {#rendertonodestream}

```javascript
ReactDOMServer.renderToNodeStream(element)
```

Render a React element to its initial HTML. Returns a [Readable stream](https://nodejs.org/api/stream.html#stream_readable_streams) that outputs an HTML string. The HTML output by this stream is exactly equal to what [`ReactDOMServer.renderToString`](#rendertostring) would return. You can use this method to generate HTML on the server and send the markup down on the initial request for faster page loads and to allow search engines to crawl your pages for SEO purposes.

If you call [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

> Note:
>
> Server-only. This API is not available in the browser.
>
> The stream returned from this method will return a byte stream encoded in utf-8. If you need a stream in another encoding, take a look at a project like [iconv-lite](https://www.npmjs.com/package/iconv-lite), which provides transform streams for transcoding text.

* * *

### `renderToStaticNodeStream()` {#rendertostaticnodestream}

```javascript
ReactDOMServer.renderToStaticNodeStream(element)
```

Similar to [`renderToNodeStream`](#rendertonodestream), except this doesn't create extra DOM attributes that React uses internally, such as `data-reactroot`. This is useful if you want to use React as a simple static page generator, as stripping away the extra attributes can save some bytes.

The HTML output by this stream is exactly equal to what [`ReactDOMServer.renderToStaticMarkup`](#rendertostaticmarkup) would return.

If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use [`renderToNodeStream`](#rendertonodestream) on the server and [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) on the client.

> Note:
>
> Server-only. This API is not available in the browser.
>
> The stream returned from this method will return a byte stream encoded in utf-8. If you need a stream in another encoding, take a look at a project like [iconv-lite](https://www.npmjs.com/package/iconv-lite), which provides transform streams for transcoding text.
