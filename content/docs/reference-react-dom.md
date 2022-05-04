---
id: react-dom
title: ReactDOM
layout: docs
category: Reference
permalink: docs/react-dom.html
---

`react-dom` 提供了 DOM 的特定方法讓你可以在你的應用程式頂層使用，如果有需要，也可以作為一個逃生窗口來脫離 React 模型。

```js
import * as ReactDOM from 'react-dom';
```

如果你使用 ES5 與 npm，你可以這樣寫：

```js
var ReactDOM = require('react-dom');
```

`react-dom` package 也提供了特定於 client 和 server 應用程式的 module：
- [`react-dom/client`](/docs/react-dom-client.html)
- [`react-dom/server`](/docs/react-dom-server.html)

## 概覽 {#overview}

`react-dom` package export 這些方法：
- [`createPortal()`](#createportal)
- [`flushSync()`](#flushsync)

這些 `react-dom` 方法也被 export，但是被視為是 legacy：
- [`render()`](#render)
- [`hydrate()`](#hydrate)
- [`findDOMNode()`](#finddomnode)
- [`unmountComponentAtNode()`](#unmountcomponentatnode)

> 注意：
>
> `render` 與 `hydrate` 兩者在 React 18 已經替換為新的 [client 方法](/docs/react-dom-client.html)。如果你使用像是 React 17 方式，這些方法將警告你的應用程式的行為。（[從這裡](https://reactjs.org/link/switch-to-createroot)了解更多）。

### 瀏覽器支援 {#browser-support}

React 支援所有主流瀏覽器，雖然對於一些舊版瀏覽器[需要一些 polyfill](/docs/javascript-environment-requirements.html)。

> 注意：
>
> 我們不支援那些較舊不支援 ES5 方法或是 microtasks 的瀏覽器，像是 Internet Explorer。但如果頁面上引入了像是 [es5-shim 和 es5-sham](https://github.com/es-shims/es5-shim) 等 polyfill 你可能會發現你的應用程式在較舊的瀏覽器上仍可使用，但如果你選擇了這條路你就只能靠你自己了。

## 參考 {#reference}

### `createPortal()` {#createportal}

```javascript
createPortal(child, container)
```

提供了一個方式將 children [render 存在於 DOM component 層次結構之外的 DOM 節點中](/docs/portals.html)。

### `flushSync()` {#flushsync}

```javascript
flushSync(callback)
```

> 注意：
>
> `flushSync` 可能會對效能產生重大的影響。謹慎使用。
>
> `flushSync` 可能會迫使 pending 的 Suspense boundary 顯示 `fallback` 狀態。
>
> `flushSync` 也可以執行 pending effects，並在回傳之前同步 apply 它們包含的任何更新。
>
> `flushSync` `flushSync` 在必要時也可以在 callback 外 flush 更新，以 flush callback 内的更新。例如，如果有來自 click 的 pending 更新，React 可能會在 flush callback 中的更新之前 flush 這些内容。

## Legacy 參考 {#legacy-reference}
### `render()` {#render}
```javascript
render(element, container[, callback])
```

> 注意：
>
> `render` 在 React 18 已經被 `createRoot` 取代。更多資訊請參考 [createRoot](/docs/react-dom-client.html#createroot)。

將一個 React elemnt render 到提供提供的 `container` 的 DOM 中，並回傳一個該 component 的 [reference](/docs/more-about-refs.html)（對於 [stateless components](/docs/components-and-props.html#function-and-class-components) 回傳 `null`）。

如果 React element 之前已經在 `container` 內被 render，它只會執行更新並 mutate 必要的 DOM，來呈現最新的 React element。

如果提供了可選的 callback，它將會在 component 被 render 或更新之後，才被執行。

> 注意：
>
> `render()` 控制了你傳入到 container 內的 node 內容。當第一次被呼叫時，任何存在於 container 的 DOM element 都會被替換。之後的呼叫會使用 React 的 DOM diffing 演算法進行高效率的更新。
>
> `render()` 不修改 container 的 node（只修改 container 的 children）。它可以將 component 插入一個現有的 DOM node 而不用覆蓋已經存在的 children。
>
> `render()` 目前回傳一個 reference 到 root `ReactComponent` instance。然而，使用這個回傳值是被遺留的方式
> 並且應該被避免，因為未來版本的 React 在某些情況下可能會非同步地 render component。如果你需要 reference 到 root `ReactComponent` instance，首選的解決方式是附加一個
> [callback ref](/docs/refs-and-the-dom.html#callback-refs) 在 root element 上。
>
> 使用 `render()` 來 hydrate 一個 server-render container 已經被棄用。使用 [`hydrateRoot()`](#hydrateroot) 作為代替。

* * *

### `hydrate()` {#hydrate}

```javascript
hydrate(element, container[, callback])
```

> 注意：
>
> `hydrate` 在 React 18 已經被 `hydrateRoot` 取代。更多資訊請參考 [hydrateRoot](/docs/react-dom-client.html#hydrateroot)。

如同 [`render()`](#render)，但它是被用來 hydrate 一個 container，其 HTML 內容是由 [`ReactDOMServer`](/docs/react-dom-server.html) render。React 將嘗試將 event listener attach 到現有 markup 上。s

React 預期在伺服器端和客戶端所 render 的內容是相同的。它可以修補 text content 的差異，但你應該把不匹配的部分視為 bug 並且修正。在開發模式中，React 會警告關於 hydration 過程中的不匹配。在不匹配的情況下，將無法保證 attribute 的差異會被修補。這對於效能來說很重要，因為在大部分的應用程式中，不匹配的情況很少見，也因此驗證要所有 markup 的成本非常高。

如果在伺服器端和客戶端某個 element 的 attribute 或 text content 無可避免的不相同（例如，時間戳），你可以透過加入 `suppressHydrationWarning={true}` 到 element 來關閉警告。這個只有在第一層時有效並且傾向於應急的做法。不要過度使用它。除非它是 text content 否則 React 仍然不會嘗試對其進行修補，所以在未來更新之前它可能會保持不一致。

如果你刻意要在服務端和客戶端上 render 不同的內容，你可以進行兩次的 render。在客戶端上呈現不同內容的 component 可以透過讀取一個 state 變數像是 `this.state.isClient` 之後在 `componentDidMount()` 內把它設定成 `true`。這樣初始 render 將跟伺服器端 render 的內容一樣，從而避免不匹配，但在 hydrate 之後將會立即同步額外的程序。請注意，此方法會使你的 component 變慢，因為它必須被 render 兩次，因此請謹慎使用。

請記得要留意連線緩慢的使用者體驗。JavaScript 載入顯然比 HTML 首次 render 要晚得多，因此，如果你只有在客戶端 render 一些不同的東西，則轉換可能會不穩定。然而，如果執行順利的話，在伺服器上 render 應用程式的「shell」可能是有幫助的，而且只顯示一些額外的插件在客戶端。要了解如何執行此操作而不會出現 markup 不匹配的問題，請參考上一個段落的說明。

* * *

### `unmountComponentAtNode()` {#unmountcomponentatnode}

```javascript
unmountComponentAtNode(container)
```

> 注意：
>
> `unmountComponentAtNode` 在 React 18 已經被 `root.unmount()` 取代。更多資訊請參考 [createRoot](/docs/react-dom-client.html#createroot)。

從 DOM 移除一個 mount React component 並清除它的 event handler 以及 state。如果沒有 component 被 mount 在 container 的話，呼叫這個 function 並不會做任何事。如果一個 component 被 unmount 回傳一個 `true`，反之如果沒有 component 被 unmount，回傳 `false`。

* * *

### `findDOMNode()` {#finddomnode}

> 注意：
>
> `findDOMNode` 是一個用來存取底層 DOM node 應急的做法。在大多數情況下，不鼓勵使用這個應急的做法因為它會穿透 component 抽象化。[它已經在 `StrictMode` 中被棄用了。](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)

```javascript
findDOMNode(component)
```
如果這個 component 已經被 mount 到 DOM，則回傳對應原生瀏覽器的 DOM element。這個方法對於從 DOM 中讀取值是有用的，像是表單的欄位值和執行 DOM 的測量。 **在大多數情況下，你可以附加一個 ref 給 DOM node 來避免使用 `findDOMNode`。**

當一個 component render 成 `null` 或 `false` 時， `findDOMNode` 回傳 `null`。當一個 component render 成字串時， `findDOMNode` 回傳一個包含該值的文字 DOM node。從 React 16 開始，component 可以回傳包含很多 children 的 fragment，在這種情況下 `findDOMNode` 將會回傳和第一個非空的子節點相對應的 DOM node。

> 注意：
>
> `findDOMNode` 只在已經 mount 的 component 上有用（即已放置在 DOM 中的 component）。 如果你嘗試在尚未 mount 的 component 上呼叫它（比如在尚未建立的 component 的 `render()` 中調用 `findDOMNode()`），將會拋出異常。
>
> `findDOMNode` 不能被用在 function component。

* * *
