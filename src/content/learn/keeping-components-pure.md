---
title: 保持 Component 的 Pure
---

<Intro>

有些 JavaScript 的函式為「純函式」。純函數只會執行計算，不會做別的事情。如果我們嚴格地把 component 都寫成純函數，就可以在隨著 codebase 的增長中避免一系列令人困惑且不可預期的問題出現。但是在獲得這些好處前，你必須先遵守一些規則。


</Intro>

<YouWillLearn>

* 什麼是 purity 以及它如何幫助你避免錯誤
* 如何透過將變更保留在 render 階段外來保持 component 的 pure
* 如何使用 Strict Mode 來尋找 component 中的錯誤

</YouWillLearn>

## Purity：Component 作為公式 {/*purity-components-as-formulas*/}

在計算機科學中（尤其是函數式程式設計的世界），[純函式](https://wikipedia.org/wiki/Pure_function)具有以下的特徵：

* **只關心自己的事務。**這個函式不會修改任何在他被呼叫之前就已經存在的 object 或變數。
* **一樣的輸入，一樣的輸出。**只要我們輸入相同的參數，這個函式總是回傳相同的輸出。

你可能已經熟悉純函數的其中一個例子：數學中的公式

來看這個數學公式： <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>

如果 <Math><MathI>x</MathI> = 2</Math> 那麼 <Math><MathI>y</MathI> = 4</Math> ，永遠如此。

如果 <Math><MathI>x</MathI> = 3</Math> 那麼 <Math><MathI>y</MathI> = 6</Math>，永遠如此。

如果 <Math><MathI>x</MathI> = 3</Math> ， <MathI>y</MathI> 不會因為一天中的時間或是股票市場的狀態而有時候是 <Math>9</Math> 或 <Math>–1</Math> 或 <Math>2.5</Math>。

如果 <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> 且 <Math><MathI>x</MathI> = 3</Math>， <MathI>y</MathI> 永遠都會是 <Math>6</Math>。

如果我們把它放到 JavaScript 函數中，它會長得像這樣：

```js
function double(number) {
  return 2 * number;
}
```

在上面的範例中，`double` 是一個**純函式**。如果你傳入 `3`，他永遠都會回傳 `6`。

React 就是圍繞這個概念設計的。**React 假設你編寫的每個函式都是純函式。** 這表示你撰寫的所有 React component 都必須永遠在給定相同輸入的情況下，回傳相同的 JSX ：

<Sandpack>

```js App.js
function Recipe({ drinkers }) {
  return (
    <ol>    
      <li>Boil {drinkers} cups of water.</li>
      <li>Add {drinkers} spoons of tea and {0.5 * drinkers} spoons of spice.</li>
      <li>Add {0.5 * drinkers} cups of milk to boil and sugar to taste.</li>
    </ol>
  );
}

export default function App() {
  return (
    <section>
      <h1>Spiced Chai Recipe</h1>
      <h2>For two</h2>
      <Recipe drinkers={2} />
      <h2>For a gathering</h2>
      <Recipe drinkers={4} />
    </section>
  );
}
```

</Sandpack>

當你把 `drinkers={2}` 傳入 `Recipe` 時，會永遠回傳包含 `2 cups of water` 的 JSX。

當你傳入 `drinkers={4}`，會永遠回傳包含 `4 cups of water` 的 JSX。

就像是數學公式一樣。

你可以把 Component 想成是食譜一樣： 如果你遵循它們並且在烹飪過程中不加入新食材，那麼你每次都會得到相同的菜餚。這個「菜餚」就是 Component 提供給 React [Render](/learn/render-and-commit) 的 JSX。 

<Illustration src="/images/docs/illustrations/i_puritea-recipe.png" alt="A tea recipe for x people: take x cups of water, add x spoons of tea and 0.5x spoons of spices, and 0.5x cups of milk" />

## 副作用：（非）預期的後果 {/*side-effects-unintended-consequences*/}

React 的渲染過程必須永遠保持 pure 。 Components 應該永遠 *回傳* 它們的 JSX，而不該 *更改* 任何渲染之前就存在的物件或變數 - 這會使它們變得 impure ！

這是一個違反規則的 Component ：

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

這個 component 正在讀取與更改在外部宣告的 `guest` 變數。這意味著**多次呼叫這個 component 會產生不一樣的 JSX ！** 更重要的是，如果 _其他_ components 也讀取 `guest` ，它們將依照被渲染的時間點而產生不一樣的 JSX ！這是不可預測的。

回到我們的公式 <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>，即使現在 <Math><MathI>x</MathI> = 2</Math>， 我們不能保證 <Math><MathI>y</MathI> = 4</Math>。我們的測試可能會失敗、我們的用戶可能會感到困惑、飛機會從天上掉下來 - 你可以看到這將會導致令人困惑的錯誤！

你可以透過 [將 `guest` 當成 prop 傳入](/learn/passing-props-to-a-component) 來修正這個 component：

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

現在你的 component 是 pure 的，因為它返回的 JSX 僅依賴 `guest` prop。

一般來說，你不應該預期 components 以任何特定順序渲染。在 <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> 之前或之後調用 <Math><MathI>y</MathI> = 5<MathI>x</MathI></Math> 並不重要：兩個公式都將各自獨立地求解。同樣的，每個 component 都應該「只考慮自己」， 而不是在渲染過程中試圖與其他 components 協調或是依賴其他 components 。渲染就像是一個學校考試：每個 components 都應該計算自己的 JSX ！

<DeepDive>

#### 使用嚴格模式檢查 impure 的計算 {/*detecting-impure-calculations-with-strict-mode*/}

僅管你可能還沒有全部使用過它們，但在 React 中你可以在渲染時讀取三種輸入：[props](/learn/passing-props-to-a-component)、[state](/learn/state-a-components-memory) 以及 [context](/learn/passing-data-deeply-with-context)。你應該永遠將這些輸入視為 read-only 。

當你想要 *改變* 某些以用戶輸入為響應的內容時，你應該要 [set state](/learn/state-a-components-memory) 而非直接更改變數。你永遠都不該在 component 渲染過程中改變已存在的變數或物件。

React 提供了「嚴格模式」，在開發過程中它會呼叫每個 component 的函數兩次。 **透過呼叫兩次 component 的函數，嚴格模式有助於找到違反這些規則的 components。**

請注意在原本的範例，它顯示了「Guest #2」、 「Guest #4」以及「Guest #6」，而不是「Guest #1」、「Guest #2」及「Guest #3」。原本的函數是 impure 的，所以呼叫兩次後就破壞了它。但在修正後的 pure 版本中，即使每次呼叫了兩次函數還是能夠正常運作。 **純函數只進行運算，因此呼叫兩次後也不會改變任何事** -- 就像是呼叫 `double(2)` 兩次也不會改變它的回傳值，求解 <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> 兩次不會改變 <MathI>y</MathI> 的值。相同的輸入永遠會有相同的輸出。

嚴格模式不會影響正式環境，因此它不會拖慢用戶的應用程式速度。如需選擇嚴格模式，你可以將你的 root component 包裝到 `<React.StrictMode>`。有些框架預設會這麼做。

</DeepDive>

### 變異本地化：你的 component 的小秘密 {/*local-mutation-your-components-little-secret*/}

在上面的範例中， 問題是 component 在渲染時改變了 *預先存在的* 變數。這通常會稱之為 **變異 (mutation)** 使其聽起來有點可怕。純函數不會改變函數範圍外的變數、或是調用之前就已建立的物件 — 這使得它們 impure！

不過， **在渲染時改變 *剛剛* 才建立的變數或物件是完全沒問題的**。在這個範例中，你建立了 `[]` 陣列，並賦值給 `cups` 變數，接著把一打杯子 `push` 進去：

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaGathering() {
  let cups = [];
  for (let i = 1; i <= 12; i++) {
    cups.push(<Cup key={i} guest={i} />);
  }
  return cups;
}
```

</Sandpack>

如果 `cups` 變數或者是 `[]` 陣列是在 `TeaGathering` 函數之外建立的，這就會是個大問題！你會在將項目放入陣列時改變一個 *預先存在的* 物件。

不過，由於你是在 `TeaGathering` 內的 *同個渲染過程中* 建立它們的，所以不會有問題。在 `TeaGathering` 範圍外的任何程式碼都不會知道發生了這個情況。這稱為 **"local mutation"**- 這就像是 component 自己的小秘密。

## _可能_ 會引起副作用的地方 {/*where-you-_can_-cause-side-effects*/}

雖然函數程式設計在很大程度上依賴於存粹性，但在某些時候，_有些東西_ 必須改變。這就是程式設計的意義所在！這些更改例如：顯示畫面、起始一個動畫、更改資料都被稱為 **副作用** 。他們是 _一邊發生_ 的事情，而不是在渲染期間發生的事情。

在 React 中，**副作用通常屬於[事件處理器](/learn/responding-to-events)**。事件處理器是 React 在你執行某些操作（例如：點擊一個按鈕）時運行的函數。儘管事件處理器是在 component *內部* 定義的，但它們 *不會在渲染時間執行*！**所以事件處理器不需是 pure 的。**

如果你已經用盡了所有其他選項，並且無法找到其他適合你的 side effect 的 event handler，你仍然可以選擇 component 中的 [`useEffect`](/reference/react/useEffect) 來將其附加到回傳的 JSX。這告訴 React 在 render 後、允許 side effect 的情況下執行它。**但是，這個方法應該要是你最後的手段。**

可以的話，盡量嘗試透過 render 過程來表示你的邏輯。你會驚訝它能帶你走多遠！

<DeepDive>

#### 為什麼 React 在意存粹性？ {/*why-does-react-care-about-purity*/}

撰寫純函數需要一些習慣與紀律。但純函數也解鎖了一些絕佳的功能：

* 你的 components 可以在不同環境上運行 - 例如，在伺服器上！由於它們對相同輸出會有相同結果，因此一個 component 可以滿足許多用戶請求。
* 你可以透過 [skipping rendering](/reference/react/memo) 那些 input 沒有更新的 components 來提升效能。這是安全的，因為純函式永遠都會回傳相同的結果，所以可以安全地 cache 它們。
* 如果在渲染深層元件樹 (deep component tree) 的過程中某些資料發生變化，React 可以重新啟動渲染、而不浪費時間完成過時的渲染。純粹性可以讓它更安全地隨時停止計算。

所有我們正在建立的 React 新功能都利用了純粹性的優點。從獲取資料到動畫再到性能，保持 components 的存粹性能夠解鎖 React 典範的力量。

</DeepDive>

<Recap>

* 一個 component 是 pure 的，這意味著：
  * **只關心自己的事務。**這個函式不會修改任何在他被呼叫之前就已經存在的 object 或變數。
  * **一樣的輸入，一樣的輸出** 只要我們輸入相同的參數，這個函數總是回傳一個相同的輸出。
* 渲染可能會在任何時間發生，因此 components 不該依賴於彼此的渲染順序。
* 你不該改變任何你的 components 用來渲染的輸入。這包含 props，state，以及 context。要更新畫面的話，請 ["set" state](/learn/state-a-components-memory) 而不是直接修改預先存在的物件。
* 盡量在返回的 JSX 中表達你的 component 邏輯。當你需要「更改內容」時，你會希望在事件處理器中處理。或是作為最後的手段，你可以使用 `useEffect`。
* 撰寫純函數需要一些練習，不過它能解鎖 React 典範的力量。

</Recap>


  
<Challenges>

#### 修正一個換掉的時鐘 {/*fix-a-broken-clock*/}

這個 component 希望在午夜至上午 6 點期間將 `<h1>` 的 CSS class 設定為 `"night"`，並在所有其他時段都設成 `"day"`。但是它沒辦法運作。你能修正這個 component 嗎？

你可以透過暫時修改電腦的時區來驗證你的做法是否有效。當時間在午夜至上午 6 點時，時鐘的顏色應該要是反白的！

<Hint>

渲染是一種 *計算* ，它不應該嘗試「做」事情。你能用不同方式表達同一種想法嗎？

</Hint>

<Sandpack>

```js Clock.js active
export default function Clock({ time }) {
  let hours = time.getHours();
  if (hours >= 0 && hours <= 6) {
    document.getElementById('time').className = 'night';
  } else {
    document.getElementById('time').className = 'day';
  }
  return (
    <h1 id="time">
      {time.toLocaleTimeString()}
    </h1>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  return (
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

<Solution>

你可以透過計算 `className` 並把它放入渲染出來的輸出中來修復這個 component：

<Sandpack>

```js Clock.js active
export default function Clock({ time }) {
  let hours = time.getHours();
  let className;
  if (hours >= 0 && hours <= 6) {
    className = 'night';
  } else {
    className = 'day';
  }
  return (
    <h1 className={className}>
      {time.toLocaleTimeString()}
    </h1>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  return (
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

在這個範例中，副作用（修改 DOM ）根本完全沒有必要。你只需要返回 JSX 即可。

</Solution>

#### 修正一個壞掉的 Profile {/*fix-a-broken-profile*/}

有兩個 `Profile` components 使用不同資料並排地呈現。在第一個 Profile 中點選 "Collapse"，接著 "Expand"。你會發現這時兩個 profiles 顯示的是同一個人。這是一個 bug。

找到問題並且解決它。

<Hint>

有錯誤的程式碼位於 `Profile.js` 中。請務必從頭到尾閱讀全部內容！

</Hint>

<Sandpack>

```js Profile.js
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

let currentPerson;

export default function Profile({ person }) {
  currentPerson = person;
  return (
    <Panel>
      <Header />
      <Avatar />
    </Panel>
  )
}

function Header() {
  return <h1>{currentPerson.name}</h1>;
}

function Avatar() {
  return (
    <img
      className="avatar"
      src={getImageUrl(currentPerson)}
      alt={currentPerson.name}
      width={50}
      height={50}
    />
  );
}
```

```js Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Collapse' : 'Expand'}
      </button>
      {open && children}
    </section>
  );
}
```

```js App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  )
}
```

```js utils.js hidden
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
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

