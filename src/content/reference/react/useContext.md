---
title: useContext
---

<Intro>

`useContext` 是一個 React Hook，讓你從元件中讀取和訂閱（subscribe） [context](/learn/passing-data-deeply-with-context)。

```js
const value = useContext(SomeContext)
```

</Intro>

<InlineToc />

---

## 參考 {/*reference*/}

### `useContext(SomeContext)` {/*usecontext*/}

在元件的頂層呼叫 `useContext` 以讀取和訂閱 [context](/learn/passing-data-deeply-with-context)。

```js
import { useContext } from 'react';

function MyComponent() {
  const theme = useContext(ThemeContext);
  // ...
```

[往下查看更多範例。](#usage)

#### 參數 {/*parameters*/}

* `SomeContext`: 你已經預先用 [`createContext`](/reference/react/createContext) 創建的 context。這個 context 本身不儲存資訊，只代表元件可以提供或讀取的資訊種類。

#### 回傳值 {/*returns*/}

`useContext` 會回傳呼叫元件的 context 值。這個值是由元件樹中距離呼叫元件上方最近的 `SomeContext`，所傳入的 `value` 來決定。如果沒有像這樣的 provider，回傳值就會是你在建立這個 context 時，傳入 [`createContext`](/reference/react/createContext) 的 `defaultValue`。回傳值總是最新的。如果 context 發生變化，React 會自動重新渲染（re-render）讀取這些 context 的元件。

#### 注意事項 {/*caveats*/}

* 元件中所呼叫的 `useContext()` 並不會被 *同一個* 元件所回傳的 provider 影響。對應的 `<Context>` **必須位於呼叫 `useContext()` 的元件 *上方***。
* React 會 **自動重新渲染** 所有使用特定 context 並從 provider 接收不同 `value` 的子元件。渲染之前和之後的值會用 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 來作比較。用 [`memo`](/reference/react/memo) 跳過重新渲染，並不能阻止子元件接收 context 的新值。
* 如果你建置（build）的系統在輸出過程中產生重複的模組（可能會發生在符號連結（symlink）），會破壞 context。只在當用來提供 context 的 `SomeContext`  與用來讀取它的 `SomeContext` 是 ***完全* 相同的物件** 時，透過 context 傳遞資料才會正常運作，這是由 `===` 的比較所決定。

---

## 使用 {/*usage*/}

### 將資料傳入元件樹的深處 {/*passing-data-deeply-into-the-tree*/}

在元件的頂層呼叫 `useContext` 以讀取和訂閱 [context](/learn/passing-data-deeply-with-context)。

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { useContext } from 'react';

function Button() {
  const theme = useContext(ThemeContext);
  // ... 
```

`useContext` 針對你傳入的 <CodeStep step={1}>context</CodeStep> 回傳 <CodeStep step={2}>context 值</CodeStep>。為了決定 context 值，React 搜尋元件樹，並尋找針對這個 context，**上方距離最近的 context provider**。

要傳入 context 給 `Button` 的話，在它或其中一個父元件外，包上一層對應的 context provider：

```js [[1, 3, "ThemeContext"], [2, 3, "\\"dark\\""], [1, 5, "ThemeContext"]]
function MyPage() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  );
}

