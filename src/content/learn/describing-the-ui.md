---
title: 描述使用者介面
---

<Intro>

React 是一個用來渲染使用者介面 (UI) 的 Javascript 函式庫。一個完整的使用者介面是用各種小元件（例如按鈕、文字或圖片）組合而成。React 讓你將這些小元件組合成可以重複使用、可以巢狀使用的 *component*。 

無論是網站還是手機 App，所有畫面上的東西都可以被拆分成一個個 component。在這個章節，你將學會如何建立、客製化以及根據不同的條件來在畫面上渲染 React component。

</Intro>

<YouWillLearn isChapter={true}>

<<<<<<< HEAD
* [如何寫出你的第一個 React Component](/learn/your-first-component)
* [如何建立多個 Component 的檔案](/learn/importing-and-exporting-components)
* [如何用 JSX 在 Javascript 中加入 Markup](/learn/writing-markup-with-jsx)
* [如何在 JSX 中透過大括號來使用 Javascript 的語法](/learn/javascript-in-jsx-with-curly-braces)
* [如何用 Props 來設定你的 Component](/learn/passing-props-to-a-component)
* [如何根據特定條件來渲染 Component](/learn/conditional-rendering)
* [如何一次渲染多個 Component](/learn/rendering-lists)
* [如何把 Component 寫成「純函數」來避免容易混淆的錯誤](/learn/keeping-components-pure)
=======
* [How to write your first React component](/learn/your-first-component)
* [When and how to create multi-component files](/learn/importing-and-exporting-components)
* [How to add markup to JavaScript with JSX](/learn/writing-markup-with-jsx)
* [How to use curly braces with JSX to access JavaScript functionality from your components](/learn/javascript-in-jsx-with-curly-braces)
* [How to configure components with props](/learn/passing-props-to-a-component)
* [How to conditionally render components](/learn/conditional-rendering)
* [How to render multiple components at a time](/learn/rendering-lists)
* [How to avoid confusing bugs by keeping components pure](/learn/keeping-components-pure)
* [Why understanding your UI as trees is useful](/learn/understanding-your-ui-as-a-tree)
>>>>>>> a0cacd7d3a89375e5689ccfba0461e293bfe9eeb

</YouWillLearn>

## 你的第一個 component {/*your-first-component*/}

一個完整的 React 應用程式是由多個被稱為 *Component* 的使用者介面分塊組合而成。一個 React Component 是一個你可以在裡面使用 Markup 語法的 Javascript 函數。 

Component 可能小至一個按鈕，也可能大至整個頁面。這裡有一個名叫 `Gallery` 的 Component，這個 Component 裡面渲染了三個名叫 `Profile` 的 Component：

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>驚人的科學家們</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/your-first-component">

閱讀 **[你的第一個 Component](/learn/your-first-component)** 來學習如何宣告並使用 React Component。

</LearnMore>

## 導入和導出 Component {/*importing-and-exporting-components*/}

你可以在一個檔案中宣告很多的 Component，但如果檔案太大的話我們將很難快速的找到想要的程式碼在檔案的哪個位置。為了解決這個問題，你可以從一個檔案 *導出* 一個 Component，然後在另一個檔案中 *導入* 這個 Component 並使用他：

<Sandpack>

