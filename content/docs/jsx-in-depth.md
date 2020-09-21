---
id: jsx-in-depth
title: 深入 JSX
permalink: docs/jsx-in-depth.html
redirect_from:
  - "docs/jsx-spread.html"
  - "docs/jsx-gotchas.html"
  - "tips/if-else-in-JSX.html"
  - "tips/self-closing-tag.html"
  - "tips/maximum-number-of-jsx-root-nodes.html"
  - "tips/children-props-type.html"
  - "docs/jsx-in-depth-zh-CN.html"
  - "docs/jsx-in-depth-ko-KR.html"
---

基本上，JSX 單純只是 `React.createElement(component, props, ...children)` function 的一個語法糖。以下 JSX 程式碼：

```js
<MyButton color="blue" shadowSize={2}>
  Click Me
</MyButton>
```

會編譯成：

```js
React.createElement(
  MyButton,
  {color: 'blue', shadowSize: 2},
  'Click Me'
)
```

如果沒有 children 的話你也可以使用閉合的標籤形式。例如：

```js
<div className="sidebar" />
```

會編譯成：

```js
React.createElement(
  'div',
  {className: 'sidebar'}
)
```

如果你想測試某些特定的 JSX 會轉換成什麼樣的 JavaScript，你可以在[線上 Babel 編譯器](babel://jsx-simple-example)進行測試。

## 指定 React Element 類型 {#specifying-the-react-element-type}

JSX 標籤的第一個部分決定 React element 的類型。

大寫字母的 JSX 標籤代表它們是 React Component。這些標籤會編譯成指向命名變數的 reference，所以當你使用 JSX `<Foo />` 表達式時，`Foo` 就必須在作用域內。

### React 必須在作用域內 {#react-must-be-in-scope}

因為 JSX 會編譯成呼叫 `React.createElement` 的形式，`React` 函式庫必須同時與你的 JSX 程式碼在相同的作用域內。

舉例來說，雖然 `React` 與 `CustomButton` 並沒有在 JavaScript 中被直接使用，但是在此程式碼中它們必須被導入：

```js{1,2,5}
import React from 'react';
import CustomButton from './CustomButton';

function WarningButton() {
  // return React.createElement(CustomButton, {color: 'red'}, null);
  return <CustomButton color="red" />;
}
```

如果你不使用任何 JavaScript bundler 並從 `<script>` 標籤來載入 React，那麼它就已經以 `React` 存在於作用域中了。

### 在 JSX 類型中使用點記法 {#using-dot-notation-for-jsx-type}

你也可以在 JSX 中使用點記法來指向一個 React Component。這對當你有一個會導出許多 React component 的 module 來講是十分方便的。舉例來說，如果 `MyComponents.DatePicker` 是一個 component，那麼你可以在 JSX 中直接這樣使用：

```js{10}
import React from 'react';

const MyComponents = {
  DatePicker: function DatePicker(props) {
    return <div>Imagine a {props.color} datepicker here.</div>;
  }
}

function BlueDatePicker() {
  return <MyComponents.DatePicker color="blue" />;
}
```

### 使用者定義的 Component 必須由大寫字母開頭 {#user-defined-components-must-be-capitalized}

當一個 element 為小寫字母開頭時，它就會指向內建的 component，例如 `<div>` 或 `<span>` 會生產成字串 `'div'` 或 `'span'` 並傳遞給 `React.createElement`。像 `<Foo />` 大寫字母開頭的 element 會編譯成 `React.createElement(Foo)` 並且在你的 JavaScript 檔案裡對應自定義或導入的 component。

我們建議以大寫字母開頭來命名 component。如果你有一個小寫字母開頭的 component，請在 JSX 裡使用之前把它賦值給一個大寫字母開頭的變數。

例如，以下程式碼並不會按照預期運行：

```js{3,4,10,11}
import React from 'react';

// 錯誤！這是一個 component 並且應該由大寫字母開頭：
function hello(props) {
  // 正確！因為 div 是一個有效的 HTML 標籤，所以使用<div> 是可行的：
  return <div>Hello {props.toWhat}</div>;
}

function HelloWorld() {
  // 錯誤！React 會因為非大寫字母開頭而認為 <hello /> 是一個 HTML 標籤：
  return <hello toWhat="World" />;
}
```

為了解決這個問題，我們將重新命名 `hello` 成 `Hello` 並且以 `<Hello />` 來使用它：

```js{3,4,10,11}
import React from 'react';

// 正確！這是一個 component 並且應該由大寫字母開頭：
function Hello(props) {
  // 正確！因為 div 是一個有效的 HTML 標籤，所以使用 <div> 是可行的：
  return <div>Hello {props.toWhat}</div>;
}

function HelloWorld() {
  // 正確！React 會因為大寫字母開頭而了解 <Hello /> 是一個 component。
  return <Hello toWhat="World" />;
}
```

### 在 Runtime 時選擇類型 {#choosing-the-type-at-runtime}

你不能用通用表達式當作 React element 的類型。如果你想要用通用表達式來表示 element 的類型，你可以先把它賦值給一個大寫字母開頭的變數。這是在當你想要根據一個 prop 來決定 render 不同 component 時常常發生的：

```js{10,11}
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // 錯誤！JSX 不能是表達式。
  return <components[props.storyType] story={props.story} />;
}
```

為了解決這個問題，我們首先將類型賦值給一個大寫字母開頭的變數：

```js{10-12}
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // 正確！JSX 類型可以是大寫字母開頭的變數。
  const SpecificStory = components[props.storyType];
  return <SpecificStory story={props.story} />;
}
```

## JSX 中的 Props {#props-in-jsx}

在 JSX 中有不同的方式可以指定 props。

### JavaScript 表達式作為 Props {#javascript-expressions-as-props}

你可以用 `{}` 包住任何 JavaScript 表達式作為一個 prop 傳遞。例如，在以下 JSX 中：

```js
<MyComponent foo={1 + 2 + 3 + 4} />
```

對 `MyComponent` 來說，因為 `1 + 2 + 3 + 4` 會被解讀，所以 `props.foo` 的值會是 `10`。

因為 `if` 語法與 `for` 迴圈都不屬於 JavaScript 表達式，所以它們並不能在 JSX 中被直接使用。不過，你可以在它周圍外的程式碼中使用。例如：

```js{3-7}
function NumberDescriber(props) {
  let description;
  if (props.number % 2 == 0) {
    description = <strong>even</strong>;
  } else {
    description = <i>odd</i>;
  }
  return <div>{props.number} is an {description} number</div>;
}
```

你可以在對應的段落中了解更多關於[條件式 render](/docs/conditional-rendering.html) 與[迴圈](/docs/lists-and-keys.html)。

### 字串字面值 {#string-literals}

你可以傳遞一個字串字面值作為 prop。以下兩個 JSX 表達式是相等的：

```js
<MyComponent message="hello world" />

<MyComponent message={'hello world'} />
```

當你傳遞一個字串字面值時，它的值是未經 HTML 轉義的。所以以下兩個 JSX 表達式是相等的：

```js
<MyComponent message="&lt;3" />

<MyComponent message={'<3'} />
```

這種行為通常是無關緊要的。在此只是為了完整性而提及。

### Props 預設為 「True」 {#props-default-to-true}

如果你沒給 prop 賦值，那麼它的預設值就是 `true`。以下兩個 JSX 表達式是相等的：

```js
<MyTextBox autocomplete />

<MyTextBox autocomplete={true} />
```

一般來說，我們不建議*不*傳遞 prop 的值，因為容易把它跟 [ES6 object shorthand](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Operators/Object_initializer#New_notations_in_ECMAScript_2015) 混淆，`{foo}` 是 `{foo: foo}` 的簡寫而不是 `{foo: true}`，所以並不建議這樣使用。這種行為存在只是為了相配 HTML 的行為。

### 展開屬性 {#spread-attributes}

如果你已經有了一個 `props` 的 object，並且想把它傳遞進 JSX，你可以使用 `...` 作為展開運算子來傳遞整個 props object。以下兩個 component 是相等的：

```js{7}
function App1() {
  return <Greeting firstName="Ben" lastName="Hector" />;
}

function App2() {
  const props = {firstName: 'Ben', lastName: 'Hector'};
  return <Greeting {...props} />;
}
```

你也可以使用展開運算子來分開並挑選 component 所需的 props。

```js{2}
const Button = props => {
  const { kind, ...other } = props;
  const className = kind === "primary" ? "PrimaryButton" : "SecondaryButton";
  return <button className={className} {...other} />;
};

const App = () => {
  return (
    <div>
      <Button kind="primary" onClick={() => console.log("clicked!")}>
        Hello World!
      </Button>
    </div>
  );
};
```

在以上的範例中，`kind` prop 被安全地挑出並且*不會*被傳遞進 DOM 中的 `<button>` element。
所有其它的 props 藉由 `...other` object 被傳遞，讓 component 的應用非常具有彈性。你可以看見它傳遞一個 `onClick` 與 `children` props。

展開運算子不但可以如此靈活地使用，它能讓我們輕易挑選出對於 component 不重要且多餘的 props，也能讓我們傳遞無效的 HTML 屬性到 DOM 裡。

## JSX 中的 Children {#children-in-jsx}

在 JSX 表達式有包含開始與結束標籤的情形下，夾在兩者之間的內容會被傳遞為特別的 prop：`props.children`。有幾種不同的方法來傳遞 children：

### 字串字面值 {#string-literals-1}

你可以在兩個標籤之間放置字串，而 `props.children` 就會是那個字串。這對許多內建的 HTML element 是很有用的。例如：

```js
<MyComponent>Hello world!</MyComponent>
```

這是有效的 JSX，而 `props.children` 在 `MyComponent` 中單純就會是 `"Hello world!"`。HTML 是未經轉義的，所以你可以這樣如同 HTML 來寫 JSX：

```html
<div>This is valid HTML &amp; JSX at the same time.</div>
```

JSX 會把開頭與結尾的空白去除，也會去除空行。與標籤相鄰的新行會去除；在字串字面值中間的新行則會被壓縮成單一空格。所以以下都會 render 同樣的結果：

```js
<div>Hello World</div>

<div>
  Hello World
</div>

<div>
  Hello
  World
</div>

<div>

  Hello World
</div>
```

### JSX Children {#jsx-children}

你可以提供許多 JSX element 作為 children。這在顯示巢狀 component 時是非常實用的：

```js
<MyContainer>
  <MyFirstComponent />
  <MySecondComponent />
</MyContainer>
```

你可以混合不同類型的 children，所以你也能夠同時使用字串字面值與 JSX children。這也是 JSX 與 HTML 另一相似的點，而以下是有效的 JSX 同時也是有效的 HTML：

```html
<div>
  Here is a list:
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</div>
```

一個 React component 也能夠回傳一個陣列 element：

```js
render() {
  // 沒有必要把多餘的 list items 包在 element 裡頭！
  return [
    // 別忘了加 keys :)
    <li key="A">First item</li>,
    <li key="B">Second item</li>,
    <li key="C">Third item</li>,
  ];
}
```

### JavaScript 表達式作為 Children {#javascript-expressions-as-children}

你可以傳遞任何封裝在 `{}` 內的 JavaScript 表達式作為 children。例如，以下表達式皆相等：

```js
<MyComponent>foo</MyComponent>

<MyComponent>{'foo'}</MyComponent>
```

這在要 render 任意長度的 JSX 表達式列表時是非常實用的。例如，這會 render 一個 HTML 列表：

```js{2,9}
function Item(props) {
  return <li>{props.message}</li>;
}

function TodoList() {
  const todos = ['finish doc', 'submit pr', 'nag dan to review'];
  return (
    <ul>
      {todos.map((message) => <Item key={message} message={message} />)}
    </ul>
  );
}
```

JavaScript 表達式可以與不同類型的 children 混合。這在不使用樣板字串時非常實用：

```js{2}
function Hello(props) {
  return <div>Hello {props.addressee}!</div>;
}
```

### Functions 作為 Children {#functions-as-children}

正常來說，在 JSX 中的 JavaScript 表達式會被轉換成字串、React element、或者包含這些的列表。不過，`props.children` 就像其它 prop 一樣可以傳遞任何類型的資料，而並不局限於只有 React 知道如何 render 的資料。舉例來說，假如你有一個自訂 component，你可以把 callback 作為 `props.children` 傳遞：

```js{4,13}
// numTimes 次呼叫 children callback 來重複生成 component
function Repeat(props) {
  let items = [];
  for (let i = 0; i < props.numTimes; i++) {
    items.push(props.children(i));
  }
  return <div>{items}</div>;
}

function ListOfTenThings() {
  return (
    <Repeat numTimes={10}>
      {(index) => <div key={index}>This is item {index} in the list</div>}
    </Repeat>
  );
}
```

被傳遞進自訂 component 的 children 可以是任何東西，只要 component 能夠在 render 之前把它轉換成 React 能夠理解的東西就可以了。這種用法並不普遍，但能夠顯示出 JSX 的延伸性。

### Booleans, Null, 與 Undefined 會被忽略 {#booleans-null-and-undefined-are-ignored}

`false`, `null`, `undefined`, 與 `true` 都是有效的 children。它們只是單純不會被 render。以下 JSX 表達式皆會 render 相同的結果：

```js
<div />

<div></div>

<div>{false}</div>

<div>{null}</div>

<div>{undefined}</div>

<div>{true}</div>
```

這在需要條件式 render 不同 React elements 時非常方便。以下 JSX 只會在 `showHeader` 為 `true` 時 render `<Header />`：

```js{2}
<div>
  {showHeader && <Header />}
  <Content />
</div>
```

值得注意的是有一些像是數字 `0` 的 [「falsy」值](https://developer.mozilla.org/zh-TW/docs/Glossary/Falsy) 仍然會被 React 給 render。舉例來說，以下的程式碼可能不會如同你預期般地運作，因為當 `props.messages` 是一個空 array 時， `0` 會被印出：

```js{2}
<div>
  {props.messages.length &&
    <MessageList messages={props.messages} />
  }
</div>
```

為了解決這個問題，確保在 `&&` 之前的表達式為 boolean：

```js{2}
<div>
  {props.messages.length > 0 &&
    <MessageList messages={props.messages} />
  }
</div>
```

相反地，如果你想要印出 `false`、`true`、`null` 或者 `undefined` 時，你必須要先把它[轉換成一個字串](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/String#String_conversion)：

```js{2}
<div>
  My JavaScript variable is {String(myVariable)}.
</div>
```
