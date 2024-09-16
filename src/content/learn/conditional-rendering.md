---
title: 條件式 Rendering
---

<Intro>

有時候你的 component 會需要根據不同的條件來顯示不同的內容。在 React 中，你可以使用 JavaScript 中 `if` 陳述式、`&&` 以及 `? :` 運算子等語法來根據條件 render 不同的 JSX。

</Intro>

<YouWillLearn>

* 如何根據不同條件回傳不同 JSX
* 如何有條件地包含或排除一段 JSX
* React codebases 中常見的條件式簡短語法

</YouWillLearn>

## 條件性地回傳 JSX {/*conditionally-returning-jsx*/}

舉例來說，你在 `PackingList` component 中 render 了數個可以被標記為打包完成與否的 `Item` component：

<Sandpack>

```js
function Item({ name, isPacked }) {
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="Space suit"
        />
        <Item
          isPacked={true}
          name="Helmet with a golden leaf"
        />
        <Item
          isPacked={false}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<<<<<<< HEAD
注意有些 `Item` component 的 `isPacked` prop 的值是 `true` 而非 `false`。而你想要在 `isPacked={true}` 的情況下，為已打包的項目加上一個勾號 (✔)。
=======
Notice that some of the `Item` components have their `isPacked` prop set to `true` instead of `false`. You want to add a checkmark (✅) to packed items if `isPacked={true}`.
>>>>>>> 0f2284ddc8dcab8bbb9b42c04f3c7af94b5b2e73

你可以將此情境用以下 [`if`/`else` 陳述式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else)來表示：

```js
if (isPacked) {
  return <li className="item">{name} ✅</li>;
}
return <li className="item">{name}</li>;
```

如果 `isPacked` prop 的值為 `true`，這段程式碼會**回傳一個不同的 JSX tree**。藉由此更動，部分項目內容的最後會有一個勾號。

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return <li className="item">{name} ✅</li>;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="Space suit"
        />
        <Item
          isPacked={true}
          name="Helmet with a golden leaf"
        />
        <Item
          isPacked={false}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

請嘗試更改在不同情況下回傳的內容，並觀察結果會有何不同！

注意你是如何使用 JavaScript 的 `if` 和 `return` 陳述式建立分支邏輯的。在 React 中，控制流程 (例如條件) 是交由 JavaScript 來處理的。

### 條件式地使用 `null` 代表不回傳任何內容 {/*conditionally-returning-nothing-with-null*/}

在某些情況下，你可能不想 render 任何東西。舉例來說，你不想顯示任何已經打包好的項目，但 component 必須要有個回傳值。在這種情況下，你可以回傳 `null`：

```js
if (isPacked) {
  return null;
}
return <li className="item">{name}</li>;
```

如果 `isPacked` 的值為 `true`，component 不回傳任何東西 (意即 `null`)。否則，component 會回傳要 render 的 JSX。

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return null;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="Space suit"
        />
        <Item
          isPacked={true}
          name="Helmet with a golden leaf"
        />
        <Item
          isPacked={false}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

在實際開發中，component 回傳結果為 `null` 可能並不在 render 該 component 的開發者的預期之內，所以此方法並不常使用。較為常見的方法是在 parent component 的 JSX 中，條件性地決定是包含或移除此 component。實作方法如下！

## 條件性地包含 JSX {/*conditionally-including-jsx*/}

在先前的範例中，你可以控制哪個 JSX tree 會被 component 回傳 (如果有的話！)。而你可能已經注意到 render 內容中有一些重複的部分：

```js
<li className="item">{name} ✅</li>
```

與下方段落非常相似

```js
<li className="item">{name}</li>
```

兩個條件分支都會回傳 `<li className="item">...</li>`:

```js
if (isPacked) {
  return <li className="item">{name} ✅</li>;
}
return <li className="item">{name}</li>;
```

雖然這個重複不會造成太大影響，但它可能會讓你的程式碼維護起來較不容易。假如你想要修改 `className` 的值呢？你會需要修改兩處程式碼！在這種情況下，你可以有條件地包含一些 JSX，讓你的程式碼更符合 [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) 的原則。

### 條件 (三元) 運算子 (`? :`) {/*conditional-ternary-operator--*/}

JavaScript 有一個簡潔的語法可以用來撰寫條件表達式--[條件運算子](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) 或「三元運算子」。

不使用這種寫法：

```js
if (isPacked) {
  return <li className="item">{name} ✅</li>;
}
return <li className="item">{name}</li>;
```

你可以改為以下寫法：

```js
return (
  <li className="item">
    {isPacked ? name + ' ✅' : name}
  </li>
);
```

<<<<<<< HEAD
你可以把這段程式碼解讀為：「如果 `isPacked` 的值為 `true`，則 (`?`) render `name + ' ✔'`；否則 (`:`)，render `name` 」。
=======
You can read it as *"if `isPacked` is true, then (`?`) render `name + ' ✅'`, otherwise (`:`) render `name`"*.
>>>>>>> 0f2284ddc8dcab8bbb9b42c04f3c7af94b5b2e73

<DeepDive>

#### 上述兩個範例是完全等價的嗎？ {/*are-these-two-examples-fully-equivalent*/}

如果你有物件導向開發的相關背景，你或許會因為其中一個範例有可能會建立兩個不同的 `<li>` instance，從而認為上面的兩個範例略有不同。但 JSX 元素其實並不是 instance，因為它們沒有保存任何內部狀態，也不是真正的 DOM 節點。它們是像藍圖一樣的輕量化描述。所以上述兩個例子事實上 *是* 全等價的。[保留與重設狀態](/learn/preserving-and-resetting-state) 詳細介紹了它的運作原理。

</DeepDive>

現在假設你想將打包完成項目的文字用另一個 HTML 標籤包起來，像是藉由 `<del>` 為文字加上刪除線。你可以藉由增加換行和括弧，以方便為兩種情況加入更多 JSX：

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {isPacked ? (
        <del>
          {name + ' ✅'}
        </del>
      ) : (
        name
      )}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="Space suit"
        />
        <Item
          isPacked={true}
          name="Helmet with a golden leaf"
        />
        <Item
          isPacked={false}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

這種寫法適用於條件式簡單的情況，但要適度的使用。如果你的 component 因包含太多巢狀的條件標記而變得雜亂，應該要考慮提取出 child component 以進行程式碼整理。在 React 中，標記是你程式碼的一部分，所以你可以使用像是變數和函式這樣的工具來整理複雜的表達式。

### 邏輯 AND 運算子 (`&&`) {/*logical-and-operator-*/}

另一個常見的簡短語法是 [JavaScript 邏輯 AND (`&&`) 運算子](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#:~:text=The%20logical%20AND%20(%20%26%26%20)%20operator,it%20returns%20a%20Boolean%20value.)。在 React component 中，時常會遇到在條件成立時 render 一些 JSX，否則不呈現任何東西的情境。藉由使用 `&&`，你可以只有在 `isPacked` 的值為 `true` 時呈現勾號：

```js
return (
  <li className="item">
    {name} {isPacked && '✅'}
  </li>
);
```

你可以把這段程式碼解讀為：「如果 `isPacked` 為真，就（`?`）render 勾號；否則（`:`），什麼都不 render 」。

實際用法如下：

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✅'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="Space suit"
        />
        <Item
          isPacked={true}
          name="Helmet with a golden leaf"
        />
        <Item
          isPacked={false}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

[JavaScript && 運算子](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND) 會在左側的條件為 `true` 時回傳它右側的值（在範例中是勾號）。但如果條件為 `false`，整個表達式的結果就會變成 `false`。跟 `null` 或 `undefined` 一樣，React 會將 `false` 視為像是 JSX tree 中的一個 「洞」，因此不會 render 任何東西。


<Pitfall>

**不要在 `&&` 左側使用數值。**

為了判定條件結果，JavaScript 會自動將左側轉換為布林值。但如果左側的值是 `0`，則整個表達式會取用它的值 (`0`)，React 也因此會 render `0`，而不是什麼都不 render。

例如，常見的一個錯誤是撰寫像 `messageCount && <p>New messages</p>` 這樣的程式碼。人們很容易就誤以為當  `messageCount` 的值為 `0` 時，它什麼都不會 render ，但實際上它會呈現出 `0` 本身！

要修正這個問題，可以將左側轉換為回傳布林值： `messageCount > 0 && <p>New messages</p>`。

</Pitfall>

### 有條件地將 JSX 指定給變數 {/*conditionally-assigning-jsx-to-a-variable*/}

當使用簡短語法造成在寫程式碼本身有所不便時，你可以嘗試使用 `if` 陳述式和一個變數。使用 [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) 宣告的變數的值是允許你修改的, 所以可以先將你預設希望顯示的內容指定給這個變數，也就是 name：

```js
let itemContent = name;
```

接著在 `isPacked` 的值為 `true` 時，使用 `if` 陳述式重新將 `itemContent` 的值指定為一個 JSX 表達式。

```js
if (isPacked) {
  itemContent = name + " ✅";
}
```

[大括弧打開了引入 JavaScript 的大門。](/learn/javascript-in-jsx-with-curly-braces#using-curly-braces-a-window-into-the-javascript-world) 由大括弧可以將變數嵌入回傳的 JSX tree 中，進而將先前計算的表達式巢狀地嵌在 JSX 中：

```js
<li className="item">
  {itemContent}
