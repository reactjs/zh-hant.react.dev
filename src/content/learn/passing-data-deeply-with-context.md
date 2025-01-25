---
title: 使用 Context 深層傳遞參數
---

<Intro>

大多數情況下，你會通過 props 將信息從 parent component 傳遞給 child component。但是，如果你必須通過許多中間 component 向下傳遞 props，或者是在你應用的許多 component  中需要傳遞相同的信息，傳遞props會變得冗長和不便。 *Context* 不需要通過 props 顯示傳遞，它允許 parent component 向其下層的無論多深的任意 component 傳遞信息，

</Intro>

<YouWillLearn>

- 什麼是「prop 逐級傳遞」
- 如何使用 context 替代重複的參數傳遞
- Context 的常見用法
- Context 的常用代替方案

</YouWillLearn>

## 傳遞 props 帶來的問題 {/*the-problem-with-passing-props*/}

[傳遞 props](/learn/passing-props-to-a-component) 是一種將數據通過 UI 樹顯式傳遞到使用它的 component  的好方法。

但是當你需要在 tree 中深層傳遞參數以及需要在 component 間複用相同的參數時，傳遞 props 就會變得冗長且不便。最近的共同祖先可能離需要數據的 component 很遠，[state 提升](/learn/sharing-state-between-components)至過高的層級會導致「prop 逐級傳遞」的情況。

<DiagramGroup>

<Diagram name="passing_data_lifting_state" height={160} width={608} captionPosition="top" alt="Diagram with a tree of three components. The parent contains a bubble representing a value highlighted in purple. The value flows down to each of the two children, both highlighted in purple." >

state 提升

</Diagram>
<Diagram name="passing_data_prop_drilling" height={430} width={608} captionPosition="top" alt="Diagram with a tree of ten nodes, each node with two children or less. The root node contains a bubble representing a value highlighted in purple. The value flows down through the two children, each of which pass the value but do not contain it. The left child passes the value down to two children which are both highlighted purple. The right child of the root passes the value through to one of its two children - the right one, which is highlighted purple. That child passed the value through its single child, which passes it down to both of its two children, which are highlighted purple.">

Prop 逐級傳遞

</Diagram>

</DiagramGroup>

要是有一種方法能夠在 tree 中「直傳」數據到所需的 component  還不用通過 props，可就太好了。React 的 context 功能可以做到。  

## Context: 傳遞 props 的另一種方法 {/*context-an-alternative-to-passing-props*/}

Context 讓 parent component 可以為它下面的整個 tree 提供數據。Context 有很多種用途。這有一個示例。思考一下這個 `Heading`  component  接收一個 `level` 參數決定它標題尺寸的場景:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Heading level={2}>Heading</Heading>
      <Heading level={3}>Sub-heading</Heading>
      <Heading level={4}>Sub-sub-heading</Heading>
      <Heading level={5}>Sub-sub-sub-heading</Heading>
      <Heading level={6}>Sub-sub-sub-sub-heading</Heading>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

假如你想讓相同 `Section` 中的多個 Heading 總是有相同的尺寸:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Section>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Section>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Section>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

現在，你將 `level` 參數分別傳遞給每個 `<Heading>`:

```js
<Section>
  <Heading level={3}>About</Heading>
  <Heading level={3}>Photos</Heading>
  <Heading level={3}>Videos</Heading>
</Section>
```

將 `level` 參數傳遞給 `<Section>` component  而不是傳給 `<Heading>` component  ，會看起來更好一些。這樣的話你可以強制使同一個 section 中的所有標題都有相同的尺寸:

```js
<Section level={3}>
  <Heading>About</Heading>
  <Heading>Photos</Heading>
  <Heading>Videos</Heading>
</Section>
```

但是 `<Heading>` component 是如何知道離它最近的 `<Section>` 的 level 的呢？**這需要 child 可以通過某種方式「訪問」到 tree 中某處在其上層的數據。**

你不能只通過 props 來實現它。這就是 context 大展身手的地方。你可以通過以下三個步驟實現它:

1. **創建** 一個 context。 (你可以呼叫它為 `LevelContext`, 因為它表示的是標題級別。)
2. 在需要數據的 component  內 **使用** 剛剛創建的 context。(`Heading` 將會使用 `LevelContext`。)
3. 在指定數據的 component  中 **提供** 這個 context(`Section` 將會提供 `LevelContext`。)

