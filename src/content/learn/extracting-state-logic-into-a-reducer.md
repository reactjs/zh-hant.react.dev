---
title: 抽出狀態邏輯到 Reducer
---

<Intro>

如果元件的狀態更新很多次，且分散在多個事件處理函式（event handler）中，可能會變得難以管理。在這種情況下，可以將所有更新狀態的邏輯整合到元件外的一個函式，稱為 _reducer_。

</Intro>

<YouWillLearn>

- Reducer 函式是什麼
- 如何將 `useState` 重構為 `useReducer`
- 使用 reducer 的時機
- 如何寫好 reducer

</YouWillLearn>

## 以 Reducer 整合狀態邏輯 {/*consolidate-state-logic-with-a-reducer*/}

當元件愈來愈複雜時，就會很難一眼看出元件的狀態是如何被更新的。舉例來說， `TaskApp` 元件在狀態中保存了一個 `tasks` 陣列，並用三個不同的事件處理函式來新增、刪除和編輯任務：

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, setTasks] = useState(initialTasks);

  function handleAddTask(text) {
    setTasks([
      ...tasks,
      {
        id: nextId++,
        text: text,
        done: false,
      },
    ]);
  }

  function handleChangeTask(task) {
    setTasks(
      tasks.map((t) => {
        if (t.id === task.id) {
          return task;
        } else {
          return t;
        }
      })
    );
  }

  function handleDeleteTask(taskId) {
    setTasks(tasks.filter((t) => t.id !== taskId));
  }

  return (
    <>
      <h1>布拉格的行程</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: '參觀卡夫卡博物館', done: true},
  {id: 1, text: '看木偶戲', done: false},
  {id: 2, text: '在連儂牆打卡', done: false},
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="新增任務"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        新增
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>儲存</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>編輯</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>刪除</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

元件的每個事件處理函式呼叫 `setTasks` 來更新狀態。隨著元件成長，分散在其中的狀態邏輯也隨之增加。為了減少元件的複雜度，並將邏輯保存在一個易於存取的地方，可以將狀態邏輯移到元件外的一個函式， **稱為 reducer。**

Reducer 是另一種處理狀態的方式。可以透過三個步驟將 `useState` 遷移到 `useReducer` ：

1. 將直接設定狀態 **改為** 派發（dispatch） action。
2. **撰寫** reducer 函式。
3. 在元件中 **使用** reducer。

### 步驟一：將直接設定狀態改為派發 action {/*step-1-move-from-setting-state-to-dispatching-actions*/}

下面的事件處理函式現在是透過設定狀態來指定 _要做什麼_ ：

```js
function handleAddTask(text) {
  setTasks([
    ...tasks,
    {
      id: nextId++,
      text: text,
      done: false,
    },
  ]);
}

function handleChangeTask(task) {
  setTasks(
    tasks.map((t) => {
      if (t.id === task.id) {
        return task;
      } else {
        return t;
      }
    })
  );
}

function handleDeleteTask(taskId) {
  setTasks(tasks.filter((t) => t.id !== taskId));
}
```

刪掉所有的狀態設定邏輯。保留下面三個事件處理函式：

- `handleAddTask(text)` 在使用者點擊「新增」時呼叫。
- `handleChangeTask(task)` 在使用者切換任務或點擊「儲存」時呼叫。
- `handleDeleteTask(taskId)` 在使用者點擊「刪除」時呼叫。

用 reducer 管理狀態和直接設定狀態有些微的不同。並不是用設定狀態的方式告訴 React 「要做什麼」，而是在事件處理函式中用派發「action」的方式指定「使用者剛剛做了什麼」。（狀態更新邏輯會放在別的地方！）所以並不是藉由事件處理函式「設定 `tasks`」，而是派發「新增/修改/刪除任務」的 action 。這樣比較能表達使用者的意圖。

```js
function handleAddTask(text) {
  dispatch({
    type: 'added',
    id: nextId++,
    text: text,
  });
}

function handleChangeTask(task) {
  dispatch({
    type: 'changed',
    task: task,
  });
}

function handleDeleteTask(taskId) {
  dispatch({
    type: 'deleted',
    id: taskId,
  });
}
```

