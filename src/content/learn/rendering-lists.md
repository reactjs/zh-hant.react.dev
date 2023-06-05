---
title: 列表 Rendering
---

<Intro>

你經常會需要用多個相似的 component 來顯示一系列的資料。這個時候你可以在 React 中使用 JavaScript 的 [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) 和 [`map()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map) 來過濾資料並轉換成包含多個 component 的 array 。 

</Intro>

<YouWillLearn>

* 如何使用 JavaScript 的 `map()` 方法處理 array 資料 render component
* 如何使用 JavaScript 的 `filter()` 方法處理 array 資料 render 特定的 component
* 什麼時候使用及為什麼使用 React 中的 key

</YouWillLearn>

## 從 array 中 render 資料 {/*rendering-data-from-arrays*/}
假設你有一個內容列表。

```js
<ul>
  <li>Creola Katherine Johnson: mathematician</li>
  <li>Mario José Molina-Pasquel Henríquez: chemist</li>
  <li>Mohammad Abdus Salam: physicist</li>
  <li>Percy Lavon Julian: chemist</li>
  <li>Subrahmanyan Chandrasekhar: astrophysicist</li>
</ul>
```

在這個列表唯一的差異就在於各個內容和資料。當你建立介面時，常常需要使用不同資料顯示相同的 component，從評論列表到個人資料圖庫。在這些情況下，你可以將資料儲存在 JavaScript 的 object 和array 中，並使用 [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) 和 [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) 的方法來 render 一個 component 列表。


這裡有個使用 array 產生一個列表項目的簡單範例：
1. 將資料**移入**陣列：

```js
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];
```
2. 對 `people` 成員進行 **Map**，以建立新的 JSX 節點 array，`listItems`：

```js
const listItems = people.map(person => <li>{person}</li>);
```

3. 把 `listItems` 用 `<ul>` 包起來，並且**回傳**它：

```js
return <ul>{listItems}</ul>;
```

來看看運作結果：

<Sandpack>

```js
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
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

請注意上面的範例中 sandbox 顯示了一個錯誤訊息：

<ConsoleBlock level="error">

Warning: Each child in a list should have a unique "key" prop.

</ConsoleBlock>

你將會在這個頁面稍後學到如何修正這個錯誤。在這之前，我們先將這個 array 資料更加結構化。

## 過濾 array 裡的項目 {/*filtering-arrays-of-items*/}

這讓資料變得更結構化。

```js
const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',  
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
}];
```

假設你想要一種方法，僅顯示其職業為「chemist」的人。你可以使用 JavaScript 的 `filter()` 方法來篩選符合條件的項目。這個方法會讓 array 中的每個項目進行「過濾」(一個回傳 `true` 或 `false` 的函式)，最後回傳一個滿足篩選條件項目的新 array。

你只想要 `profession` 為 `'chemist'` 的項目。此「測試」函式看起來像 `(person) => person.profession === 'chemist'`。以下是如何將它們組合起來的方式：

1. 透過在 `people` 上呼叫 `filter()` 以 `person.profession === 'chemist'` 為過濾條件，**建立**一個僅包含「化學家」的新 array `chemists`：

```js
const chemists = people.filter(person =>
  person.profession === 'chemist'
);
```

