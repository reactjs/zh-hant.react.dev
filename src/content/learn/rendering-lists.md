---
title: 列表 Rendering
---

<Intro>
你經常會需要用多個相似的 component 來展示一系列的資料。這個時候你可以在 React 中使用 JavaScript 的 [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) 和 [`map()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map) 來篩選資料並轉換成包含多個 component 的 array 。 
</Intro>

<YouWillLearn>
* 如何使用 JavaScript 的 `map()` 方法處理 array 資料 render component
* 如何使用 JavaScript 的 `filter()` 方法處理 array 資料 render 特定的 component
* 什麼時候使用及為什麼使用 React 中的 key

</YouWillLearn>

## 從 array 中 Render 資料 {/*rendering-data-from-arrays*/}
這裡有一個列表

```js
<ul>
  <li>凱瑟琳·約翰遜：數學家</li>
  <li>馬里奧·莫利納：化學家</li>
  <li>穆罕默德·阿卜杜勒·薩拉姆：物理學家</li>
  <li>珀西·萊溫·朱利亞：化學家</li>
  <li>蘇布拉馬尼揚·錢德拉塞卡：天體物理學家</li>
</ul>
```

我們可以觀察到，在這個列表中，唯一的差異就在於各個項目的內容。在未來某些情境中，你會經常需要使用不同的資料建造出相似的 component，像是評論列表或是個人資料的圖片列表等。在這些情境下，你可以把需要用到的資料存入 JavaScript 的 object 或 array ，然後使用 [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) 和 [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) 的方法來 render 一個 component 列表。


這裡有個使用 array 產生一個列表項目的簡單範例： 

1. 首先，將資料**儲存**到 array 中：

```js
const people = [
  '凱瑟琳·約翰遜：數學家',
  '馬里奧·莫利納：化學家',
  '穆罕默德·阿卜杜勒·薩拉姆：物理學家',
  '珀西·萊溫·朱利亞：化學家',
  '蘇布拉馬尼揚·錢德拉塞卡：天體物理學家'
];
```
2. **遍歷** `people` 中的每一個項目，轉換為新的 JSX nodes  array  `listItems`:

```js
const listItems = people.map(person => <li>{person}</li>);
```

3. 把 `listItems` 用 `<ul>` 包起來，並且 **回傳** 它：

```js
return <ul>{listItems}</ul>;
```

來看看運作結果：

<Sandpack>

```js
const people = [
  '凱瑟琳·約翰遜：數學家',
  '馬里奧·莫利納：化學家',
  '穆罕默德·阿卜杜勒·薩拉姆：物理學家',
  '珀西·萊溫·朱利亞：化學家',
  '蘇布拉馬尼揚·錢德拉塞卡：天體物理學家'
];

export default function List() {
  const listItems = people.map(person =>
    <li>{person}</li>
  );
  return <ul>{listItems}</ul>;
}
```

```css
li { margin-bottom: 10px; }
```

</Sandpack>

請注意上面的範例中，在控制台顯示了一項錯誤訊息：

<ConsoleBlock level="error">

Warning: Each child in a list should have a unique "key" prop.

</ConsoleBlock>

我們等等會學到如何修復它。在這之前，我們先將這個 array 資料更加結構化。

## 篩選 array 裡的每個項目 {/*filtering-arrays-of-items*/}

將 `people` 資料變得更結構化。

```js
const people = [{
  name: '凱瑟琳·約翰遜',
  profession: '數學家',
}, {
  name: '馬里奧·莫利納',
  profession: '化學家',
}, {
  name: '穆罕默德·阿卜杜勒·薩拉姆',
  profession: '物理學家',
}, {
  name: '珀西·萊溫·朱利亞',
  profession: '化學家',  
}, {
  name: '蘇布拉馬尼揚·錢德拉塞卡',
  profession: '天體物理學家',
}];
```

假如你只想在列表上顯示誰是 `'化學家'`，你可以使用 JavaScript 的 `filter()` 方法來篩選符合條件的項目。這個方法會讓 array 中的每個項目進行「篩選」(一個回傳 `true` 或 `false` 的函式)，最後回傳一個滿足篩選條件項目的新 array 。

如果你只想顯示 `profession` 是 `'化學家'` 的人，這個「篩選」的函示應該長這樣: `(person) => person.profession === '化學家'`。以下我們來看看怎麼把他們組合在一起:

1. **建立** 一個只有 `'化學家'` 的新 array ，這裡用到 `filter()` 方法篩選 `people`  array 中所有符合 `person.profession === '化學家'` 的條件：

```js
const chemists = people.filter(person =>
  person.profession === '化學家'
);
```

2. 使用 **map** 方法組合 `化學家` 符合條件的項目：

```js {1,13}
const listItems = chemists.map(person =>
  <li>
     <img
       src={getImageUrl(person)}
       alt={person.name}
     />
     <p>
       <b>{person.name}:</b>
       {' ' + person.profession + ' '}
       因{person.accomplishment}而聞名世界
     </p>
  </li>
);
```

3. 最後，回傳 `listItems` ：

```js
return <ul>{listItems}</ul>;
```

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === '化學家'
  );
  const listItems = chemists.map(person =>
    <li>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        因{person.accomplishment}而聞名世界
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

```js data.js
export const people = [{
  id: 0,
  name: '凱瑟琳·約翰遜',
  profession: '數學家',
  accomplishment: '計算太空飛行的相關數值',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: '馬里奧·莫利納',
  profession: '化學家',
  accomplishment: '發現北極臭氧空洞',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: '穆罕默德·阿卜杜勒·薩拉姆',
  profession: '物理學家',
  accomplishment: '基本粒子間弱相互作用和電磁相互作用的統一理論',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: '珀西·萊溫·朱利亞',
  profession: '化學家',
  accomplishment: '研究開創性的可的松藥物、類固醇和避孕藥',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: '蘇布拉馬尼揚·錢德拉塞卡',
  profession: '天體物理學家',
  accomplishment: '計算白矮星質量',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Pitfall>

箭頭函式會隱式的回傳 `=>` 之後的表達式，所以你可以省略 `return`

```js
const listItems = chemists.map(person =>
  <li>...</li> // 隱式回傳!
);
```

不過，**如果你的 `=>` 後面接著一對大括弧 `{`，那你必須使用 `return` 指定回傳值！**

```js
const listItems = chemists.map(person => { // 大括號
  return <li>...</li>;
});
```

箭頭函式 `=> {` 後面的部分被稱為 [「block body」](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#function_body)， 這支援多行程式碼的寫法，但*必須*使用 `return` 指定回傳值。如果你忘記使用 `return`，那這個函式什麼都不會回傳。

</Pitfall>

## 用 `key` 保持列表項目的排序 {/*keeping-list-items-in-order-with-key*/}

請注意上面所有的範例，控制台都顯示了一個錯誤訊息：

<ConsoleBlock level="error">

Warning: Each child in a list should have a unique "key" prop.

</ConsoleBlock>

你必須給 array 裡的每一個項目指定一個 `key` -- 它可以是數字或是字串，只要是可用來當作 array 裡每個項目的唯一識別就行。

```js
<li key={person.id}>...</li>
```

<Note>

在 `map()` 方法裡回傳 JSX elements 時，總是需要指定 key 屬性！

</Note>

這些 key 會告訴 React ，每個 component 對應著 array 裡的哪一項，React 就可以把它們對應起來。這在某些需要被操作的 array 上非常重要，例如排序、新增或是刪除資料等。一個合適的 key 可以幫助 React 推斷發生什麼事，從而正確的更新 DOM Tree。

`key` 應該先準備好在資料中，而不是在運行時隨手產生：

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}</b>
          {' ' + person.profession + ' '}
          因{person.accomplishment}而聞名世界
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

```js data.js active
export const people = [{
  id: 0, // Used in JSX as a key
  name: '凱瑟琳·約翰遜',
  profession: '數學家',
  accomplishment: '計算太空飛行的相關數值',
  imageId: 'MK3eW3A'
}, {
  id: 1, // Used in JSX as a key
  name: '馬里奧·莫利納',
  profession: '化學家',
  accomplishment: '發現北極臭氧空洞',
  imageId: 'mynHUSa'
}, {
  id: 2, // Used in JSX as a key
  name: '穆罕默德·阿卜杜勒·薩拉姆',
  profession: '物理學家',
  accomplishment: '基本粒子間弱相互作用和電磁相互作用的統一理論',
  imageId: 'bE7W1ji'
}, {
  id: 3, // Used in JSX as a key
  name: '珀西·萊溫·朱利亞',
  profession: '化學家',
  accomplishment: '研究開創性的可的松藥物、類固醇和避孕藥',
  imageId: 'IOjWm71'
}, {
  id: 4, // Used in JSX as a key
  name: '蘇布拉馬尼揚·錢德拉塞卡',
  profession: '天體物理學家',
  accomplishment: '計算白矮星質量',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<DeepDive>

#### 在列表中的每個項目展示多個 DOM nodes {/*displaying-several-dom-nodes-for-each-list-item*/}

如果你想讓每個列表項目都輸出多個 DOM nodes 而不是一個的話，你該怎麼做?

[`<>...</> Fragment`](/reference/react/Fragment) 簡短的語法沒有辦法賦予 key 值，所以你只能使用 `<div>` 標籤將內容包起來，或是使用長一點且更明確的 [`<Fragment>`](/reference/react/Fragment#rendering-a-list-of-fragments) 語法

```js
import { Fragment } from 'react';

// ...

const listItems = people.map(person =>
  <Fragment key={person.id}>
    <h1>{person.name}</h1>
    <p>{person.bio}</p>
  </Fragment>
);
```

Fragments 標籤不會顯示在 DOM 上，所以這串程式碼換轉換成 `<h1>`, `<p>`, `<h1>`, `<p>` 列表。

</DeepDive>

### 如何設定 `key` {/*如何設定-key*/}

不同的資料來源提供不同方式來獲取 key 值：

* **來自資料庫的資料** 如果你的資料是來自於資料庫，你可以使用資料庫的 keys/IDs ，它們本身就具有唯一性。
* **本地產生資料** 如果你的資料生產和保存都在本地 (例如筆記軟體的筆記)，那麼你可使用計數器、 [`crypto.randomUUID()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID) 或是套件 [`uuid`](https://www.npmjs.com/package/uuid) 來產生這些 key 值。

### key 的規則 {/*rules-of-keys*/}

* **在同一群體內 key 值必須是唯一的，** 不過，在 JSX nodes 裡不同的列表，是沒有關係的。
* **key 不能改變，** 否則就失去使用 key 的意義，所以不要在 rendering 時動態生產 key 值

### 為什麼 React 需要 key? {/*why-does-react-need-keys*/}

想像一下你桌面上的文件都沒有名稱，你需要過文件的順序來區分它們，第一個文件，第二個文件，以此類推。也許你可以很快習慣這種方式，但如果你拿走其中一個文件，這種區分方式就會變得很混亂。原來的第二文件可能變成第一個文件，原來的第三個元件可能變成第一個文件...

文件夾裡的文件跟 React 需要 key 值的道理是相似的，這可以讓我們在群體中快速辨識出某一項，而合適的 key 能提供的資訊不只是項目在 array 中的位置。即使項目的位置在一些操作中被改變，`key` 也能幫助 React 在整個生命週期中一直認得它。

<Pitfall>

你可能會想用 array 中的索引值來當作 `key` 值，實際上，當你沒有指定 `key` 值時，React 的預設行為會這樣做。但如果操作 array 像是插入、刪除項目或重新排序等改變 array ，使用索引值作為 key 值往往會產生微妙且令人困惑的錯誤。

類似的概念還有，不要在運行過程中隨機產生 key，例如像是 `key={Math.random()}`。這會導致每一次 component 重新 render 時的 key 都不一樣。不但會造成運行變慢的問題，也可能造成使用者輸入的資料不符預期，所以才我們需要提供一個穩定的值。

請注意 component 不會將 `key` 當成 props 的一部分。key 的存在只用於提示 React 本身。如果你的 component 需要一個 ID，那麼請另外傳送 prop 給 component： `<Profile key={id} userId={id} />`。

</Pitfall>

<Recap>

在這篇文章中，你學會了：

* 如何從 component 抽出資料，並把它們放入像是 array 或是 object 結構中。
* 如何使用 JavaScript 的 `map` 方法來產生一組相似的 component。
* 如何使用 JavaScript 的 `filter` 方法來篩選 array 。
* 為什麼以及如何給 component 中的每個群體 `key` 值，使 React 能在資料位置被改變或是發生變化時，能持續追蹤這些 component。

</Recap>



<Challenges>

#### 將列表一分為二 {/*splitting-a-list-in-two*/}

下面有一個人員的列表的範例

請試著將列表分為前後兩個列表：分別是 **化學家** 與 **其他科學家**。像剛剛學會的一樣，你可以透過 `person.profession === '化學家'` 這項條件來判斷一個人不是化學家。

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        因{person.accomplishment}而聞名世界
      </p>
    </li>
  );
  return (
    <article>
      <h1>科學家</h1>
      <ul>{listItems}</ul>
    </article>
  );
}
```

```js data.js
export const people = [{
  id: 0,
  name: '凱瑟琳·約翰遜',
  profession: '數學家',
  accomplishment: '計算太空飛行的相關數值',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: '馬里奧·莫利納',
  profession: '化學家',
  accomplishment: '發現北極臭氧空洞',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: '穆罕默德·阿卜杜勒·薩拉姆',
  profession: '物理學家',
  accomplishment: '基本粒子間弱相互作用和電磁相互作用的統一理論',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: '珀西·萊溫·朱利亞',
  profession: '化學家',
  accomplishment: '研究開創性的可的松藥物、類固醇和避孕藥',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: '蘇布拉馬尼揚·錢德拉塞卡',
  profession: '天體物理學家',
  accomplishment: '計算白矮星質量',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Solution>

你可以使用 `filter()` 來取得兩個獨立的 array ，然後使用 `map` 方法遍歷它們來得到結果。

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === '化學家'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== '化學家'
  );
  return (
    <article>
      <h1>科學家列表</h1>
      <h2>化學家</h2>
      <ul>
        {chemists.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              因{person.accomplishment}而聞名世界
            </p>
          </li>
        )}
      </ul>
      <h2>其他科學家</h2>
      <ul>
        {everyoneElse.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              因{person.accomplishment}而聞名世界
            </p>
          </li>
        )}
      </ul>
    </article>
  );
}
```

```js data.js
export const people = [{
  id: 0,
  name: '凱瑟琳·約翰遜',
  profession: '數學家',
  accomplishment: '計算太空飛行的相關數值',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: '馬里奧·莫利納',
  profession: '化學家',
  accomplishment: '發現北極臭氧空洞',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: '穆罕默德·阿卜杜勒·薩拉姆',
  profession: '物理學家',
  accomplishment: '基本粒子間弱相互作用和電磁相互作用的統一理論',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: '珀西·萊溫·朱利亞',
  profession: '化學家',
  accomplishment: '研究開創性的可的松藥物、類固醇和避孕藥',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: '蘇布拉馬尼揚·錢德拉塞卡',
  profession: '天體物理學家',
  accomplishment: '計算白矮星質量',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

這個方案中，我們直接在父層 `ul` element 中執行 `map` 方法。但如果你想增加程式碼的可讀性，你也可以使用變數保存 `map` 之後的結果。

現在取得的列表中仍然存在一些重複的程式碼，我們可以將重複的部分抽成一個 `<ListSection>` component：

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              因{person.accomplishment}而聞名世界
            </p>
          </li>
        )}
      </ul>
    </>
  );
}