function Form() {
  // ⋯⋯在這之中渲染按鈕⋯⋯
}
```

Provider 和 `Button` 之間有幾層元件並不重要。當在 `Form` 以內不管在哪裡的 `Button` 呼叫 `useContext(ThemeContext)`，就會收到 `"dark"` 作為 context 的值。

<Pitfall>

`useContext()` 必定尋找呼叫元件 *上方* 最近的 provider。它只會往上搜尋，**不會考慮** 你從 provider 下的哪一個元件呼叫 `useContext()`。

</Pitfall>

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}

function Form() {
  return (
    <Panel title="歡迎">
      <Button>註冊</Button>
      <Button>登入</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

---

### 以 context 更新傳遞的資料 {/*updating-data-passed-via-context*/}

通常，你會希望 context 隨著時間變化。要更新 context 的話，搭配使用 context 和 [state](/reference/react/useState)。在父元件宣告一個狀態變數，並將當前狀態作為 <CodeStep step={2}>context 的值</CodeStep> 向下傳遞給 provider。

```js {2} [[1, 4, "ThemeContext"], [2, 4, "theme"], [1, 11, "ThemeContext"]]
function MyPage() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext value={theme}>
      <Form />
      <Button onClick={() => {
        setTheme('light');
      }}>
        切換到 light 主題
      </Button>
    </ThemeContext>
  );
}
```

現在 provider 中的任何 `Button` 都會收到當前的 `theme` 的值。如果呼叫 `setTheme` 來更新你傳給 provider 的 `theme` 值，所有的 `Button` 元件都會以新的 `'light'` 值，重新渲染。

<Recipes titleText="更新 context 的範例" titleId="examples-basic">

#### 以 context 更新數值 {/*updating-a-value-via-context*/}

在這個範例中，`MyApp` 元件有一個在稍候會傳給 `ThemeContext` provider 的狀態變數。試著改變「Dark 模式」核取方塊來更新狀態。改變提供的值，會讓所有使用這個 context 的元件重新渲染。

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext value={theme}>
      <Form />
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light')
          }}
        />
        使用 dark 模式
      </label>
    </ThemeContext>
  )
}

function Form({ children }) {
  return (
    <Panel title="歡迎">
      <Button>註冊</Button>
      <Button>登入</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

現在 `value="dark"` 傳入 `"dark"` 字串，但 `value={theme}` 是以 [JSX 花括號（curly brace）](/learn/javascript-in-jsx-with-curly-braces) 傳入 JavaScript 的 `theme` 變數。花括號可以讓你傳入非字串的 context 值。

<Solution />

#### 以 context 更新物件 {/*updating-an-object-via-context*/}

在這個範例中，`currentUser` 狀態變數中有一個物件。你把 `{ currentUser, setCurrentUser }` 組合成單一個物件，並在 `value={}` 中向下傳遞。這會讓下方像是 `LoginButton` 這樣的任何一個元件，同時讀取 `currentUser` 和 `setCurrentUser`，並在需要的時候呼叫 `setCurrentUser`。

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <CurrentUserContext
      value={{
        currentUser,
        setCurrentUser
      }}
    >
      <Form />
    </CurrentUserContext>
  );
}

function Form({ children }) {
  return (
    <Panel title="歡迎">
      <LoginButton />
    </Panel>
  );
}

function LoginButton() {
  const {
    currentUser,
    setCurrentUser
  } = useContext(CurrentUserContext);

  if (currentUser !== null) {
    return <p>你已登入為 {currentUser.name} 。</p>;
  }

  return (
    <Button onClick={() => {
      setCurrentUser({ name: 'Advika' })
    }}>以 Advika 登入</Button>
  );
}

function Panel({ title, children }) {
  return (
    <section className="panel">
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}

.button {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}
```

</Sandpack>

<Solution />

#### 多個 contexts {/*multiple-contexts*/}

在這個範例中，有兩個相互獨立的 context。`ThemeContext` 提供當前的主題，為字串；而 `CurrentUserContext` 中是一個代表目前使用者的物件。

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext value={theme}>
      <CurrentUserContext
        value={{
          currentUser,
          setCurrentUser
        }}
      >
        <WelcomePanel />
        <label>
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={(e) => {
              setTheme(e.target.checked ? 'dark' : 'light')
            }}
          />
          使用 dark 模式
        </label>
      </CurrentUserContext>
    </ThemeContext>
  )
}

function WelcomePanel({ children }) {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <Panel title="歡迎">
      {currentUser !== null ?
        <Greeting /> :
        <LoginForm />
      }
    </Panel>
  );
}

function Greeting() {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <p>你已登入為 {currentUser.name} 。</p>
  )
}

