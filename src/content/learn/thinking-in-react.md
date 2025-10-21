---
title: 用 React 的方式去思考
---

<Intro>

React 可以改變你看待設計與建立應用程式的思考方式。當你使用 React 建立使用者介面時，第一步你需要先把它拆解成「component」。接著，你要描述每個 component 不同的畫面狀態。最後，把這些 component 連結起來，讓資料可以在它們之間流動。在本教學中，我們將引導你透過 React 打造一個可搜尋的產品資料表格，並了解其中的思考過程。

</Intro>

## 從 mockup 開始 {/*start-with-the-mockup*/}

想像你已經從設計師那裡拿到了 JSON API 和 mockup。

JSON API 回傳的資料如下所示：

```json
[
  { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
  { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
  { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
  { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
  { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
  { category: "Vegetables", price: "$1", stocked: true, name: "Peas" }
]
```

Mockup 看起來像這樣：

<img src="/images/docs/s_thinking-in-react_ui.png" width="300" style={{margin: '0 auto'}} />

在 React 中實作 UI，通常會依照以下五個步驟進行。

## 第一步：將 UI 拆解成一層層的 component {/*step-1-break-the-ui-into-a-component-hierarchy*/}

首先，把 mockup 中每一個 component 與 child component 框起來，並為它們命名。如果你是跟設計師合作的話，他們可能已經在設計工具中幫這些 component 命名好了。問問他們吧！

依據你的專業背景，你可以用不同的方式來思考如何將設計拆解成 component：