export default function List() {
  const chemists = people.filter(person =>
    person.profession === '化學家'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== '化學家'
  );
  return (
    <article>
      <h1>科學家列表</h1>
      <ListSection
        title="化學家"
        people={chemists}
      />
      <ListSection
        title="其他科學家"
        people={everyoneElse}
      />
    </article>
  );
}
```

```js data.js
export const people = [{
  id: 0,
  name: '凱瑟琳·約翰遜',
  profession: '數學家',
  accomplishment: '計算太空飛行的相關數值',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: '馬里奧·莫利納',
  profession: '化學家',
  accomplishment: '發現北極臭氧空洞',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: '穆罕默德·阿卜杜勒·薩拉姆',
  profession: '物理學家',
  accomplishment: '基本粒子間弱相互作用和電磁相互作用的統一理論',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: '珀西·萊溫·朱利亞',
  profession: '化學家',
  accomplishment: '研究開創性的可的松藥物、類固醇和避孕藥',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: '蘇布拉馬尼揚·錢德拉塞卡',
  profession: '天體物理學家',
  accomplishment: '計算白矮星質量',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

細心的讀者可能會注意到我們使用了兩個 `filter` 透過職業對每個人進行了兩次篩選。檢查一個屬性並不會花太多時間，因此在這個範例是沒什麼問題。但如果你的程式碼邏輯比這裡複雜且花費更多效能，那你可以使用迴圈進行一次檢查來代替兩次的 `filter` 做的事情。

實際上，如果 `people` 的資料不會改變，你可以直接把這段程式碼移到 component 外面。從 React 的角度來看，它只關心你最後給他的是不是包含 JSX nodes 的 array ，並不會在乎 array 是怎麼來的：

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

let chemists = [];
let everyoneElse = [];
people.forEach(person => {
  if (person.profession === '化學家') {
    chemists.push(person);
  } else {
    everyoneElse.push(person);
  }
});

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              因{person.accomplishment}而聞名世界
            </p>
          </li>
        )}
      </ul>
    </>
  );
}