<Solution>

問題在於 `Profile` component 修改一個稱為 `currentPerson` 的預先存在的變數，而 `Header` and `Avatar` components 都有讀取這個變數。這導致 *它們三個* 都變得 impure 且難以預測。

要修正這個錯誤，請先刪除 `currentPerson` 變數。並且改成透過 props 將所有資料從 `Profile` 傳送到 `Header` 與 `Avatar`。你會需要會兩個 components 添加一個 `person` prop 並把它一直向下傳遞。

<Sandpack>

```js Profile.js active
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

export default function Profile({ person }) {
  return (
    <Panel>
      <Header person={person} />
      <Avatar person={person} />
    </Panel>
  )
}

function Header({ person }) {
  return <h1>{person.name}</h1>;
}

function Avatar({ person }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={50}
      height={50}
    />
  );
}
```

```js Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Collapse' : 'Expand'}
      </button>
      {open && children}
    </section>
  );
}
```

```js App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  );
}
```

```js utils.js hidden
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
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

請記住， React 不保證 component 函數會以任何特定順序執行，所以你無法透過設置變數在它們之間溝通。所有的溝通都必須透過 props 進行。

</Solution>

#### 修正一個壞掉的故事列表 {/*fix-a-broken-story-tray*/}

你公司的 CEO 要求你將「多個故事」加入線上時鐘應用程式中，而你不能拒絕。你已經編寫了一個 `StoryTray` component，它接受「故事」列表，並會在後面接上一個 "Create Story" 的圖片框。

你透過在作為 props 的 `stories` 陣列後面加上一筆假資料來實作 "Create Story" 的圖片框。但由於某種原因，"Create Story" 出現了不只一次，請解決這個問題。

<Sandpack>

```js StoryTray.js active
export default function StoryTray({ stories }) {
  stories.push({
    id: 'create',
    label: 'Create Story'
  });

  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

</Sandpack>

<Solution>

請注意，每當時鐘更新時，"Create Story" 就會被增加 *兩次* 。這暗示我們在渲染過程中發生了一個變異 -- 嚴格模式調用了兩次 components 使得這個問題更明顯。

`StoryTray` 函數不是純粹的。透過在接收到的 `stories` 陣列（一個 prop ）呼叫 `push` ，它會改變在 `StoryTray` 渲染前就建立的物件。這使得它變得充滿錯誤並且難以預測。

最簡單的修正作法是完全不要修改陣列，只單獨渲染 "Create Story"：

<Sandpack>

```js StoryTray.js active
export default function StoryTray({ stories }) {
  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
      <li>Create Story</li>
    </ul>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

或者，你可以在你推入新的項目前創立一個 _新的_ 陣列（透過複製現有陣列）：

<Sandpack>

```js StoryTray.js active
export default function StoryTray({ stories }) {
  // Copy the array!
  let storiesToDisplay = stories.slice();

  // Does not affect the original array:
  storiesToDisplay.push({
    id: 'create',
    label: 'Create Story'
  });

  return (
    <ul>
      {storiesToDisplay.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

這使得變異能夠保持本地化、並且保持渲染函數純粹。但是你仍然需要小心：舉例來說，如果你嘗試改變陣列中的任何現有項目，你也必須先複製這些項目。

記住陣列中的哪些操作會改變原始陣列、哪些不會是很有用的。例如，`push`、`pop`、`reverse`、以及 `sort` 會改變原始陣列，但是 `slice`、`filter` 以及 `map` 會建立一個新的陣列。

</Solution>

</Challenges>
