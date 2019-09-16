---
id: reconciliation
title: Reconciliation
permalink: docs/reconciliation.html
---

React 提供聲明式 (declarative) 的 API，讓開發者在使用 React 時，可以不用關注每次 Component 更新時底層有什麼改變。這讓開發應用程式簡單許多，但也可能讓開發者對 React 底層的相關實作不夠瞭解。因此在這篇文章中描述了實作 React 底層中 「diffing」 演算法時，我們採取什麼策略讓 Component 的更新可以同時滿足可預測性以及高性能。

## 動機 {#motivation}

在使用 React 時，每次呼叫 `render()` 函式，我們都可以當成是創建了一顆由 React 元素構成的樹狀結構。而在每一次有 state 或 props 更新時，`render()` 函式就會返回一顆不同的樹。因此，React 需要判斷如何有效率的把 UI 從舊的樹更新成新的樹。

對於這個「如何用最少操作去將舊的樹轉換成新的樹」的演算法問題有一些通用的解法，但即使是目前[最先進的演算法](<(https://grfia.dlsi.ua.es/ml/algorithms/references/editsurvey_bille.pdf)>)都還需要 O(n<sup>3</sup>) 的時間複雜度（n 為樹中元素數量）。

假設 React 使用這種演算法，則呈現 1000 個元素需要 10 億次的比較。因為這個比較成本實在太高，所以 React 在以下兩個假設下採用了一個 O(n) 的啓發式 (heuristic) 演算法：

1. 兩個不同類型的元素會產生出不同的樹
2. 開發者可以通過 `key` prop 來指出哪些子元素在不同的渲染下能保持不變；

而事實上，以上假設在幾乎所有實務上會出現的場景都成立。

## Diffing 演算法 {#the-diffing-algorithm}

當比對兩顆樹時，React 首先比較兩棵樹的根節點。不同類型的根節點元素會有不同的處理方式。

### 比對不同類型的元素 {#elements-of-different-types}

當比對的兩個根節點為不同類型的元素時，React 會將原有的樹整顆拆掉並且重新建立起新的樹。例如，當一個元素從 `<a>` 變成 `<img>`、從 `<Article>` 變成 `<Comment>`、或從 `<Button>` 變成 `<div>` 時，都會觸發一個完整的重建流程。

當拆掉一顆樹時，舊的 DOM 節點會被銷毀，且該 Component 實例 (instance) 會執行 `componentWillUnmount()` 函式。當建立一顆新的樹時，新建立的 DOM 節點會被插入到 DOM 中，且該 Component 實例會依次執行 `componentWillMount()` 與 `componentDidMount()` 方法。而所有跟之前舊的樹所關聯的 state 也會被銷毀。

在根節點以下的 Component 也會被卸載，它們的狀態會被銷毀。比如，當比對以下變更時：

```xml
<div>
  <Counter />
</div>

<span>
  <Counter />
</span>
```

React 會銷毀舊的子節點 `Counter` 並且重新建立一個新的。

### 比對同一類型的 DOM 元素 {#dom-elements-of-the-same-type}

當比對兩個相同類型的 React 元素時，React 會保留 DOM 節點，只比對及更新有改變的屬性。例如：

```xml
<div className="before" title="stuff" />

<div className="after" title="stuff" />
```

透過比對這兩個元素，React 知道只需要修改 DOM 元素上的 className 屬性。

同樣地，當更新 style 屬性時，React 僅更新有所更變的屬性。比如：

```xml
<div style={{color: 'red', fontWeight: 'bold'}} />

<div style={{color: 'green', fontWeight: 'bold'}}/>
```

透過比對這兩個元素，React 知道只需要修改 DOM 元素上的 `color` 樣式，無需修改 `fontWeight。`

在處理完當前節點之後，React 會繼續對子節點進行遞迴處理。

## 比對同類型的 Component 元素 {#component-elements-of-the-same-type}

當一個 Component 更新時， 該 Component 的實例保持不變，這樣 state 能夠留存在不同次的渲染中。React 會更新該 Component 實例的 props 以跟最新的元素保持一致，並且呼叫該實例的 `componentWillReceiveProps()` 和 `componentWillUpdate()` 方法。

接下來，該實例會再呼叫 `render()` 方法，而 diff 算法將會遞迴處理舊的結果以及新的結果。

### 對子節點進行遞迴處理 {#recursing-on-children}

在默認條件下，當遞迴處理 DOM 節點的子元素時，React 會同時遍歷兩個子元素的陣列，並在發現差異時，生成一個 Mutation。

在子元素的陣列尾端新增元素時，變更需要的成本比較小。例如：

```xml
<ul>
  <li>first</li>
  <li>second</li>
</ul>

<ul>
  <li>first</li>
  <li>second</li>
  <li>third</li>
</ul>
```

React 會先匹配兩個 `<li>first</li>` 對應的樹，然後匹配第二個元素 `<li>second</li>` 對應的樹，最後插入第三個元素 `<li>third</li>` 的樹。

如果只是單純的實作，則在陣列開頭插入新元素會讓效能變差，因為變更需要的成本會提升。例如：

```xml
<ul>
  <li>Duke</li>
  <li>Villanova</li>
</ul>

<ul>
  <li>Connecticut</li>
  <li>Duke</li>
  <li>Villanova</li>
</ul>
```

這個情況下，React 會針對每個子元素都進行 mutate，而不是讓兩個相同的 `<li>Duke</li>` 和 `<li>Villanova</li>` 子樹不參與 mutate。這種情況下的低效率可能會帶來性能問題。

**Keys**

為了解決以上問題，React 提供了 key 屬性。當子元素擁有 `key` 屬性時，React 使用 key 來匹配原有樹上的子元素以及最新樹上的子元素。因此，以下例子在新增 `key` 屬性之後，可以改善在上個例子中發生的效能問題：

```xml
<ul>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>

<ul>
  <li key="2014">Connecticut</li>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>
```

現在 React 知道只有帶著 `'2014'` key 的元素是新元素，而帶著 `'2015'` 以及 `'2016'` key 的元素只是相對位置移動了。

在現實中，產生一個 key 並不困難。你要展現的元素可能已經有了一個可以唯一識別的 ID，於是 key 可以直接從你的數據中提取：

```js
<li key={item.id}>{item.name}</li>
```

當以上情況不成立時，你可以新增一個 ID 字串到你的 Model 中，或者利用一部分內容作為哈希值 (hash) 來生成一個 key。這個 key 不需要全局唯一，但在陣列中需要保持唯一。

最後，你也可以使用元素在陣列中的索引值作為 key。這個方法在元素不進行重新排序時比較合適，但如果有順序修改，diff 就會變慢。

當使用陣列索引值作為 key 的 Component 進行重新排序時， Component state 可能會遇到一些問題。由於 Component 實例是基於它們的 key 來決定是否更新以及重複使用，如果 key 是一個索引值，那麼修改順序時會修改當前的 key，導致 Component 的 state（例如不受控制輸入框）可能相互篡改導致無法預期的變動。

[這是](codepen://reconciliation/index-used-as-key) 在 Codepen 上的例子，展示使用索引值作為 key 時導致的問題，以及 [這裡](codepen://reconciliation/no-index-used-as-key) 是一個不使用索引值作為 key 的例子的版本，修復了重新排列，排序，以及在陣列首插入的問題。

## 權衡 {#tradeoffs}

請記得 Reconciliation 只是一個實現細節，即使 React 在每個動作後之後對整個應用進行重新渲染，得到的最終結果也會和進行 Reconciliation 後是一樣的。在這個情形下，重新渲染表示在所有 Component 內呼叫 `render`，這不代表 React 會卸載或裝載它們。React 只會基於以上提到的規則來決定如何進行差異的合併。

我們會定期優化演算法，讓常見的使用場景能夠更有效率地執行。在當前的實現中，可以理解為一棵子樹能在其相同階層的兄弟之間移動，但不能移動到其他位置。如果移動到其他位置，則演算法會重新渲染整棵子樹。

由於 React 依賴這樣啓發式的算法，因此當以下假設沒有得到滿足，性能會有所損耗。

1. 該演算法不會嘗試匹配不同 Component 類型的子樹。如果你發現你在兩種不同類型的 Component 中切換，但輸出非常相似的內容，建議把它們改成同一類型。在現實中，我們沒有發現在改成同一種類型後會發生問題。
2. Key 應該具有穩定、可預測、以及陣列內唯一的特質。不穩定的 key（例如通過 `Math.random()` 隨機生成的）會導致許多 Component 實例和 DOM 節點被不必要地重新創建，這可能導致性能下降和子 Component 中的狀態丟失。