export default function List() {
  return (
    <article>
      <h1>科學家列表</h1>
      <ListSection
        title="化學家"
        people={chemists}
      />
      <ListSection
        title="其他科學家"
        people={everyoneElse}
      />
    </article>
  );
}
```

```js data.js
export const people = [{
  id: 0,
  name: '凱瑟琳·約翰遜',
  profession: '數學家',
  accomplishment: '計算太空飛行的相關數值',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: '馬里奧·莫利納',
  profession: '化學家',
  accomplishment: '發現北極臭氧空洞',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: '穆罕默德·阿卜杜勒·薩拉姆',
  profession: '物理學家',
  accomplishment: '基本粒子間弱相互作用和電磁相互作用的統一理論',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: '珀西·萊溫·朱利亞',
  profession: '化學家',
  accomplishment: '研究開創性的可的松藥物、類固醇和避孕藥',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: '蘇布拉馬尼揚·錢德拉塞卡',
  profession: '天體物理學家',
  accomplishment: '計算白矮星質量',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

</Solution>

#### Nested lists in one component {/*nested-lists-in-one-component*/}

請根據你的 array 產生食譜列表！ 在食譜列表中，請使用 `<h2>` 顯示菜色的名稱，並使用 `<ul>` 列出它所需的原料。

<Hint>

這裡會需要使用兩層巢狀的`map`。

</Hint>

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>食譜</h1>
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: '希臘沙拉',
  ingredients:  ['番茄', '黃瓜', '洋蔥', '橄欖', '菲達乳酪']
}, {
  id: 'hawaiian-pizza',
  name: '夏威夷披薩',
  ingredients:  ['比薩餅皮', '比薩醬', '莫扎瑞拉乳酪', '火腿', '鳳梨']
}, {
  id: 'hummus',
  name: '鷹嘴豆泥',
  ingredients: ['鷹嘴豆', '橄欖油', '大蒜瓣', '檸檬', '芝麻醬']
}];
```

</Sandpack>

<Solution>

這是一種可能的解法：

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>食譜</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: '希臘沙拉',
  ingredients:  ['番茄', '黃瓜', '洋蔥', '橄欖', '菲達乳酪']
}, {
  id: 'hawaiian-pizza',
  name: '夏威夷披薩',
  ingredients:  ['比薩餅皮', '比薩醬', '莫扎瑞拉乳酪', '火腿', '鳳梨']
}, {
  id: 'hummus',
  name: '鷹嘴豆泥',
  ingredients: ['鷹嘴豆', '橄欖油', '大蒜瓣', '檸檬', '芝麻醬']
}];
```

