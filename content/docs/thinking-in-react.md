---
id: thinking-in-react
title: 用 React 思考
permalink: docs/thinking-in-react.html
redirect_from:
  - 'blog/2013/11/05/thinking-in-react.html'
  - 'docs/thinking-in-react-zh-CN.html'
prev: composition-vs-inheritance.html
---

在我們的意見中，React 是用 JavaScript 建立大型、快速的網路應用程式最首要的方式。它對於在 Facebook 和 Instagram 的我們來說能很有效的增加規模。

React 眾多的優點之ㄧ是它讓你能在寫程式的同時去思考你的應用程式。在這個章節中，我們會帶領你體會用 React 來建立一個可搜尋的產品資料表格的思考過程。

## 從視覺稿開始 {#start-with-a-mock}

想像一下我們已經有個 JSON API 和一個設計師給我們的產品視覺稿。這個視覺稿看起來像這樣：

![視覺稿](../images/blog/thinking-in-react-mock.png)

我們的 JSON API 則會回傳一些看起來像這樣的資料：

```
[
  {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
  {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
  {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
  {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
  {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
  {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];
```

## 第一步：將 UI 拆解成 component 層級 {#step-1-break-the-ui-into-a-component-hierarchy}

首先，你要做的是將視覺稿中每一個 component （及 subcomponent）都圈起來，並幫它們命名。如果你在跟設計師合作的話，他們可能已經幫你做好這一步了，所以跟他們聊聊吧！他們在 Photoshop 中所用的圖層的名字可能可以作為你的 React component 的名字！

