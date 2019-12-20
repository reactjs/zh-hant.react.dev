---
id: forwarding-refs
title: 傳送 Ref
permalink: docs/forwarding-refs.html
---

傳送 ref 是一種自動把 [ref](/docs/refs-and-the-dom.html) 從一個元件傳遞到他底下的其中一個 child 的技巧。通常來說，應用程式裡大部分的元件都不需要用到它。然而，對某些種類的元件來說，他是很有用的，特別是能共重複使用的元件庫。以下會解釋最常見的情形。

## 傳送 ref 到 DOM 元件 {#forwarding-refs-to-dom-components}

試著考慮一個叫做 `FancyButton` 的元件，他會 render 一個原生的 `button` DOM element：`embed:forwarding-refs/fancy-button-simple.js`

React 元件會隱藏包含他的 render 的結果等實作細節。其他使用到 `FancyButton` 的元件**通常不需要**獲得內部按鈕的 DOM element 的 [ref](/docs/refs-and-the-dom.html)。這樣帶來的好處是能夠使得我們避免讓其他元件過度依賴彼此的 DOM 的結構。

雖然這樣的封裝對於應用程式層級的元件（像是 `FeedStory` 或 `Comment`）來說是我們所希望擁有的，但對於常用的「末端」元件，像是 `FancyButton` 或 `MyTextInput` 來說，可能會變得不方便使用。這些末端元件通常會像普通的 DOM `button` 和 `input` 一樣，在應用程式的各個地方被使用，獲取他們的 DOM 節點在處理 focus、選取或動畫時，可能是不可避免的。

**傳送 ref 是個選擇性的功能，他能夠讓某些元件利用他們收到的 `ref` 來傳遞到底下的子元件。**

在下面的例子中，`FancyButton` 藉由 `React.forwardRef` 來獲取傳遞到他身上的 `ref`，然後再傳遞到他 render 的 DOM `button` 上：

`embed:forwarding-refs/fancy-button-simple-ref.js`

這樣一來，使用 `FancyButton` 的元件可以獲得他底下的 `button` 的 DOM 節點的 ref，並可以在需要的時候獲取他 —— 就如同直接使用 `button` DOM 一樣。

以下對於上面例子一步一步的解釋到底發生了什麼事：

1. 我們藉由呼叫 `React.createRef` 產生了一個 [React ref](/docs/refs-and-the-dom.html)，然後將他賦值於叫做 `ref` 的變數裡。
1. 我們藉由把 `ref` 當成一個 JSX attribute 來把他傳遞到 `<FancyButton ref={ref}>`。
1. React 把 `ref` 當作第二個變數傳到 `forwardRef` 裡的 `(props, ref) => ...` 函式。
1. 我們藉由把這個 `ref` 當作 JSX attribute 來傳遞到更下面的 `<button ref={ref}>`。
1. 當 ref 被附上之後，`ref.current` 會指向 `<button>` DOM 節點。

>注意
>
>第二個 `ref` 變數只會在你用 `React.forwardRef` 呼叫定義一個元件的時候存在。一般的函式或 class component 不會獲得 `ref` 變數，且在 props 裡 ref 也不存在。
>
>Ref forwarding 不侷限於 DOM 元件。你可以也將 ref 傳遞到 class component。

## 對元件庫管理者的提醒 {#note-for-component-library-maintainers}

**當你在元件庫開始使用 `forwardRef` 時，你應該要把它當作重大變化，然後為你的元件庫發佈新的主要版號。** 因為你的元件庫可能會有可見的不同行為（像是 ref 被指定在哪，或是什麼型別會被輸出），然後他可能會破壞你的依賴於舊有行為的應用程式或其他套件。

有條件的在 ref 存在時才使用 `React.forwardRef` 也是不推薦的方式，相同的原因：他改變了你的套件的行為，且當你的使用者升級 React 之後可能會破壞使用者的應用程式。

## 在高階元件裡傳送 ref {#forwarding-refs-in-higher-order-components}

在[高階元件](/docs/higher-order-components.html)（也叫做 HOC）裡，這樣的技巧會特別有用。讓我們用一個會把元件的 prop 記錄到 console 的 HOC 為例：
`embed:forwarding-refs/log-props-before.js`

這個「logProps」HOC 把所有的 `prop` 傳遞到他所包裹的元件，所以被 render 出的結果會是一樣的。舉例來說，我們可以用這個 HOC 來記錄所有經過「fancy button」元件的 prop：
`embed:forwarding-refs/fancy-button.js`

以上的範例有個警告：ref 不會被傳遞過去。因為 `ref` 不是個 prop。就像 `key` 一樣，在 React 用不同的方式處理他。如果你想要在 HOC 加上一個 ref，ref 會被指定到最外層的元件，而不是直接包裹他的那個元件。

這代表對於 `FancyButton` 元件所用的 ref 會直接被附到 `LogProps` 元件：
`embed:forwarding-refs/fancy-button-ref.js`

幸運的是，我們可以刻意利用 `React.forwardRef` API 把 ref 傳送到裡面的 `FancyButton` 元件。`React.forwardRef` 接受一個用到 `props` 和 `ref` 參數的 render 的函式並回傳一個 React 節點。例如：
`embed:forwarding-refs/log-props-after.js`

## 在 DevTool 裡顯示客製化的名稱 {#displaying-a-custom-name-in-devtools}

`React.forwardRef` 接受一個 render 函式。React DevTool 使用這個函式來決定這個傳送 ref 的元件該顯示什麼。

例如，在 DevTool 裡，這個傳送的元件會顯示為 「*ForwardRef*」：

`embed:forwarding-refs/wrapped-component.js`

如果你對 render 函式取名，DevTool 會包含他的名字（例如：「*ForwardRef(myFunction)*」）：

`embed:forwarding-refs/wrapped-component-with-function-name.js`

你也可以設定函式的 `displayName` 來包裹你的元件：

`embed:forwarding-refs/customized-display-name.js`
