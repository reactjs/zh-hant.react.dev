---
id: react-dom
title: ReactDOM
layout: docs
category: Reference
permalink: docs/react-dom.html
---

如果使用 `<script>` 標籤載入 React 這些頂層 API 就可以在全域 `ReactDOM` 使用。如果你使用 ES6 和 npm，你可以寫成 `import ReactDOM from 'react-dom'`。如果你使用 ES5 和 npm，你可以寫成 `var ReactDOM = require('react-dom')`。

## 概述 {#overview}

`react-dom` 套件提供了 DOM 專用的方法可以在你的應用程式頂層被使用以及如果你需要的話也是個逃脫 React 模式的出口。大部分你的 component 不應該需要使用到這個模組。

- [`render()`](#render)
- [`hydrate()`](#hydrate)
- [`unmountComponentAtNode()`](#unmountcomponentatnode)
- [`findDOMNode()`](#finddomnode)
- [`createPortal()`](#createportal)

### 瀏覽器支援 {#browser-support}

React 支援所有主流瀏覽器包含 IE 9 和以上，儘管舊版瀏覽器像是 IE 9 和 IE 10 [需要一些 polyfill](/docs/javascript-environment-requirements.html)。

> 注意：
>
> 我們不支援那些不支援 ES5 方法的瀏覽器，但如果頁面上包含了 [es5-shim 和 es5-sham](https://github.com/es-shims/es5-shim) 等 polyfill 你可能會發現你的應用程式在舊版瀏覽器上仍可使用。如果你選擇了這條不歸路你就只能靠你自己了。

* * *

## Reference {#reference}

### `render()` {#render}

```javascript
ReactDOM.render(element, container[, callback])
```

將 React element 渲染在提供的 `container` 的 DOM 之中並返回 component [reference](/docs/more-about-refs.html)（或是 [stateless components](/docs/components-and-props.html#functional-and-class-components) 則返回 `null`）。

如果 React element 已經在 `container` 中渲染，這將對它執行更新並只在必要時改變 DOM 以反映出最新的 React element。

如果提供了可選的 callback，它將會在 component 渲染或更新之後被執行。

> 注意：
>
> `ReactDOM.render()` 控制了你傳進去的 node 容器的內容。在第一次呼叫時裡面有的任何 DOM element 都會被替換。之後使用 React 的 DOM diffing 演算法進行高效率的更新。
>
> `ReactDOM.render()` 不修改 container node（只修改 container 的子節點）。它可以將 component 插入一個現有的 DOM node 而不用覆蓋已經存在的子節點。
>
> `ReactDOM.render()` 目前返回根 `ReactComponent` 實例的 reference。然而使用這個回傳值是老舊的方式
> 並且應該被避免因為未來的 React 版本中在某些情況下可能會非同步地渲染 components。如果你需要一個根 `ReactComponent` 實例的 reference，比較好的解決方式是附加一個
> [callback ref](/docs/more-about-refs.html#the-ref-callback-attribute) 在根 element 上。
>
> 使用 `ReactDOM.render()` 來 hydrate 一個伺服器端渲染的的容器已經被棄用而且將會在 React 17 被移除。使用 [`hydrate()`](#hydrate) 代替。

* * *

### `hydrate()` {#hydrate}

```javascript
ReactDOM.hydrate(element, container[, callback])
```

和 [`render()`](#render) 一樣，但用來 hydrate 其 HTML 內容由 [`ReactDOMServer`](/docs/react-dom-server.html) 所渲染的容器。React 將會嘗試附加 event listeners 在現存的 markup。

React 預期在伺服器端和客戶端渲染的內容是相同的。他可以修補 text content 的差異但你應該把不匹配的部分視為 bug 並且修正。在開發模式中，React 會警告關於 hydration 過程中的不匹配。在不匹配的情況下將無法保證 attribute 的差異會被修補。這對於效能來說很重要因為在大部分的應用中，不匹配的情況很少見，也因此驗證所有的 markup 將非常昂貴。

如果伺服器端和客戶端之間單一個 element 的 attribute 或是 text content 無法避免地不相同（舉例來說，時間戳）則可以透過替 element 增加 `suppressHydrationWarning={true}` 來關閉警告。這個只有在第一層時有效並且傾向於違反設計原則。不要過度使用它。除非他是 text content 否則 React 仍然不會嘗試對其進行修補，所以在未來更新之前它可能會保持不一致。

如果你故意要在服務端和客戶端上呈現不同內容，則可以進行兩次渲染。在客戶端上呈現不同內容的 Components 可以透過讀取一個 state 變數像是 `this.state.isClient` 之後在 `componentDidMount()` 內把它設定成 `true`。這樣初始渲染程序將跟伺服器端渲染的內容一樣，從而避免不匹配，但在 hydrate 之後將會立即同步額外的程序。請注意，此方法會使你的 component 變慢因為他必須被渲染兩次，因此請謹慎使用。

請記得要注意慢網速的使用者體驗。JavaScript 載入可能比 HTML 首次渲染要晚得多，因此如果你只有在客戶端的程序渲染一些不同的東西，則轉換可能會不穩定。然而，如果執行的順利，在伺服器上顯示一個應用程式的 "shell" 可能是有益的，可以只在客戶端上顯示一些額外的小部件。要在不會導致不匹配的情況下學會如何執行此操作，請參考上一個段落的說明。

* * *

### `unmountComponentAtNode()` {#unmountcomponentatnode}

```javascript
ReactDOM.unmountComponentAtNode(container)
```

從 DOM 之中移除一個已經 mount 的 React component 並清除其 event handlers 和 state。如果 container 中沒有 mount 任何 component，則調用此 function 不會執行任何操作。如果一個 component 被 unmount 則回傳 `true` 而如果沒有要 unmount 的 component 則回傳 `false`。

* * *

### `findDOMNode()` {#finddomnode}

> 注意：
>
> `findDOMNode` 是一個用來存取底層 DOM node 的逃脫出口。在大多數情況下，不鼓勵使用這個逃脫出口因為他會穿透 component 抽象化。[它已經在 `StrictMode` 中被棄用了。](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)

```javascript
ReactDOM.findDOMNode(component)
```
如果這個 component 已經被 mount 進入 DOM 則返回其相應原生的瀏覽器 DOM element。這個方法對於從 DOM 中讀取值是有用的，像是表單的欄位值和運行 DOM 測量。 **在大多數情況下，你可以附加一個 ref 給 DOM node 來避免使用 `findDOMNode`。**

當一個 component render 成 `null` 或 `false` 時，`findDOMNode` 回傳 `null`。當一個 component render 成字串時， `findDOMNode` 回傳一個包含該值的文字 DOM node。從 React 16 開始，component 可以回傳包含很多 children 的 fragment，在這種情況下 `findDOMNode` 將會回傳和第一個非空的子節點相對應的 DOM node。

> 注意：
>
> `findDOMNode` 只在已經 mount 的 component 上有用（即已放置在 DOM 中的 component）。 如果你嘗試在尚未 mount 的組建上調用它（比如在尚未創建的 component 的 `render()` 中調用 `findDOMNode()`）將會拋出異常。
>
> `findDOMNode` 不能被用在 function component。

* * *

### `createPortal()` {#createportal}

```javascript
ReactDOM.createPortal(child, container)
```

創建 portal。Portal 提供了一種方法來 [渲染 children 為存在於 DOM component 層級結構之外的 DOM node](/docs/portals.html)。