Context 可以讓 parent，甚至是很遠的一個都可以為其內部的整個 tree 提供數據。

<DiagramGroup>

<Diagram name="passing_data_context_close" height={160} width={608} captionPosition="top" alt="Diagram with a tree of three components. The parent contains a bubble representing a value highlighted in orange which projects down to the two children, each highlighted in orange." >

同級 child component  使用 context

</Diagram>

<Diagram name="passing_data_context_far" height={430} width={608} captionPosition="top" alt="Diagram with a tree of ten nodes, each node with two children or less. The root parent node contains a bubble representing a value highlighted in orange. The value projects down directly to four leaves and one intermediate component in the tree, which are all highlighted in orange. None of the other intermediate components are highlighted.">

遠親 component  使用 context

</Diagram>

</DiagramGroup>

### Step 1: 創建 context {/*step-1-create-the-context*/}

首先, 你需要創建這個 context. 你需要將其 **從一個文件中 export** 來讓你的 component  可以使用它:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Section>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Section>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Section>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js active
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

`createContext` 只需要 _default_ value。 這裡，`1` 代表最大的標題級別，但是你可以傳遞任何類型的 value（甚至是一個對象）。你將在下一個步驟中見識到 default value 的意義。

### Step 2: Use the context {/*step-2-use-the-context*/}

從 React 中引入 `useContext` Hook 以及你剛剛創建的 context:

```js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';
```

現在，`Heading` component 從 props 中讀取 `level`:

```js
export default function Heading({ level, children }) {
  // ...
}
```

然後，刪除 `level` 參數並從你剛剛引入的 `LevelContext` 中讀取值:

```js {2}
export default function Heading({ children }) {
  const level = useContext(LevelContext);
  // ...
}
```

`useContext` 是一個 Hook。 就像 `useState` 和 `useReducer` 一樣， 你只能在 React component  中（不是循環或者條件裡）立即調用 Hook。 **`useContext` 告訴 React `Heading` component  想要讀取 `LevelContext`。**

現在 `Heading` component  中沒有 `level` 參數， 你不再需要像這樣在你的 JSX 中將 level 參數傳遞給 `Heading`:

```js
<Section>
  <Heading level={4}>Sub-sub-heading</Heading>
  <Heading level={4}>Sub-sub-heading</Heading>
  <Heading level={4}>Sub-sub-heading</Heading>
</Section>
```

更新一下 JSX 來讓 `Section` component  可以接收 level 參數:

```jsx
<Section level={4}>
  <Heading>Sub-sub-heading</Heading>
  <Heading>Sub-sub-heading</Heading>
  <Heading>Sub-sub-heading</Heading>
</Section>
```

提醒一下，這是你使得代碼能正常運行的必備步驟:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Title</Heading>
      <Section level={2}>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section level={3}>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section level={4}>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

注意，這個示例還不能運行！所有的 headings 的尺寸都一樣，因為 **哪怕你正在 *使用* context， 你也還沒 *提供* 它。** React 不知道從哪獲取這個 context!

如果你不提供 context， React 將會使用你在上一步指定的默認值。在這個例子中，你將參數 `1` 傳遞給了 `createContext`，因此 `useContext(LevelContext)` 會 return `1`，同時把所有的標題都設置為 `<h1>`。我们可以通过让每个 `Section` 提供它自己的 context 来修复这个问题。

### Step 3: 提供 context {/*step-3-provide-the-context*/}

`Section`component 目前渲染傳入它的 child component:

```js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

**用一個 context provider 把它们包裹起来** 便可以提供 `LevelContext` 給它們:

```js {1,6,8}
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext.Provider value={level}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

這會告訴 React:「如果在 `<Section>` component  中的任何 child component  請求 `LevelContext`，給它們這個 `level`。」 component  會使用 UI 樹中在它上層最近的那個 `<LevelContext.Provider>` 傳遞過來的值。

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Title</Heading>
      <Section level={2}>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section level={3}>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section level={4}>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext.Provider value={level}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

這與原始代碼的運行結果是相同的，但是你不需要傳遞 `level` 參數給每一個 `Heading` component  了！取而代之, 它通過訪問上層最近的 `Section` 來「斷定」它的標題級別:

1. 你將一個 `level` 參數傳給 `<Section>`。
2. `Section` 把它的 children 包裹在 `<LevelContext.Provider value={level}>` 中。
3. `Heading` 使用 `useContext(LevelContext)` 訪問上層最近的 `LevelContext` 提供的值。

