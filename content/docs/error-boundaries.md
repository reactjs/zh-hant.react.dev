---
id: error-boundaries
title: 錯誤邊界
permalink: docs/error-boundaries.html
---

在過去，component 裡 JavaScript 的錯誤常常會破壞 React 的內部 state，並使它在下次 render 的時候[發生](https://github.com/facebook/react/issues/4026) [神秘的](https://github.com/facebook/react/issues/6895) [錯誤](https://github.com/facebook/react/issues/8579)。這些錯誤總是被應用程式的程式碼裡更早發生的錯誤所導致，但 React 並沒有提供在 component 裡優雅處理它們的方式，而且也無法從錯誤中恢復。


## 引入錯誤邊界 {#introducing-error-boundaries}

一個介面裡的某一個 JavaScript 的錯誤不應該毀了整個應用程式。為了替 React 使用者解決這個問題，React 16 引入了一個新的概念：「錯誤邊界」。

錯誤邊界是一個 React component，它**捕捉了任何在它的 child component tree 裡發生的 JavaScript 的錯誤，記錄那些錯誤，然後顯示在一個 fallback 的使用介面**，而非讓整個 component tree 崩壞。錯誤邊界會在 render 的時候、在生命週期函式內、以及底下一整個 component tree 裡的 constructor 內捕捉錯誤。

> 注意
>
> 錯誤邊界**不會**在以下情況捕捉錯誤：
>
> * Event handlers ([學習更多](#how-about-event-handlers))
> * 非同步的程式碼 (例如 `setTimeout` 或 `requestAnimationFrame` callback)
> * Server side rendering
> * 在錯誤邊界裡丟出的錯誤（而不是在它底下的 children）

一個 class component 如果定義了 [`static getDerivedStateFromError()`](/docs/react-component.html#static-getderivedstatefromerror) 或 [`componentDidCatch()`](/docs/react-component.html#componentdidcatch) 其中一種（或兩種都有）生命週期，它就會變成錯誤邊界。在錯誤被丟出去之後，我們使用 `static getDerivedStateFromError()` 來 render fallback 的 UI，以及使用 `componentDidCatch()` 來記錄錯誤的資訊。

```js{7-10,12-15,18-21}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 以至於下一個 render 會顯示 fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 你也可以把錯誤記錄到一個錯誤回報系統服務
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 你可以 render 任何客製化的 fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

然後你就可以把它當成一般的 component 來使用：

```js
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

錯誤邊界就如同 JavaScript 的 `catch {}`，但它是給 component 使用的。只有 class component 可以成為錯誤邊界。實務上，大部分的時間你只會想要宣告錯誤邊界 component 一次，然後在你的應用程式裡重複使用它。

要注意**錯誤邊界只會捕捉它底下 component tree 裡的 component 的錯誤**。錯誤邊界無法捕捉它自己本身的錯誤。如果一個錯誤邊界在 render 錯誤訊息的時候失敗了，這個錯誤會被傳遞到在它之上最近的錯誤邊界。這個也與 JavaScript 的 catch {} 的運作方式類似。

## Live Demo {#live-demo}

查看 [React 16](/blog/2017/09/26/react-v16.0.html) [這個宣告與使用錯誤邊界的範例](https://codepen.io/gaearon/pen/wqvxGa?editors=0010)。


## 該把錯誤邊界放在哪裡 {#where-to-place-error-boundaries}

錯誤邊界的精確度取決於你自己。你可以把它包在最上層的 route component 藉以顯示「發生了一些錯誤」的訊息給使用者，就如同 server-side framework 裡常常處理錯誤的方式。你也可以把它包在個別的小工具外，藉以保護它們不受應用程式裡發生的其他錯誤的影響。


## 對於未捕捉到的錯誤的新行為 {#new-behavior-for-uncaught-errors}

這個改變有重要的意義。**在 React 16，沒有被錯誤邊界所捕捉到的錯誤會 unmount 整個 React component tree。**

我們為了這個決定辯論過，但在我們的經驗裡，留下壞掉的 UI 比完全移除它更糟。舉例來說，在像 Messenger 一樣的產品裡，留下壞掉的 UI 可能會導致某人傳送訊息給錯誤的對象。相似地，在支付軟體裡，顯示錯誤的金額比 render 空白畫面來得更糟。

這個改變代表著，如果你遷移到 React 16，你有可能會發掘出應用程式裡以前沒注意過但已經存在的錯誤。加上錯誤邊界使你在錯誤發生時能夠提供更好的使用者體驗。

例如，Facebook Messenger 用分開的錯誤邊界包住了側欄位的內容、資訊面板、對話紀錄、和訊息輸入欄。如果某個在其中一個 UI 裡的 component 壞了，其他的部分仍會保持能夠互動的狀態。

我們也鼓勵你使用 JS 的錯誤回報服務（或建立一個你自己的服務），這樣你可以從上線的程式裡學習未處理的 exception 並修理它們。


## Component Stack Traces {#component-stack-traces}

React 16 把所有發生在 render 時的錯誤在開發時印出在 console 裡，即使應用程式不小心吞掉了這些錯誤。除了錯誤訊息和 JavaScript 的 stack 以外，它也提供了 component stack trace。現在你可以看到錯誤在哪個 component 裡發生的確切位置：

<img src="../images/docs/error-boundaries-stack-trace.png" style="max-width:100%" alt="被錯誤邊界 component 捕捉到的錯誤">

你也可以在 component stack trace 裡看見檔案名稱和行數。這個在 [Create React App](https://github.com/facebookincubator/create-react-app) 裡是預設行為：

<img src="../images/docs/error-boundaries-stack-trace-line-numbers.png" style="max-width:100%" alt="被錯誤邊界 component 捕捉到的錯誤與行數">

如果你沒有使用 Create React App, 你可以手動在 Babel 設定加上[這個 plugin](https://www.npmjs.com/package/@babel/plugin-transform-react-jsx-source)。注意它是被設計用來在開發模式使用的，且**必須在正式環境被關掉**。

> 注意
>
> 在 stack trace 裡顯示的 component 名稱是由 [`Function.name`](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Function/name) attribute 所決定的。如果你支援沒有原生提供它的舊瀏覽器和裝置（例如 IE 11），試著考慮把 `Function.name` polyfill 到你的應用程式，例如 [`function.name-polyfill`](https://github.com/JamesMGreene/Function.name)。或著，你可以另外在你所有的 component 裡設定 [`displayName`](/docs/react-component.html#displayname) attribute。


## 那 try/catch 呢？ {#how-about-trycatch}

`try` / `catch` 很棒，但它只作用在命令式程式碼（imperative code）：

```js
try {
  showButton();
} catch (error) {
  // ...
}
```

然而，React component 是宣告式（declarative）的，且指明了*什麼*必須被 render：

```js
<Button />
```

錯誤邊界保有了 React 宣告式的天性，且如你所預期的運行。例如，即使在某個 tree 裡很深的地方被 `setState` 所導致的 `componentDidUpdate` 的錯誤，它仍然會正確的被傳遞到最近的錯誤邊界。

## 那 Event Handler 呢？ {#how-about-event-handlers}

錯誤邊界**不會**捕捉 event handler 裡所發生的錯誤。

React 不需要從 event handler 裡發生的錯誤恢復。不像 render 和其他生命週期的函式一樣，event handler 不會發生在 render 的時候。所以如果它們丟出錯誤，React 仍然知道該顯示什麼在畫面上。

如果你需要捕捉一個 event handler 裡的錯誤，只要使用一般 JavaScript 的 `try` / `catch` 就可以了：

```js{9-13,17-20}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    try {
      // 做某些可以拋出錯誤的事情
    } catch (error) {
      this.setState({ error });
    }
  }

  render() {
    if (this.state.error) {
      return <h1>Caught an error.</h1>
    }
    return <button onClick={this.handleClick}>Click Me</button>
  }
}
```

注意以上的範例是用來示範一般 JavaScript 的行為，並沒有用到錯誤邊界。

## 從 React 15 發生的名稱改變 {#naming-changes-from-react-15}

React 15 用不同的函式名稱支援了非常有限的錯誤邊界功能：`unstable_handleError`。這個函式不能用了，而且從 16 beta 開始，你需要將它改成 `componentDidCatch`。

我們為這個改變提供了 [codemod](https://github.com/reactjs/react-codemod#error-boundaries) 來自動遷移你的程式碼。
