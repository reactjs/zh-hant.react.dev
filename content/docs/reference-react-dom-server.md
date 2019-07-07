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

這個方法將一個 React element render 至其初始的 HTML。React 將會返回一個 HTML string。你可以使用這個方法在伺服器端生成 HTML，並在初次請求時將標記下傳，以加快頁面下載速度，並讓搜尋引擎爬取你的頁面以達到 SEO 優化的效果。

如果你在一個已經有伺服器端 render 標記的 node 上呼叫 [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate)，React 將會保留這個 node 並只附上事件處理，這使你能有一個高效能的初次下載體驗。

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

這個方法和 [`renderToString`](#rendertostring) 很相似，不過這個方法不會建立那些額外的、React 內部使用的 DOM attribute，像是 `data-reactroot`。這個方法在你想要用 React 作為一個簡單的靜態頁面生成器時很有用，因為去除一些額外的 attribute 可以省去一些位元組。

如果你打算在前端使用 React 以使得標記有互動性的話，請不要使用這個方法。請在伺服器端使用 [`renderToString`](#rendertostring) 並在前端使用 [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate)。

* * *

### `renderToNodeStream()` {#rendertonodestream}

```javascript
ReactDOMServer.renderToNodeStream(element)
```

這個方法會將一個 React element render 至其初始的 HTML。它會返回一個[可讀流](https://nodejs.org/api/stream.html#stream_readable_streams)並輸出為一個 HTML string。通過可讀流輸出的 HTML 和 [`ReactDOMServer.renderToString`](#rendertostring) 返回的 HTML 完全相同。你可以使用這個方法在伺服器端生成 HTML，並在初次請求時將標記下傳，以加快頁面下載速度，並讓搜尋引擎爬取你的頁面以達到 SEO 優化的效果。

如果你在一個已經有伺服器端 render 標記的 node 上呼叫 [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate)，React 將會保留這個 node 並只附上事件處理，這使你能有一個高效能的初次下載體驗。


> 注意：
>
> 這個 API 只在伺服器端有用。你無法在瀏覽器中使用此 API。
>
> 這個方法返回的流將會返回一個由 utf-8 編碼的位元組流。 如果你需要另一種編碼的流，請參考像是 [iconv-lite](https://www.npmjs.com/package/iconv-lite) 這種為轉換文本提供轉換流的專案。

* * *

### `renderToStaticNodeStream()` {#rendertostaticnodestream}

```javascript
ReactDOMServer.renderToStaticNodeStream(element)
```

這個方法和 [`renderToNodeStream`](#rendertonodestream) 很相似，不過這個方法不會建立那些額外的、React 內部使用的 DOM attribute，像是 `data-reactroot`。這個方法在你想要用 React 作為一個簡單的靜態頁面生成器時很有用，因為去除一些額外的 attribute 可以省去一些位元組。

通過這個可讀流輸出的 HTML 和 [`ReactDOMServer.renderToStaticMarkup`](#rendertostaticmarkup) 會返回的 HTML 完全相同。

如果你打算在前端使用 React 以使得標記有互動性的話，請不要使用這個方法。請在伺服器端使用 [`renderToNodeStream`](#rendertonodestream) 並在前端使用 [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate)。

> 注意：
>
> 這個 API 只在伺服器端有用。你無法在瀏覽器中使用此 API。
>
> 這個方法返回的流將會返回一個由 utf-8 編碼的位元組流。 如果你需要另一種編碼的流，請參考像是 [iconv-lite](https://www.npmjs.com/package/iconv-lite) 這種為轉換文本提供轉換流的專案。