</Sandpack>

`recipes` array 中每一個項目都擁有一個 `id`，所以外層的循環可以直接拿到並且作為 `key`。不過在循環原料的時候，就沒有現成的 `id` 可以使用了。但我們合理推測一下，一份食譜裡不會有重複的原料，所以原料的名字就適合作為 `key`。此外，你也可以在原本的資料上加上新的 `id`，或是使用索引值來當作 `key` （還是需要注意使用索引值，會讓你無法正常的對原料進行排序）。

</Solution>

#### 把列表提取成一個 component {/*extracting-a-list-item-component*/}

`RecipeList` component 的程式碼有兩層巢狀的 `map`。為了讓程式碼簡化，我們會抽出一個 `Recipe` component 並接受 `id`、`name` 和 `ingredients` 作為 props，在這種情況下，你會把外層的 `key` 放在哪裡? 原因是什麼?

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>食譜</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: '希臘沙拉',
  ingredients:  ['番茄', '黃瓜', '洋蔥', '橄欖', '菲達乳酪']
}, {
  id: 'hawaiian-pizza',
  name: '夏威夷披薩',
  ingredients:  ['比薩餅皮', '比薩醬', '莫扎瑞拉乳酪', '火腿', '鳳梨']
}, {
  id: 'hummus',
  name: '鷹嘴豆泥',
  ingredients: ['鷹嘴豆', '橄欖油', '大蒜瓣', '檸檬', '芝麻醬']
}];
```

</Sandpack>

<Solution>

你可以將外層 `map` 中的 JSX 複製並貼到一個新的 `Recipe` component 中，並將其作為該 component 的回傳值。然後，將原先的 `recipe.name` 更改為 `name`，`recipe.id` 更改為 `id`，依此類推，最後將它們作為 `props` 傳遞給 `Recipe` component。

<Sandpack>

```js
import { recipes } from './data.js';