傳入 `dispatch` 的物件稱為「action」：

```js {3-7}
function handleDeleteTask(taskId) {
  dispatch(
    // 「action」物件：
    {
      type: 'deleted',
      id: taskId,
    }
  );
}
```

它是一個普通的 JavaScript 物件。你可以決定要放入的內容，但一般而言應該要包含關於 _發生了什麼事_ 的最少資訊。（後面的步驟會新增 `dispatch` 函式。）

<Note>

Action 物件的結構可以是任何樣子。

習慣上通常會給它一個 `type` 字串來描述發生什麼事，並在其他欄位傳入附帶的資訊。因為 `type` 是特定給單一元件的，例子中不管是寫 `'added'` 或 `'added_task'` 都可以。只要選一個命名來敘述發生什麼事就好！

```js
dispatch({
  // 特定給單一元件
  type: '發生什麼事',
  // 其他欄位寫在這
});
```

</Note>

### 步驟二：撰寫 reducer 函式 {/*step-2-write-a-reducer-function*/}

reducer 函式是放置狀態邏輯的地方。它接收兩個引數——當前狀態和 action 物件，並回傳新的狀態：

```js
function yourReducer(state, action) {
  // 回傳新的狀態讓 React 設定
}
```

React 會將狀態設定為 reducer 回傳的值。

在這個範例中，為了將狀態設定邏輯從事件處理函式移至 reducer 函式，你會：

1. 宣告當前狀態（`tasks`）作為第一個引數。
2. 宣告 `action` 物件作為第二個引數。
3. 在 reducer 回傳 _新的_ 狀態（React 會以此設定新的狀態）。

以下是所有遷移至 reducer 函式的狀態設定邏輯：

```js
function tasksReducer(tasks, action) {
  if (action.type === 'added') {
    return [
      ...tasks,
      {
        id: action.id,
        text: action.text,
        done: false,
      },
    ];
  } else if (action.type === 'changed') {
    return tasks.map((t) => {
      if (t.id === action.task.id) {
        return action.task;
      } else {
        return t;
      }
    });
  } else if (action.type === 'deleted') {
    return tasks.filter((t) => t.id !== action.id);
  } else {
    throw Error('未知的 action: ' + action.type);
  }
}
```

Reducer 函式接收狀態（`tasks`）作為引數，所以可以 **在元件外宣告它**。這樣可以減少縮排的層級，讓程式碼更易讀。

<Note>

上面的程式碼使用 if/else 語句，但習慣上在 reducer 中會使用 [switch 語句](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/switch)。雖然結果相同，但 switch 語句比較一目了然。

我們會在後續的文件中像這樣使用 switch 語句：

```js
function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('未知的 action: ' + action.type);
    }
  }
}
```

我們建議以大括號 `{` 和 `}` 包裹每個 `case` 區塊，這樣每個 `case` 中宣告的變數就不會彼此衝突。此外，`case` 通常應該以 `return` 作結尾。如果忘記用 `return`，程式碼會「掉到」下一個 `case`，就會導致錯誤！

如果你不習慣用 switch 語句，用 if/else 也完全沒問題。

</Note>

<DeepDive>

#### 為什麼用這種方式呼叫 Reducer？ {/*why-are-reducers-called-this-way*/}

