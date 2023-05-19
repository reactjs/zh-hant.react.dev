---
id: faq-internals
title: Virtual DOM 及它的本質
permalink: docs/faq-internals.html
layout: docs
category: FAQ
---

### 什麼是 Virtual DOM? {#what-is-the-virtual-dom}

Virtual DOM（VDOM）是一種程式概念，其中 UI 的理想或「虛擬」表示保存在記憶體中，並通過 ReactDOM 等函式庫與「真實」的 DOM 同步。這個過程叫做 [reconciliation](/docs/reconciliation.html)。

這種方法啟用了 React 的宣告式 API：你告訴 React 你希望 UI 處於什麼狀態，它會確保 DOM 與該狀態匹配。這抽像出了你在構建應用程式時必須使用的屬性操作、事件處理和手動 DOM 更新。

與其「Virtual DOM」說是一種特定技術，不如說是一種模式，因此人們有時會說它有不同的含義。 在 React 世界中，術語「Virtual DOM」通常與 [React elements](/docs/rendering-elements.html) 因為它們是代表用戶界面的物件。然而，React 還使用稱為「fibers」的內部物件來保存有關 component tree 的附加資訊。它們也可以被視為 React 中「Virtual DOM」實現的一部分。

### Shadow DOM 和 Virtual DOM 一樣嗎？{#is-the-shadow-dom-the-same-as-the-virtual-dom}

不，它們是不同的。Shadow DOM 是一種瀏覽器技術，主要設計用於在 Web 組件中定義 variables 和 CSS。Virtual DOM 是一個概念，由函式庫在瀏覽器 API 之上用 JavaScript 實現。

### 什麼是"React Fiber"? {#what-is-react-fiber}

Fiber 是 React 16 中新的 reconciliation 引擎。它的主要目標是啟用 Virtual DOM 的增量渲染。[閱讀更多](https://github.com/acdlite/react-fiber-architecture)。