## 在相同的组件中使用并提供 context {/*using-and-providing-context-from-the-same-component*/}

現在，你仍需要手動指定每個 section 的 `level`:

```js
export default function Page() {
  return (
    <Section level={1}>
      ...
      <Section level={2}>
        ...
        <Section level={3}>
          ...
```

由於 context 讓你可以從上層的 component  中讀取信息，每個 `Section` 都會從上層的 `Section` 讀取 `level`，並自動向下層傳遞 `level + 1`。你可以像下面這樣做。

```js src/Section.js {5,8}
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

這樣修改後，你不需要將 `level` 參數傳給 `<Section>` *或者是* `<Heading>` 了:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Title</Heading>
      <Section>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

現在，`Heading` 和 `Section` 都通過讀取 `LevelContext` 來判斷它們「深度」。並且 `Section` 把它的 child component  都包裹在 `LevelContext` 中來指定其中的任何內容都處於一個「更深」的級別。

<Note>

該示例使用標題級別來說明，是因為它們直觀地顯示了嵌套 component  是如何覆蓋 context。但是 context 對於許多其他場景也很有用。你可以用它來傳遞整個字數需要的任何信息: 當前的顏色主題、當前的登錄用戶等。

</Note>

## Context 能穿過中間層級的 component {/*context-passes-through-intermediate-components*/}

你可以在提供 context 的 component 和使用它的 component 之間的層級插入任意數量的 component 。這包括像 `<div>` 這樣的內置 component 和你自己創建的 component 。

該實例中，相同的 `Post`  component （帶有虛線邊框）在兩個不同的嵌套層級上渲染。注意，它內部的 `<Heading>` 會自動從最近的 `<Section>` 獲取它的級別:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function ProfilePage() {
  return (
    <Section>
      <Heading>My Profile</Heading>
      <Post
        title="Hello traveller!"
        body="Read about my adventures."
      />
      <AllPosts />
    </Section>
  );
}

function AllPosts() {
  return (
    <Section>
      <Heading>Posts</Heading>
      <RecentPosts />
    </Section>
  );
}

function RecentPosts() {
  return (
    <Section>
      <Heading>Recent Posts</Heading>
      <Post
        title="Flavors of Lisbon"
        body="...those pastéis de nata!"
      />
      <Post
        title="Buenos Aires in the rhythm of tango"
        body="I loved it!"
      />
    </Section>
  );
}

function Post({ title, body }) {
  return (
    <Section isFancy={true}>
      <Heading>
        {title}
      </Heading>
      <p><i>{body}</i></p>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children, isFancy }) {
  const level = useContext(LevelContext);
  return (
    <section className={
      'section ' +
      (isFancy ? 'fancy' : '')
    }>
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}

.fancy {
  border: 4px dashed pink;
}
```

</Sandpack>

你不需要做任何特殊的操作。`Section` 為它內部的樹指定了一個 context，所以你可以在任何地方插入一個 `<Heading>`，並且它會有正確的尺寸。在上邊的 sandbox 嘗試下！

**Context 讓你可以編寫「適應周圍的環境」的 component，並且根據 _在哪_ （或者說，_在哪個 context 中_）來渲染它們不同的樣子。**