雖然 reducer 可以「減少（reduce）」元件中程式碼的數量，但它的命名是來自針對陣列執行的 [`reduce()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) 操作。

針對陣列的 `reduce()` 操作能將多個數值「累加（accumulate）」成一個數值：

```
const arr = [1, 2, 3, 4, 5];
const sum = arr.reduce(
  (result, number) => result + number
); // 1 + 2 + 3 + 4 + 5
```

傳入 `reduce` 的函式也稱為「reducer」。它接收 _目前為止的結果_ 和 _當前項目_，並回傳 _新的結果_。React Reducer 以相同的概念為例：接收 _目前為止的狀態_ 和 _action_，並回傳 _新的狀態_。用這樣的方式可以累加 actions 到狀態中。

甚至可以傳入 reducer 函式給 `reduce()` 方法，搭配 `initialState` 和 `actions` 陣列來計算最終狀態：

<Sandpack>

```js src/index.js active
import tasksReducer from './tasksReducer.js';

let initialState = [];
let actions = [
  {type: 'added', id: 1, text: '參觀卡夫卡博物館'},
  {type: 'added', id: 2, text: '看木偶戲'},
  {type: 'deleted', id: 1},
  {type: 'added', id: 3, text: '在連儂牆打卡'},
];

let finalState = actions.reduce(tasksReducer, initialState);

const output = document.getElementById('output');
output.textContent = JSON.stringify(finalState, null, 2);
```

```js src/tasksReducer.js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('未知的 action: ' + action.type);
    }
  }
}
```

```html public/index.html
<pre id="output"></pre>
```

</Sandpack>

你通常不需要自己這樣做，因為 React 已經做了類似的處理！

</DeepDive>

### 步驟三：在元件中使用 Reducer {/*step-3-use-the-reducer-from-your-component*/}

最後一步，把 `tasksReducer` 接到你的元件上。從 React 引入 `useReducer` Hook：

```js
import { useReducer } from 'react';
```

接著就可以換掉 `useState`：

```js
const [tasks, setTasks] = useState(initialTasks);
```

像這樣用 `useReducer` 替換：

```js
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```

`useReducer` Hook 和 `useState` 很像——必須傳入一個初始狀態並回傳一個狀態值和設定狀態的方式（在這個例子中是一個派發函式）。但兩者有些微不同：

`useReducer` Hook 接收兩個引數：

1. Reducer 函式
2. 初始狀態

並回傳：

1. 狀態值
2. 派發函式（把使用者的 actions「派發」給 reducer）

現在一切就緒了！Reducer 被宣告在元件檔案的下方：

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>布拉格的行程</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('未知的 action: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: '參觀卡夫卡博物館', done: true},
  {id: 1, text: '看木偶戲', done: false},
  {id: 2, text: '在連儂牆打卡', done: false},
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="新增任務"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        新增
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>儲存</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>編輯</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>刪除</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

如果你想，甚至可以將 reducer 搬到另一個檔案：

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import tasksReducer from './tasksReducer.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>布拉格的行程</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: '參觀卡夫卡博物館', done: true},
  {id: 1, text: '看木偶戲', done: false},
  {id: 2, text: '在連儂牆打卡', done: false},
];
```