function Recipe({ id, name, ingredients }) {
  return (
    <div>
      <h2>{name}</h2>
      <ul>
        {ingredients.map(ingredient =>
          <li key={ingredient}>
            {ingredient}
          </li>
        )}
      </ul>
    </div>
  );
}

export default function RecipeList() {
  return (
    <div>
      <h1>食譜</h1>
      {recipes.map(recipe =>
        <Recipe {...recipe} key={recipe.id} />
      )}｀
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: '希臘沙拉',
  ingredients:  ['番茄', '黃瓜', '洋蔥', '橄欖', '菲達乳酪']
}, {
  id: 'hawaiian-pizza',
  name: '夏威夷披薩',
  ingredients:  ['比薩餅皮', '比薩醬', '莫扎瑞拉乳酪', '火腿', '鳳梨']
}, {
  id: 'hummus',
  name: '鷹嘴豆泥',
  ingredients: ['鷹嘴豆', '橄欖油', '大蒜瓣', '檸檬', '芝麻醬']
}];
```

</Sandpack>

這裡使用 `<Recipe {...recipe} key={recipe.id} />` 是一種簡寫方式，它表示將 `recipe`  object 中的每個屬性都作為 props 傳遞給 `Recipe` component。這種簡寫方式與直接明確列出每個 prop 是一樣的，例如 `<Recipe id={recipe.id} name={recipe.name} ingredients={recipe.ingredients} key={recipe.id} />`。

**注意這裡的 `key` 是在 `<Recipe>` component 本身上的，而不是在 `Recipe` 內回傳的 `<div>` 上。** 這是因為這個 `key` 只有在 array 上下文中使用才有意義。之前的寫法中，你有一個 `<div>` 的 array ，所以每個 `<div>` 都需要一個 `key`，但現在你有了一個 `<Recipe>` 的 array 。換句話說，當你提取一個 component 時，不要忘記將 `key` 放在你複製和貼上的 JSX 外層 component 上。

</Solution>

#### 帶有分隔線的列表 {/*list-with-a-separator*/}

這個範例展示了葛飾北斎一首著名的俳句，它的每一行都由 `<p>` 標籤包覆。你需要在段落之間插入分隔線，結果大概會像這個樣子： 

```js
<article>
  <p>I write, erase, rewrite</p>
  <hr />
  <p>Erase again, and then</p>
  <hr />
  <p>A poppy blooms.</p>