Context 的工作方式可能會讓你想起[CSS 屬性繼承](https://developer.mozilla.org/en-US/docs/Web/CSS/inheritance) 在 CSS， 你可以指定 `color: blue` 給一個 `<div>`， 並且在其中的任意 DOM node，無論多深，都會繼承那個顏色，除非中間的其他 DOM node用 `color: green` 覆蓋它。類似地，在 React 中，覆蓋來自上層的某些 Context 的唯一方法時間 child component  包裹到一個提供不同值的 context provider 中。

在 CSS 中，不同屬性的 `color` 和 `background-color` 不會彼此覆蓋。你可以設置所有的 `<div>` 都為 `color` 紅色，還不會影響 `background-color`。類似地， **不同的 React context 不會彼此覆蓋。** 你用 `createContext()` 創建的每個 context 都和其他 context 完全分離，只有使用和提供 *那個特定的* context 才會聯繫到一起。一個 component 可以毫無問題地使用或者是提供不同的 context。

## 在你使用 context 之前 {/*before-you-use-context*/}

使用 Context 看起來非常誘人！然而，這也意味著它很容易被過度使用。 **若你只是想將一些 props 逐層傳遞多個層級，這並不意味著你需要把這些信息放到 context 中。**

在你使用 context 之前，這裡有一些可供你選擇的代替方案:

1. **從 [傳遞 props 開始。](/learn/passing-props-to-a-component)** 如果你的 component 看起來不起眼，那麼通過十幾個 component 向下傳遞一堆 props 並不少見。這有點像是在埋頭苦幹，但是這樣做可以讓哪些 component 用了哪些數據變得十分清晰！維護你代碼的人會很高興你用 props 傳遞數據，這會讓數據流變得更加清晰。
2. **抽象 component 並 [把 JSX 作為 `children`](/learn/passing-props-to-a-component#passing-jsx-as-children) 傳給它們。** 如果你通過很多層不使用該數據的中間 component （並且只會向下傳遞）來傳遞數據。舉個例子，你可能想把一些像 `posts` 的 props 數據傳遞到不會直接使用這個參數的 component，比如說 `<Layout posts={posts} />`。更好的方式是，讓 `Layout` 把 `children` 當做一個參數，然後渲染 `<Layout><Posts posts={posts} /></Layout>`。這樣就減少了定義數據的 component 和使用數據的 component 之間的層級。

如果這兩種替代方案都不適合你，再考慮使用 context。

## Context 的使用場景 {/*use-cases-for-context*/}

* **主題:** 如果你的應用允許用戶更改其外觀（例如 dark mode），你可以在應用頂層定義一個 context provider，並在需要調整其外觀的 component 中使用該 context。
* **當前賬戶:** 許多 component 可能需要知道當前登錄的用戶信息。把它放到 context 中可以方便在樹中任何為止讀取它。某些應用還允許你同時操作多個賬戶（例如，以不同用戶的身份發表評論）。在這些情況下，將 UI 的一部分包裹到具有不同賬戶數據的 provider 中會很方便。
* **路由:** 大多數路由解決方案在其內部使用 context 來保存當前路由。這就是每個鏈接「知道」它是否處於活動狀態的方式。如果你創建自己的路由，你可能也會這麼做。
* **state 管理:** 隨著你的應用的開發，最終在靠近應用頂部的為止可能會有很多 state。許多遙遠的下層 component 可能想要修改它們。通常 [將 reducer 與 context 搭配使用](/learn/scaling-up-with-reducer-and-context) 來管理複雜的 state 並將其傳遞給深層的 component 來避免過多的麻煩。
  
Context 不局限於靜態值。如果你在下一次渲染時傳遞不同的值，React 將會更新所有讀取它的下層 component ！這就是 context 經常和 state 結合使用的原因。

通常來說，如果樹中不同部分的遠距離 component 需要傳遞某些信息，使用 context 是一個很好的選擇。

<Recap>

* Context 讓一個 component 向其下整個樹的 component 提供信息。
* 傳遞 context 的步驟:
  1. 通過 `export const MyContext = createContext(defaultValue)` 創建並 export  context。
  2. 在無論層級多深的任何 child component  中，把 context 傳遞給 `useContext(MyContext)` Hook 來讀取它。
  3. 在 parent 中把 children 包裹在 `<MyContext.Provider value={...}>` 中來提供 context。
* Context 會穿過在中間的所有 component。
* Context 讓你寫出「適應周圍環境的」 component。
* 在你使用 context 之前，先嘗試下傳遞 props 或者將 JSX 作為 `children` 傳遞。

</Recap>

<Challenges>

#### 用 context 代替 prop 逐級傳遞 {/*replace-prop-drilling-with-context*/}

該示例中，切換復選框狀態會修改傳入的每個 `<PlaceImage>` 的 `imageSize` 參數。復選框的 state 保存在頂層的 `App` component 中，但每個 `<PlaceImage>` 都需要注意它。

现在， `App` 将 `imageSize` 傳遞給 `List`，再將其傳遞給每個 `Place`，`Place` 又將其傳遞給 `PlaceImage`。刪除 `imageSize` 參數，然後在 `App` component 中直接將其傳遞給 `PlaceImage`。

你可以在 `Context.js` 中聲明 context。

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        Use large images
      </label>
      <hr />
      <List imageSize={imageSize} />
    </>
  )
}

