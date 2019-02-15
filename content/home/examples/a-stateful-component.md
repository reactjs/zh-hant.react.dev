---
title: Stateful Component
order: 1
domid: timer-example
---

除了接受輸入資料外（透過 `this.props` 存取），一個 Component 也可以保存自身的 state（透過 `this.state` 存取）。當一個 component 的 state 改變的時候，產生的標記語法將會透過自動重新呼叫 `render()` 更新。
