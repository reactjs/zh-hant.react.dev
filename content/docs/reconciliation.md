---
id: reconciliation
title: Reconciliation
permalink: docs/reconciliation.html
---

React 提供聲明式 (declarative) 的 API，讓開發者在使用 React 時，可以不用關注每次 Component 更新時底層有什麼改變。這讓開發應用程式簡單許多，但也可能讓開發者對 React 底層的相關實作不夠瞭解。因此在這篇文章中描述了實作 React 底層中「diffing」演算法時，我們採取什麼策略讓 component 的更新是可預測的，同時可以滿足要求高效能的應用程式。

## 動機 {#motivation}

在使用 React 時，每次呼叫 `render()` 函式，我們都可以當成是建立了一顆由 React element 構成的樹狀結構。而在每一次有 state 或 props 更新時，`render()` 函式就會回傳一顆不同的 tree。因此，React 需要判斷如何有效率的把 UI 從舊的 tree 更新成新的 tree。

對於這個「如何用最少操作去將舊的 tree 轉換成新的 tree」的演算法問題有一些通用的解法，但即使是目前[最先進的演算法](https://grfia.dlsi.ua.es/ml/algorithms/references/editsurvey_bille.pdf)都還需要 O(n<sup>3</sup>) 的時間複雜度（n 為 tree 中 element 的數量）。

假設 React 使用這種演算法，則呈現 1000 個 element 需要 10 億次的比較。因為這個比較成本實在太高，所以 React 在以下兩個假設下採用了一個 O(n) 的啓發式 (heuristic) 演算法：

1. 兩個不同類型的 element 會產生出不同的 tree
2. 開發者可以通過 `key` prop 來指出哪些子 element 在不同的 render 下能保持不變；

而事實上，以上假設在幾乎所有實務上會出現的場景都成立。

## Diffing 演算法 {#the-diffing-algorithm}

當比對兩顆 tree 時，React 首先比較兩棵 tree 的 root element。不同類型的 root element 會有不同的處理方式。

### 比對不同類型的 Element {#elements-of-different-types}

當比對的兩個 root element 為不同類型的元素時，React 會將原有的 tree 整顆拆掉並且重新建立起新的 tree。例如，當一個元素從 `<a>` 變成 `<img>`、從 `<Article>` 變成 `<Comment>`、或從 `<Button>` 變成 `<div>` 時，都會觸發一個完整的重建流程。

當拆掉一顆 tree 時，舊的 DOM 節點會被銷毀，且該 component instance 會執行 `componentWillUnmount()` 函式。當建立一顆新的 tree 時，新建立的 DOM 節點會被插入到 DOM 中，且該 component instance 會依次執行 `UNSAFE_componentWillMount()` 與 `componentDidMount()` 方法。而所有跟之前舊的 tree 所關聯的 state 也會被銷毀。

任何在 root 以下的 component 也會被 unmount，它們的狀態會被銷毀。例如，當比對以下變更時：

```xml
<div>
  <Counter />
</div>

<span>
  <Counter />
</span>
```

React 會 destroy 舊的 `Counter` 並且重新建立一個新的。

>筆記：
>
>下列方法已過時，你在寫新程式應[避免使用他們](/blog/2018/03/27/update-on-async-rendering.html)：
>
>- `UNSAFE_componentWillMount()`

### 比對同一類型的 DOM Element {#dom-elements-of-the-same-type}

當比對兩個相同類型的 React element 時，React 會保留 DOM 節點，只比對及更新有改變的 attribute。例如：

```xml
<div className="before" title="stuff" />

<div className="after" title="stuff" />
```

透過比對這兩個 element，React 知道只需要修改 DOM 節點上的 className。

當更新 `style` 時，React 僅更新有所更變的屬性。例如：

```xml
<div style={{color: 'red', fontWeight: 'bold'}} />

<div style={{color: 'green', fontWeight: 'bold'}} />
```

透過比對這兩個 element，React 知道只需要修改 `color` 的樣式，而不需修改 `fontWeight。`

在處理完目前節點之後，React 會繼續對 children 進行遞迴處理。

### 比對同類型的 Component Element {#component-elements-of-the-same-type}

當一個 component 更新時，該 component 的 instance 保持不變，這樣 state 能夠被保留在不同次的 render 中。React 會更新該 component instance 的 props 以跟最新的 element 保持一致，並且呼叫該 instance 的 `UNSAFE_componentWillReceiveProps()` 、 `UNSAFE_componentWillUpdate()` 和 `componentDidUpdate()` 方法。

接下來，該 instance 會再呼叫 `render()` 方法，而 diff 算法將會遞迴處理舊的結果以及新的結果。

>筆記：
>
>下列方法已過時，你在寫新程式應[避免使用他們](/blog/2018/03/27/update-on-async-rendering.html)：
>
>- `UNSAFE_componentWillUpdate()`
>- `UNSAFE_componentWillReceiveProps()`

### 對 Children 進行遞迴處理 {#recursing-on-children}

在預設條件下，當遞迴處理 DOM 節點的 children 時，React 只會同時遍歷兩個 children 的 array，並在發現差異時，產生一個 mutation。

例如，當在 children 的 array 尾端新增一個 element 時，在這兩個 tree 之間的轉換效果很好：

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

React 會先匹配兩個 `<li>first</li>` 對應的 tree，然後匹配第二個元素 `<li>second</li>` 對應的 tree，最後插入第三個元素 `<li>third</li>` 的 tree。

如果只是單純的實作，則在 array 開頭插入新元素會讓效能變差。例如，在兩個 tree 之間的轉換效果很差：

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

這個情況下，React 會針對每個 child 都進行 mutate，而不是讓兩個相同的 `<li>Duke</li>` 和 `<li>Villanova</li>` subtree 不參與 mutate。這種低效率的情況下可能會帶來效能問題。

**Keys**

為了解決以上問題，React 提供了 key 屬性。當 children 擁有 `key` 屬性時，React 使用 key 來匹配原有 tree 上的 children 以及後續 tree 的 children。例如，以下範例在新增 `key` 屬性之後，可以改善在上個例子中發生的效能問題：

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

現在 React 知道只有帶著 `'2014'` key 的 element 是新的，而帶著 `'2015'` 以及 `'2016'` key 的 element 只是相對位置移動了。

實際上，找出一個 key 通常並不困難。你要顯示的 element 可能已經具有唯一的 ID 了，這個 key 可能是來自於你的資料：

```js
<li key={item.id}>{item.name}</li>
```

當以上情況不成立時，你可以新增一個 ID 字串到你的 Model 中，或者利用一部分內容作為 hash 來產生一個 key。這個 key 不需要是全域唯一，但在 array 中需要保持唯一。

最後，你也可以使用元素在 array 中的索引值作為 key。這個方法在元素不進行重新排序時比較合適，但如果有順序修改，diff 就會變慢。

當使用 array 索引值作為 key 的 component 進行重新排序時，component state 可能會遇到一些問題。由於 component instance 是基於它們的 key 來決定是否更新以及重複使用，如果 key 是一個索引值，那麼修改順序時會修改目前的 key，導致 component 的 state（例如不受控制輸入框）可能相互篡改導致無法預期的變動。

下面是一個在 Codepen 上的範例，[示範使用索引值作為 key 時導致的問題](codepen://reconciliation/index-used-as-key)，以及[一個修復了重新排列、排序、以及在 array 開頭插入的問題，且不使用索引值作為 key 的版本](codepen://reconciliation/no-index-used-as-key)。

## 權衡 {#tradeoffs}

請記得 Reconciliation 只是一個實作細節，即使 React 在每個動作後之後對整個應用進行重新 render，得到的最終結果也會和進行 Reconciliation 後是一樣的。在這個情形下，重新 render 表示在所有 component 內呼叫 `render`，這不代表 React 會 unmount 或重新 mount 它們。React 只會基於以上提到的規則來決定如何進行差異的合併。

我們會定期改善啟發式演算法，讓常見的使用場景能夠更有效率地執行。在目前的實作中，可以理解為一棵 subtree 能在其相同階層的兄弟之間移動，但不能移動到其他位置。如果移動到其他位置，則演算法會重新 render 整棵 subtree。

由於 React 依賴啓發式的演算法，因此當以下假設沒有得到滿足，效能將會有所影響。

1. 該演算法不會嘗試匹配不同 component 類型的 subtree。如果你發現你在兩種不同類型的 component 中切換，但輸出非常相似的內容，建議把它們改成同一類型。實際上，我們沒有發現在改成同一種類型後會發生問題。
   
2. Key 應該具有穩定、可預測、以及 array 內唯一的特質。不穩定的 key（例如透過 `Math.random()` 隨機生成的）會導致許多 component instance 和 DOM 節點被不必要地重新建立，這可能導致效能低下和 child component 中的 state 丟失。
