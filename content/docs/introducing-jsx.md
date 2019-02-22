---
id: introducing-jsx
title: 隆重介紹 JSX
permalink: docs/introducing-jsx.html
prev: hello-world.html
next: rendering-elements.html
---

考慮下面這個變數宣告：

```js
const element = <h1>你好，世界！</h1>;
```

這個有趣的標籤語法不是一個字串也不是 HTML。

這個語法叫做 JSX，是一個 JavaScript 的語法擴充。我們推薦你在寫 React 的時候透過這個語法來描述使用者界面的外觀。 JSX 可能為讓你想到一些樣板語言，但不一樣的地方是 JSX 允許你使用 JavaScript 所有的功能。

執行 JSX 會產生 React「element」。我們會在[下一個章節](/docs/rendering-elements.html)深入如何將這些輸出 render 到 DOM 裡頭。接下來，我們將帶您了解 JSX 的基礎。

### 為什麼要用 JSX? {#why-jsx}

React 擁抱了 render 邏輯從根本上就得跟其他 UI 邏輯綁在一起的事實：事件要怎麼處理？隨著時間經過 state 會如何變化？以及要怎麼將資料準備好用於顯示？

與其刻意的將*技術*拆開，把標籤語法跟邏輯拆放於不同檔案之中，React [*關注點分離*](https://en.wikipedia.org/wiki/Separation_of_concerns)的方法是將其拆分為很多同時包含 UI 與邏輯的 component，而彼此之間很少互相依賴。我們會在[之後的章節](/docs/components-and-props.html)中回來探討 component 這個主題，但如果你還沒被說服接受將標籤語法寫在 JS 裡頭，[這個演講](https://www.youtube.com/watch?v=x7cQ3mrcKaY)或許會說服你。

React [並不要求](/docs/react-without-jsx.html)使用 JSX，但大部分人覺得在 JavaScript 程式碼中撰寫使用者界面的同時，這是一個很好的視覺輔助。這也允許 React 顯示更有用的錯誤及警告訊息。

好，說完這個了，讓我們開始吧！

### 在 JSX 中嵌入 Expression {#embedding-expressions-in-jsx}

在下面這個範例中，我們宣告一個名為 `name` 的變數，並在 JSX 中透過將其名稱包在大括號中使用：

```js{1,2}
const name = 'Josh Perez';
const element = <h1>Hello, {name}</h1>;

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

你可以在 JSX 的大括號中寫入任何合法的 [JavaScript expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#Expressions)。舉例來說，`2 + 2`、`user.firstName` 以及 `formatName(user)` 都是合法的 JavaScript expression。

接下來的範例中，我們將嵌入呼叫 JavaScript function (`formatName(user)`) 的回傳值到一個 `<h1>` element 中。

```js{12}
function formatName(user) {
  return user.firstName+ ' ' + user.lastName;
}

const user = {
  firstName: 'Harper',
  lastName: 'Perez'
};

const element = (
  <h1>
    Hello, {formatName(user)}!
  </h1>
);

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

[](codepen://introducing-jsx)

為了方便閱讀，我們將 JSX 拆成很多行表達。雖然這並不需要，我們建議將多行 JSX 包在括號中來避免遇到[自動分號補足](http://stackoverflow.com/q/2846283)的麻煩。

### JSX 本身也是 Expression {#jsx-is-an-expression-too}

在編譯之後，JSX expressions 就變成了一般的 JavaScript function 呼叫並回傳 JavaScript 物件。
這表示你也可以在 `if` 跟 `for` 迴圈中使用 JSX，將其指定到一個變數，使用 JSX 作為參數並由 function 中回傳。

```js{3,5}
function getGreeting(user) {
  if (user) {
    return <h1>Hello, {formatName(user)}!</h1>;
  }
  return <h1>Hello, Stranger.</h1>;
}
```

### 在 JSX 中指定屬性 {#specifying-attributes-with-jsx}

你可以使用引號將字串設定為屬性：

```js
const element = <div tabIndex="0"></div>;
```

你也可以在屬性中使用大括號來嵌入一個 JavaScript expression：

```js
const element = <img src={user.avatarUrl}></img>;
```

不要在嵌入 JavaScript expression 作為屬性的時候同時使用引號或是大括號。你應該要在使用字串屬性的時候使用引號，使用 expressions 的時候使用大括號，但不要同時使用。

>**注意：**
>
>由於 JSX 比較接近 JavaScript 而不是 HTML，React DOM 使用 `camelCase` 來命名屬性而不是使用慣有的 HTML 屬性名稱。
>
>舉例來說：在 JSX 之中，`class` 變成了 [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) 而 `tabindex` 變成了 [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/tabIndex)。

### 在 JSX 中指定 Children {#specifying-children-with-jsx}

就像是在 XML 之中，如果一個標籤是空白的，你可以用 `/>` 立刻關閉這個標籤：

```js
const element = <img src={user.avatarUrl} />;
```

JSX 標籤也可以包含 children：

```js
const element = (
  <div>
    <h1>Hello!</h1>
    <h2>Good to see you here.</h2>
  </div>
);
```

### JSX 防範注入攻擊 {#jsx-prevents-injection-attacks}

在 JSX 之中可以安全的直接嵌入使用者輸入：

```js
const title = response.potentiallyMaliciousInput;
// 這是安全的：
const element = <h1>{title}</h1>;
```

React DOM 預設會在 render 之前 [escape](http://stackoverflow.com/questions/7381974/which-characters-need-to-be-escaped-on-html) 所有嵌入在 JSX 中的變數。這保證你永遠不會不小心注入任何不是直接寫在你的應用程式中的東西。所有變數都會在 render 之前轉為字串，這可以避免 [XSS（跨網站指令碼）](https://en.wikipedia.org/wiki/Cross-site_scripting)攻擊。

### JSX 表示物件 {#jsx-represents-objects}

Babel 將 JSX 編譯為呼叫 `React.createElement()` 的程式。

下面這兩個例子完全相同：

```js
const element = (
  <h1 className="greeting">
    Hello, World!
  </h1>
);
```

```js
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, World!'
);
```

`React.createElement()` 會進行一些檢查以幫助你寫出沒有 bug 的程式，但基本上它會產生類似下面的物件：

```js
// 注意：這是簡化過的結構
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world!'
  }
};
```

這種物件被稱呼為「React element」。你可以想像他們描述的是你想要在螢幕上看到的東西，React 會讀取這些物件並用這些描述來產生 DOM 並保持他們在最新狀態。

我們會在下一個章節探討如何把 React element render 到 DOM 之中。

>**提示：**
>
> 我們推薦你在編輯器中使用 [「Babel」語法](http://babeljs.io/docs/editors)，這樣可以確保 ES6 跟 JSX 都能夠正確的被語法突顯。這個網站使用的是一個相容的色彩主題 [Oceanic Next](https://labs.voronianski.com/oceanic-next-color-scheme/)。
