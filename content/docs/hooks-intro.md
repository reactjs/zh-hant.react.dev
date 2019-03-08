---
id: hooks-intro
title: 隆重介紹 Hooks
permalink: docs/hooks-intro.html
next: hooks-overview.html
---

*Hooks* 是 React 16.8 新加的功能，他們讓你可以不用寫 class 就能使用 state 與其他 React 的功能。

```js{4,5}
import React, { useState } from 'react';

function Example() {
  // 宣告一個新的 state 變數，我們稱作為「count」。
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

這個新的 function `useState` 是我們將要學習的第一個「Hook」，但這個例子只是個預告，如果你看不懂，不用擔心！

**你可以[在下一頁](/docs/hooks-overview.html)開始學習 Hooks 。** 在這一頁，我們將解釋為什麼我們在 React 中加入 Hooks 與他們如何幫助你寫出更好的應用程式。 

>補充
>
>React 16.8.0 是支援 Hooks 的第一版釋出。當你升級的時候，不要忘記更新所有的 package，包括 React DOM。React Native 將會在下一版穩定釋出的時候支援 Hooks。

## 影片介紹 {#video-introduction}

Sophie Alpert 與 Dan Abramov 在 React Conf 2018 隆重介紹 Hooks，Ryan Florence 接著展示如何使用他們重構一個應用程式。在這裡觀看影片：

<br>

<iframe width="650" height="366" src="//www.youtube.com/embed/dpw9EHDh2bM" frameborder="0" allowfullscreen></iframe>

## 沒有 Breaking Change {#no-breaking-changes}

在我們繼續之前，注意 Hooks 是：

* **完全選擇在你。** 你可以在幾個 component 中試用 Hooks，不需要重寫任何現有的 code。不過如果你不想要，你不需要現在就學或使用 Hooks。
* **100% 向後兼容。** Hooks 沒有任何 breaking change。
* **現在就可以使用。** Hooks 在 v16.8.0 釋出中就可以使用。

**沒有從 React 中移除 class 的計畫。** 你可以在本頁[下方](#gradual-adoption-strategy)閱讀更多 Hooks 逐步採用策略。

**Hooks 不會取代你關於 React 概念的知識。** 相反地，Hooks 提供一個更直接的 API 給你已經會的 React 概念：props, state, context, refs, 與 lifecycle。我們之後將展示，Hooks 也提供一個新的強大的方式來結合他們。

**如果你只想要開始學習 Hooks，歡迎[直接跳到下一頁！](/docs/hooks-overview.html)** 你也可以繼續閱讀這一頁了解更多為什麼我們加入 Hooks，與我們將如何開始使用他們，不需要重寫我們的應用程式。

## 動機 {#motivation}

Hooks 解決一連串看似無關的 React 的問題，那些我們過去五年中寫和維護的數以千計的 component 中的問題。無論你正在學習 React、日常使用、或甚至偏好一個不同但類似元件模型的函式庫，你也許會認得其中這些問題。

### 很難在 component 之間重複使用 stateful 邏輯{#its-hard-to-reuse-stateful-logic-between-components}

React 沒有提供一個方式去「連接」可重複使用的邏輯在 component 上（例如，連接 store）。如果你已經使用 React 一陣子，你也許很熟悉一些 pattern 像是 [render props](/docs/render-props.html) 與 [higher-order components](/docs/higher-order-components.html) 都試著解決這個問題。但是這些 pattern 在你使用他們的時候，需要你重新架構你的 component，這會很麻煩並且讓 code 很難懂。如果你在 React DevTools 看一個典型的 React 應用程式，你很有機會看到「wrapper hell」，component 被一層層 provider、consumer、higher-order component、render prop 與其他抽象邏輯所圍繞。雖然我們可以[用 DevTools 過濾他們](https://github.com/facebook/react-devtools/pull/503)，這只出了一個很深層的問題：React 需要一個更好的基本型別來共享 statefule 邏輯。

有了 Hooks，你可以從 component 中抽離 stateful 邏輯，如此一來，他可以被獨立測試和重複使用。**Hooks 讓你不用改變你的 component hierarchy 就可以重複使用 stateful 邏輯。**這讓 component 或社群之間共享 Hooks 變得很容易。

我們將在[打造你自己的 Hooks](/docs/hooks-custom.html) 討論更多。

### 複雜的 component 變得很難懂 {#complex-components-become-hard-to-understand}

我們過去常常必須維護一些 component，他們一開始很單純但慢慢演變成一堆不可管理的亂七八糟的 stateful 邏輯與 side effect。每一個 lifecycle 常常包含一堆沒有關聯的邏輯。例如，在「componentDidMount」與「componentDidUpdate」中 component 會 fetch 資料，然而同一個「componentDidMount」方法可能同時包含一些沒有關聯的邏輯用來設定 event listener，並在「componentWillUnmount」cleanup。彼此相關且需要一起更改的程式碼被分開了，但完全沒有關聯的程式碼最終合併在同一個方法之中。這麼做太容易導致 bug 和前後不一致。

很多情況下不可能將這些 component 拆成更小的 component 因為 stateful 邏輯散佈在各處，同時也很難測試他們。這也是其中一個理由為什麼很多人喜歡結合 React 和一個獨立的狀態管理函式庫。然而，這常常導致太多抽象邏輯，需要你在不同檔案間跳來跳去，且讓重複使用 component 變得更困難。

為了解決這個問題，比起強迫根據 lifecycle 方法拆分，**Hooks 讓你根據相關的部分（像是設定訂閱或 fetch 資料）將一個 component 拆成許多更小的 function**。你也可以選擇透過 reducer 管理 component 的 local state 讓他更容易預測。

我們將在[使用 Effect Hook](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns) 討論更多。

### class 讓人和電腦都很疑惑

除了讓程式碼更難重複使用和管理之外，我們發現 class 是學習 React 的一個很大的障礙。你必須了解 `this` 在 JavaScript 中是怎麼運作的，這和他在大部份其他語言的運作方式不同，你必須記得 bind event handler。在 [syntax proposals](https://babeljs.io/docs/en/babel-plugin-transform-class-properties/) 還不穩定的期間，程式碼會很冗長。大家能夠很好地理解 props，state 和 top-down data flow 但對於 class 還在努力地理解中。對於有經驗的 React 開發者來說，對於什麼時候使用 function 和 class component 和他們彼此之間的分別，都還存在著歧見。

此外，React 已經推出五年了，我們想要確保下一個五年他還有一席之地。像是 [Svelte](https://svelte.technology/)，[Angular](https://angular.io/)，[Glimmer](https://glimmerjs.com/)，和其他框架所顯示地，component [ahead-of-time compilation](https://en.wikipedia.org/wiki/Ahead-of-time_compilation) 未來有很多的潛力，特別是如果不只侷限在 template 的話。最近我們已經透過 [Prepack](https://prepack.io/) 實驗了 [component folding](https://github.com/facebook/react/issues/7323)，且我們看到很有展望的早期成果。然而，我們發現 class component 會鼓勵使用非刻意的 pattern 讓這些優化退化成更慢的路徑。class 在今天的工具上也造成了問題，例如，class 縮小檔案的效果不好，且他們讓 hot reloading 變得不可靠。我們想要提供一個 API 讓程式碼盡可能留在可優化的路徑。

為了解決這些問題，**Hooks 讓你不用 class 就可以使用更多 React 的功能。**概念上，React component 一直和 function 比較接近。Hooks 擁抱 function，卻不犧牲 React 的實用精神。Hooks 讓你在不得已的時候可以使用命令式的方法，且不需要你學習複雜的 functional 或 reactive programming 技巧。

>範例
>
>[第一眼 Hooks](/docs/hooks-overview.html) 是開始學習 Hooks 的好地方。

## 逐步採用策略 {#gradual-adoption-strategy}

>**長話短說：沒有從 React 中移除 class 的計畫。**

我們知道 React 開發者專注在開發產品且沒有時間細看每一個剛釋出的新的 API，Hooks 還很新，考慮學習或採用之前，可能等更多範例和教程釋出比較好。

我們也理解在 React 中加入新的基本型別的門檻非常高。我們準備了[詳細的 RFC](https://github.com/reactjs/rfcs/pull/68) 給有好奇心的讀者，深入探討動機與對於某些設計決定的額外看法和相關的現有技術。

**很重要，Hooks 和現有的程式碼共同運作，讓你可以逐步採用。**不用急著轉移到 Hooks，我們建議避免任何「大重寫」，特別是現有的複雜的 class component。需要花點時間在想法上開始「用 Hooks 思考」。根據我們的經驗，最好的方式是先在新的且非關鍵的 component 練習使用 Hooks，且確保你的團隊裡的每個人都得心應手。在你試過 Hooks 之後，請大方[寄給我們回饋](https://github.com/facebook/react/issues/new)，好的或壞的都可以。

我們計畫用 Hooks 涵蓋所有現存的 class 使用案例，但是 **我們將在可預見的未來持續支援 class component。**在 Facebook，我們有數以千計的 component 用 class 寫成，且我們完全沒有計劃重寫他們。相反地，我們開始在新的程式碼一起使用 Hooks 和 class。

## 常見問題 {#frequently-asked-questions}

我們準備了 [Hooks 常見問題頁](/docs/hooks-faq.html)用來回答有關 Hooks 的最常見的問題。

## 下一步 {#next-steps}

在這一頁的最後，你應該有一個粗略的概念 Hooks 解決什麼樣的問題，但很多細節可能還不清楚。不用擔心，**讓我們現在前往[下一頁](/docs/hooks-overview.html)用範例開始學習 Hooks。**
