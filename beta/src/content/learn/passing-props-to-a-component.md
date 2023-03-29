---
title: 傳遞 Props 到 Component 中
---

<Intro>

React components 使用 *props* 相互通信。每個 parent component 可以通過向 children component 傳遞 props 來傳遞一些信息。 Props 可能讓你想起 HTML attributes，但你可以通過它們傳遞任何 JavaScript 值，包括 object、array 和函式。

</Intro>

<YouWillLearn>

* 如何向 component 傳遞 props
* 如何從 component 中讀取 props
* 如何為 props 指定默認值
* 如何向 component 傳遞一些 JSX
* props 如何隨著時間變化

</YouWillLearn>

## 認識 props {/*familiar-props*/}

Props 是你傳遞給 JSX 標籤的信息。例如，`className`、`src`、`alt`、`width` 和 `height` 是你可以傳遞給 `<img>` 標籤的一些 props：

<Sandpack>

```js
function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/1bX5QH6.jpg"
      alt="Lin Lanying"
      width={100}
      height={100}
    />
  );
}

export default function Profile() {
  return (
    <Avatar />
  );
}
```

```css
body { min-height: 120px; }
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

可以傳遞給 `<img>` 標籤的 props 已被預定義了（ReactDOM 符合 [the HTML standard](https://www.w3.org/TR/html52/semantics-embedded-content.html#the-img-element) 的標準）。但是，你可以向自己的 component（例如 `<Avatar>`）傳遞任何 props 以自定義它們。以下是如何操作：

## 向 Component 傳遞 props {/*passing-props-to-a-component*/}

在這段代碼中，`Profile` component 沒有向它的 child component， `Avatar` 傳遞任何 props：

```js
export default function Profile() {
  return (
    <Avatar />
  );
}
```

你可以通過兩個步驟為 `Avatar` 提供一些 props。

### 第一步：向 child component 傳遞 props {/*step-1-pass-props-to-the-child-component*/}

首先，向 `Avatar` 傳遞一些 props。例如，讓我們傳遞兩個 props：`person`（一個 object）和 `size`（一個 number）：

```js
export default function Profile() {
  return (
    <Avatar
      person={{ name: 'Lin Lanying', imageId: '1bX5QH6' }}
      size={100}
    />
  );
}
```

> 如果 `person=` 後面的雙大括號讓你感到困惑，請記住，[它們只是 JSX 大括號中的一個 object](/learn/javascript-in-jsx-with-curly-braces#using-double-curlies-css-and-other-objects-in-jsx)。

現在，你可以在 `Avatar` component 內部讀取這些 props。

### 第二步：在 child component 中讀取 props {/*step-2-read-props-inside-the-child-component*/}

你可以通過在 `function Avatar` 之後的 `({` 和 `})` 內部用逗號分隔它們的名稱 `person,size` 來讀取這些 props。這使你可以在 `Avatar` 代碼中使用它們，就像使用變數一樣。

```js
function Avatar({ person, size }) {
  // person and size are available here
}
```

為 `Avatar` 添加一些使用 `person` 和 `size` props 進行渲染的邏輯，然後就完成了。

現在，你可以使用不同的 props 配置 `Avatar` 以多種不同的方式進行呈現。試著調整這些值！

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

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

export default function Profile() {
  return (
    <div>
      <Avatar
        size={100}
        person={{ 
          name: 'Katsuko Saruhashi', 
          imageId: 'YfeOqp2'
        }}
      />
      <Avatar
        size={80}
        person={{
          name: 'Aklilu Lemma', 
          imageId: 'OKS67lh'
        }}
      />
      <Avatar
        size={50}
        person={{ 
          name: 'Lin Lanying',
          imageId: '1bX5QH6'
        }}
      />
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
body { min-height: 120px; }
.avatar { margin: 10px; border-radius: 50%; }
```

</Sandpack>

Props 讓你獨立思考 parent 和 child components。例如，你可以在 `Profile` 內部更改 `person` 或 `size`，而無需考慮 `Avatar` 如何使用它們。同樣的，你可以更改 `Avatar` 如何使用這些 props，不必考慮到 `Profile`。

