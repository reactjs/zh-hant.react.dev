---
id: lists-and-keys
title: 列表與 Key
permalink: docs/lists-and-keys.html
prev: conditional-rendering.html
next: forms.html
---

首先，讓我先來複習一下你在 JavaScript 中如何改變列表。

在以下的程式碼中，我們用 [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) 這個 function 來接收 `numbers` 這個 array 並將其中的每個值乘以兩倍。我們將 `map()` 回傳的新的 array 設定為變數 `doubled` 的值並印出：

```javascript{2}
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((number) => number * 2);
console.log(doubled);
```

這段程式碼在 console 中輸出 `[2, 4, 6, 8, 10]`。

在 React 中，將 array 轉變成 [element](/docs/rendering-elements.html) 的列表幾乎是一樣的方式。

### Render 多個 Component {#rendering-multiple-components}

你可以建立一系列的 element 並用括號 `{}` [將它們包含在JSX裡面](/docs/introducing-jsx.html#embedding-expressions-in-jsx)。

下面，我們會用 JavaScript [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) 的 function 來 loop `numbers` 這個 array。每一個項目，我們會回傳一個 `<li>` 元素。最後，我們會把結果產生的 element array assign 給 `listItems`:

```javascript{2-4}
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li>{number}</li>
);
```

我們會把整個 `listItems` array 包含在一個 `<ul>` element 裡面，然後 [render 到 DOM 上面](/docs/rendering-elements.html#rendering-an-element-into-the-dom)：

```javascript{2}
ReactDOM.render(
  <ul>{listItems}</ul>,
  document.getElementById('root')
);
```

[**在 CodePen 上試試看吧！**](https://codepen.io/gaearon/pen/GjPyQr?editors=0011)

這段程式碼展示了一個數字列表，從一到五。

### 基本列表 Component {#basic-list-component}

一般來說，你會在一個 [component](/docs/components-and-props.html) 內 render 列表。

我們可以將上面的例子改寫為一個接收 `numbers` array 並輸出一個沒有排序的 element 列表的 component。

```javascript{3-5,7,13}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li>{number}</li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

當你執行這段程式碼時，你會收到一個關於你應該提供 key 給每一個列表項目的警告。一個「key」是一個當你在創造一個 element 列表時必須使用的特殊的 string 屬性。在下一個段落中，我們將會討論其重要性。

讓我們在 `numbers.map()` 中將 `key` assign 給我們列表中的項目，並解決沒有 key 的這個問題。

```javascript{4}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li key={number.toString()}>
      {number}
    </li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

[**在 CodePen 上試試看吧！**](https://codepen.io/gaearon/pen/jrXYRR?editors=0011)

## Key {#keys}

Key 幫助 React 分辨哪些項目被改變、增加或刪除。Key 應該 should be given to the elements inside the array to 以給予 element 穩定的身份：

```js{3}
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li key={number.toString()}>
    {number}
  </li>
);
```

選擇 key 最好的方式就是The best way to pick a key is to use a string that uniquely identifies a list item among its siblings. Most often you would use IDs from your data as keys:

```js{2}
const todoItems = todos.map((todo) =>
  <li key={todo.id}>
    {todo.text}
  </li>
);
```

當你 render 的項目沒有穩定的 ID，且你沒有更好的方法時，你可能可以使用項目的索引做為 key：

```js{2,3}
const todoItems = todos.map((todo, index) =>
  // 請在項目沒有穩定的 ID 時才這樣做
  <li key={index}>
    {todo.text}
  </li>
);
```

我們並不建議你使用索引作為 key，尤其如果項目的順序會改變的話。這會對性能產生不好的影響，也可能會讓 component state 產生問題。請參考 Robin Pokorny 這篇[深入剖析使用索引作為 key 的負面效應](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318)的文章。如果你選擇不要列表項目指定明確的 key 的話，那麼 React 將會使用索引作為 key 的預設值。

如果你想了解更多，這是另一篇[深度剖析 key 的必要性](/docs/reconciliation.html#recursing-on-children)的文章。

### 用 key 提取 Component {#extracting-components-with-keys}

Key 只有在附近的 array 的環境中 the context of the surrounding array 才有意義。

比如，如果你[提取](/docs/components-and-props.html#extracting-components)一個 `ListItem` component，你應該把 key 放在 array 中 `<ListItem />` 的 element 而不是在 on the `<li>` element in the `ListItem` itself。

**範例：Key 的錯誤使用方式**

```javascript{4,5,14,15}
function ListItem(props) {
  const value = props.value;
  return (
    // 錯！你不需要在這裡指出 key：
    <li key={value.toString()}>
      {value}
    </li>
  );
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // 錯！你應該要在這裡指出 key：
    <ListItem value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

**範例：Key 的正確使用方式**

```javascript{2,3,9,10}
function ListItem(props) {
  // 正確！你不需要在這裡指出 key：
  return <li>{props.value}</li>;
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // 正確！你需要在 array 裡指出 key：
    <ListItem key={number.toString()}
              value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

[**在 CodePen 上試試看吧！**](https://codepen.io/gaearon/pen/ZXeOGM?editors=0010)

一個好的經驗法則是，在 `map()` 呼叫中的 element 都會需要 key。

### Key 必須在 Sibling 中是獨一無二的 {#keys-must-only-be-unique-among-siblings}

Keys used within arrays should be unique among their siblings. However they don't need to be globally unique. We can use the same keys when we produce two different arrays:

```js{2,5,11,12,19,21}
function Blog(props) {
  const sidebar = (
    <ul>
      {props.posts.map((post) =>
        <li key={post.id}>
          {post.title}
        </li>
      )}
    </ul>
  );
  const content = props.posts.map((post) =>
    <div key={post.id}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  );
  return (
    <div>
      {sidebar}
      <hr />
      {content}
    </div>
  );
}

const posts = [
  {id: 1, title: 'Hello World', content: 'Welcome to learning React!'},
  {id: 2, title: 'Installation', content: 'You can install React from npm.'}
];
ReactDOM.render(
  <Blog posts={posts} />,
  document.getElementById('root')
);
```

[**在 CodePen 上試試看吧！**](https://codepen.io/gaearon/pen/NRZYGN?editors=0010)

Keys serve as a hint to React but they don't get passed to your components. If you need the same value in your component, pass it explicitly as a prop with a different name:

```js{3,4}
const content = posts.map((post) =>
  <Post
    key={post.id}
    id={post.id}
    title={post.title} />
);
```

With the example above, the `Post` component can read `props.id`, but not `props.key`。

### 在 JSX 中嵌入 map() {#embedding-map-in-jsx}

在上面的例子中，我們宣告了另一個 `listItems` 變數並把它包含在 JSX 中：

```js{3-6}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <ListItem key={number.toString()}
              value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}
```

JSX 讓你在括號中[嵌入任何表達式](/docs/introducing-jsx.html#embedding-expressions-in-jsx)，所以我們能夠 inline the `map()` result：

```js{5-8}
function NumberList(props) {
  const numbers = props.numbers;
  return (
    <ul>
      {numbers.map((number) =>
        <ListItem key={number.toString()}
                  value={number} />
      )}
    </ul>
  );
}
```

[**在 CodePen 上試試看吧！**](https://codepen.io/gaearon/pen/BLvYrB?editors=0010)

有時候這會產生更乾淨的程式碼，但這種風格也可能被濫用。就像 JavaScript 一樣，是否要將變數提取出來以增加可讀性完全是看你的決定。請記得，如果 `map()` body 太 nested, it might be a good time to [提取 component](/docs/components-and-props.html#extracting-components)。