但是你要怎麼知道哪一個東西應該是自己獨立一個 component 呢？就用和你決定建立一個新的 function 或 object 一樣的準則即可。其中一個技巧是[單一責任原則](https://en.wikipedia.org/wiki/Single_responsibility_principle)，它的意思是：在我們的理想中，一個 component應該只負責做一件事情。如果這個 component 最後變大了，你就需要再將它分成數個更小的 subcomponent 。

由於你常常會展示 JSON 的資料模型給使用者，你會發現，如果你的模式是正確地被建立的話，你的 UI（以及你的 component 結構）就會很好的對應起來。這是因為 UI 和資料模型通常是遵守相同的*資訊架構*，這意味著將你的 UI 拆成 component 通常是相當容易的。只要將 UI 分解成數個 component，每一個都明確代表著你的資料模型中的某一部份即可。

![Component 架構圖](../images/blog/thinking-in-react-components.png)

你會看到在這裡我們簡單的應用程式中有五個 component。我們把每個 component 所代表的資料都斜體化了。

  1. **`FilterableProductTable`（橘色）：** 包含整個範例
  2. **`SearchBar`（藍色）：** 接收所有 *使用者的輸入*
  3. **`ProductTable`（綠色）：** 展示並過濾根據*使用者輸入*的*資料集*
  4. **`ProductCategoryRow`（土耳其藍色）：** 為每個*列別*展示標題
  5. **`ProductRow`（紅色）：** 為每個*產品*展示一列

如果你看看 `ProductTable`，你會發現表格的標題列（內含「Name」和「Price」標籤 ）並非獨立的 component。要不要把它們變成 component 這個議題完全是個人的喜好，正反意見都有。在這邊的例子裡面，我們把它當作 `ProductTable` 的一部分，因為它是 rendering *數據集* 的一部分，而這正是 `ProductTable` 這個 component 的責任。然而，如果標題欄之後變得越來越複雜（也就是如果我們要加上可以分類的 affordance 的話），那麼建立一個獨立的 `ProductTableHeader` component 就非常合理。

既然我們已經找出視覺稿中的 component 了，讓我們來安排它們的層級。這很容易。在視覺稿中，在另一個 component 中出現的 component 就應該是 child：

  * `FilterableProductTable`
    * `SearchBar`
    * `ProductTable`
      * `ProductCategoryRow`
      * `ProductRow`

## 第二步：在 React 中建立一個靜態版本 {#step-2-build-a-static-version-in-react}

<p data-height="600" data-theme-id="0" data-slug-hash="BwWzwm" data-default-tab="js" data-user="lacker" data-embed-version="2" class="codepen">在 <a href="http://codepen.io">CodePen</a> 中看<a href="https://codepen.io/gaearon/pen/BwWzwm">用 React 思考：第二步</a>。</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

在你有了 component 層級後，就可以開始實作你的應用程式了。最簡單的方式是為你的應用程式建立一個接收資料模型、render UI 且沒有互動性的版本。建立一個靜態版本需要打很多字，但不需要想很多，而加上互動性則相反，需要做很多的思考，很少的打字，所以最好的方式是把這幾個過程都分開來。接下來，我們會知道為什麼是如此。

為你的應用程式建立一個 render 資料模型的版本，你會想要建立可以重複使用其他 component 的 component，並使用 *props* 傳遞資料。*Props* 是將資料從 parent 傳給 child 的方式。如果你對於 *state* 的概念很熟悉的話，請**完全不要使用 state** 來建立這個靜態版本。State 是保留給互動性的，也就是會隨時間改變的資料。既然我們目前要做的是這應用程式的靜態版本，你就不需要 state。

你可以從最上層開始，或從最下層開始。也就是說，你可以先從層級較高的 component 開始做起（也就是從 `FilterableProductTable` 開始），或者你也可以從比它低層級的（`ProductRow`）開始。在比較簡單的例子中，通常從上往下是比較簡單的。但在較為大型的專案中，從下往上、邊寫邊測試則比較容易。

在這一步的最後，你會有一個函式庫的可重複使用的 component 來 render 你的資料模型。這些 component 只會有 `render()` 方法，因為這是你應用程式的靜態版本。最高層級的 component (`FilterableProductTable`) 會接收你的資料模型作為 prop。如果你改變底層的資料模型並再次呼叫 `ReactDOM.render()` 的話，那麼 UI 就會被更新。看到你的 UI 被更新以及哪裡該被改變是很容易的，因為目前為止還沒有任何複雜的事發生。React 的 **單向資料流**（也可稱為*單向綁定*）確保所有 component 都是模塊化且快速的。

如果你需要幫助來執行這一步的話，請參考這份 [React 文件](/docs/)。

### 簡短的插曲：Props 和 State {#a-brief-interlude-props-vs-state}

React 中有兩種「模型」資料： props and state。理解兩者的差別至關重要。若你不確定兩者的差別，請瀏覽 [React 的官方文件](/docs/interactivity-and-dynamic-uis.html)。

## 第三步：找出最少（但完整）的 UI State 的代表 {#step-3-identify-the-minimal-but-complete-representation-of-ui-state}

為了將你的 UI 變成有互動性，你需要有辦法觸發底層的資料模型做出改變。React 使用 **state** 把這件事變容易了。

為了正確地建立你的應用程式，你首先需要思考你的應用程式最少需要哪些可變的 state。這裡的關鍵是 [DRY：*避免重複代碼原則*](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)。請找出你的應用程式所需的最少的 representation，並在你遇到其他東西時再計算它們。例如，如果你在建立一個待辦清單，就先使用一個可以用來代表待辦事項的 array。不要另外用一個獨立的 state 變數來追蹤數量。當你要 render 代辦事項的數量時，讀取待辦事項 array 的長度即可。

思考我們範例中應用程式的所有資料。我們現在有：

  * 原本的產品列表
  * 使用者輸入的搜尋關鍵字
  * 複選框的值
  * 篩選過後的產品列表

讓我們來看一下每一個資料，並找出哪一個是 state。對於每一個資料，問你自己這三個問題：

  1. 這個資料是從 parent 透過 props 傳下來的嗎？如果是的話，那它很可能不是 state。
  2. 這個資料是否一直保持不變呢？如果是的話，那它很可能不是 state。
  3. 你是否可以根據你的 component 中其他的 state 或 prop 來計算這個資料呢？如果是的話，那它一定不是 state。

原本的產品列表是被當作 prop 往下傳的，所以它不是 state。搜尋關鍵字和複選框看起來可能是 state，因為它們會隨時間而改變，也不能從其他東西中被計算出來。最後，篩選過後的產品列表不是 state，因為它能透過結合原本的產品列表、搜尋關鍵字和複選框的值被計算出來。

所以，我們的 state 是：

  * 使用者輸入的搜尋關鍵字
  * 複選框的值

## 第四步：找出你的 State 應該在哪裡 {#step-4-identify-where-your-state-should-live}

<p data-height="600" data-theme-id="0" data-slug-hash="qPrNQZ" data-default-tab="js" data-user="lacker" data-embed-version="2" class="codepen">在 <a href="http://codepen.io">CodePen</a> 中看<a href="https://codepen.io/gaearon/pen/qPrNQZ">用 React 思考：第四步</a>。</p>

OK，所以我們已經找出這個應用程式最少的 state 是哪些了。下一步，我們需要找出哪幾個 component 會 mutate，或者*擁有*，這個 state。

請記得，React 的核心精神是單向資料流，從 component 的層級從高往下流。也許哪個 component 該擁有 state 在一開始並不是很明顯。**對新手來說，這往往是最難理解的概念**，所以請跟著以下的步驟來思考：

在你的應用程式中的每個 state：

  * 指出每個根據 state 來 render 某些東西的 component。
  * 找出一個共同擁有者 component（在層級中單一一個需要 state 的、在所有的 component 之上的 component）。
  * 應該擁有 state 的會是共同擁有者 component 或另一個更高層級的 component。
  * 如果你找不出一個應該擁有 state 的 component 的話，那就建立一個新的 component 來保持 state，並把它加到層級中共同擁有者 component 之上的某處。

讓我們來討論一下我們應用程式的這個策略：

  * `ProductTable` 需要根據 state 來篩選產品列表，而 `SearchBar` 需要展示搜尋關鍵字和複選框的 state。
  * 這兩個 component 的共同擁有者 component 是 `FilterableProductTable`。
  * 概念上來說，篩選過的文字和復選框的值存在於 `FilterableProductTable` 中是合理的。

很好，所以我們現在已經決定我們的 state 會存在於 `FilterableProductTable` 之中。首先，把這個實例的 property `this.state = {filterText: '', inStockOnly: false}` 加到 `FilterableProductTable` 的 `constructor` 裡面以反映你的應用程式的初始 state。接著，把 `filterText` 和 `inStockOnly` 作為 prop 傳給 `ProductTable` 和 `SearchBar`。最後，用這些 prop 來篩選 `ProductTable` 中的列，並設定 `SearchBar` 中的表格欄的值。

你可以開始看到你的應用程式會如何運作：將 `filterText` 設定為 `「ball」` 並更新你的程式。你會看到資料表被正確地更新了。

## 第五步：加入相反的資料流 {#step-5-add-inverse-data-flow}

<p data-height="600" data-theme-id="0" data-slug-hash="LzWZvb" data-default-tab="js,result" data-user="rohan10" data-embed-version="2" data-pen-title="Thinking In React: Step 5" class="codepen"> 在 <a href="http://codepen.io">CodePen</a> 中看<a href="https://codepen.io/gaearon/pen/LzWZvb">用 React 思考：第四步</a>。</p>

到目前為止，我們已經建立了一個作為含有從層級由上往下傳 props 和 state 的、且可以正確 render 的 function 的應用程式。現在是時候支援另一種資料流的方向了：在層級深處的表格 component 需要更新 `FilterableProductTable` 的 state。

React 將這種資料流明確表示出來，以便讓你能更容易理解你的程式如何運作，但是這的確比傳統的雙向資料綁定需要打多一點字。

如果你試著在範例目前的版本中印出或勾選複選框，你會看到 React 無視你的輸入。這是刻意的，因為我們把 `input` 的 `value` prop 設定為永遠和從 `FilterableProductTable` 傳下來的 `state` ㄧ樣。

讓我們思考一下我們想要做些什麼。我們想確保當使用者改變這個表格時，我們會更新 state 以反映使用者的輸入。既然 component 只應該更新它自己本身的 state， `FilterableProductTable` 將會把 callback 傳給 `SearchBar`，而它們則會在 state 該被更新的時候被觸發。我們可以在輸入上使用 `onChange` 這個 event 來
接收通知。被 `FilterableProductTable` 傳下來的 callback 則會呼叫 `setState()`，之後應用程式就會被更新。

雖然這聽起來負責，但實際上這所用的程式碼很少。而你的資料在應用程式中流動的方向是非常明確的。

## 完成 {#and-thats-it}

希望這幫助你理解如何用 React 建立 component 和應用程式。雖然這可能需要你比你習慣的多打一些程式碼，請記得閱讀程式碼比起寫程式碼更常發生，而閱讀這種模組化、清晰明確的程式碼是非常容易的。當你開始建立大型的 component 函式庫時，你會很感激有這樣的明確性和模組性，而當你開始重複使用程式碼時，你的程式的行數會開始減少。:)
