---
id: testing
title: 測試概覽
permalink: docs/testing.html
redirect_from:
  - "community/testing.html"
next: testing-recipes.html
---

你可以像測試其他 JavaScript 程式碼一樣來測試 React component。

有幾種方式可以來測試 React component。大致上來說，它們可以分為兩種類型：

* 在簡化的測試環境中 **render component tree** 並且 assert 它們的輸出。
* 在真實瀏覽器環境中**執行一個完整的應用程式**（也稱為「end-to-end」測試）。

本文件章節專注於第一種情況的測試策略。而完整的 end-to-end 測試對於預防重要的 workflow 不受影響非常有用，但此類測試不涉於 React component，因此不在本文件範圍內。

### 權衡 {#tradeoffs}


當選擇測試工具時，值得考慮一些權衡：

* **迭代速度 vs 實際環境：** 有一些工具在做出更改和查看結果之間提供了非常快速的回饋，但沒有精確的模擬瀏覽器的行為。其他工具可能使用真實的瀏覽器環境，但降低了迭代速度而且在持續集成伺服器上較脆弱。
* **需要多少 Mock：**對於 component 的「單元」測試和「整合」測試之間的區別可能很模糊。如果你要測試一個表單，應該要測試表單內的按鈕嗎？或是 button component 應該有它自己的測試？重構按鈕會破壞表單的測試嗎？

對於不同的團隊和產品會有不同的答案。

### 推薦工具 {#tools}

**[Jest](https://facebook.github.io/jest/)** 是一個 JavaScript test runner 讓你可以透過 [`jsdom`](/docs/testing-environments.html#mocking-a-rendering-surface) 存取 DOM。jsdom 只是一個很接近瀏覽器工作的方式，不過它以經足以測試 React component。Jest 有出色的迭代速度與像是 mock [module](/docs/testing-environments.html#mocking-modules) 和 [timer](/docs/testing-environments.html#mocking-timers) 的強大功能，因此你可以有更多的方式來控制你的程式碼執行。

**[React Testing Library](https://testing-library.com/react)** 是一系列的 helper 讓你可以測試 React component 而不需要依賴它們的實作細節。這個方法讓重構變的輕而易舉，也讓你朝著可訪問性的最佳實踐的方向而前進。雖然它沒有提供一種「shallow」render 它的 child component 的方式，透過像是 Jest test runner 的 [mock](/docs/testing-recipes.html#mocking-modules) 可以讓你達到這個目的。

### 學習更多 {#learn-more}

本章節分成以下兩頁：

- [方法](/docs/testing-recipes.html)：為 React component 撰寫測試時的常用模式。
- [環境](/docs/testing-environments.html)：為 React component 設定測試環境時應該考慮的事項。
