---
title: useState
---

<Intro>

`useState` 是一個將 [狀態變數](/learn/state-a-components-memory) 加入元件的 React Hook。

```js
const [state, setState] = useState(initialState)
```

</Intro>

<InlineToc />

---

## 參考 {/*reference*/}

### `useState(initialState)` {/*usestate*/}

呼叫 `useState`，在元件的頂層宣告一個 [狀態變數](/learn/state-a-components-memory) 。

```js
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(28);
  const [name, setName] = useState('Taylor');
  const [todos, setTodos] = useState(() => createTodos());
  // ...
```

命名狀態變數的慣例是 [陣列解構](https://javascript.info/destructuring-assignment) ，像是 `[something, setSomething]`。

[往下看更多範例。](#usage)

#### 參數 {/*parameters*/}

* `initialState` ：期望的初始值。可以是任何型別的數值，若為函式會有特別的行為。初次渲染後這個引數會被忽略。
  * 如果傳入一個函式作為 `initialState` ，會被視為初始化函式。該函式應為純函式、無引數，且回傳任一型別的值。React 在初始化元件的時候，會呼叫你的初始化函式，並保存回傳值作為初始狀態。 [往下看更多範例。](#avoiding-recreating-the-initial-state)

#### 回傳值 {/*returns*/}

`useState` 會回傳一個剛好兩個值的陣列：

1. 當前狀態。在第一次渲染的期間，會匹配你傳入的 `initialState`。
2. [`set` 函式](#setstate) 會更新狀態並觸發重渲染。

#### 注意事項 {/*caveats*/}

* `useState` 是一個 Hook，所以只能在元件的頂層或自己的 Hook 中呼叫它。不能在迴圈或條件式中呼叫。如有需要，抽成新的元件並將狀態移入。
* 在嚴格模式中，React 會 **呼叫初始化函式兩次** 以 [幫你找到意外的不純行為（accidental impurities）](#my-initializer-or-updater-function-runs-twice) 。僅在開發環境會有這個行為，並不影響生產環境。如果你的初始化函式是純函式（它應該要是），就不會影響該行為。其中一次的呼叫的結果會被忽略。

---

### `set` 函式，像是 `setSomething(nextState)` {/*setstate*/}

`useState` 回傳的 `set` 函式可以將狀態更新成不同的值並觸發重渲染。可以直接傳入新的狀態，或由之前的狀態計算的函式：

```js
const [name, setName] = useState('Edward');

function handleClick() {
  setName('Taylor');
  setAge(a => a + 1);
  // ...
```

#### 參數 {/*setstate-parameters*/}

* `nextState` ：期望狀態變成的值。可以為任一型別，但為函式時會有特殊的行為。
  * 若傳入函式到 `nextState`，將會被視為 _更新函式（updater function）_ 。其必須為純函式，必須有待處理狀態（pending state）作為唯一的引數，且回傳下一個狀態。React 會將更新函式放進佇列，並重渲染元件。在下一次的渲染時，React 會根據佇列中所有的更新函式，以之前的狀態計算出新的狀態。 [往下看更多範例。](#updating-state-based-on-the-previous-state)

#### 回傳值 {/*setstate-returns*/}

`set` 函式沒有回傳值。

#### 注意事項 {/*setstate-caveats*/}

* `set` 函式 **只會在 *下一次* 渲染時更新狀態變數** 。如果你在呼叫 `set` 函式後馬上讀取狀態變數，[還是會拿到舊的值](#ive-updated-the-state-but-logging-gives-me-the-old-value) ，也就是在呼叫前畫面上的值。

* 如果你提供的值跟現在的 `state` 相同（由 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 的比較來判定），React 會 **跳過元件和子元件的重渲染** 作為最佳化。雖然在某些情況中 React 仍然需要在跳過子元件前呼叫元件，但這不應該影響你的程式碼。

* React 會 [批次處理狀態更新](/learn/queueing-a-series-of-state-updates) 。也就是在所有的事件處理函式（event handler）執行完畢後更新畫面，並呼叫所有 set 函式。這樣能避免單一事件期間多次重渲染。在少數的情況中，必須更早強迫 React 立即更新畫面，例如可以用 [`flushSync`](/reference/react-dom/flushSync) 來存取 DOM。

* `set` 函式有穩定的識別性，所以常在 Effect 的依賴中被省略，就算在依賴中也不會觸發 Effect。如果 linter 在依賴省略 `set` 函式時沒有報錯，也是安全可行的。 [瞭解更多關於移除 Effect 的依賴。](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

* 只有正在渲染的元件可以在 *渲染期間* 呼叫 `set` 函式。React 會放棄這次渲染的結果，並立刻嘗試以新的值渲染。這種做法很少用，但可以用來 **保存之前渲染的資訊** 。 [往下看更多範例。](#storing-information-from-previous-renders)

* 在嚴格模式中，React 會 **呼叫更新函式兩次** ，這是為了 [幫你找到意外的不純行為](#my-initializer-or-updater-function-runs-twice)。僅在開發環境會有這個行為，並不影響生產環境。如果你的更新函式是純函式（它應該要是），就不會影響該行為。其中一次的呼叫的結果會被忽略。

---

## 用法 {/*usage*/}

### 將狀態加入元件 {/*adding-state-to-a-component*/}

在元件的頂層呼叫 `useState` 來宣告一個或多個 [狀態變數](/learn/state-a-components-memory) 。

```js [[1, 4, "age"], [2, 4, "setAge"], [3, 4, "42"], [1, 5, "name"], [2, 5, "setName"], [3, 5, "'Taylor'"]]
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(42);
  const [name, setName] = useState('Taylor');
  // ...
```

命名狀態變數的慣例是 [陣列解構](https://javascript.info/destructuring-assignment) ，像是 `[something, setSomething]` 。

`useState` 會回傳剛好有兩個項目的陣列：

1. 狀態變數的<CodeStep step={1}>當前狀態</CodeStep>，一開始被設為你提供的<CodeStep step={3}>初始值</CodeStep>。
2. <CodeStep step={2}>`set` 函式</CodeStep>，根據互動將狀態改變成其他值。

呼叫 `set` 函式，將畫面上的值更新為新的狀態：

```js [[2, 2, "setName"]]
function handleClick() {
  setName('Robin');
}
```

React 會保存新的狀態，以新的值再次渲染元件，並更新 UI。

<Pitfall>

呼叫 `set` 函式 [**並不會** 改變正在執行的程式碼裡的狀態](#ive-updated-the-state-but-logging-gives-me-the-old-value) ：

```js {3}
function handleClick() {
  setName('Robin');
  console.log(name); // 還是「Taylor」！
}
```

只會影響 `useState` 在 *下一次* 渲染時回傳的值。

</Pitfall>

<Recipes titleText="useState 的基本範例" titleId="examples-basic">

#### 計數器（數值） {/*counter-number*/}

在此範例中，狀態變數 `count` 為一個數值（number）。
點擊按鈕可以增加次數。

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      你按了我 {count} 次
    </button>
  );
}
```

</Sandpack>

<Solution />

#### 文字輸入框（字串） {/*text-field-string*/}

在此範例中，狀態變數 `text` 為一個字串（string）。
當輸入文字時，`handleChange` 讀取瀏覽器 input DOM element 最新的輸入值，並呼叫 `setText` 來更新狀態。就能將當前的 `text` 顯示在下方。

<Sandpack>

```js
import { useState } from 'react';

export default function MyInput() {
  const [text, setText] = useState('哈囉');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <input value={text} onChange={handleChange} />
      <p>你輸入了： {text}</p>
      <button onClick={() => setText('哈囉')}>
        重設
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### 核取方塊（布林值） {/*checkbox-boolean*/}

在此範例中，狀態變數 `liked` 為布林值（boolean）。當點擊 input， `setLiked` 會以核取方塊是否被勾選，來更新狀態變數 `liked`。變數 `liked` 被用來渲染核取方塊下方的文字。

<Sandpack>

```js
import { useState } from 'react';

export default function MyCheckbox() {
  const [liked, setLiked] = useState(true);

  function handleChange(e) {
    setLiked(e.target.checked);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={liked}
          onChange={handleChange}
        />
        我喜歡這個
      </label>
      <p>你 {liked ? '喜歡' : '不喜歡'} 這個。</p>
    </>
  );
}
```

</Sandpack>

<Solution />

#### 表單（兩個變數） {/*form-two-variables*/}

在同一個元件中，可以宣告一個以上的狀態變數。每個狀態變數之間是完全相互獨立的。

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => setAge(age + 1)}>
        增加年齡
      </button>
      <p>哈囉， {name}。 你 {age} 歲。</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### 以之前的狀態更新當前狀態 {/*updating-state-based-on-the-previous-state*/}

假設 `age` 是 `42`。這個處理函式（handler）呼叫了三次 `setAge(age + 1)`：

```js
function handleClick() {
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
}
```

但點擊之後， `age` 會是 `43` 而不是 `45`！這是因為 `set` 函式 [並不會更新](/learn/state-as-a-snapshot) 正在執行程式碼中的狀態變數 `age` 。所以每個 `setAge(age + 1)` 呼叫都會是 `setAge(43)` 。

如果要解決這個問題， **應該傳一個*更新函式*** 給 `setAge` 而不是新的狀態：

```js [[1, 2, "a", 0], [2, 2, "a + 1"], [1, 3, "a", 0], [2, 3, "a + 1"], [1, 4, "a", 0], [2, 4, "a + 1"]]
function handleClick() {
  setAge(a => a + 1); // setAge(42 => 43)
  setAge(a => a + 1); // setAge(43 => 44)
  setAge(a => a + 1); // setAge(44 => 45)
}
```

上面這邊， `a => a + 1` 是更新函式。以<CodeStep step={1}>待處理狀態</CodeStep>計算<CodeStep step={2}>新的狀態</CodeStep>。

React 會將所有更新函式放入 [佇列](/learn/queueing-a-series-of-state-updates) 。下次渲染時，會照順序呼叫這些函式：

1. `a => a + 1` 以 `42` 作為待處理狀態，並回傳 `43` 作為新的狀態。
2. `a => a + 1` 以 `43` 作為待處理狀態，並回傳 `44` 作為新的狀態。
3. `a => a + 1` 以 `44` 作為待處理狀態，並回傳 `45` 作為新的狀態。

因為沒有其他排隊的更新函式，最後 React 會保存 `45` 作為當前狀態。

慣例上，通常會將待處理狀態引數命名為狀態變數的第一個字母，像是 `age` 的 `a`。不過也可以用 `prevAge` 或其它你覺得清楚的命名。

React 在開發環境時，可能會 [呼叫更新函式兩次](#my-initializer-or-updater-function-runs-twice) 來驗證是否為 [純函式](/learn/keeping-components-pure) 。

<DeepDive>

#### 用更新函式一定比較好嗎？ {/*is-using-an-updater-always-preferred*/}

你可能有聽過一種建議：如果你的狀態是從之前的狀態計算而來的，就要寫 `setAge(a => a + 1)` 這樣的程式碼。這無傷大雅，但並非必要。

在大部分的情況裡，這兩種方式並無差別。React 會確保像點擊這類使用者有意的行為， `age` 狀態變數在下次點擊前就會被更新。這表示在事件處理函式一開始，不會有看到「過時的」 `age` 的風險。

不過，如果想在同一個事件中多次更新，更新函式會很有用。當狀態變數不易取得時，更新函式也很有幫助。（像是在最佳化重渲染時。）

如果你偏好統一寫法，即使語法稍微冗長，只要狀態是根據之前的狀態計算而來，都用更新函式也是合理的。如果狀態是根據 *其它* 狀態變數計算而來，或許可以把它們合併成一個物件，然後 [用化簡器（reducer）處理](/learn/extracting-state-logic-into-a-reducer) 。

</DeepDive>

<Recipes titleText="傳入更新函式和直接傳入新的狀態的差別" titleId="examples-updater">

#### 傳入更新函式 {/*passing-the-updater-function*/}

此範例傳入更新函式，讓「+3」的按鈕有作用。

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [age, setAge] = useState(42);

  function increment() {
    setAge(a => a + 1);
  }

  return (
    <>
      <h1>你的年齡： {age}</h1>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <button onClick={() => {
        increment();
      }}>+1</button>
    </>
  );
}
```

```css
button { display: block; margin: 10px; font-size: 20px; }
h1 { display: block; margin: 10px; }
```

</Sandpack>

<Solution />

#### 直接傳入新的狀態 {/*passing-the-next-state-directly*/}

這個範例 **並非** 傳入更新函式，所以「+3」按鈕的作用 **不如預期** 。

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [age, setAge] = useState(42);

  function increment() {
    setAge(age + 1);
  }

  return (
    <>
      <h1>你的年齡： {age}</h1>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <button onClick={() => {
        increment();
      }}>+1</button>
    </>
  );
}
```

```css
button { display: block; margin: 10px; font-size: 20px; }
h1 { display: block; margin: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### 更新狀態中的物件及陣列 {/*updating-objects-and-arrays-in-state*/}

狀態中可以放物件和陣列。在 React 中狀態是唯讀的，所以 **應該 *替換（replace）* 而不是 *變動（mutate）* 已存在的物件** 。例如狀態是一個 `form` 物件時，不要變動它：

```js
// 🚩 不要像這樣變動狀態中的物件：
form.firstName = 'Taylor';
```

應該新增並替換整個物件：

```js
// ✅ 以新的物件替換狀態
setForm({
  ...form,
  firstName: 'Taylor'
});
```

可以閱讀 [更新狀態中的物件](/learn/updating-objects-in-state) 及 [更新狀態中的陣列](/learn/updating-arrays-in-state) 來瞭解更多。

<Recipes titleText="物件及陣列狀態的範例" titleId="examples-objects">

#### 表單（物件） {/*form-object*/}

在這個範例中，`form` 狀態變數是一個物件。每次輸入時會有改變處理函式（change handler）呼叫 `setForm`，包含整個表單的新狀態。`{ ...form }` 這樣的展開語法可以確保狀態物件是被替換而不是被變動。

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [form, setForm] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com',
  });

  return (
    <>
      <label>
        名字：
        <input
          value={form.firstName}
          onChange={e => {
            setForm({
              ...form,
              firstName: e.target.value
            });
          }}
        />
      </label>
      <label>
        姓氏：
        <input
          value={form.lastName}
          onChange={e => {
            setForm({
              ...form,
              lastName: e.target.value
            });
          }}
        />
      </label>
      <label>
        信箱：
        <input
          value={form.email}
          onChange={e => {
            setForm({
              ...form,
              email: e.target.value
            });
          }}
        />
      </label>
      <p>
        {form.firstName}{' '}
        {form.lastName}{' '}
        ({form.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; }
```

</Sandpack>

<Solution />

#### 表單（巢狀物件） {/*form-nested-object*/}

在這個範例中，狀態是巢狀的。更新巢狀的狀態時，會需要複製一份你要更新的物件，及所有上層「包含」這個物件的物件。閱讀 [更新一個巢狀物件](/learn/updating-objects-in-state#updating-a-nested-object) 以了解更多。

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        姓名：
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        標題：
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        城市：
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        圖片：
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (位於 {person.artwork.city})
      </p>
      <img 
        src={person.artwork.image} 
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<Solution />

#### 列表（陣列） {/*list-array*/}

在這個範例中，`todos` 狀態變數為一個陣列。每個按鈕的處理函式會呼叫 `setTodos`，包含新版本的陣列。展開語法 `[...todos]`、`todos.map()` 和 `todos.filter()` 確保狀態陣列是被替換而不是被變動。

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: '買牛奶', done: true },
  { id: 1, title: '吃捲餅', done: false },
  { id: 2, title: '泡茶', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(initialTodos);

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="新增待辦事項"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>新增</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          儲存
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
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
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
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

#### 用 Immer 寫出精確的更新邏輯 {/*writing-concise-update-logic-with-immer*/}

如果不用變動的方式更新陣列和物件感覺很冗餘，可用像 [Immer](https://github.com/immerjs/use-immer) 這樣的函式庫來減少重複的程式碼。Immer 可以幫你寫出準確的程式碼，就像在變動物件一樣，但其實是以不可變的更新方式：

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: '大肚腩', seen: false },
  { id: 1, title: '月球景觀', seen: false },
  { id: 2, title: '兵馬俑', seen: true },
];

export default function BucketList() {
  const [list, updateList] = useImmer(initialList);

  function handleToggle(artworkId, nextSeen) {
    updateList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>藝術品人生清單</h1>
      <h2>我想看的藝術品清單：</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Solution />

</Recipes>

---

### 避免重新創建初始狀態 {/*avoiding-recreating-the-initial-state*/}

React 只保存初始狀態一次，並在下次渲染時忽略它。

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  // ...
```

雖然 `createInitialTodos()` 的結果只會在第一次渲染用到，還是可以在每次渲染的時候呼叫這個函式。但如果這個函式會建立大的陣列或處理複雜計算，會很浪費效能。

為了解決這個問題，你可以 **傳入一個 _初始化_ 函式** 給 `useState` 作為代替：

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  // ...
```

需要注意的是，這邊是傳入 `createInitialTodos` 這個 *函式本身* ，而不是 `createInitialTodos()` 呼叫的結果。如果傳一個函式給 `useState`，React 就只會在初始化的時候呼叫它。

React 在開發環境會 [呼叫你的初始化函式兩次](#my-initializer-or-updater-function-runs-twice) 以驗證是否為 [純函式](/learn/keeping-components-pure) 。

<Recipes titleText="傳入初始化函式和直接傳入初始狀態的差別" titleId="examples-initializer">

#### 傳入初始化函式 {/*passing-the-initializer-function*/}

這個範例傳入初始化函式，所以 `createInitialTodos` 函式只會在初始化時執行。當元件重渲染，例如輸入時，這個函式並不會執行。

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: '項目 ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        setTodos([{
          id: todos.length,
          text: text
        }, ...todos]);
      }}>新增</button>
      <ul>
        {todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

#### 直接傳入初始狀態 {/*passing-the-initial-state-directly*/}

這個範例 **並非** 傳入初始化函式，所以 `createInitialTodos` 函式在每次渲染時都會執行，例如輸入文字時。在行為上無法看出差別，但程式碼比較沒效率。

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: '項目 ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        setTodos([{
          id: todos.length,
          text: text
        }, ...todos]);
      }}>新增</button>
      <ul>
        {todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### 以鍵值（key）重設狀態 {/*resetting-state-with-a-key*/}

在 [渲染列表](/learn/rendering-lists) 時常常會遇到 `key` 這個屬性，但鍵值還有另一個用途。

可以 **透過傳入不同的 `key` 來重設元件的狀態** 。在這個範例中，重設按鈕會改變 `version` 狀態變數，而 `version` 被傳入 `Form` 中作為 `key`。當 `key` 改變時，React 會重新創建 `Form` 元件（及所有的子元件），一切重新開始，因此元件的狀態也會被重設。

閱讀 [保存並重設狀態](/learn/preserving-and-resetting-state) 以了解更多。

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [version, setVersion] = useState(0);

  function handleReset() {
    setVersion(version + 1);
  }

  return (
    <>
      <button onClick={handleReset}>重設</button>
      <Form key={version} />
    </>
  );
}

function Form() {
  const [name, setName] = useState('Taylor');

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <p>哈囉， {name}。</p>
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

---

### 從之前的渲染保存資訊 {/*storing-information-from-previous-renders*/}

通常我們會在事件處理函式更新狀態，但是在少數情況中，可能會想要在渲染後改變狀態。例如，可能會想要在屬性（prop）改變時，去改變狀態變數。

在大部分的情況中，不需要：

* **如果你的值可以完全以當前的屬性或其它狀態計算，則 [拿掉所有多餘的狀態](/learn/choosing-the-state-structure#avoid-redundant-state)** 。如果你擔心太常重新計算，用 [`useMemo` Hook](/reference/react/useMemo) 會有幫助。
* 如果想要重設整個元件樹的狀態， [傳一個不同的 `key` 給你的元件](#resetting-state-with-a-key) 。
* 如果可以，在事件處理函式中更新所有相關的狀態。

在少數的情況中，上面幾種方式都不合適。有種方式可以基於目前已經渲染過的值來更新狀態，就是在元件渲染時，呼叫一個 `set` 函式。

下面這邊有個例子。`count` 屬性傳入 `CountLabel` 元件：

```js src/CountLabel.js
export default function CountLabel({ count }) {
  return <h1>{count}</h1>
}
```

想要顯示計數器從上一次改變後是 *增加還是減少* 的話，從 `count` 是看不出來的，應該要持續追蹤計數器先前的數值。可以新增 `prevCount` 狀態變數來追蹤。另外新增一個叫做 `trend` 的狀態變數來掌握計數器是增加還是減少。比較 `prevCount` 和 `count`，如果兩者不同，就更新 `prevCount` 和 `trend`。然後就可以顯示目前的計數屬性及 *它從上次渲染後是如何改變的* 。

<Sandpack>

```js src/App.js
import { useState } from 'react';
import CountLabel from './CountLabel.js';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        增加
      </button>
      <button onClick={() => setCount(count - 1)}>
        減少
      </button>
      <CountLabel count={count} />
    </>
  );
}
```

```js src/CountLabel.js active
import { useState } from 'react';

export default function CountLabel({ count }) {
  const [prevCount, setPrevCount] = useState(count);
  const [trend, setTrend] = useState(null);
  if (prevCount !== count) {
    setPrevCount(count);
    setTrend(count > prevCount ? '增加' : '減少');
  }
  return (
    <>
      <h1>{count}</h1>
      {trend && <p>計數為{trend}</p>}
    </>
  );
}
```

```css
button { margin-bottom: 10px; }
```

</Sandpack>

要注意的是，如果在渲染時呼叫 `set` 函式，一定有像是 `prevCount !== count` 這樣的判斷，然後在判斷裡面呼叫像是 `setPrevCount(count)` 這樣的函式。否則元件會在迴圈內不斷重渲染直到當掉。另外，也可以像前面這邊說的，只更新 *現在正在渲染的元件* 。在渲染期間呼叫*另一個*元件的 `set` 函式是錯誤的。最後一點，`set` 呼叫應該要 [更新狀態但不變動（mutation）](#updating-objects-and-arrays-in-state) ，但這並不表示可以違反 [純函式](/learn/keeping-components-pure) 的規範。

這個方式可能不太好懂，而且最常被避免使用，但還是比在 effect 中更新狀態好。當在渲染時呼叫 `set` 函式，React 會立刻重渲染元件，時間點是在 `return` 以後元件已存在，但子元件還沒渲染之前。這樣一來子元件就不會渲染兩次。而元件中其它的函式還是會執行（執行結果會被捨棄）。如果你的條件式是在所有的 Hook 之前，應該要在更早之前加上 `return;`，才能更早重新渲染。

---

## 故障排除 {/*troubleshooting*/}

### 我已經更新狀態了，卻拿到舊的值 {/*ive-updated-the-state-but-logging-gives-me-the-old-value*/}

**在執行的程式碼中呼叫 `set` 函式並不會改變狀態** ：

```js {4,5,8}
function handleClick() {
  console.log(count);  // 0

  setCount(count + 1); // 以 1 要求重渲染
  console.log(count);  // 還是 0 ！

  setTimeout(() => {
    console.log(count); // 也是 0 ！
  }, 5000);
}
```

這是因為 [狀態的表現像快照](/learn/state-as-a-snapshot) 。更新狀態會要求新的渲染，但不會影響執行中事件處理函式裡的 `count` 這個 JavaScript 變數。

如果需要用新的狀態，可以在傳入 `set` 函式前，將狀態保存在一個變數中：

```js
const nextCount = count + 1;
setCount(nextCount);

console.log(count);     // 0
console.log(nextCount); // 1
```

---

### 我已經更新狀態了，畫面卻沒有更新 {/*ive-updated-the-state-but-the-screen-doesnt-update*/}

**如果新的狀態跟之前的狀態相同， React 會忽略它** ，這是由 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 的比較來決定的。當直接改變物件或陣列時，就常常會發生這個情況：

```js
obj.x = 10;  // 🚩 錯誤：變動現有的物件
setObj(obj); // 🚩 不會發生任何事
```

因為這邊是變動一個現有的 `obj` 物件並把它傳進 `setObj`，React 會忽略掉而不更新。要解決這個問題，必須確保總是 [_替換_ 狀態中的物件和陣列而不是 _變動_](#updating-objects-and-arrays-in-state)：

```js
// ✅ 正確：創建一個新物件
setObj({
  ...obj,
  x: 10
});
```

---

### 我得到錯誤訊息：「過多重渲染」 {/*im-getting-an-error-too-many-re-renders*/}

有時候可能會得到這個錯誤訊息： `Too many re-renders. React limits the number of renders to prevent an infinite loop` 。一般來說，這表示你 *渲染期間* 在沒有條件判斷的狀況下設置狀態，所以元件進入了這個迴圈：渲染 -> 設置狀態（導致一次渲染） -> 渲染 -> 設置狀態（導致一次渲染），以此類推。這經常會導致事件處理函式中的錯誤：

```js {1-2}
// 🚩 錯誤：在渲染期間呼叫處理函式
return <button onClick={handleClick()}>點擊我</button>

// ✅ 正確：傳入事件處理函式
return <button onClick={handleClick}>點擊我</button>

// ✅ 正確：傳入行內函式（inline function）
return <button onClick={(e) => handleClick(e)}>點擊我</button>
```

如果找不到錯誤的原因，點擊控制台中錯誤旁邊的箭頭，查看 JavaScript 堆疊來找到發生錯誤的 `set` 函式。

---

### 初始化或更新函式執行了兩次 {/*my-initializer-or-updater-function-runs-twice*/}

在 [嚴格模式](/reference/react/StrictMode) 中，React 有時會呼叫函式兩次，而不是一次：

```js {2,5-6,11-12}
function TodoList() {
  // 這個元件每次渲染時都會執行兩次

  const [todos, setTodos] = useState(() => {
    // 這個初始化函式在初始化期間會執行兩次
    return createTodos();
  });

  function handleClick() {
    setTodos(prevTodos => {
      // 這個更新函式在每次點擊時都會執行兩次
      return [...prevTodos, createTodo()];
    });
  }
  // ...
```

這個情況符合預期，程式碼也沒有壞掉。

這個 **只在開發環境** 出現的行為，可以幫助 [保持元件是純函式](/learn/keeping-components-pure) 。React 只會用其中一次呼叫的結果，並忽略另一次的呼叫。只要元件、初始化函式及更新函式是純函式，就不會影響程式邏輯。不過如果有非純函式，這個機制就能幫忙發現錯誤。

例如，下面這個不純的更新函式變動了狀態中的陣列：

```js {2,3}
setTodos(prevTodos => {
  // 🚩 錯誤：變動狀態
  prevTodos.push(createTodo());
});
```

React 會呼叫更新函式兩次，於是就會看到待辦事項被新增了兩次，你就會發現有錯誤。在這個例子中，可以用 [替代而非變動陣列](#updating-objects-and-arrays-in-state) 的方式修正錯誤：

```js {2,3}
setTodos(prevTodos => {
  // ✅ 正確：用新的狀態替代
  return [...prevTodos, createTodo()];
});
```

現在更新函式是純函式了，多呼叫一次也不會出現不同的行為。這就是為什麼 React 要呼叫兩次，來幫你找到錯誤。 **只有元件、初始化函式和更新函式需要是純函式。** 事件處理函式不需要是純函式，所以 React 絕不會呼叫事件處理函式兩次。

閱讀 [保持元件為純函式](/learn/keeping-components-pure) 以了解更多。

---

### 我試著設置函式給狀態，但函式被呼叫了 {/*im-trying-to-set-state-to-a-function-but-it-gets-called-instead*/}

不能像這樣在狀態中放函式：

```js
const [fn, setFn] = useState(someFunction);

function handleClick() {
  setFn(someOtherFunction);
}
```

因為傳入函式，React 會假設 `someFunction` 是一個 [初始化函式](#avoiding-recreating-the-initial-state) ， `someOtherFunction` 是一個 [更新函式](#updating-state-based-on-the-previous-state) ，所以 React 會呼叫這些函式，並保存呼叫的結果。如果真的想要 *保存* 一個函式，必須把 `() =>` 寫在函式前面。這樣 React 就會保存你傳入的函式了。

```js {1,4}
const [fn, setFn] = useState(() => someFunction);

function handleClick() {
  setFn(() => someOtherFunction);
}
```
