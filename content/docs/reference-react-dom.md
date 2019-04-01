---
id: react-dom
title: ReactDOM
layout: docs
category: Reference
permalink: docs/react-dom.html
---

如果使用 `<script>` 標籤載入 React 這些頂層 API 就可以在全域 `ReactDOM` 上找到。如果你使用 ES6 和 npm，你可以寫成 `import ReactDOM from 'react-dom'`。如果你使用 ES5 和 npm，你可以寫成 `var ReactDOM = require('react-dom')`。

## 概覽 {#overview}

`react-dom` package 提供了特定於 DOM 的方法，可以被用在你的應用程式的頂層，也可以作為 React model 的出口。大部分你的 component 不應該需要使用到這個模組。

- [`render()`](#render)
- [`hydrate()`](#hydrate)
- [`unmountComponentAtNode()`](#unmountcomponentatnode)
- [`findDOMNode()`](#finddomnode)
- [`createPortal()`](#createportal)

### 瀏覽器支援 {#browser-support}

React 支援所有主流瀏覽器包含 IE 9 和以上，儘管舊版瀏覽器像是 IE 9 和 IE 10 [需要一些 polyfill](/docs/javascript-environment-requirements.html)。

> 注意：
>
> 我們不支援那些較舊的不支援 ES5 方法的瀏覽器，但如果頁面上包含了像是 [es5-shim 和 es5-sham](https://github.com/es-shims/es5-shim) 等 polyfill 你可能會發現你的應用程式在較舊的瀏覽器上仍可使用。如果你選擇了這條不歸路你就只能靠你自己了。

* * *

## Reference {#reference}

### `render()` {#render}

```javascript
ReactDOM.render(element, container[, callback])
```

在 `container` 內 render 一個 React element 並回傳一個 [reference](/docs/more-about-refs.html) 到 component（或者是 [stateless components](/docs/components-and-props.html#functional-and-class-components) 則回傳 `null`）。

如果 React element 之前已經在 `container` 內被 render，它只會執行更新並 mutate 必要的 DOM，來呈現最新的 React element。

如果提供了可選的 callback，它將會在 component 被 render 或更新之後，才被執行。

> 注意：
>
> `ReactDOM.render()` 控制了你傳入到 container 內的 node 內容。當第一次被呼叫時，任何存在於 container 的 DOM element 都會被替換。之後的呼叫會使用 React 的 DOM diffing 演算法進行高效率的更新。
>
> `ReactDOM.render()` 不修改 container 的 node（只修改 container 的 children）。它可以將 component 插入一個現有的 DOM node 而不用覆蓋已經存在的 children。
>
> `ReactDOM.render()` 目前回傳一個 reference 到 root `ReactComponent` instance。然而，使用這個回傳值是被遺留的方式
> 並且應該被避免，因為未來版本的 React 在某些情況下可能會非同步地 render component。如果你需要 reference 到 root `ReactComponent` instance，首選的解決方式是附加一個
> [callback ref](/docs/more-about-refs.html#the-ref-callback-attribute) 在 root element 上。
>
> 使用 `ReactDOM.render()` 來 hydrate 一個 server-render container 已經被棄用，並且在 React 17 將會被移除。使用 [`hydrate()`](#hydrate) 作為代替。

* * *

### `hydrate()` {#hydrate}

```javascript
ReactDOM.hydrate(element, container[, callback])
```

與 [`render()`](#render) 相同，但用來 hydrate 其 HTML 內容由 [`ReactDOMServer`](/docs/react-dom-server.html) 所 render 的 container 。React 將會嘗試附加 event listener 到現有的 markup。

React 預期在伺服器端和客戶端所 render 的內容是相同的。它可以修補 text content 的差異，但你應該把不匹配的部分視為 bug 並且修正。在開發模式中，React 會警告關於 hydration 過程中的不匹配。在不匹配的情況下，將無法保證 attribute 的差異會被修補。這對於效能來說很重要，因為在大部分的應用程式中，不匹配的情況很少見，也因此驗證要所有 markup 的成本非常高。

如果在伺服器端和客戶端某個 element 的 attribute 或 text content 無可避免的不相同（例如，時間戳），你可以透過加入 `suppressHydrationWarning={true}` 到 element 來關閉警告。這個只有在第一層時有效並且傾向於應急的做法。不要過度使用它。除非它是 text content 否則 React 仍然不會嘗試對其進行修補，所以在未來更新之前它可能會保持不一致。

如果你刻意要在服務端和客戶端上 render 不同的內容，你可以進行兩次的 render。在客戶端上呈現不同內容的 component 可以透過讀取一個 state 變數像是 `this.state.isClient` 之後在 `componentDidMount()` 內把它設定成 `true`。這樣初始 render 將跟伺服器端 render 的內容一樣，從而避免不匹配，但在 hydrate 之後將會立即同步額外的程序。請注意，此方法會使你的 component 變慢，因為它必須被 render 兩次，因此請謹慎使用。

請記得要留意連線緩慢的使用者體驗。JavaScript 載入顯然比 HTML 首次 render 要晚得多，因此，如果你只有在客戶端 render 一些不同的東西，則轉換可能會不穩定。然而，如果執行順利的話，在伺服器上 render 應用程式的「shell」可能是有幫助的，而且只顯示一些額外的插件在客戶端。要了解如何執行此操作而不會出現 markup 不匹配的問題，請參考上一個段落的說明。

* * *

### `unmountComponentAtNode()` {#unmountcomponentatnode}

```javascript
ReactDOM.unmountComponentAtNode(container)
```

從 DOM 之中移除一個已經 mount 的 React component 並清除其 event handler 和 state。如果 container 中沒有 mount 任何 component，呼叫此 function 不會執行任何操作。如果一個 component 被 unmount 則回傳 `true`，而如果沒有要 unmount 的 component 則回傳 `false`。

* * *

### `findDOMNode()` {#finddomnode}

> 注意：
>
> `findDOMNode` 是一個用來存取底層 DOM node 應急的做法。在大多數情況下，不鼓勵使用這個應急的做法因為它會穿透 component 抽象化。[它已經在 `StrictMode` 中被棄用了。](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)

```javascript
ReactDOM.findDOMNode(component)
```
如果這個 component 已經被 mount 到 DOM，則回傳對應原生瀏覽器的 DOM element。這個方法對於從 DOM 中讀取值是有用的，像是表單的欄位值和執行 DOM 的測量。 **在大多數情況下，你可以附加一個 ref 給 DOM node 來避免使用 `findDOMNode`。**

當一個 component render 成 `null` 或 `false` 時， `findDOMNode` 回傳 `null`。當一個 component render 成字串時， `findDOMNode` 回傳一個包含該值的文字 DOM node。從 React 16 開始，component 可以回傳包含很多 children 的 fragment，在這種情況下 `findDOMNode` 將會回傳和第一個非空的子節點相對應的 DOM node。

> 注意：
>
> `findDOMNode` 只在已經 mount 的 component 上有用（即已放置在 DOM 中的 component）。 如果你嘗試在尚未 mount 的 component 上呼叫它（比如在尚未建立的 component 的 `render()` 中調用 `findDOMNode()`），將會拋出異常。
>
> `findDOMNode` 不能被用在 function component。

* * *

### `createPortal()` {#createportal}

```javascript
ReactDOM.createPortal(child, container)
```

創建 portal。Portal 提供了一種方法來 [render children 為存在於 DOM component 層級結構之外的 DOM node](/docs/portals.html)。