```js src/tasksReducer.js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('未知的 action: ' + action.type);
    }
  }
}
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="新增任務"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        新增
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>儲存</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>編輯</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>刪除</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

像上面這樣分開考慮，元件的邏輯就會更好讀。現在事件處理函式就只以派發 actions 來指定 _發生了什麼事_，reducer 函式則根據 actions 來決定 _狀態如何被更新_。

## 比較 `useState` 和 `useReducer` {/*comparing-usestate-and-usereducer*/}

Reducer 並非完美無缺！以下是一些可以比較的地方：

- **程式碼大小**：一般來說，先用 `useState` 可以寫比較少的程式碼。用 `useReducer` 的話，必須同時撰寫 reducer 函式 _和_ 派發 actions。不過如果有很多用類似方法修改狀態的事件處理函式，`useReducer` 能幫忙減少程式碼的數量。
- **可讀性**：當狀態更新很簡單時，`useState` 的寫法很好讀。但變複雜時，元件的程式碼會暴增，也變得難以瀏覽。這種情況下，`useReducer` 能夠清楚地區分狀態 _如何_ 更新及事件處理函式中 _發生了什麼事_。
- **除錯**：當 `useState` 有 bug 時，很難去說狀態在 _哪裡_ 和 _為什麼_ 被錯誤設定。用 `useReducer` 的話，可以在 reducer 加入 console log 來檢視每個狀態更新及 _為什麼_ 會發生（根據每個 `action`）。如果每個 `action` 都是正確的，你就能知道錯誤是在 reducer 的邏輯本身。不過相較於 `useState`，就必須追蹤更多的程式碼。
- **測試**：reducer 是純函式，不依賴元件。也就是說，你可以單獨測試它。雖然一般而言最好是在更真實的環境測試元件，在狀態更新邏輯較複雜時，針對特定的初始狀態和 action，斷言（assert）reducer 回傳的狀態會特別有幫助。
- **個人偏好**：有些人喜歡 reducer，有些人不喜歡。這沒關係。只是個人偏好。可以隨時在 `useState` 和 `useReducer` 中間擺盪：它們在功能上是等價的！

如果你常常因為某些元件錯誤的狀態更新而遇到 bug，而且想要採用更有結構的程式碼，我們建議你使用 reducer。不需要在所有的地方使用 reducer：盡情混用與搭配！甚至可以在元件裡同時使用 `useState` 和 `useReducer`。

## 撰寫良好的 Reducer {/*writing-reducers-well*/}

撰寫 reducer 時，記得這兩個重點：

- **Reducer 必須是純函式。** 類似於[狀態更新函式（state updater functions）](/learn/queueing-a-series-of-state-updates)，reducer 會在渲染中執行！（Actions 會被放在佇列中直到下次渲染。）這意味著 reducer [必須是純函式](/learn/keeping-components-pure)——同樣的輸入永遠會是同樣的輸出。reducer 不應該用來傳送請求、排程逾時任務（timeouts）或執行任何副作用（影響元件以外事物的操作）。Reducer 應該避免用改動（mutation）的方式更新[物件](/learn/updating-objects-in-state)和[陣列](/learn/updating-arrays-in-state)。
- **即使一個 action 會導致多個資料改變，每個 action 都應該只描述一個使用者的互動。** 舉例來說，如果使用者按下由 reducer 管理、有五個欄位的表單的「重設」按鈕，比起五個分別的 `set_field` actions，派發一個 `reset_form` action 更為合理。如果你記錄 reducer 中所有的 action，這些紀錄應該能很清楚重建這些互動或回應發生的順序。這對除錯很有幫助！

## 用 Immer 撰寫簡潔的 Reducer {/*writing-concise-reducers-with-immer*/}

就像在一般的狀態中[更新物件](/learn/updating-objects-in-state#write-concise-update-logic-with-immer)和[陣列](/learn/updating-arrays-in-state#write-concise-update-logic-with-immer)一樣，可以用 Immer 函式庫讓 reducer 更為簡潔。[`useImmerReducer`](https://github.com/immerjs/use-immer#useimmerreducer) 能讓你用 `push` 或 `arr[i] =` 賦值來改動狀態：

<Sandpack>

```js src/App.js
import { useImmerReducer } from 'use-immer';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(draft, action) {
  switch (action.type) {
    case 'added': {
      draft.push({
        id: action.id,
        text: action.text,
        done: false,
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex((t) => t.id === action.task.id);
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('未知的 action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useImmerReducer(tasksReducer, initialTasks);

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>布拉格的行程</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: '參觀卡夫卡博物館', done: true},
  {id: 1, text: '看木偶戲', done: false},
  {id: 2, text: '在連儂牆打卡', done: false},
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="新增任務"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        新增
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>儲存</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>編輯</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>刪除</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
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

Reducer 必須是純函式，因此不應該改動（mutate）狀態。但 Immer 提供一個特別的 `draft` 物件可以安全地改動。在底層，Immer 會根據你對 `draft` 的改變，建立一份狀態的副本。這就是為什麼 `useImmerReducer` 所管理的 reducer 可以改動第一個引數，而不需要回傳狀態。

<Recap>

- 要將 `useState` 轉換成 `useReducer` 的話：
  1. 在事件處理函式中派發 actions。
  2. 撰寫 reducer 函式，根據給予的狀態和 action 回傳新的狀態。
  3. 以 `useReducer` 替代 `useState`。
- Reducer 需要多寫一些程式碼，但對除錯和測試有幫助。
- Reducer 必須是純函式。
- 每個 action 描述一個使用者的互動。
- 如果想要用改動的方式撰寫 reducer，可以使用 Immer。

</Recap>

<Challenges>

#### 在事件處理函式中派發 actions {/*dispatch-actions-from-event-handlers*/}

現在 `ContactList.js` 和 `Chat.js` 中的事件處理函式有 `// TODO` 註解。這是在輸入框中打字會無效的原因，也是為什麼點擊按鈕不會改變所選的聯絡人。

用對應 actions 的 `dispatch` 程式碼來替換這兩個 `// TODO`。查看 `messengerReducer.js` 中的 reducer 來確認所需的結構和 actions 的類型。Reducer 已經寫好了，你不需要改寫它。只需要派發 `ContactList.js` 和 `Chat.js` 中的 actions。

<Hint>

在這兩個元件中，`dispatch` 函式已經作為參數傳入，所以可以直接使用。你應該以對應的 action 物件來呼叫 `dispatch`。

要確認 action 物件的結構，可以查看 reducer 並確認需要哪些 `action` 的欄位。舉例來說，reducer 中的 `changed_selection` case 看起來像這樣：

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId
  };
}
```

這表示你的 action 物件應該要有一個 `type: 'changed_selection'`。這裡也可以看到 `action.contactId` 被使用，因此應該要在你的 action 中包含 `contactId` 這個屬性。

</Hint>

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: '哈囉',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('未知的 action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                // TODO: 派發 changed_selection
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          // TODO: 派發 edited_message
          // (從 e.target.value 讀取輸入值)
        }}
      />
      <br />
      <button>傳送到 {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

從 reducer 的程式碼可以推測 actions 應該要看起來像這樣：

```js
// 當使用者按下「Alice」
dispatch({
  type: 'changed_selection',
  contactId: 1,
});

// 當使用者輸入「哈囉！」
dispatch({
  type: 'edited_message',
  message: '哈囉！',
});
```

以下是派發對應訊息的範例：

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: '哈囉',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('未知的 action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'和' + contact.name + '聊天'}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button>傳送到 {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

</Solution>

#### 送出訊息時清空輸入框 {/*clear-the-input-on-sending-a-message*/}

現在點擊「送出」沒有作用。新增處理以下兩點的事件處理函式給「送出」按鈕：

1. 顯示一個 `alert`，包含聯絡人的信箱和訊息。
2. 清空訊息輸入框。

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: '哈囉',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('未知的 action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'和 ' + contact.name + ' 聊天'}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button>傳送到 {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

可以用一些方式撰寫「送出」按鈕的事件處理函式。其中一個方法是顯示一個提示視窗（alert），並派發包含空白 `message` 的 `edited_message` action：

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: '哈囉',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('未知的 action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'和 ' + contact.name + ' 聊天'}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`傳送「${message}」到 ${contact.email}`);
          dispatch({
            type: 'edited_message',
            message: '',
          });
        }}>
        傳送到 {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

這麼做是可行的，也會在你點擊「送出」時清空輸入框。

不過，_以使用者的觀點來說_，送出訊息和編輯欄位是不同的 action。作為應對，應該建立一個 _新的_ action ，也就是 `sent_message` 來代替，並在 reducer 中分別處理：

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js active
export const initialState = {
  selectedId: 0,
  message: '哈囉',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: '',
      };
    }
    default: {
      throw Error('未知的 action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'和 ' + contact.name + ' 聊天'}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`傳送「${message}」到 ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        傳送到 {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

結果上行為是相同的。但要記得 action 的類型理想中應該要描述「使用者做了什麼」，而不是「你希望狀態如何改變」。這樣之後會比較容易新增更多功能。

不管是哪個解法，很重要的一點是 **不要** 把 `alert` 放在 reducer 中。Reducer 應該要是純函式——只負責計算新的狀態。它不該「做」任何事，包含不該顯示訊息給使用者。顯示訊息的這件事應該在發生在事件處理函式中。（為了抓到這類型的錯誤，React 在嚴格模式中會多次呼叫你的 reducer。這也是為什麼如果你將警告放在 reducer 中，它會觸發兩次。）

</Solution>

#### 切換分頁（tabs）時恢復輸入內容 {/*restore-input-values-when-switching-between-tabs*/}

在這個範例中，切換不同的聯絡人會清空文字輸入框：

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId,
    message: '' // 清空輸入框
  };
```

這是因為你不會想在多個聯絡人之間共用一個訊息草稿（draft）。但如果你的應用能「記得」每個聯絡人的草稿，並在切換聯絡人的時候把它還原回來會更好。

你的任務是去改變狀態的結構，讓你能為 _每個聯絡人_ 分別記住一份訊息草稿。你需要對 reducer、初始狀態和元件做一些改變。

<Hint>

可以像這樣構成你的狀態：

```js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor', // contactId = 0 時的草稿
    1: 'Hello, Alice', // contactId = 1 時的草稿
  },
};
```

`[key]: value` [計算屬性（computed property）](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#computed_property_names)語法能幫你更新 `messages` 物件：

```js
{
  ...state.messages,
  [id]: message
}
```

</Hint>

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: '哈囉',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: '',
      };
    }
    default: {
      throw Error('未知的 action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'和 ' + contact.name + ' 聊天'}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`傳送「${message}」到 ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        傳送到 {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

你應該更新 reducer 來儲存和更新每個聯絡人分別的訊息草稿：

```js
// 當輸入框被編輯：
case 'edited_message': {
  return {
    // 保留其他的狀態，例如所選項目
    ...state,
    messages: {
      // 保留其他聯絡人的訊息
      ...state.messages,
      // 但改變所選的聯絡人的訊息
      [state.selectedId]: action.message
    }
  };
}
```

也要更新 `Messenger` 元件來讀取當前所選聯絡人的訊息：

```js
const message = state.messages[state.selectedId];
```

以下是完整的解法：

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: '哈囉， Taylor',
    1: '哈囉， Alice',
    2: '哈囉， Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('未知的 action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'和 ' + contact.name + '聊天'}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`傳送「${message}」到 ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        傳送到 {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

值得注意的是，不需要改寫任何一個事件處理函式來實現上述的行為。但如果沒有 reducer，就必須改寫每一個更新狀態的事件處理函式。

</Solution>

#### 從零開始實作 `useReducer` {/*implement-usereducer-from-scratch*/}

前面的範例是從 React 引入 `useReducer`。這次直接來實作 _`useReducer` Hook 本身_！下面有一段虛設常式（stub）幫助你開始。應該不會寫超過十行的程式碼。

試著在輸入框中打字或選擇聯絡人來測試你的改寫：

<Hint>

以下是更詳細的實作草稿：

```js
export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    // ？？？
  }

  return [state, dispatch];
}
```

記得 reducer 函式接收兩個引數——當前狀態和 action 物件，並回傳新的狀態。你的 `dispatch` 實作應該怎麼使用它呢？

</Hint>

<Sandpack>

```js src/App.js
import { useReducer } from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('未知的 action: ' + action.type);
    }
  }
}
```

```js src/MyReact.js active
import { useState } from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  // ???

  return [state, dispatch];
}
```

```js src/ContactList.js hidden
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js hidden
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

Dispatching an action calls a reducer with the current state and the action, and stores the result as the next state. This is what it looks like in code:

<Sandpack>

```js src/App.js
import { useReducer } from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: '哈囉， Taylor',
    1: '哈囉， Alice',
    2: '哈囉， Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('未知的 action: ' + action.type);
    }
  }
}
```

```js src/MyReact.js active
import { useState } from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```

```js src/ContactList.js hidden
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js hidden
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'和 ' + contact.name + ' 聊天'}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`傳送「${message}」到 ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        傳送到 {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

雖然在大部分的情形下不是很重要，這是更精準一點的實作：

```js
function dispatch(action) {
  setState((s) => reducer(s, action));
}
```

這是因為被派發的 actions 會在佇列中直到下次渲染，[與更新函式類似](/learn/queueing-a-series-of-state-updates)。

</Solution>

</Challenges>