* **程式設計**--就像你寫程式時會判斷是否該建立新的函式或物件一樣，也可以用相同的技巧來拆 component。其中一個常見的技巧叫做[單一職責原則](https://en.wikipedia.org/wiki/Separation_of_concerns)，也就是說，理想的情況下，每個 component 應該只做一件事情。如果某個 component 隨著開發越來越複雜，它就應該被分解成更小的 child component。
* **CSS**--思考會在那些地方使用類別選擇器 (不過 component 通常並不會拆解得像 CSS 那麼細)
* **Design**--思考你會如何安排設計稿的圖層結構

假如你的 JSON 架構設計非常棒，通常會發現它可以很自然地對應到 UI 的 component 架構。那是因為 UI 與資料模型通常會擁有相同的資訊架構 -- 也就是相同的結構。將 UI 拆成一個個 component，讓每一個 component 都能對應到資料模型中的一部分。

以下畫面包含了五個 component：

<FullWidth>

<CodeDiagram flip>

<img src="/images/docs/s_thinking-in-react_ui_outline.png" width="500" style={{margin: '0 auto'}} />

1. `FilterableProductTable`（灰色）是整個應用程式的容器。
2. `SearchBar`（藍色）用來接收使用者的輸入。
3. `ProductTable`（淡紫色）會根據使用者的輸入顯示並篩選清單。
4. `ProductCategoryRow`（綠色）用來顯示每個類別的標題。
5. `ProductRow`（黃色）顯示每筆產品資料的一列。

</CodeDiagram>

</FullWidth>

若你查看 `ProductTable`（淡紫色）時，會發現表格的表頭（包含「Name」和「Price」標籤）並不是獨立的 component。這純粹是偏好的問題，你可以選擇任何一種作法。以這裡為例，表頭被視為 `ProductTable` 的一部分，因為它出現在 `ProductTable` 的清單中。不過，當這個表頭變得更加複雜（例如加入了排序功能），你就可以把它抽出成獨立的 `ProductTableHeader` component。

現在你已經辨識出所有 mockup 裡的 component 了，接下來要將它們整理成層級結構。只要在 mockup 中出現在其他 component 裡的 component，都應該以 child component 的層級呈現：

* `FilterableProductTable`
    * `SearchBar`
    * `ProductTable`
        * `ProductCategoryRow`
        * `ProductRow`

## 第二步：使用 React 建立靜態版本 {/*step-2-build-a-static-version-in-react*/}

現在你已經有 component 的層級結構，是時候開始實作你的應用程式了。最直接的方式是先建立一個根據資料模型來渲染 UI，且暫時不增加任何互動功能的版本...沒錯！通常都會先完成靜態版本，再慢慢加入互動。建立靜態版本的過程需要大量的打字，但幾乎不太需要思考；而加入互動則相反，它需要大量思考，但打得字並不多。

為了建立一個根據資料模型來渲染畫面的靜態版本應用程式，你需要建立可以重複使用的 [component](/learn/your-first-component)，並透過 [props.](/learn/passing-props-to-a-component) 來傳遞資料，Props 是一個可以將資料從 parent 傳遞到 children 的方法。（如果你已經熟悉 [state](/learn/state-a-components-memory)的概念，請不要在這個靜態版本中使用到 state。State 是專門用來處理互動的，也就是那些會隨時間改變的資料。因此在這個靜態版本的應用程式中，你不需要用到它。）

你可以選擇「由上而下」的方式來開發，從層級較高的 component（像是 `FilterableProductTable`）開始建立，也可以選擇「由下而上」的方式，從層級較低的 component（像是 `ProductRow`）開始。在簡單的例子中，通常由上而下會比較簡單，但在較大型的專案中，則由下而上會比較容易。

<Sandpack>

```jsx src/App.js
function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar() {
  return (
    <form>
      <input type="text" placeholder="Search..." />
      <label>
        <input type="checkbox" />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

function FilterableProductTable({ products }) {
  return (
    <div>
      <SearchBar />
      <ProductTable products={products} />
    </div>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 10px;
}
td {
  padding: 2px;
  padding-right: 40px;
}
```

</Sandpack>

(如果你覺得這段程式碼有點困難，不妨先看看[快速開始](/learn/)章節)

當你建立好 component 後，你就會擁有一個可重複使用的 library，用來渲染你的資料模型。由於這是一個靜態應用程式，所以 component 只會回傳 JSX，不包含任何互動邏輯。最上層的 component（`FilterableProductTable`）會將資料模型作為 prop 傳入。這種資料從頂層 component 一路向下傳遞到樹狀結構底部 component 的方式，被稱為_單向資料流_。

<Pitfall>

在這階段，你不應該使用任何 state。那是下一步要處理的事！

</Pitfall>

## 第三步：找到最小但最完整的 UI 狀態 {/*step-3-find-the-minimal-but-complete-representation-of-ui-state*/}

為了使 UI 具備互動性，你需要讓使用者可以改變底層的資料模型。這時就會用到 *state*。

可以把 state 想成是應用程式中必須記住，且會變動的最小資料集合。在設計 state 時最重要的原則是保持 [DRY (Don't Repeat Yourself)](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)。也就是說，你要找出應用程式中真正需要紀錄的最小 state，其他的部分則在需要時再去即時計算出來。舉例來說，假如你在建立一個購物清單，商品項目以陣列方式儲存在 state 裡。如果你還想顯示清單中的項目數量，不要再用額外的 state 來儲存 -- 反之，你應該直接讀取陣列的長度來取得數量。

現在來思考一下這個應用程式範例中所有的資料：

1. 原始的產品清單
2. 使用者輸入的搜尋文字
3. Checkbox 的勾選狀態
4. 篩選後的產品清單

其中哪些資料應該放進 state 呢？試著辨識出其中不是 state 的項目：

* 它會隨時間變化**保持不變**嗎？會的話，那它就不是 state。
* 它是透過 props **從 parent 傳進來的**嗎？是的話，那它就不是 state。
* 你能根據 component 中現有的 state 或 props 計算出它嗎？可以的話，那它*絕對*不是 state！

剩下的那些資料，很可能就是要放進 state 的了。

讓我們再一起逐項看過這些資料：

1. 原始的產品清單會**透過 props 傳遞，所以它不能放進 state**。
2. 搜尋文字看起來是 state，因為它會隨時間變化而改變，且不能從任何東西計算出來。
3. checkbox 的狀態看起來可以放進 state，因為它會隨時間變化而改變，且不能從任何東西計算出來。
4. 篩選後的產品清單**不能放進 state，因為它可以透過原始的產品清單被計算出來**，且篩選本身是根據搜尋文字與 checkbox 狀態而來。
這代表只有搜尋文字與 checkbox 狀態應該被放進 state 中！做得好！
<DeepDive>

#### Props vs State {/*props-vs-state*/}

在 React 中有兩種資料「模型」：props 和 state。它們兩者非常的不同：

* [**Props** 就像你傳給函式的參數](/learn/passing-props-to-a-component)。它們讓 parent component 能傳遞資料給 child component，並且客製化 child component 的顯示。舉例來說，`Form` 可以傳遞 `color` prop 到 `Button`。
* [**State** 就像 component 的記憶](/learn/state-a-components-memory)。它讓 component 可以持續追蹤一些資訊，並且根據互動來改變這些資訊。舉例來說，`Button` 可能會持續追蹤 `isHovered` 這個 state。

Props 和 state 雖然不同，但它們會一起運作。parent component 通常會在 state 中存放一些資訊（這樣才能去改變它），然後再透過 props *往下傳遞*到 child component。如果第一次閱讀到這裡，對於它們的不同還是感到模糊也沒關係。這需要一些練習，才能真正熟悉！

</DeepDive>

## 第四步：辨識 state 應該放在哪裡 {/*step-4-identify-where-your-state-should-live*/}

辨識完應用程式最小的 state 資料後，你需要辨識出哪個 component 應該負責改變這個 state，或者說*擁有*這個 state。記住：React 使用單向資料流，資料會透過 component 階層，從 parent component 往下傳遞到 child component。剛開始也許沒辦法立刻清楚哪個 component 該擁有哪個 state。如果你第一次接觸到這個概念將會是一大挑戰，但你可以根據以下步驟來理解！

針對你應用程式中的每一個 state：

1. 找出*所有*依賴該 state 來渲染畫面的 component。
2. 找出這些 component 最近的共同 parent component -- 也就是在 component 層級中，位於它們之上的某個 component。
3. 決定 state 該放在哪裡：
    1. 通常可以將 state 放在它們的共同 parent component 中。
    2. 你也可以將 state 放在它們共同 parent component 之上的 component。
    3. 如果沒辦法找到合理的 component 來擁有 state，單獨建立一個新 component 來處理 state，並且將這個新 component 新增在 component 階層中高於共同 parent component 上的位置。

在前一個步驟中，你會發現這個應用程式中會有兩個 state：使用者輸入的搜尋文字，和 checkbox 的勾選狀態。在這個範例中，它們總是一起出現，所以將它們放在同一個 component 中是合理的。

現在，讓我們來為這些 state 套用我們的策略：

1. **找出使用 state 的 component：**
    * `ProductTable` 需要透過 state（搜尋文字與 checkbox 勾選狀態）來過濾產品清單。
    * `SearchBar` 需要顯示這些 state（搜尋文字與 checkbox 勾選狀態）的內容。
2. **找出它們的共同 parent component：**兩個 state 最近的共同 parent component 是 `FilterableProductTable`。
3. **決定 state 要放在哪裡：**我們會把搜尋文字與勾選狀態這兩個 state 值保存在 `FilterableProductTable`。

所以這兩個 state 值會被放在 `FilterableProductTable` 裡。

使用  [`useState()` Hook](/reference/react/useState) 將 state 新增進 component 裡。Hook 是一種特殊的函式，可以讓你在 React 中「鉤住」component 的生命週期與行為。在 `FilterableProductTable` 的頂端新增兩個 state 變數，並且為它們設定初始值：

```js
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
```

接著，將 `filterText` 和 `inStockOnly` 這兩個值作為 props，傳遞給 `ProductTable` 和 `SearchBar`：

```js
<div>
  <SearchBar
    filterText={filterText}
    inStockOnly={inStockOnly} />
  <ProductTable
    products={products}
    filterText={filterText}
    inStockOnly={inStockOnly} />
</div>
```

你開始可以看見應用程式是如何運作的了。在下方 sandbox 程式碼中，將 `useState('')` 改成 `useState('fruit')` 來改變 `filterText` 的初始值。你將會看到搜尋輸入的文字與表格兩者都會隨之更新：

<Sandpack>

```jsx src/App.js
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly} />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input
        type="text"
        value={filterText}
        placeholder="Search..."/>
      <label>
        <input
          type="checkbox"
          checked={inStockOnly} />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 5px;
}
td {
  padding: 2px;
}
```

</Sandpack>

請注意，目前編輯表格的功能還無法運作。在上方 sandbox 中，有一個 console 的錯誤訊息解釋為什麼無法運作：

<ConsoleBlock level="error">

You provided a \`value\` prop to a form field without an \`onChange\` handler. This will render a read-only field.

</ConsoleBlock>

在上方的 sandbox 中，`ProductTable` 和 `SearchBar` 會讀取從 props 傳入的 `filterText` 和 `inStockOnly` 來渲染表格、文字輸入框與 checkbox。舉例來說，下面這段程式碼就是 `SearchBar` 顯示值的方式：

```js {1,6}
function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input
        type="text"
        value={filterText}
        placeholder="Search..."/>
```

不過，你目前還沒有加入任何的程式碼來處理使用者的操作，例如輸入文字。這將會是你接下來的最後一個步驟。


## 第五步：加入反向資料流 {/*step-5-add-inverse-data-flow*/}

目前應用程式已經能透過 props 和 state 隨著階層結構往下流正確地渲染。但為了能根據使用者的輸入來改變 state，就需要支援資料往反方向流動：也就是在階層中最底部的表單 component，要能更新 `FilterableProductTable` 中的 state。

React 讓這種資料流變得更加明確，但它比起雙向資料綁定需要多寫一點程式碼。如果你試著在上方的範例中輸入文字或勾選 checkbox，你將發現 React 會忽略你的輸入。這是刻意設計的。當寫下 `<input value={filterText} />` 時，其實是把 `input` 的 `value` prop 設定為 `FilterableProductTable` 提供的 `filterText` state。因此只要 `filterText` 不被更新，輸入框內的文字也就永遠無法改變。

你希望無論使用者何時修改表單輸入，state 都能依據這些變化來更新。但因為這些 state 是被 `FilterableProductTable` 所擁有的，所以只有它可以呼叫 `setFilterText` 和 `setInStockOnly`。為了使 `SearchBar` 能夠更新 `FilterableProductTable` 的 state，你需要傳遞將這些函式往下傳遞到 `SearchBar`：

```js {2,3,10,11}
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly} />
```

在 `SearchBar` 裡，你將新增 `onChange` 事件處理器，並透過它們來更新 parent component 的 state：

```js {4,5,13,19}
function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange
}) {
  return (
    <form>
      <input
        type="text"
        value={filterText}
        placeholder="Search..."
        onChange={(e) => onFilterTextChange(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockOnlyChange(e.target.checked)}
```

現在應用程式可以完整運作了！

<Sandpack>

```jsx src/App.js
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly} />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange
}) {
  return (
    <form>
      <input
        type="text"
        value={filterText} placeholder="Search..."
        onChange={(e) => onFilterTextChange(e.target.value)} />
      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockOnlyChange(e.target.checked)} />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding: 4px;
}
td {
  padding: 2px;
}
```

</Sandpack>

你可以在[加入互動性](/learn/adding-interactivity)章節中，學到所有關於事件處理與更新 state 的內容。

## 接下來該往哪裡走 {/*where-to-go-from-here*/}

這一張只是一個簡單的入門介紹，目的是告訴你如何用 React 思維建立 component 與應用程式。現在你可以從[安裝](/learn/installation)章節開始，或深入了解[所有在本章節使用到的語法](/learn/describing-the-ui)。
