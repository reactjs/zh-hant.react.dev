---
title: 有狀態的元件
order: 1
domid: timer-example
---

除了接受輸入資料外（透過 `this.props` 存取），一個元件也可以維護自身的狀態（透過 `this.state` 存取）。當一個元件的狀態資訊改變的時候，產生的標記語法將會透過重新呼叫 `render()` 自動更新。
