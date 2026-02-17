---
title: 使用 Reducer 和 Context 擴充應用程式
---

<Intro>

Reducers 可以整合元件的狀態更新邏輯。Context 能將資訊深入向下傳遞到其他的元件。你可以混用 reducer 和 context 來管理複雜畫面的狀態。

</Intro>

<YouWillLearn>

* 如何混用 reducer 和 context
* 如何避免藉由屬性（props）傳送狀態和派發 action
* 如何維持不同檔案中的 context 和狀態邏輯

</YouWillLearn>

## 混用 reducer 和 context {/*combining-a-reducer-with-context*/}

在[介紹 reducer](/learn/extracting-state-logic-into-a-reducer)的例子中，狀態是由 reducer 所管理。Reducer 函式包含所有的狀態邏輯，並被宣告於檔案的下方：

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

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
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>放假去京都</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
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

let nextId = 3;
const initialTasks = [
  { id: 0, text: '哲學之道', done: true },
  { id: 1, text: '參觀寺廟', done: false },
  { id: 2, text: '喝抹茶', done: false }
];
```

```js src/AddTask.js
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="新增任務"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>新增</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
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
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
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

Reducer 可以讓事件處理函式保持簡潔。不過隨著應用程式成長，可能會遭遇另一種困境。**現在 `task` 狀態和 `dispatch` 函式只在 `TaskApp` 元件的頂層才能使用。** 要讓其他元件讀取任務清單或改變任務，需要另外[向下傳遞](/learn/passing-props-to-a-component)當前狀態並讓事件處理函式作為屬性來改變任務。

舉例來說，`TaskApp` 將一個任務清單和一些事件處理函式傳入 `TaskList`：

```js
<TaskList
  tasks={tasks}
  onChangeTask={handleChangeTask}
  onDeleteTask={handleDeleteTask}
/>
```

`TaskList` 將這些事件處理函式傳給 `Task`：

```js
<Task
  task={task}
  onChange={onChangeTask}
  onDelete={onDeleteTask}
/>
```

在這樣的小範例中，它可以作用得很好，但如果你有數以百計的元件在中間，要把所有的狀態和函式都向下傳遞，會很令人挫折！

這就是為什麼，作為傳遞屬性的替代方案，你可能會想把 `tasks` 狀態和 `dispatch` 函式都[放進 context](/learn/passing-data-deeply-with-context)。
**這樣一來，`TaskApp` 樹底下的任何元件都能讀取到任務及派發 action，而不用重複「層層傳遞屬性（prop drilling）」。**

以下是混用 reducer 和 context 的方法：

1. **創建** context。
2. 將狀態和派發函式 **放入** context。
3. 在樹的任何地方 **使用** context。

### 步驟一：創建 context {/*step-1-create-the-context*/}

`useReducer` Hook 會回傳當前的 `tasks` 和用來更新 `tasks` 的 `dispatch` 函式：

```js
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```

為了把狀態跟函式往樹的下方傳遞，必須[創建](/learn/passing-data-deeply-with-context#step-2-use-the-context)兩個分別的 context：

- `TasksContext` 提供目前的任務清單。
- `TasksDispatchContext` 提供讓元件派發 action 的函式。

從一個分別的檔案導出（export）這兩個 context，之後才能在其他檔案引入：

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

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
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>放假去京都</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
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

let nextId = 3;
const initialTasks = [
  { id: 0, text: '哲學之道', done: true },
  { id: 1, text: '參觀寺廟', done: false },
  { id: 2, text: '喝抹茶', done: false }
];
```

```js src/TasksContext.js active
import { createContext } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);
```

```js src/AddTask.js
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="新增任務"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>新增</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
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
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
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

以上傳入 `null` 作為兩個 context 的預設值。確切的數值會由 `TaskApp` 元件提供。

### 步驟二：將狀態和派發函式放入 context {/*step-2-put-state-and-dispatch-into-context*/}

現在你可以引入兩個 context 到 `TaskApp` 元件了。取得 `useReducer()` 回傳的 `tasks` 和 `dispatch`，並[提供](/learn/passing-data-deeply-with-context#step-3-provide-the-context)給下面的整棵樹：

```js {4,7-8}
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
  // ...
  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        ...
      </TasksDispatchContext>
    </TasksContext>
  );
}
```

目前為止，你同時藉由屬性和 context 傳遞這些資訊：

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

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
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        <h1>放假去京都</h1>
        <AddTask
          onAddTask={handleAddTask}
        />
        <TaskList
          tasks={tasks}
          onChangeTask={handleChangeTask}
          onDeleteTask={handleDeleteTask}
        />
      </TasksDispatchContext>
    </TasksContext>
  );
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

let nextId = 3;
const initialTasks = [
  { id: 0, text: '哲學之道', done: true },
  { id: 1, text: '參觀寺廟', done: false },
  { id: 2, text: '喝抹茶', done: false }
];
```

```js src/TasksContext.js
import { createContext } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);
```

```js src/AddTask.js
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="新增任務"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>新增</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
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
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
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

在下個步驟中，將會移除屬性傳遞：

### 步驟三：在樹的任何地方使用 context {/*step-3-use-context-anywhere-in-the-tree*/}

現在不用向下傳遞任務清單或事件處理函式了：

