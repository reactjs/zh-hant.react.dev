---
id: strict-mode
title: 嚴格模式
permalink: docs/strict-mode.html
---

`嚴格模式（Strict Mode）` 是一個用來突顯應用程式裡潛在問題的工具。如同 `Fragment` 一樣，`嚴格模式`不會 render 任何可見的介面。它為了它底下的所有子元件們啟動了額外的檢查和警告。

> 注意：
>
> 嚴格模式檢查只會在開發模式中執行；_它們不應該影響線上的應用程式_。

你可以在應用程式的任何地方打開嚴格模式。例如：`embed:strict-mode/enabling-strict-mode.js`

在上面的例子裡，嚴格模式檢查將*不會*跑在 `Header` 和 `Footer` 元件上。然而 `ComponentOne` 和 `ComponentTwo`，以及它們底下的所有子元件，都會被檢查。

`嚴格模式` 目前幫助了：
* [發現擁有不安全生命週期的元件](#identifying-unsafe-lifecycles)
* [警告使用到了既有的 string ref API](#warning-about-legacy-string-ref-api-usage)
* [警告使用到了被棄用的 findDOMNode](#warning-about-deprecated-finddomnode-usage)
* [偵測意想不到的副作用](#detecting-unexpected-side-effects)
* [偵測既有的 context API](#detecting-legacy-context-api)

其他功能會在未來版本的 React 釋出時被加進去。

### 發現不安全的生命週期 {#identifying-unsafe-lifecycles}

如[這篇文章](/blog/2018/03/27/update-on-async-rendering.html)所述，某些遺留的生命週期在非同步的 React 應用程式裡使用是不安全的。然而，如果你的應用程式使用到第三方套件，確認這些生命週期有沒有被使用到是很困難的。幸好嚴格模式可以在這點幫助我們！

當嚴格模式被打開的時候，React 編譯了一整串用到這些不安全生命週期的 class components，然後記錄了這些元件的警告訊息，例如：

![](../images/blog/strict-mode-unsafe-lifecycles-warning.png)

_現在_ 就關注這些被嚴格模式所發現的問題，會幫助你在 React 將來的版本裡處理非同步 render 的時候更容易。

### 警告使用到了既有的 string ref API {#warning-about-legacy-string-ref-api-usage}

以前 React 提供了兩種管理 refs 的方式：既有的 string ref API 和 callback API。雖然 string ref API 在兩者之間是比較方便的，但它有很多[缺點](https://github.com/facebook/react/issues/1373)，所以我們的官方推薦是[使用 callback form](/docs/refs-and-the-dom.html#legacy-api-string-refs).

React 16.3 加上了第三種選擇，提供了 string ref 的便利性且免除了那些缺點：
`embed:16-3-release-blog-post/create-ref-example.js`

因為 object refs 已經大量取代了 string refs，嚴格模式現在會在你使用 string refs 的時候警告你。

> **注意：**
>
> 除了新的 `createRef` API 以外，callback refs 會持續被支援。
>
> 你不需要改掉你元件裡的 callback refs。它們稍微更有彈性，所以它們會持續是一個進階性的功能。

[學習更多關於新的 `createRef` API。](/docs/refs-and-the-dom.html)

### 警告使用到了被棄用的 findDOMNode {#warning-about-deprecated-finddomnode-usage}

React 過去支援了 `findDOMNode` 來用 class instance 搜尋樹裡面的 DOM 節點。通常你不需要這個，因為你可以 [直接把一個 ref 附到你的 DOM 節點](/docs/refs-and-the-dom.html#creating-refs)。

`findDOMNode` 也可以被使用在 class components 上，但這是一個破壞抽象層的用法，它允許了 parent 來要求 render 某個特定的 children。它產生了重構的風險，因為 parent 可能會進入到某個 DOM 節點，所以你不能隨意改變元件的實作細節。`findDOMNode` 只會回傳第一個 child，但如果使用了 Fragments，有可能某個元件會 render 多個 DOM 節點。`findDOMNode` 是一個只能讀一次的 API。它只在你要求的時候告訴你答案。如果一個子元件 render 了不同的節點，沒有任何方法可以處理這樣的改變。所以 `findDOMNode` 只在元件永遠回傳一個單一且永遠不改變的 DOM 節點時有用。

你可以藉由傳遞 ref 到你的客製化元件，且把它傳到使用 [ref forwarding](/docs/forwarding-refs.html#forwarding-refs-to-dom-components) 的 DOM，使它變得明顯。

你也可以在你的元件加上一個包裹的 DOM 節點，然後把 ref 直接附在它上面。

```javascript{4,7}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.wrapper = React.createRef();
  }
  render() {
    return <div ref={this.wrapper}>{this.props.children}</div>;
  }
}
```

> 注意：
>
> 在 CSS 裡，如果你不想要某個節點成為 layout 的一部份，[`display: contents`](https://developer.mozilla.org/en-US/docs/Web/CSS/display#display_contents) 屬性可以被使用。

### 偵測意想不到的副作用 {#detecting-unexpected-side-effects}

概念上，React 在兩種面相上能夠運作：
* **render** 面相決定了必須做出什麼改變到例如 DOM 的地方。在這個面相上，React 呼叫 `render` 然後比較了它與上一次 render 的結果。
* **commit** 面相是每當 React 運用到任何改變的時候。（在 React DOM 的例子，當 React 插入、更新、或移除 DOM 節點。）React 也在這個面相上呼叫了像是 `componentDidMount` 和 `componentDidUpdate` 的生命週期。

Commit 面相通常非常快，但 render 可能會很慢。為了這個原因，將來的非同步模式（還沒被預設成開啟）會把 render 的工作切成小塊，暫停和恢復這些工作藉以避免阻擋瀏覽器。 這表示 React 可能會在 commit 之前調用多次 render 面相的生命週期，或是他會不管有沒有 commit 就調用它們（因為錯誤或是更高優先性的中斷）。

Render 面相的生命週期包含了以下 class component 函式:
* `constructor`
* `componentWillMount`
* `componentWillReceiveProps`
* `componentWillUpdate`
* `getDerivedStateFromProps`
* `shouldComponentUpdate`
* `render`
* `setState` updater functions (第一個參數)

因為以上函式可能會被呼叫不只一次，不包含副作用是很重要的。忽視這個規則可能會導致各種問題，包含記憶體滲漏，和不合法的應用程式 state。不幸的是，偵測這些問題很困難，因為它們通常是 [non-deterministic](https://en.wikipedia.org/wiki/Deterministic_algorithm)。

嚴格模式無法自動偵測副作用，但它可以藉由使這些副作用變得更有確定性，來幫助你發現它們。它藉由故意調用兩次下面的函式來完成這個功能：

* Class component `constructor` method
* The `render` method
* `setState` updater functions (第一個參數)
* 靜態的 `getDerivedStateFromProps` 生命週期

> 注意：
>
> 這個只在開發模式發生。 _生命週期不會被重複調用在線上模式。_

例如，考慮以下程式碼：
`embed:strict-mode/side-effects-in-constructor.js`

第一眼看這段程式碼，可能不會覺得它有問題。但如果 `SharedApplicationState.recordEvent` 不是 [idempotent](https://en.wikipedia.org/wiki/Idempotence#Computer_science_meaning) 的話，多次實體化這個元件可能會導致不合法的應用程式 state。這種細微的錯誤可能在開發期間不會出現，或者會不一致地出現，因此被忽略了。

通過有意地雙重調用如 component constructor，嚴格模式使這種模式更容易被發現。

### 偵測既有的 context API {#detecting-legacy-context-api}

既有的 context API 是容易出錯的，並將在以後的主要版本中刪除。它仍然適用於所有 16.x 版本，但將在嚴格模式下顯示以下警告訊息：

![](../images/blog/warn-legacy-context-in-strict-mode.png)

閱讀[新的 context API文檔](/docs/context.html)，以幫助遷移到新版本。