```js App.js hidden
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js Gallery.js active
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>驚人的科學家們</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js Profile.js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

<LearnMore path="/learn/importing-and-exporting-components">

閱讀 **[導入及導出 Component](/learn/importing-and-exporting-components)** 來學習如何把多個 Component 拆分到屬於他們自己的檔案中。

</LearnMore>

## 用 JSX 來撰寫 Markup 語法 {/*writing-markup-with-jsx*/}

每個 React component 都是一個可以渲染一些 Markup 語法到瀏覽器的 Javascript 函數，React components 使用一個語法擴充功能稱作 JSX 來表示這些 Markup 語法。JSX 看起來就像 HTML 一樣，但他比 HTML 更加嚴格一些，並且能夠顯示出動態的資訊。

如果你把一個 HTML Markup 直接貼到一個 React component 中，他不一定可以正常運作：

<Sandpack>

```js
export default function TodoList() {
  return (
    // 這個寫法沒辦法正常運作！
    <h1>Hedy Lamarr 的待辦事項</h1>
    <img
      src="https://i.imgur.com/yXOvdOSs.jpg"
      alt="Hedy Lamarr"
      class="photo"
    >
    <ul>
      <li>Invent new traffic lights
      <li>Rehearse a movie scene
      <li>Improve spectrum technology
    </ul>
  );
}
```

```css
img { height: 90px; }
```

</Sandpack>

如果你有像這樣的現成 HTML，你可以用這個 [轉換工具](https://transform.tools/html-to-jsx) 來修復他。

<Sandpack>

```js
export default function TodoList() {
  return (
    <>
      <h1>Hedy Lamarr 的待辦事項</h1>
      <img
        src="https://i.imgur.com/yXOvdOSs.jpg"
        alt="Hedy Lamarr"
        className="photo"
      />
      <ul>
        <li>Invent new traffic lights</li>
        <li>Rehearse a movie scene</li>
        <li>Improve spectrum technology</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/writing-markup-with-jsx">

閱讀 **[用 JSX 來撰寫 Markup 語法](/learn/writing-markup-with-jsx)** 來學習如何撰寫正確的 JSX 語法。

</LearnMore>

## 在 JSX 中使用 Javascript 的語法 {/*javascript-in-jsx-with-curly-braces*/}

JSX 讓你可以在 Javascript 檔案中使用類似 HTML 的語法，這讓我們把渲染邏輯和內容能夠寫在同一個地方。有時候你可能想要在 Markup 中使用一些 Javascript 的邏輯或是引入一個動態的變數。

在這種情況，你可以在 JSX 語法中使用 **大括號** 來「打開一個 Javascript 的視窗」：

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name} 的待辦事項</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/javascript-in-jsx-with-curly-braces">

閱讀 **[在 JSX 中使用 Javascript 的語法](/learn/javascript-in-jsx-with-curly-braces)** 來學習如何在 JSX 語法中存取 JavaScript 的資料。

</LearnMore>

## 傳遞 Props 到一個 Component 中 {/*passing-props-to-a-component*/}

React components 使用 *props* 來互相傳遞資訊。每個上層的 Component 都可以藉由賦予他們 Props 的方式來傳遞一些資訊到他的下層 Component 中。

Props 可能會讓你想起 HTML 語法中的 attributes，但你可以傳遞任何 JavaScript 的變數到 Props 中，包括物件、陣列、函數，甚至是 JSX！

<Sandpack>

```js
import { getImageUrl } from './utils.js'

export default function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2'
        }}
      />
    </Card>
  );
}

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

```

```js utils.js
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.card {
  width: fit-content;
  margin: 5px;
  padding: 5px;
  font-size: 20px;
  text-align: center;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.avatar {
  margin: 20px;
  border-radius: 50%;
}
```

</Sandpack>

<LearnMore path="/learn/passing-props-to-a-component">

閱讀 **[傳遞 Props 到 Component 中](/learn/passing-props-to-a-component)** 來學習如何傳入 Props 到 Component 中並使用他。

</LearnMore>

## 條件渲染 {/*conditional-rendering*/}

有時候你的 Component 會需要根據不同的條件來展示不同的內容。在 React 中，你可以使用 JavaScript 語法中的 `if` 陳述式，`&&` 以及 `? :` 運算子來根據條件渲染不同的 JSX。

在下面的範例中，我們用 JavaScript 的 `&&` 運算子來根據條件渲染打勾符號：

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
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

<LearnMore path="/learn/conditional-rendering">

閱讀 **[條件渲染](/learn/conditional-rendering)** 來學習各種根據條件來渲染內容的方法。

</LearnMore>

## 列表渲染 {/*rendering-lists*/}

你經常會需要用多個相似的 Component 來展示一系列的資料。這個時候你可以在 React 中使用 JavaScript 的 `filter()` 和 `map()` 來篩選資料並轉換成包含多個 Component 的陣列。 

對轉換後的陣列中的每個物件，你必須要幫他們指定一個 `key`。 一般來說，你可以用他們在資料庫中的 ID 來作為 `key`。 Key 可以讓 React 知道列表中每個物件當前的位置，即便你的列表發生了改動也沒關係。

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
      <h1>科學家列表</h1>
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
  grid-template-columns: 1fr 1fr;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
h1 { font-size: 22px; }
h2 { font-size: 20px; }
```

</Sandpack>

<LearnMore path="/learn/rendering-lists">

閱讀 **[列表渲染](/learn/rendering-lists)** 來學習如何一次把一個陣列渲染成多個 Component，以及如何幫每個 Component 選擇一個 key。

</LearnMore>

## 把 Component 寫成「純函數」 {/*keeping-components-pure*/}

我們說一個 JavaScript 的函數是一個 *純函數* (Pure Function) ，如果他滿足這些條件： 

* **不多管閒事** : 這個函數不會修改任何在他被呼叫之前就已經存在的物件或變數。
* **一樣的輸入，一樣的輸出** : 只要我們輸入相同的參數，這個函數總是回傳一個相同的輸出。

如果我們嚴格地把 Component 都寫成純函數，就可以在隨著專案規模越來越大的過程中避免一系列不可預期的問題出現。這裡給出了一個「不純的函數」作為例子：

<Sandpack>

```js
let guest = 0;

function Cup() {
  // Bad: changing a preexisting variable!
  guest = guest + 1;
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```

</Sandpack>

你可以藉由改成 Props 傳入資料的方式，而不是直接從外部讀取，來將函數改造為純函數：

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

</Sandpack>

<LearnMore path="/learn/keeping-components-pure">

閱讀 **[把 Component 寫成「純函數」](/learn/keeping-components-pure)** 來學習如何用「純函數」且「行為可預測」的寫法來撰寫 Component。

</LearnMore>

<<<<<<< HEAD
## 下一步 {/*whats-next*/}
=======
## Your UI as a tree {/*your-ui-as-a-tree*/}

React uses trees to model the relationships between components and modules. 

A React render tree is a representation of the parent and child relationship between components. 

<Diagram name="generic_render_tree" height={250} width={500} alt="A tree graph with five nodes, with each node representing a component. The root node is located at the top the tree graph and is labelled 'Root Component'. It has two arrows extending down to two nodes labelled 'Component A' and 'Component C'. Each of the arrows is labelled with 'renders'. 'Component A' has a single 'renders' arrow to a node labelled 'Component B'. 'Component C' has a single 'renders' arrow to a node labelled 'Component D'.">An example React render tree.</Diagram>

Components near the top of the tree, near the root component, are considered top-level components. Components with no child components are leaf components. This categorization of components is useful for understanding data flow and rendering performance.

Modelling the relationship between JavaScript modules is another useful way to understand your app. We refer to it as a module dependency tree. 

<Diagram name="generic_dependency_tree" height={250} width={500} alt="A tree graph with five nodes. Each node represents a JavaScript module. The top-most node is labelled 'RootModule.js'. It has three arrows extending to the nodes: 'ModuleA.js', 'ModuleB.js', and 'ModuleC.js'. Each arrow is labelled as 'imports'. 'ModuleC.js' node has a single 'imports' arrow that points to a node labelled 'ModuleD.js'.">An example module dependency tree.</Diagram>

A dependency tree is often used by build tools to bundle all the relevant JavaScript code for the client to download and render. A large bundle size regresses user experience for React apps. Understanding the module dependency tree is helpful to debug such issues. 

<LearnMore path="/learn/understanding-your-ui-as-a-tree">

Read **[Your UI as a Tree](/learn/understanding-your-ui-as-a-tree)** to learn how to create a render and module dependency trees for a React app and how they're useful mental models for improving user experience and performance.

</LearnMore>


## What's next? {/*whats-next*/}
>>>>>>> a0cacd7d3a89375e5689ccfba0461e293bfe9eeb

出發前往 [你的第一個 Component](/learn/your-first-component) 來一頁一頁閱讀這個章節的內容！

或是，如果你已經熟悉這些主題了，不妨瞭解看看 [加入可互動性](/learn/adding-interactivity) ?