function List({ imageSize }) {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place
        place={place}
        imageSize={imageSize}
      />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place, imageSize }) {
  return (
    <>
      <PlaceImage
        place={place}
        imageSize={imageSize}
      />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place, imageSize }) {
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```

```js src/Context.js

```

```js src/data.js
export const places = [{
  id: 0,
  name: 'Bo-Kaap in Cape Town, South Africa',
  description: 'The tradition of choosing bright colors for houses began in the late 20th century.',
  imageId: 'K9HVAGH'
}, {
  id: 1, 
  name: 'Rainbow Village in Taichung, Taiwan',
  description: 'To save the houses from demolition, Huang Yung-Fu, a local resident, painted all 1,200 of them in 1924.',
  imageId: '9EAYZrt'
}, {
  id: 2, 
  name: 'Macromural de Pachuca, Mexico',
  description: 'One of the largest murals in the world covering homes in a hillside neighborhood.',
  imageId: 'DgXHVwu'
}, {
  id: 3, 
  name: 'Selarón Staircase in Rio de Janeiro, Brazil',
  description: 'This landmark was created by Jorge Selarón, a Chilean-born artist, as a "tribute to the Brazilian people."',
  imageId: 'aeO3rpI'
}, {
  id: 4, 
  name: 'Burano, Italy',
  description: 'The houses are painted following a specific color system dating back to 16th century.',
  imageId: 'kxsph5C'
}, {
  id: 5, 
  name: 'Chefchaouen, Marocco',
  description: 'There are a few theories on why the houses are painted blue, including that the color repels mosquitos or that it symbolizes sky and heaven.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Gamcheon Culture Village in Busan, South Korea',
  description: 'In 2009, the village was converted into a cultural hub by painting the houses and featuring exhibitions and art installations.',
  imageId: 'ZfQOOzf'
}];
```

```js src/utils.js
export function getImageUrl(place) {
  return (
    'https://i.imgur.com/' +
    place.imageId +
    'l.jpg'
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
```

</Sandpack>

<Solution>

Remove `imageSize` prop from all the components.

Create and export `ImageSizeContext` from `Context.js`. Then wrap the List into `<ImageSizeContext.Provider value={imageSize}>` to pass the value down, and `useContext(ImageSizeContext)` to read it in the `PlaceImage`:

<Sandpack>

```js src/App.js
import { useState, useContext } from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';
import { ImageSizeContext } from './Context.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <ImageSizeContext.Provider
      value={imageSize}
    >
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        Use large images
      </label>
      <hr />
      <List />
    </ImageSizeContext.Provider>
  )
}

function List() {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place place={place} />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place }) {
  return (
    <>
      <PlaceImage place={place} />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place }) {
  const imageSize = useContext(ImageSizeContext);
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```

```js src/Context.js
import { createContext } from 'react';

export const ImageSizeContext = createContext(500);
```

```js src/data.js
export const places = [{
  id: 0,
  name: 'Bo-Kaap in Cape Town, South Africa',
  description: 'The tradition of choosing bright colors for houses began in the late 20th century.',
  imageId: 'K9HVAGH'
}, {
  id: 1, 
  name: 'Rainbow Village in Taichung, Taiwan',
  description: 'To save the houses from demolition, Huang Yung-Fu, a local resident, painted all 1,200 of them in 1924.',
  imageId: '9EAYZrt'
}, {
  id: 2, 
  name: 'Macromural de Pachuca, Mexico',
  description: 'One of the largest murals in the world covering homes in a hillside neighborhood.',
  imageId: 'DgXHVwu'
}, {
  id: 3, 
  name: 'Selarón Staircase in Rio de Janeiro, Brazil',
  description: 'This landmark was created by Jorge Selarón, a Chilean-born artist, as a "tribute to the Brazilian people".',
  imageId: 'aeO3rpI'
}, {
  id: 4, 
  name: 'Burano, Italy',
  description: 'The houses are painted following a specific color system dating back to 16th century.',
  imageId: 'kxsph5C'
}, {
  id: 5, 
  name: 'Chefchaouen, Marocco',
  description: 'There are a few theories on why the houses are painted blue, including that the color repels mosquitos or that it symbolizes sky and heaven.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Gamcheon Culture Village in Busan, South Korea',
  description: 'In 2009, the village was converted into a cultural hub by painting the houses and featuring exhibitions and art installations.',
  imageId: 'ZfQOOzf'
}];
```

```js src/utils.js
export function getImageUrl(place) {
  return (
    'https://i.imgur.com/' +
    place.imageId +
    'l.jpg'
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
```

</Sandpack>

注意，中間的 component 不再需要傳遞 `imageSize`。

</Solution>

</Challenges>