function LoginForm() {
  const {setCurrentUser} = useContext(CurrentUserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const canLogin = firstName.trim() !== '' && lastName.trim() !== '';
  return (
    <>
      <label>
        名字{'：'}
        <input
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        姓氏{'：'}
        <input
        required
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </label>
      <Button
        disabled={!canLogin}
        onClick={() => {
          setCurrentUser({
            name: firstName + ' ' + lastName
          });
        }}
      >
        Log in
      </Button>
      {!canLogin && <i>兩個欄位均須填寫。</i>}
    </>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, disabled, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### 將 provider 抽成元件 {/*extracting-providers-to-a-component*/}

隨著應用程式成長，在應用程式的根部（root）附近，會形成一座由 context 組成的「金字塔」。這沒什麼問題。不過，如果你在美感上不喜歡這種嵌套結構，可以將 provider 抽成單一的元件。在這個範例中，`MyProviders` 藏起「管線（plumbing）」，並以必要的 provider 渲染傳入的子元件。注意 `theme` 和 `setTheme` 狀態是 `MyApp` 本身必須的，所以 `MyApp` 仍然擁有部分的狀態。

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <MyProviders theme={theme} setTheme={setTheme}>
      <WelcomePanel />
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light')
          }}
        />
        使用 dark 模式
      </label>
    </MyProviders>
  );
}

function MyProviders({ children, theme, setTheme }) {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext value={theme}>
      <CurrentUserContext
        value={{
          currentUser,
          setCurrentUser
        }}
      >
        {children}
      </CurrentUserContext>
    </ThemeContext>
  );
}

function WelcomePanel({ children }) {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <Panel title="歡迎">
      {currentUser !== null ?
        <Greeting /> :
        <LoginForm />
      }
    </Panel>
  );
}

function Greeting() {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <p>你已登入為 {currentUser.name} 。</p>
  )
}