你可以將 props 視為可以調節的“旋鈕”。它們扮演著函式所需的參數的相同角色——實際上，props _就是_ component 唯一的參數！ React component 函式接受一個單獨的參數，一個名為 props 的 object：

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```
通常你不需要整個 `props` object 本身，所以你可以使用解構將其拆分成單個 props 變數。

<Pitfall>

在聲明 props 時，**不要忘記**在 `(` 和 `)` **內部使用一對 `{` 和 `}` 大括號**：

```js
function Avatar({ person, size }) {
  // ...
}
```
此語法稱為 ["destructuring"](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Unpacking_fields_from_objects_passed_as_a_function_parameter) 等同於從函式參數讀取 properties：

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

</Pitfall>

## 為 prop 指定默認值 {/*specifying-a-default-value-for-a-prop*/}

如果你想給一個 prop 一個默認值以在沒有指定值時使用，你可以通過在參數後面放置 `=` 和默認值來實現解構：

```js
function Avatar({ person, size = 100 }) {
  // ...
}
```
現在，如果在沒有 `size` prop 的情況下渲染 `<Avatar person={...} />`，則 `size` 將被設置為 `100`。

默認值僅在缺少 `size` prop 或傳遞 `size={undefined}` 時使用。 但是，如果你傳遞 `size={null}` 或 `size={0}`，默認值將**不**被使用。

## 使用 JSX 展開语法轉發 props {/*forwarding-props-with-the-jsx-spread-syntax*/}

有時，傳遞 props 會變得非常重複：

```js
function Profile({ person, size, isSepia, thickBorder }) {
  return (
    <div className="card">
      <Avatar
        person={person}
        size={size}
        isSepia={isSepia}
        thickBorder={thickBorder}
      />
    </div>
  );
}
```

重複代碼沒有錯——它可以更易讀。 但有時你可能會看重簡潔。 一些 components 將它們的所有 props 轉發給它們的 children component，就像這個 `Profile` 如何處理 `Avatar` 一樣。 因為他們不直接使用他們的任何 props，所以使用更簡潔的”展開“語法是有意義的：

```js
function Profile(props) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
}
```

這將會轉發所有 `Profile` 的 props 給 `Avatar` 而無需列出每個 props 的名字。

**有節制地使用擴展語法。** 如果你在所有其他 component 中都使用它，那就有問題了。 通常，它表示你應該拆分 components 並將 children component 作為 JSX 傳遞。 接下來會詳細介紹！

## 傳遞 JSX 为 children {/*passing-jsx-as-children*/}

嵌套瀏覽器標籤是很常見的：

```js
<div>
  <img />
</div>
```

有時你會希望以相同的方式嵌套自己的 component：

```js
<Card>
  <Avatar />
</Card>
```

當你將內容嵌套在 JSX 標籤中時，parent component 將在名為 children 的 prop 中接收該內容。 例如，下面的 `Card` component 將接收一個為 `<Avatar/>` 的 `children` prop 並將其渲染在被嵌套的 div 中：

<Sandpack>

```js App.js
import Avatar from './Avatar.js';

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

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
```

```js Avatar.js
import { getImageUrl } from './utils.js';