</article>
```

一句俳句通常只有三行，但是你的解答應當適用於任何行數。注意 `<hr />` elements 只會存在於 `<p>` *之間*，而不會出現在開頭或是結尾！

<Sandpack>

```js
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, index) =>
        <p key={index}>
          {line}
        </p>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

(這是一個比較少見可以把索引值當作 `key` 的範例，因爲詩句之間的順序是固定的。)

<Hint>

你可以嘗試把原本的 `map` 改成手動循環， 或著嘗試使用 fragment 語法。

</Hint>

<Solution>

你可以寫一個迴圈把  `<hr />` 和 `<p>...</p>` 插入到輸出的 array 中： 

<Sandpack>

```js
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  let output = [];

  // Fill the output array
  poem.lines.forEach((line, i) => {
    output.push(
      <hr key={i + '-separator'} />
    );
    output.push(
      <p key={i + '-text'}>
        {line}
      </p>
    );
  });
  // Remove the first <hr />
  output.shift();

  return (
    <article>
      {output}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

原本使用詩句索引值作為 `key` 的方法已經行不通了，因爲現在 array 裡同時包含了分隔線和詩句。但是，你可以用添加後綴的方式給它們賦予獨一無二的 `key` 值，像是 `key={i + '-text'}` 這樣。


或著，你可以生產一個 fragment 包含  `<hr />` 和 `<p>...</p>`，但因為 fragment 簡寫  `<>...</>` 不支援設定 `key`，所以你需要寫成 `<Fragment>` 形式。
<Sandpack>

```js
import { Fragment } from 'react';

const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, i) =>
        <Fragment key={i}>
          {i > 0 && <hr />}
          <p>{line}</p>
        </Fragment>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

記住，使用 fragment 語法 (通常寫作 `<> </>`) 來包覆 JSX nodes 可避免引入額外的 `div`。

</Solution>

</Challenges>
