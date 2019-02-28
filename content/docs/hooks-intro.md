---
id: hooks-intro
title: 介紹 Hook
permalink: docs/hooks-intro.html
next: hooks-overview.html
---

*Hook* 是 React 16.8 中增加的新功能。它讓你不必寫 class 就能使用 state 以及其他 React 的功能。

```js{4,5}
import React, { useState } from 'react';

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

這個新 function `useState` 將會是我們學習的第一個「Hook」，不過這只是一個初窺的範例。如果這現在看起來並不合理，請別擔心！

**你可以開始[在下一頁](/docs/hooks-overview.html)學習 Hook。**在這一頁，我們將會繼續解釋為什麼要把 Hook 加到 React 以及他們如何幫助你寫出好的應用程式。

>注意
>
>React 16.8.0 是第一個支援 Hook 的版本。在升級時，記得不要忘記升級所有的套件包括 React DOM。React Native 會在下一個穩定發佈中支援 Hook。

## 介紹影片 {#video-introduction}

在 React Conf 2018，Sophie Alpert 和 Dan Abramov 介紹了 Hook，接著 Ryan Florence 展示了如何用它們來重構應用程式。在這裡觀看影片：

<br>

<iframe width="650" height="366" src="//www.youtube.com/embed/dpw9EHDh2bM" frameborder="0" allowfullscreen></iframe>

## 沒有 Breaking Change {#no-breaking-changes}

在我們繼續之前，請注意 Hook 是：

* **完全自由選擇使用。**你可以在幾個 component 中試用 Hook 而不用重寫任何既有的程式碼。不過如果你不想要，並不需要現在學習或使用 Hook。
* **100% 向下相容。**Hook 沒有任何 breaking change。
* **現在即可使用。**隨著 v16.8.0 發佈，現在即可使用 Hook。

**目前沒有計畫要從 React 移除 class。** 你可以在這個頁面[下面的章節](#gradual-adoption-strategy)閱讀更多跟逐步採用 Hook 有關的內容。

**Hook 不會取代你對 React 概念的了解。**相反的，Hook 是對你已經熟悉的 React 概念：props、state、context、refs 以及 lifecycle，提供了一個更直接的 API。正如我們稍後將展示的那樣，Hook 還提供了一種新的強大方式來組合他們。

**如果你只是想要開始學習 Hook，可以自由地[直接跳到下一頁！](/docs/hooks-overview.html)**你也可以繼續閱讀這一頁來了解更多關於我們為什麼要加入 Hook，以及我們如何在不重寫應用程式的情況下開始使用它們。

## 動機 {#motivation}

Hook 解決了 React 中我們過去五年在編寫與維護數萬個 component 時所遇到的各種看似不相關的問題。無論你是在學習 React、每天使用它、還是更喜歡有著相似 component 模型的不同函式庫，你可能都會發現其中一些問題。

### 在 Component 之間重用 Stateful 的邏輯很困難 {#its-hard-to-reuse-stateful-logic-between-components}

React 沒有提供一個方法來把可重用的行為「附加」到一個 component 上 (舉例來說，把它連結到一個 store)。如果你已經使用 React 一段時間，你或許會熟悉像是 [render props](/docs/render-props.html) 以及 [higher-order components](/docs/higher-order-components.html)，這些試著解決這個問題的模式。但是這些模式要求你在使用它們時重新架構你的 component，這可能很麻煩，而且使程式碼更難追蹤。如果你在 React DevTools 上查看一個典型的 React 應用程式，你很可能會發現一個 component 的「包裝地獄」，被 provider、consumer、higher-order component、render props 以及其他抽象給層層圍繞。現在我們可以[在 DevTools 裡把它們過濾掉](https://github.com/facebook/react-devtools/pull/503)，不過這指出了一個更根本的問題：React 需要一個更好的 primitive 來共用 stateful 邏輯。

使用 Hook，你可以從 component 抽取 stateful 的邏輯，如此一來它就可以獨立地被測試和重複使用。**Hook 讓你不需要改變 component 階層就能重用 stateful 的邏輯。**這讓在許多 component 之間共用或是與社群共用 Hook 很簡單。

我們將會在[打造你自己的 Hook](/docs/hooks-custom.html) 討論更多相關內容。

### 複雜的 component 變得很難理解 {#complex-components-become-hard-to-understand}

我們時常必須維護那些一開始非常簡單，但後來變成充滿無法管理的 stateful 邏輯和 side effect 的 component。每個 lifecycle 方法常常包含不相關的邏輯混合在一起。舉例來說，component 可能會在 `componentDidMount` 和 `componentDidUpdate` 中抓取資料。但是，同一個 `componentDidMount` 方法可能也包含一些設置 event listener 的不相關邏輯，並在 `componentWillUnmount` 執行清除它們。會一起改變且彼此相關的程式碼被拆分，但完全不相關的程式碼卻放在同一個方法裡。這讓它很容易製造 bug 和不一致性。

在許多情況下，因為到處都是 stateful 邏輯，不可能把這些 component 拆分成更小的 component。而測試它們也很困難。這是許多人偏愛把 React 跟一個獨立的 state 管理函式庫結合的其中一個理由。然而，這常常引入了太多的抽象，要求你在不同檔案間跳來跳去，而且讓重用 component 更加困難。

為了解決這個問題，**Hook 讓你把一個 component 拆分成更小的 function，這基於什麼部分是相關的（像是設置一個 subscription 或是抓取資料）**，而不是強制基於 lifecycle 方法來分拆。你還可以選擇使用 reducer 來管理 component 的內部 state，使其更具可預測性。

我們將會在[使用 Effect Hook](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns) 討論更多相關內容。

### Class 讓人們和電腦同時感到困惑 {#classes-confuse-both-people-and-machines}

除了使重用、組織程式碼更加困難以外，我們發現 class 可能是學習 React 的一大障礙。你必須了解 `this` 在 JavaScript 中如何運作，而這跟它在大部分程式語言中的運作方式非常不同。你必須記得 bind 那些 event handler。如果沒有不穩定的[語法提案](https://babeljs.io/docs/en/babel-plugin-transform-class-properties/)，撰寫的程式碼會非常繁瑣。人們可以很好的理解 props、state 以及從上而下的資料流，但仍然在跟 class 奮鬥。React 中的 function component 和 class component 之間的差異以及什麼時候該使用哪一個，甚至在經驗豐富的 React 開發者之間也存在意見分歧。

此外，React 已經出現了大約五年，而我們想要確保它在下一個五年保持競爭力。如同 [Svelte](https://svelte.technology/)、[Angular](https://angular.io/)、[Glimmer](https://glimmerjs.com/)，以及其他人所展示的，component 的[提前編譯](https://en.wikipedia.org/wiki/Ahead-of-time_compilation) 有很大的未來潛力。特別是如果它不侷限在模板上。最近，我們在實驗使用 [Prepack](https://prepack.io/) 來做 [component folding](https://github.com/facebook/react/issues/7323)，而我們已經看到大有可為的早期結果。然而，我們發現使用 class component 會鼓勵一些不是故意的模式，這會讓這些最佳化回到一條比較慢的路。Class 在現在的工具上也有不少問題。例如，class 沒有辦法很好的壓縮，而且它讓 hot reload 變得脆弱而且不可靠。我們想要提出一個可以讓程式碼更可能留在可最佳化的路徑上的 API。

為了解決這些問題，**Hook 讓你不需要 class 就能使用更多 React 的功能。** 從概念上來看，React component 一直都更接近 function。Hook 擁抱 function，但沒有犧牲 React 的實際精神。Hook 提供取用 imperative 技術的辦法且不要求你學習複雜的 functional 或 reactive programming 技術。

>範例
>
>[Hook 總覽](/docs/hooks-overview.html)是一個開始學習 Hook 的好地方。

## 逐步的採用策略 {#gradual-adoption-strategy}

>**長話短說：目前沒有計畫要從 React 移除 class。**

我們知道 React 的開發者們專注在交付產品，沒有時間仔細去看每一個被釋出的新 API。Hook 非常新，所以在考慮學習或採用它們之前，等待更多範例和教學可能會更好。

我們也了解要添加一個新的 primitive 到 React 的標準非常高。我們已經準備了一個[詳盡的 RFC](https://github.com/reactjs/rfcs/pull/68) 給好奇的讀者，它藉由更多細節深入探討動機，並針對特定的設計決策以及先關的既有技術提供額外的觀點。

**至關重要的是，Hook 可以與既有的程式碼一起運作，因此你可以逐步採用它們。** 不用急著轉換到 Hook。我們建議避免任何「巨大的改寫」，尤其是那些既有、複雜的 class component。要開始「從 Hook 的角度思考」需要一些思維上的轉變。根據我們的經驗，最好先在新的且重要性較低的 component 中練習使用 Hook，並確保團隊中的每個人都不會對它感到不舒服。在你嘗試了 Hook 之後，請自由地[給我們一些回饋](https://github.com/facebook/react/issues/new)，不管是正面的還是負面的可以。

我們有意讓 Hook 能涵蓋 class 所有既有的使用案例，但**我們會在可見的未來繼續支援 class component。**在 Facebook 裡，我們有數以萬計的 component 是用 class 寫的，而我們絕對沒有計劃要改寫它們。取而代之，我們開始在新的程式碼中使用 Hook 並讓它們跟 class 共存。

## 常見問題 {#frequently-asked-questions}

我們準備了一個 [Hook 的常見問題頁面](/docs/hooks-faq.html) 來回答 Hook 最常見到的問題。

## 下一步 {#next-steps}

看到這頁的最後面，你應該已經大致了解 Hook 正在解決什麼問題，不過許多細節你可能都還不大清楚。別擔心！**讓我們馬上前往[下一頁](/docs/hooks-overview.html)，我們可以在那裡開始藉由範例學習 Hook。**