```js {4-5}
<TasksContext value={tasks}>
  <TasksDispatchContext value={dispatch}>
    <h1>放假去京都</h1>
    <AddTask />
    <TaskList />
  </TasksDispatchContext>
</TasksContext>
```

任何需要任務清單的元件，可以從 `TasksContext` 讀取：

```js {2}
export default function TaskList() {
  const tasks = useContext(TasksContext);
  // ...
```

想要更新任務清單的話，任何元件都可以讀取 context 中的 `dispatch` 函式並呼叫它：

```js {3,9-13}
export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useContext(TasksDispatchContext);
  // ...
  return (
    // ...
    <button onClick={() => {
      setText('');
      dispatch({
        type: 'added',
        id: nextId++,
        text: text,
      });
    }}>新增</button>
    // ...
```

**`TaskApp` 元件不會將任何事件處理函式向下傳遞，`TaskList` 也不會向下傳遞任何事件處理函式給 `Task` 元件。** 每個元件都只會讀取所需的 context：

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        <h1>放假去京都</h1>
        <AddTask />
        <TaskList />
      </TasksDispatchContext>
    </TasksContext>
  );
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

```js src/TasksContext.js
import { createContext } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);
```

```js src/AddTask.js
import { useState, useContext } from 'react';
import { TasksDispatchContext } from './TasksContext.js';

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useContext(TasksDispatchContext);
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

```js src/TaskList.js active
import { useState, useContext } from 'react';
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

export default function TaskList() {
  const tasks = useContext(TasksContext);
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
  const dispatch = useContext(TasksDispatchContext);
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

**狀態仍然「活在」`TaskApp` 元件的頂層，並由 `useReducer` 管理。** 但 `tasks` 和 `dispatch` 現在可以被樹底下的所有元件藉由引入和使用這些 context 來取得。

## 將程式碼移到獨立的檔案 {/*moving-all-wiring-into-a-single-file*/}

雖然不一定要這麼做，但可以將 reducer 和 context 移到獨立的檔案，以進一步整理這些元件。現在 `TasksContext.js` 只包含兩個 context 的宣告：

```js
import { createContext } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);
```

這個檔案逐漸變得擁擠！你將會移動 reducer 到同一個檔案，接著你會宣告一個新的 `TasksProvider` 元件在同一個檔案裡。這個元件會將這些片段綁在一起：

1. 元件會用 reducer 管理狀態。
2. 元件會提供兩個 context 給下面的這些元件。
3. 元件會[以 `children` 作為屬性](/learn/passing-props-to-a-component#passing-jsx-as-children)，因此你能傳入 JSX 給它。

```js
export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        {children}
      </TasksDispatchContext>
    </TasksContext>
  );
}
```

**這會移除 `TaskApp` 元件中所有複雜的程式碼和串接：**

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
import { createContext, useReducer } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);

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
import { TasksDispatchContext } from './TasksContext.js';

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useContext(TasksDispatchContext);
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
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

export default function TaskList() {
  const tasks = useContext(TasksContext);
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
  const dispatch = useContext(TasksDispatchContext);
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

也可以從 `TasksContext.js` 導出 _使用_ 到 context 的這些函式：

```js
export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}
```

當元件需要讀取 context 時，可以透過這些函式：

```js
const tasks = useTasks();
const dispatch = useTasksDispatch();
```

這不會以任何方式改變行為，但會使之後進一步拆分這些 context 或增加一些函式中的邏輯。 **現在所有的 context 和 reducer 串接都在 `TaskContext.js` 裡了。這能使元件保持乾淨及簡潔，並專注於要呈現的是什麼，而不是從何處獲取資料：**

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
import { useState } from 'react';
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

```js src/TaskList.js active
import { useState } from 'react';
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

你可以將 `TasksProvider` 考慮為畫面的一部份，它知道怎麼處理任務；把 `useTasks` 視為讀取任務的方式；並把 `useTasksDispatch` 視為在樹下任一元件更新任務的方式。

<Note>

像 `useTasks` 和 `useTasksDispatch` 這樣的函式被稱為 *[自定義（Custom） Hooks](/learn/reusing-logic-with-custom-hooks)*。當函式的命名以 `use` 開頭，就會被認為是自定義 Hook。這能讓你在像 `useContext` 這樣的其他 Hooks 中使用你的 Hook。

</Note>

隨著應用程式成長，你可能會有很多像這樣的 context 與 reducer 的配對。這是擴充應用程式的有效方式，且在需要從樹的深層取得資料時，不需要太多的工作，就能[抬升狀態](/learn/sharing-state-between-components)。

<Recap>

- 可以混用 reducer 和 context，讓任何元件讀取和更新元件上的狀態。
- 想提供狀態和派發函式給下方的元件的話：
  1. 創建兩個 context（給狀態和派發函式）。
  2. 由使用 reducer 的元件提供兩個 context。
  3. 在需要讀取的元件中使用 context。
- 可以將相關程式碼移動到獨立檔案，來進一步整理元件。
  - 可以導出像是 `TaskProvider` 這樣的元件來提供 context。
  - 也可以導出像是 `useTasks` 和 `useTasksDispatch` 這樣的自定義 Hooks 來讀取 context。
  - 在應用中可以有許多像這樣的 reducer 與 context 的配對。

</Recap>