export default function Avatar({ person, size }) {
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

嘗試使用一些文本替換 `<Card>` 中的 `<Avatar>` 以查看 `Card` component 如何包裝任何嵌套內容。 它不需要“知道”其內部渲染的是什麼。 你會在很多地方看到這種靈活的模式。

你可以將擁有 `children` prop 的 component 看作是具有可以由其 parent component 用任意 JSX “填充”的“孔”。你通常會使用 children prop 來創建可視化包裝器，例如面板，網格等。

<Illustration src="/images/docs/illustrations/i_children-prop.png" alt='A puzzle-like Card tile with a slot for "children" pieces like text and Avatar' />

## props 如何隨時間變化 {/*how-props-change-over-time*/}

下面的 `Clock` component 從其 parent component 接收兩個 prop：`顏色` 和 `時間`。 （省略了 parent component 的代碼，因為它使用了我們暫時不會深入探討的 [state](/learn/state-a-components-memory)。）

嘗試在下面的選擇框中更改顏色：

<Sandpack>

```js Clock.js active
export default function Clock({ color, time }) {
  return (
    <h1 style={{ color: color }}>
      {time}
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
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Pick a color:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

這個例子說明了**一個 component 可能會隨著時間的推移接收到不同的 props。** Props 並不總是靜態的！ 在這裡，`time` prop 每秒都在變化，而 `color` prop 會在你選擇另一種顏色時發生變化。 Props 反映 component 在任何時間點的數據，而不僅僅是在開始時。

然而，props 是 [immutable](https://zh.wikipedia.org/wiki/%E4%B8%8D%E5%8F%AF%E8%AE%8A%E7%89%A9%E4%BB%B6)——計算機科學中的一個術語，意思是“不可改變的”。 當 component 需要更改其 props 時（例如，響應用戶交互或新數據），它將不得不“請求”其 parent component 向它傳遞 _不同的 props_ —— 一個新的 object！ 舊的 props 將被丟棄，最終 JavaScript 引擎將回收它們佔用的內存。

**不要試圖“改變 props”。** 當你需要響應用戶輸入（比如改變選擇的顏色）時，你將需要“設置狀態”，你可以在 [State： Component 的記憶。](/learn/state-a-components-memory) 學習。

<Recap>

* 要傳遞 props，將它們添加到 JSX，就像使用 HTML attributes 一樣。
* 要讀取 props，請使用 `function Avatar({ person, size })` 解構語法。
* 你可以指定一個默認值，例如 `size = 100`，用於缺失和 `undefined`  的props。
* 你可以使用 `<Avatar {...props} />` JSX 展開語法轉發所有 props，但不要過度使用它！
* 像 `<Card><Avatar /></Card>` 這樣的嵌套 JSX 將顯示為 `Card` component 的 `children`  props。
* Props 是時間上的只讀快照：每次渲染都會收到一個新版本的 props。
* 你不能改變 props。 當你需要交互時，你需要設置 state。

</Recap>



<Challenges>

#### 提取 component {/*extract-a-component*/}

這個 `Gallery` component 包含兩個非常相似的 profile 標籤。 從中提取一個 `Profile` component 以減少重複。 你需要選擇什麼 props 應該被傳遞。

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <section className="profile">
        <h2>Maria Skłodowska-Curie</h2>
        <img
          className="avatar"
          src={getImageUrl('szV5sdG')}
          alt="Maria Skłodowska-Curie"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>Profession: </b> 
            physicist and chemist
          </li>
          <li>
            <b>Awards: 4 </b> 
            (Nobel Prize in Physics, Nobel Prize in Chemistry, Davy Medal, Matteucci Medal)
          </li>
          <li>
            <b>Discovered: </b>
            polonium (element)
          </li>
        </ul>
      </section>
      <section className="profile">
        <h2>Katsuko Saruhashi</h2>
        <img
          className="avatar"
          src={getImageUrl('YfeOqp2')}
          alt="Katsuko Saruhashi"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>Profession: </b> 
            geochemist
          </li>
          <li>
            <b>Awards: 2 </b> 
            (Miyake Prize for geochemistry, Tanaka Prize)
          </li>
          <li>
            <b>Discovered: </b>
            a method for measuring carbon dioxide in seawater
          </li>
        </ul>
      </section>
    </div>
  );
}
```

```js utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://i.imgur.com/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

<Hint>

首先提取其中一位 scientists 的標籤。 然後在第二個例子中找到不匹配的部分，並使它們可以通過 props 進行配置。

</Hint>

<Solution>

在此解決方案中，`Profile` component 接受多個 props：`imageId`（一個 string）、`name`（一個 string）、`profession`（一個 string）、`awards`（一個 array of string）、`discovery` （一個 string）和 `imageSize`（一個 number）。

請注意，`imageSize` prop 有一個默認值，這就是我們不將其傳遞給 component 的原因。

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

function Profile({
  imageId,
  name,
  profession,
  awards,
  discovery,
  imageSize = 70
}) {
  return (
    <section className="profile">
      <h2>{name}</h2>
      <img
        className="avatar"
        src={getImageUrl(imageId)}
        alt={name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li><b>Profession:</b> {profession}</li>
        <li>
          <b>Awards: {awards.length} </b>
          ({awards.join(', ')})
        </li>
        <li>
          <b>Discovered: </b>
          {discovery}
        </li>
      </ul>
    </section>
  );
}

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <Profile
        imageId="szV5sdG"
        name="Maria Skłodowska-Curie"
        profession="physicist and chemist"
        discovery="polonium (chemical element)"
        awards={[
          'Nobel Prize in Physics',
          'Nobel Prize in Chemistry',
          'Davy Medal',
          'Matteucci Medal'
        ]}
      />
      <Profile
        imageId='YfeOqp2'
        name='Katsuko Saruhashi'
        profession='geochemist'
        discovery="a method for measuring carbon dioxide in seawater"
        awards={[
          'Miyake Prize for geochemistry',
          'Tanaka Prize'
        ]}
      />
    </div>
  );
}
```

```js utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://i.imgur.com/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

請注意，如果 `awards` 是 array，則不需要單獨的 `awardCount` prop。 然後你可以使用 `awards.length` 來統計獎勵的數量。 請記住，props 可以接受任何值，這也包括 array！

另一種解決方案，與本頁前面的示例更相似，是將關於一個人的所有信息包含到單個 object 中，並將該 object 作為一個 prop 傳遞：

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

function Profile({ person, imageSize = 70 }) {
  const imageSrc = getImageUrl(person)

  return (
    <section className="profile">
      <h2>{person.name}</h2>
      <img
        className="avatar"
        src={imageSrc}
        alt={person.name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li>
          <b>Profession:</b> {person.profession}
        </li>
        <li>
          <b>Awards: {person.awards.length} </b>
          ({person.awards.join(', ')})
        </li>
        <li>
          <b>Discovered: </b>
          {person.discovery}
        </li>
      </ul>
    </section>
  )
}

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <Profile person={{
        imageId: 'szV5sdG',
        name: 'Maria Skłodowska-Curie',
        profession: 'physicist and chemist',
        discovery: 'polonium (chemical element)',
        awards: [
          'Nobel Prize in Physics',
          'Nobel Prize in Chemistry',
          'Davy Medal',
          'Matteucci Medal'
        ],
      }} />
      <Profile person={{
        imageId: 'YfeOqp2',
        name: 'Katsuko Saruhashi',
        profession: 'geochemist',
        discovery: 'a method for measuring carbon dioxide in seawater',
        awards: [
          'Miyake Prize for geochemistry',
          'Tanaka Prize'
        ],
      }} />
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
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

雖然語法看起來略有不同，因為你描述的是 JavaScript object 的 properties 而不是 JSX attributes 的集合，但這些示例大部分是等效的，你可以選擇任何一種方法。

</Solution>

#### 根據 prop 調整圖像大小 {/*adjust-the-image-size-based-on-a-prop*/}

在這個例子中，`Avatar` 收到一個數字 `size` prop，它決定了 `<img>` 的寬度和高度。 在此示例中，`size` properties 設置為 `40`。 但是，如果你在新標籤中打開圖像，你會注意到圖像本身更大（`160` 像素）。 實際圖像大小取決於你請求的縮略圖大小。

更改 `Avatar` component 以根據 `size` prop 請求最接近的圖像尺寸。 具體來說，如果 `size` 小於 `90`，則將 `s`（“small”）而不是 `b`（“big”）傳遞給 `getImageUrl` 函式。 通過使用不同值的 `size` prop 渲染頭像並在新標籤中打開圖像來驗證你的更改是否有效。

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person, 'b')}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <Avatar
      size={40}
      person={{ 
        name: 'Gregorio Y. Zara', 
        imageId: '7vQD0fP'
      }}
    />
  );
}
```

```js utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

<Solution>

以下是你可以採取的方法：

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <>
      <Avatar
        size={40}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

你還可以通過 [`window.devicePixelRatio`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/devicePixelRatio) 來為高 DPI 的屏幕顯示更清晰的圖像：

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

const ratio = window.devicePixelRatio;

function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size * ratio > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <>
      <Avatar
        size={40}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={70}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

Props 讓你可以將這樣的邏輯封裝在 `Avatar` component 中（如果需要，稍後可以更改它），這樣每個人使用 `<Avatar>` component 时，無需考慮如何請求圖像和調整圖像大小。

</Solution>

#### 在 `children` prop 中傳遞 JSX {/*passing-jsx-in-a-children-prop*/}

從下面的標籤中提取一個 `Card` component，並使用 `children` 屬性將不同的 JSX 傳遞給它：

<Sandpack>

```js
export default function Profile() {
  return (
    <div>
      <div className="card">
        <div className="card-content">
          <h1>Photo</h1>
          <img
            className="avatar"
            src="https://i.imgur.com/OKS67lhm.jpg"
            alt="Aklilu Lemma"
            width={70}
            height={70}
          />
        </div>
      </div>
      <div className="card">
        <div className="card-content">
          <h1>About</h1>
          <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
        </div>
      </div>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

<Hint>

你放入 component 標籤內的任何 JSX 都將作為 children prop 傳遞給該 component。

</Hint>

<Solution>

這是如何在兩個地方使用 `Card` component 的方法：

<Sandpack>

```js
function Card({ children }) {
  return (
    <div className="card">
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card>
        <h1>Photo</h1>
        <img
          className="avatar"
          src="https://i.imgur.com/OKS67lhm.jpg"
          alt="Aklilu Lemma"
          width={100}
          height={100}
        />
      </Card>
      <Card>
        <h1>About</h1>
        <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
      </Card>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

如果你希望每個 `Card` 總是擁有一個標題，你也可以將 `title` 設為一個單獨的 prop：

<Sandpack>

```js
function Card({ children, title }) {
  return (
    <div className="card">
      <div className="card-content">
        <h1>{title}</h1>
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card title="Photo">
        <img
          className="avatar"
          src="https://i.imgur.com/OKS67lhm.jpg"
          alt="Aklilu Lemma"
          width={100}
          height={100}
        />
      </Card>
      <Card title="About">
        <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
      </Card>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

</Solution>

</Challenges>