function LoginForm() {
  const {setCurrentUser} = useContext(CurrentUserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const canLogin = firstName !== '' && lastName !== '';
  return (
    <>
      <label>
        名字{': '}
        <input
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        姓氏{'：'}
        <input
        required
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </label>
      <Button
        disabled={!canLogin}
        onClick={() => {
          setCurrentUser({
            name: firstName + ' ' + lastName
          });
        }}
      >
        Log in
      </Button>
      {!canLogin && <i>兩個欄位均須填寫。</i>}
    </>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, disabled, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### 使用 reducer 和 context 擴充應用程式 {/*scaling-up-with-context-and-a-reducer*/}

在大型應用程式中，常常會搭配使用 context 和 [reducer](/reference/react/useReducer) ，將某些與狀態相關的邏輯抽到元件外。在這個範例中，所有的「串接（wiring）」都被藏進 `TasksContext.js`，包含一個 reducer 和兩個分別的 contexts。

閱讀這個範例的[完整演練](/learn/scaling-up-with-reducer-and-context)。

<Sandpack>

```js src/App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>放假去京都</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}
```

```js src/TasksContext.js
import { createContext, useContext, useReducer } from 'react';

const TasksContext = createContext(null);

const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        {children}
      </TasksDispatchContext>
    </TasksContext>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('未知的 action：' + action.type);
    }
  }
}

const initialTasks = [
  { id: 0, text: '哲學之道', done: true },
  { id: 1, text: '參觀寺廟', done: false },
  { id: 2, text: '喝抹茶', done: false }
];
```

```js src/AddTask.js
import { useState, useContext } from 'react';
import { useTasksDispatch } from './TasksContext.js';

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useTasksDispatch();
  return (
    <>
      <input
        placeholder="新增任務"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
          type: 'added',
          id: nextId++,
          text: text,
        }); 
      }}>新增</button>
    </>
  );
}

let nextId = 3;
```

```js src/TaskList.js
import { useState, useContext } from 'react';
import { useTasks, useTasksDispatch } from './TasksContext.js';

export default function TaskList() {
  const tasks = useTasks();
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useTasksDispatch();
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value
              }
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          儲存
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          編輯
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked
            }
          });
        }}
      />
      {taskContent}
      <button onClick={() => {
        dispatch({
          type: 'deleted',
          id: task.id
        });
      }}>
        刪除
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution />

</Recipes>

---

### 指定備用預設值 {/*specifying-a-fallback-default-value*/}

如果 React 在父元件樹中，找不到任何特定 <CodeStep step={1}>context</CodeStep> 的 provider，`useContext()` 所回傳的 context 值就會和你[創建 context](/reference/react/createContext) 時指定的預設值相同：

```js [[1, 1, "ThemeContext"], [3, 1, "null"]]
const ThemeContext = createContext(null);
```

這個預設值 **不會改變**。如果想更新 context，像[本文上面所說的](#updating-data-passed-via-context)搭配狀態來使用。

通常，除了 `null`，有更多可以作為預設，且更有意義的值，例如：

```js [[1, 1, "ThemeContext"], [3, 1, "light"]]
const ThemeContext = createContext('light');
```

用這個方式，如果不小心在沒有對應 provider 的情況下渲染元件，也不會壞掉。這也能幫助元件在測試環境順利運作，而不用在測試中設定很多 providers。

下面的範例中，「切換主題」按鈕總是 light，因為它在 **任何 theme context provider 之外**，而且主題的預設值是 `'light'`。試著把預設主題更改為 `'dark'`。

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext('light');

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <>
      <ThemeContext value={theme}>
        <Form />
      </ThemeContext>
      <Button onClick={() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }}>
        切換主題
      </Button>
    </>
  )
}

function Form({ children }) {
  return (
    <Panel title="歡迎">
      <Button>註冊</Button>
      <Button>登入</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

---

### 在元件樹的某些部分覆寫 context {/*overriding-context-for-a-part-of-the-tree*/}

你可以在元件樹的某些部分覆寫（override） context，以不同的值包裹 provider 中的某些部分。

```js {3,5}
<ThemeContext value="dark">
  ...
  <ThemeContext value="light">
    <Footer />
  </ThemeContext>
  ...
</ThemeContext>
```

你可以依照需求多次嵌套（nest）並覆寫 provider。

<Recipes titleText="覆寫 context 的範例">

#### 覆寫主題 {/*overriding-a-theme*/}

`Footer` *中* 的按鈕接收的 context 值（`"light"`），不同於 `Footer` 外的按鈕（`"dark"`）。

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}

function Form() {
  return (
    <Panel title="歡迎">
      <Button>註冊</Button>
      <Button>登入</Button>
      <ThemeContext value="light">
        <Footer />
      </ThemeContext>
    </Panel>
  );
}

function Footer() {
  return (
    <footer>
      <Button>設置</Button>
    </footer>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      {title && <h1>{title}</h1>}
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
footer {
  margin-top: 20px;
  border-top: 1px solid #aaa;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### 自動嵌套的標頭 {/*automatically-nested-headings*/}

當嵌套 context provider 時，你可以「累積」資訊。在這個範例中，`Section` 元件指定章節（section）嵌套的深度，以保持追蹤 `LevelContext`。它從父章節讀取 `LevelContext`，並提供由各個章節增加的 `LevelContext` 值給子元件。因此，`Heading` 元件可以自動根據 `Section` 嵌套的數量，來決定要用 `<h1>`、`<h2>`、`<h3>`⋯⋯

閱讀更多這個範例的[演練細節](/learn/passing-data-deeply-with-context)。

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>標題</Heading>
      <Section>
        <Heading>標頭</Heading>
        <Heading>標頭</Heading>
        <Heading>標頭</Heading>
        <Section>
          <Heading>小標頭</Heading>
          <Heading>小標頭</Heading>
          <Heading>小標頭</Heading>
          <Section>
            <Heading>小小標頭</Heading>
            <Heading>小小標頭</Heading>
            <Heading>小小標頭</Heading>
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
      <LevelContext value={level + 1}>
        {children}
      </LevelContext>
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
      throw Error('標頭必須在章節中！');
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
      throw Error('未知的 level：' + level);
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

<Solution />

</Recipes>

---

### 最佳化傳入物件和函式時的重新渲染 {/*optimizing-re-renders-when-passing-objects-and-functions*/}

你可以用 context 傳入任何值，包含物件和函式。

```js [[2, 10, "{ currentUser, login }"]] 
function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  function login(response) {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }

  return (
    <AuthContext value={{ currentUser, login }}>
      <Page />
    </AuthContext>
  );
}
```

<CodeStep step={2}>Context 值</CodeStep>是有兩個屬性（properties）的 JavaScript 物件，其中一個屬性是函式。無論 `MyApp` 什麼時候重新渲染（例如，當路由更新時），都會是一個 *不同的* 物件指向 *不同的* 函式，所以 React 也必須重新渲染元件樹中，所有呼叫 `useContext(AuthContext)` 的元件。

在小型應用程式中，這不算什麼問題。但是，如果像是 `currentUser` 這樣的底層資料沒有改變，其實沒必要重新渲染。為了幫助 React 發揮長處，你可以用 [`useCallback`](/reference/react/useCallback) 包裹函式，並用 [`useMemo`](/reference/react/useMemo) 包裹物件。這是效能最佳化的方式：

```js {6,9,11,14,17}
import { useCallback, useMemo } from 'react';

function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  const login = useCallback((response) => {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }, []);

  const contextValue = useMemo(() => ({
    currentUser,
    login
  }), [currentUser, login]);

  return (
    <AuthContext value={contextValue}>
      <Page />
    </AuthContext>
  );
}
```

修改的結果是，即使 `MyApp` 需要重新渲染，呼叫 `useContext(AuthContext)` 的元件也不需要重新渲染，除非 `currentUser` 有變化。

閱讀更多有關 [`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) 和 [`useCallback`.](/reference/react/useCallback#skipping-re-rendering-of-components)。

---

## 故障排除 {/*troubleshooting*/}

### 元件找不到 provider 的值 {/*my-component-doesnt-see-the-value-from-my-provider*/}

有一些常見的方式會導致這個狀況發生：

1. 你在呼叫 `useContext()` 的同一個元件中（或底下）渲染 `<SomeContext>`。將 `<SomeContext>` 移到呼叫 `useContext()` 的元件上面。
2. 你可能忘記在元件外包一層 `<SomeContext>`，或你把它放在元件樹的不同部分。用 [React 開發者工具](/learn/react-developer-tools)檢查階層是否正確。
3. 你可能遇到一些建置工具的問題，導致 `SomeContext` 被讀取的元件視為不同的物件。舉例來說，這可能會發生在使用符號連結時。你可以把 context 賦值給全域變數來檢查，像是 `window.SomeContext1` 和 `window.SomeContext2`，接著在 console 裡檢查 `window.SomeContext1 === window.SomeContext2`。如果兩者不同，必須在建置工具的層級下解決這個問題。

### 我總是從 context 取得 `undefined`，即使預設值並不是 `undefined` {/*i-am-always-getting-undefined-from-my-context-although-the-default-value-is-different*/}

你的元件樹中的 provider 可能沒有 `value`：

```js {1,2}
// 🚩 無法運作：沒有 value prop
<ThemeContext>
   <Button />
</ThemeContext>
```

如果忘記指定 `value`，就會像是傳入 `value={undefined}`。

你可能誤用了不同的 prop 名稱：

```js {1,2}
// 🚩 無法運作：prop 的名稱應該是「value」
<ThemeContext theme={theme}>
   <Button />
</ThemeContext>
```

上述這兩個情形，都應該會在 console 看到 React 的警告。要修正的話，稱 prop 為 `value`：

```js {1,2}
// ✅ 將資料傳入 value prop
<ThemeContext value={theme}>
   <Button />
</ThemeContext>
```

注意[`createContext(defaultValue)` 呼叫的預設值](#specifying-a-fallback-default-value)只會在 **上方完全沒有對應的 provider 時** 被用到。如果父元件樹的某個地方有 `<SomeContext value={undefined}>` 元件，呼叫 `useContext(SomeContext)` 會收到 `undefined` 作為 context 值。