</li>
```

這種寫法是最冗長的，卻也是最靈活的。實際用法如下：

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = name + " ✅";
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="Space suit"
        />
        <Item
          isPacked={true}
          name="Helmet with a golden leaf"
        />
        <Item
          isPacked={false}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

與前述相同，這寫法不只適用於文字，也同樣適用於任意的 JSX ：

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = (
      <del>
        {name + " ✅"}
      </del>
    );
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="Space suit"
        />
        <Item
          isPacked={true}
          name="Helmet with a golden leaf"
        />
        <Item
          isPacked={false}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

如果你不熟悉 JavaScript，一開始可能會對這些不同的寫法感到不知所措。但學會它們有助於你閱讀和撰寫任何 JavaScript 程式碼——而不僅僅是 React component！挑一個你偏好的寫法作為起始，如果忘記了其他的寫法再回來參考即可。

<Recap>

* 在 React 中，你透過 JavaScript 控制邏輯的分支。
* 你可以使用 `if` 表達式有條件地回傳 JSX 表達式。
* 你可以有條件地將一些 JSX 指定到一個變數，然後使用大括弧將它包起來以巢狀地嵌入其他 JSX 中。
* 在 JSX 中， `{cond ? <A /> : <B />}` 表示 *「如果 `cond` 為真，則 render `<A />`，否則 render `<B />`」*。
* 在 JSX 中， `{cond && <A />}` 表示 *「如果 `cond` 為真，則 render `<A />`，否則什麼都不 render」*。
* 簡短寫法很常見，但如果你偏好單純的 `if` 陳述式，完全可以不使用這些簡短寫法。

</Recap>



<Challenges>

#### 使用 `? :` 為未打包完成的項目加上圖示 {/*show-an-icon-for-incomplete-items-with--*/}

使用條件運算子（`cond ? a : b`）在 `isPacked` 的值不是 `true` 時 render 一個 ❌。

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✅'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="Space suit"
        />
        <Item
          isPacked={true}
          name="Helmet with a golden leaf"
        />
        <Item
          isPacked={false}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked ? '✅' : '❌'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="Space suit"
        />
        <Item
          isPacked={true}
          name="Helmet with a golden leaf"
        />
        <Item
          isPacked={false}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

</Solution>

#### 使用 `&&` 顯示項目的重要性 {/*show-the-item-importance-with-*/}

在這個範例中，每個 `Item` 都會收到一個數值型別的 `importance` prop。使用 `&&` 運算子為重要性不是零的項目 render 斜體的 「_(Importance: X)_」。你的項目列表最終應該如下所示：

* Space suit _(Importance: 9)_
* Helmet with a golden leaf
* Photo of Tam _(Importance: 6)_

不要忘記在兩段標籤之間加上一個空格！

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          importance={9}
          name="Space suit"
        />
        <Item
          importance={0}
          name="Helmet with a golden leaf"
        />
        <Item
          importance={6}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

你可以這樣實作：

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>(Importance: {importance})</i>
      }
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          importance={9}
          name="Space suit"
        />
        <Item
          importance={0}
          name="Helmet with a golden leaf"
        />
        <Item
          importance={6}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

要注意的是你必須寫成 `importance > 0 && ...` 而不是 `importance && ...` ，這樣如果 `importance` 的值為 `0` 時，才不會把 `0` 做為結果 render 出來。

在解答中，使用兩個單獨的條件在 name 和 importance 標籤之間插入一個空格。或者，你也可以使用帶有空格前綴的 fragment：`importance > 0 && <> <i>...</i></>`，或是直接在 `<i>` 內部增加一個空格： `importance > 0 && <i> ...</i>`。

</Solution>

#### 將多個 `? :` 用 `if` 和變數重構 {/*refactor-a-series-of---to-if-and-variables*/}

`Drink` component 使用了多個 `? :` 條件式來根據 `name` prop 的值是 `"tea"` 或 `"coffee"`" 顯示不同的資訊。問題在於每種飲料的資訊散落在多個條件式中。將此段程式碼從三個 `? :` 條件式重構為使用單個 `if` 陳述式。

<Sandpack>

```js
function Drink({ name }) {
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{name === 'tea' ? 'leaf' : 'bean'}</dd>
        <dt>Caffeine content</dt>
        <dd>{name === 'tea' ? '15–70 mg/cup' : '80–185 mg/cup'}</dd>
        <dt>Age</dt>
        <dd>{name === 'tea' ? '4,000+ years' : '1,000+ years'}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

當你使用 `if` 完成了程式碼重構後，你是否有想法能進一步簡化程式碼呢？

<Solution>

要進一步簡化程式碼有不同方式，下方這個做法可以做為一個切入點：

<Sandpack>

```js
function Drink({ name }) {
  let part, caffeine, age;
  if (name === 'tea') {
    part = 'leaf';
    caffeine = '15–70 mg/cup';
    age = '4,000+ years';
  } else if (name === 'coffee') {
    part = 'bean';
    caffeine = '80–185 mg/cup';
    age = '1,000+ years';
  }
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{part}</dd>
        <dt>Caffeine content</dt>
        <dd>{caffeine}</dd>
        <dt>Age</dt>
        <dd>{age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

在這個做法中，每個飲料的相關資訊被集中在了一起，而非分散在多個條件語句中。這麼做可以讓未來在增加更多的飲料時較為方便。

另一個做法是藉由將資訊移入 object 中來避免條件語句：

<Sandpack>

```js
const drinks = {
  tea: {
    part: 'leaf',
    caffeine: '15–70 mg/cup',
    age: '4,000+ years'
  },
  coffee: {
    part: 'bean',
    caffeine: '80–185 mg/cup',
    age: '1,000+ years'
  }
};

function Drink({ name }) {
  const info = drinks[name];
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{info.part}</dd>
        <dt>Caffeine content</dt>
        <dd>{info.caffeine}</dd>
        <dt>Age</dt>
        <dd>{info.age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
