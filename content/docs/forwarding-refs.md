---
id: forwarding-refs
title: 傳送 Ref
permalink: docs/forwarding-refs.html
---

傳送 ref 是一種自動把 [ref](/docs/refs-and-the-dom.html) 從一個 component 傳遞到它底下的其中一個 child 的技巧。通常來說，應用程式裡大部分的 component 都不需要用到它。然而，對某些種類的 component 來說它很有用，特別是能夠重複使用的函式庫。以下會解釋最常見的情形。

## 傳送 ref 到 DOM component {#forwarding-refs-to-dom-components}

試著考慮一個叫做 `FancyButton` 的 component，它會 render 一個原生的 `button` DOM element：`embed:forwarding-refs/fancy-button-simple.js`

React component 會隱藏包含 render 的結果在內的實作細節。其他使用到 `FancyButton` 的 component **通常不需要**獲得內部按鈕的 DOM element 的 [ref](/docs/refs-and-the-dom.html)。這樣帶來的好處是，我們能夠避免讓其他 component 過度依賴彼此的 DOM 的結構。

雖然這樣的封裝對於應用程式層級的 component（像是 `FeedStory` 或 `Comment`）來說是我們所希望擁有的，但對於常用的「末端」 component，像是 `FancyButton` 或 `MyTextInput` 來說，可能會變得不方便使用。這些末端 component 通常會像普通的 DOM `button` 和 `input` 一樣，在應用程式的各個地方被使用，在處理 focus、選取或動畫時，取得它們的 DOM 節點可能是不可避免的。

**傳送 ref 是個選擇性的功能，它能夠讓某些 component 利用它們收到的 `ref` 來傳遞到底下的 child component。**

在下面的例子中，`FancyButton` 藉由 `React.forwardRef` 來獲取傳遞到它身上的 `ref`，然後再傳遞到它 render 的 DOM `button` 上：

`embed:forwarding-refs/fancy-button-simple-ref.js`

這樣一來，使用 `FancyButton` 的 component 可以獲得它底下的 `button` 的 DOM 節點的 ref，並可以在需要的時候獲取它 —— 就如同直接使用 `button` DOM 一樣。

以下一步一步的解釋上面的例子到底發生了什麼事：

1. 我們藉由呼叫 `React.createRef` 產生了一個 [React ref](/docs/refs-and-the-dom.html)，然後將它賦值於叫做 `ref` 的變數裡。
1. 我們藉由把 `ref` 當成一個 JSX attribute 來把它傳遞到 `<FancyButton ref={ref}>`。
1. React 把 `ref` 當作第二個變數傳到 `forwardRef` 裡的 `(props, ref) => ...` function。
1. 我們藉由把這個 `ref` 當作 JSX attribute 來傳遞到更下面的 `<button ref={ref}>`。
1. 當 ref 被附上之後，`ref.current` 會指向 `<button>` DOM 節點。

>注意
>
>第二個 `ref` 變數只會在你用 `React.forwardRef` 呼叫定義一個 component 的時候存在。一般 function 或 class component 不會獲得 `ref` 變數，且在 props 裡 ref 也不存在。。
>
>傳送 ref 不侷限於 DOM 元件。你可以也將 ref 傳遞到 class component。

## 對於 component 函式庫維護者的提醒 {#note-for-component-library-maintainers}

**當你在函式庫開始使用 `forwardRef` 時，你應該要把它當作重大變化，然後為你的元件庫發佈新的主要版號。** 因為你的函式庫可能會有可見的不同行為（像是 ref 被指定在哪，或是什麼型別會被輸出），然後它可能會破壞那些依賴於舊有行為的應用程式或其他套件。

有條件的在 ref 存在時才使用 `React.forwardRef` 也是不推薦的方式，相同的原因：它改變了你的套件的行為，且當你的使用者升級 React 之後可能會破壞使用者的應用程式。

## 在 Higher-Order Component 內傳送 ref {#forwarding-refs-in-higher-order-components}

在 [Higher-Order Component](/docs/higher-order-components.html)（也叫做 HOC）裡，這樣的技巧會特別有用。讓我們用一個會把 component 的 prop 記錄到 console 的 HOC 為例：
`embed:forwarding-refs/log-props-before.js`

這個「logProps」HOC 把所有的 `prop` 傳遞到他所包裹的 component，所以被 render 出的結果會是一樣的。舉例來說，我們可以用這個 HOC 來記錄所有經過「fancy button」元件的 prop：
`embed:forwarding-refs/fancy-button.js`

以上的範例有個警告：ref 不會被傳遞過去。因為 `ref` 不是個 prop。就像 `key` 一樣，React 用不同的方式處理它。如果你想要在 HOC 加上一個 ref，ref 會被指定到最外層的 component，而不是直接包裹它的那個 component。

這代表對於 `FancyButton` component 所用的 ref 會直接被附到 `LogProps` component：
`embed:forwarding-refs/fancy-button-ref.js`

幸運的是，我們可以刻意利用 `React.forwardRef` API 把 ref 傳送到裡面的 `FancyButton` component。`React.forwardRef` 接受一個用到 `props` 和 `ref` 參數的 render 的 function 並回傳一個 React 節點。例如：
`embed:forwarding-refs/log-props-after.js`

## 在 DevTool 裡顯示客製化的名稱 {#displaying-a-custom-name-in-devtools}

`React.forwardRef` 接受一個 render function。React DevTool 使用這個 function 來決定這個傳送 ref 的 component 該顯示什麼。

例如，在 DevTool 裡，這個傳送的 component 會顯示為 「*ForwardRef*」：

`embed:forwarding-refs/wrapped-component.js`

如果你對 render function 取名，DevTool 會包含它的名字（例如：「*ForwardRef(myFunction)*」）：

`embed:forwarding-refs/wrapped-component-with-function-name.js`

你也可以設定 function 的 `displayName` 來包裹你的 component：

`embed:forwarding-refs/customized-display-name.js`