2. 現在對 `﻿chemists` 進行 `map()`：

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
       known for {person.accomplishment}
     </p>
  </li>
);
```

3. 最後，從你的 component 中**回傳** `listItems`： 

```js
return <ul>{listItems}</ul>;
```

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
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
        known for {person.accomplishment}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
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

箭頭函式會隱式的回傳 `=>` 之後的表達式，所以你可以省略 `return` 陳述式：

```js
const listItems = chemists.map(person =>
  <li>...</li> // 隱式回傳!
);
```

然而，**如果你的 `=>` 後面跟著 `{` 大括號，那你必須明確地撰寫 `return` 陳述式！**

```js
const listItems = chemists.map(person => { // Curly brace
  return <li>...</li>;
});
```

包含 `=> {` 的箭頭函式被稱為「區塊主體函式」。它們讓你可以撰寫多行程式碼，但你*必須*自己撰寫 `return` 陳述式。如果你忘了寫，函式就不會回傳任何值！詳細說明可以參考[這裡](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#function_body)。

</Pitfall>

## 使用 `key` 保持列表項目的順序 {/*keeping-list-items-in-order-with-key*/}

請注意上面所有的範例，所有的 sandbox 都顯示了一個錯誤訊息：

<ConsoleBlock level="error">

Warning: Each child in a list should have a unique "key" prop.

</ConsoleBlock>

你必須給 array 裡的每一個項目指定一個 `key` -- 它可以是 string 或是 number，可以在 array 的其他項目中唯一的識別它。

```js
<li key={person.id}>...</li>
```

<Note>

在 `map()` 方法裡呼叫 JSX elements 總是需要指定 key！

</Note>

這些 key 會告訴 React ，每個 component 對應著 array 裡的哪一項，React 就可以把它們對應起來。這在某些需要被操作的 array 上非常重要，例如排序、新增或是刪除資料等。一個合適的 key 可以幫助 React 推斷發生什麼事，從而正確的更新 DOM Tree。

與其即時產生 `key`，你應該將它們包含在你的資料中：

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
          known for {person.accomplishment}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

```js data.js active
export const people = [{
  id: 0, // Used in JSX as a key
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1, // Used in JSX as a key
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2, // Used in JSX as a key
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3, // Used in JSX as a key
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4, // Used in JSX as a key
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
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

#### 為每個列表顯示多個 DOM nodes {/*displaying-several-dom-nodes-for-each-list-item*/}

如果你想讓每個列表項目都 render 多個 DOM nodes 而不是一個的話，你該怎麼做?

[`<>...</>` Fragment](/reference/react/Fragment) 簡短的語法沒有辦法賦予 key 值，所以你只能使用 `<div>` 將內容包起來，或是使用長一點且更明確的 [`<Fragment>`](/reference/react/Fragment#rendering-a-list-of-fragments) 語法

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

Fragments 不會顯示在 DOM 上，所以這串程式碼換轉換成 `<h1>`、`<p>`、`<h1>`、`<p>` 等扁平列表。

</DeepDive>

### 如何取得你的 `key` {/*where-to-get-your-key*/}

不同的資料來源提供不同的 keys：

* **來自資料庫的資料：**如果你的資料是來自於資料庫，你可以使用資料庫的 keys/IDs ，它們本身就具有唯一性。
* **本機產生的資料：**如果你資料的產生和儲存都在本機 (例如筆記軟體的筆記)，那麼你可使用計數器、 [`crypto.randomUUID()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID) 或是像 [`uuid`](https://www.npmjs.com/package/uuid) 的套件來產生這些 key 值。

### Key 的規則 {/*rules-of-keys*/}

* **Siblings 之間的 key 必須是唯一的。** 然而，在_不同_的 array 中使用相同的 key，對於 JSX node 是可以的。
* **Key 不能改變** 否則就失去使用它的意義！所以不要在 rendering 時動態產生它們。

### 為什麼 React 需要 key? {/*why-does-react-need-keys*/}

想像你的桌面上沒有檔案名稱。相反的，而是按順序來區分它們 -- 第一個檔案、第二個檔案等等。你可能會慢慢習慣，但一旦刪除了檔案，就會變得很混亂。第二個檔案就會變成第一個檔案，第三個檔案就會變成第二個檔案，以此類推。

在資料夾中的檔案名稱和 array 中的 JSX key 有類似的功能。它們讓我們可以在 siblings 之間識別一個項目。一個選擇得當的 key 提供的訊息比array 中的索引來得更好。即使_位置_由於重新排序而改變，`key` 也可以讓 React 在其生命週期中識別該項目。
<Pitfall>

你可能會想用 array 中的索引值來當作 `key` 值，實際上，當你沒有指定 `key` 值時，React 會使用它。但是，如果插入、刪除項目或重新排序 array，你 render 項目的順序將會改變。索引作為 key 往往會導致微妙且令人困惑的錯誤。

類似的概念還有不要隨機產生 key，例如像是 `key={Math.random()}`。這會導致 key 在 render 時永遠無法 match，導致所有 component 和 DOM 每次都會被重新建立。不僅速度慢，而且會失去項目列表內使用者的輸入。取而代之的是使用基於資料的穩定 ID。

請注意 component 不會將 `key` 當成 props 的一部分。key 的存在只用於提示 React 本身。如果你的 component 需要一個 ID，那麼請另外傳送 prop 給 component： `<Profile key={id} userId={id} />`。

</Pitfall>

<Recap>

在這篇文章中，你學會了：

* 如何從 component 抽出資料，並把它們放入像是 array 或是 object 結構中。
* 如何使用 JavaScript 的 `map` 方法來產生一組相似的 component。
* 如何使用 JavaScript 的 `filter` 方法來過濾 array。
* 為什麼以及如何在集合中的每個 component 設定 `key`，使 React 能在資料位置被改變或是發生變化時，能持續追蹤這些 component。

</Recap>



<Challenges>

#### 將列表一分為二 {/*splitting-a-list-in-two*/}

此範例顯示所有人的列表。

請試著將列表分為前後兩個列表：分別是**化學家**與**其他科學家**。像剛剛學會的一樣，你可以透過 `person.profession === 'chemist'` 這項條件來判斷一個人不是化學家。

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
        known for {person.accomplishment}
      </p>
    </li>
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ul>{listItems}</ul>
    </article>
  );
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
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

你可以使用 `filter()` 兩次來建立兩個獨立的 array，然後使用 `map` 方法遍歷它們來得到結果。

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chemist'
  );
  return (
    <article>
      <h1>Scientists</h1>
      <h2>Chemists</h2>
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
              known for {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
      <h2>Everyone Else</h2>
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
              known for {person.accomplishment}
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
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
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

這個解決方案中，我們直接在父層 `ul` element 中執行 `map` 方法。但如果你想增加程式碼的可讀性，你也可以使用變數保存 `map` 之後的結果。

現在仍有一些重複的部分出現在被 render 的列表中。你可以進一步將重複的部分抽取到一個 `<ListSection>` component：

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
              known for {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </>
  );
}

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chemist'
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ListSection
        title="Chemists"
        people={chemists}
      />
      <ListSection
        title="Everyone Else"
        people={everyoneElse}
      />
    </article>
  );
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
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

細心的讀者可能會注意到我們使用兩個 `filter` 呼叫來檢查每個人的職業兩次。檢查 property 非常快，所以在這個範例中沒問題。如果你的邏輯操作很昂貴，那你可以使用迴圈進行一次檢查來代替兩次的 `filter`。

事實上，如果 `people` 永遠不會改變，你可以將這段程式碼從你的 component 中移除。從 React 的角度來說，它只關心你最後給他的是不是包含 JSX nodes 的 array ，並不在乎 array 是怎麼來的：

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

let chemists = [];
let everyoneElse = [];
people.forEach(person => {
  if (person.profession === 'chemist') {
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
              known for {person.accomplishment}
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
      <h1>Scientists</h1>
      <ListSection
        title="Chemists"
        people={chemists}
      />
      <ListSection
        title="Everyone Else"
        people={everyoneElse}
      />
    </article>
  );
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
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

#### 在 component 內的巢狀列表 {/*nested-lists-in-one-component*/}

請根據你的 array 產生食譜列表！在食譜列表中，請使用 `<h2>` 顯示菜色的名稱，並使用 `<ul>` 列出它所需的原料。

<Hint>

這裡會需要使用兩層巢狀的`map` 呼叫。

</Hint>

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
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
      <h1>Recipes</h1>
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
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

每個 `recipes` 已經包含一個 `id` 欄位，所以外部迴圈使用它作為 `key`。沒有可以用於迴圈食材的 ID。但是，可以假設在同一個食譜中不會列出相同的食材，所以它的名字可以用作 `key`。或者，你可以更改資料結構以加入 ID，或者使用索引作為 `key`（但注意不能安全地重新排序食材）。

</Solution>

#### 把列表提取成一個 component {/*extracting-a-list-item-component*/}

`RecipeList` component 的程式碼有兩層巢狀的 `map`。為了讓程式碼簡化，我們會抽出一個 `Recipe` component 並接受 `id`、`name` 和 `ingredients` 作為 props，在這種情況下，你會把外層的 `key` 放在哪裡？原因是什麼？

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
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
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

<Solution>

你可以將外層 `map` 中的 JSX 複製並貼到一個新的 `Recipe` component 中，並將其作為該 component 的回傳值。然後，將原先的 `recipe.name` 更改為 `name`、`recipe.id` 更改為 `id`，依此類推，最後將它們作為 `props` 傳遞給 `Recipe` component。

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
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <Recipe {...recipe} key={recipe.id} />
      )}
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

這裡使用 `<Recipe {...recipe} key={recipe.id} />` 是一種簡寫方式，它表示將 `recipe` object 中的每個property 都作為 props 傳遞給 `Recipe` component。這種簡寫方式與直接明確列出每個 prop 是一樣的，例如 `<Recipe id={recipe.id} name={recipe.name} ingredients={recipe.ingredients} key={recipe.id} />`。

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

你可以嘗試把原本的 `map` 改成手動循環，或著嘗試使用 fragment 語法。

</Hint>

<Solution>

你可以寫一個迴圈把 `<hr />` 和 `<p>...</p>` 插入到輸出的 array 中：

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

原本使用詩句索引值作為 `key` 的方法已經行不通了，因爲現在 array 裡同時包含了分隔線和詩句。但是，你可以用加入後綴的方式給它們賦予獨一無二的 `key` 值，像是 `key={i + '-text'}` 這樣。


或著，你可以生產一個 fragment 包含 `<hr />` 和 `<p>...</p>`，但因為 fragment 簡寫 `<>...</>` 不支援設定 `key`，所以你需要寫成 `<Fragment>` 形式。
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

記住，使用 fragment 語法 (通常寫作 `<> </>`) 來包覆 JSX nodes 可避免引入額外的 `div`！

</Solution>

</Challenges>
