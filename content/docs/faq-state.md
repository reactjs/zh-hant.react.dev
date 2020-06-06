---
id: faq-state
title: Component State
permalink: docs/faq-state.html
layout: docs
category: FAQ
---

### `setState` 的作用？ {#what-does-setstate-do}

`setState()` 安排對 component `state` object 的更新。當 state 改變時，component 會藉由重新 render 來回應。

### `state` 和 `props` 有什麼不同？ {#what-is-the-difference-between-state-and-props}

[`props`](/docs/components-and-props.html)（「properties」的簡寫）和 [`state`](/docs/state-and-lifecycle.html) 都是純 JavaScript object。雖然兩者都擁有會影響 render 輸出的資訊，但在一個重要方向上有所不同：`props` 是被傳遞*進* component（類似於 function 的參數），而 `state` 是在 component *內部*被管理（類似於在 function 中宣告中的變數）。

這裡有一些很棒的資源，可以進一步閱讀來了解使用 `props` 和 `state` 的時機：
* [Props vs State](https://github.com/uberVU/react-guide/blob/master/props-vs-state.md)
* [ReactJS: Props vs. State](https://lucybain.com/blog/2016/react-state-vs-pros/)

### 為什麼 `setState` 會出現錯誤的值？ {#why-is-setstate-giving-me-the-wrong-value}

在 React，`this.props` 和 `this.state` 都代表該 *render* 的值。也就是目前螢幕上的內容。

呼叫 `setState` 是非同步的 — 不要在呼叫 `setState` 後立即依賴 `this.state` 去反映新的值。如果需要基於目前 state 來計算值，請傳遞一個更新用的 function 而不是 object（細節請看下方）。

*不會*符合預期結果的程式碼範例：

```jsx
incrementCount() {
  // Note: this will *not* work as intended.
  this.setState({count: this.state.count + 1});
}

handleSomething() {
  // Let's say `this.state.count` starts at 0.
  this.incrementCount();
  this.incrementCount();
  this.incrementCount();
  // When React re-renders the component, `this.state.count` will be 1, but you expected 3.

  // This is because `incrementCount()` function above reads from `this.state.count`,
  // but React doesn't update `this.state.count` until the component is re-rendered.
  // So `incrementCount()` ends up reading `this.state.count` as 0 every time, and sets it to 1.

  // The fix is described below!
}
```

關於如何修正此問題的資訊請參考下方。

### 如何使用目前 state 的值來更新 state？ {#how-do-i-update-state-with-values-that-depend-on-the-current-state}

將一個 function 而非 object 傳遞給 `setState`，來確保呼叫時始終是使用最新版本的 state（請看下方）。

### 在 `setState` 中傳遞 object 或 function 有何不同？ {#what-is-the-difference-between-passing-an-object-or-a-function-in-setstate}

傳遞一個更新用的 function 允許你在 updater 內存取目前 state 的值。由於 `setState` 是批次處理呼叫的，這讓你能夠鏈結更新並確保它們依序建立而不會產生衝突：

```jsx
incrementCount() {
  this.setState((state) => {
    // Important: read `state` instead of `this.state` when updating.
    return {count: state.count + 1}
  });
}

handleSomething() {
  // Let's say `this.state.count` starts at 0.
  this.incrementCount();
  this.incrementCount();
  this.incrementCount();

  // If you read `this.state.count` now, it would still be 0.
  // But when React re-renders the component, it will be 3.
}
```

[學習更多關於 setState](/docs/react-component.html#setstate)

### `setState` 何時是非同步？ {#when-is-setstate-asynchronous}

目前 `setState` 在 event handler 中是非同步。

這會確保 `Child` 不會重新 render 兩次，像是 `Parent` 和 `Child` 在一個單次 click 事件中同時呼叫 `setState` 的例子。取而代之，React 會在瀏覽器事件結束時「刷新」state 的更新。這在大型應用程式中能產生顯著的效能提升。

這是一個實作細節所以請避免直接依懶它。未來的版本中，React 將在更多情況下預設批次處理更新。

### 為什麼 React 不同步地更新 `this.state`？ {#why-doesnt-react-update-thisstate-synchronously}

如同在前面篇幅解釋的，在開始重新 render 前，React 意圖「等待」直到所有的 component 都在其 event handler 中呼叫 `setState()`。藉由避免不必要的重新 render 來增加效能。

不過，你也許仍想知道，為什麼 React 不在不重新 render 的情況下立即更新 `this.state` 就好。

有 2 個主要原因：

* 這會破壞 `props` 和 `state` 間的一致性，造成難以除錯的問題。
* 這會造成我們正在研究的一些新功能難以實現。

這則 [GitHub 評論](https://github.com/facebook/react/issues/11527#issuecomment-360199710)以具體範例來深入探討。

### 我應該使用 Redux 或 MobX 之類的狀態管理函式庫嗎？ {#should-i-use-a-state-management-library-like-redux-or-mobx}

[看情況。](https://redux.js.org/faq/general#when-should-i-use-redux)

在加入額外的函式庫前先來了解 React 是個好主意。因為你可以只用 React 就建立一個夠複雜的應用程式。