---
title: '使用Refs來引用值'
---

<Intro>

當你想要一個component能夠去「記住」一些資訊時，但卻不想那些資訊會[觸發新的Renders](/learn/render-and-commit)時，你可以使用*ref*。

</Intro>

<YouWillLearn>

- 如何將Ref加入Component
- 如何更新Ref的值
- Refs與State的分別
- 如何安全地使用Refs

</YouWillLearn>

## 將Ref加入Component {/*adding-a-ref-to-your-component*/}

你可以透過引入React `useRef`的hook來新增ref到你的component：

```js
import { useRef } from 'react';
```

在component內，你可以透過調用`useRef` hook並將您要引用的初始值作為唯一的參數傳遞。例如，這是對值“0”的引用：

```js
const ref = useRef(0);
```

`useRef`會返回一個這樣的對象：

```js
{ 
  current: 0 // 你傳遞到useRef的值
}
```

<Illustration src="/images/docs/illustrations/i_ref.png" alt="一個寫著current的箭頭符號塞進了一個名為ref的口袋裡。" />

您可以透過`ref.current`屬性訪問該ref當前的值。這個值是可變的，這意味著您可以對這個值進行讀取和寫入。他就像是你component內的隱藏口袋般，無法被react追蹤。（這使它成為React單向數據流的"逃脫出口"的原因，更多內容見下文！）

下面是一個有關按鈕的例子，每次點擊這個按鈕都會對`ref.current`進行增量：

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('你點擊了' + ref.current + '次！');
  }

  return (
    <button onClick={handleClick}>
      點擊我!
    </button>
  );
}
```

</Sandpack>

剛剛例子的ref指向了一個數字，但像[state](/learn/state-a-components-memory)一樣，您可以指向任何東西：一個字符串(string)、一個對象(object)，甚至是一個函數(function)。 與state不同，ref是一個普通的JavaScript對象，具有您可以讀取和修改的"current"屬性。

請注意，**component不會在每次增量時重新渲染。** 與state一樣，React會在重新渲染之間保留refs。但是，設置state會重新渲染component。但設置ref並不會！

## 示例：構建計時器 {/*example-building-a-stopwatch*/}

您可以將refs和state組合在一個component中。 讓我們製作一個計時器作為例子，用戶可以透過按下按鈕來啟動或停止。為了顯示自用戶按下"開始"之後經過了多長時間，您需要持續追蹤按下“開始”按鈕的時間以及當前時間。**這個訊息會用於渲染，因此你必須保持它的state：**

```js
const [startTime, setStartTime] = useState(null);
const [now, setNow] = useState(null);
```

當用戶按下“開始”之後，你需要使用[`setInterval`](https://developer.mozilla.org/docs/Web/API/setInterval)來進行每10毫秒的時間更新：

<Sandpack>

```js
import { useState } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);

  function handleStart() {
    // 開始計時
    setStartTime(Date.now());
    setNow(Date.now());

    setInterval(() => {
      // 每10毫秒的時間更新
      setNow(Date.now());
    }, 10);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>已過去的時間：{secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        開始
      </button>
    </>
  );
}
```

</Sandpack>

當按下“停止”按鈕時，您需要取消現有的間interval，以便它停止更新`now`的state變量。您可以通過調用[`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)來執行此操作，但您需要為其提供先前在用戶按下"開始"時調用`setInterval`的Interval ID。您需要將Interval ID保存在某處。**由於Interval ID不會用於渲染，您可以將其保存在ref：**

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>已過去的時間：{secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        開始
      </button>
      <button onClick={handleStop}>
        停止
      </button>
    </>
  );
}
```

</Sandpack>

當信息會用於渲染時，保持它的state。當信息僅用於事件處理程序(event handler)並且更改它時不需要重新渲染，使用ref可能更好。

## Refs與State的分別 {/*differences-between-refs-and-state*/}

也許您認為refs似乎沒有state“嚴格”。例如，您可以改變它們而不總是要使用state設置函數。但在大多數情況下，您會使用state。Refs是一個你不會經常需要的“逃脫出口”。以下是state和refs的比較：

| refs                                                                                  | state                                                                                                                     |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `useRef(initialValue)` 會返回 `{ current: initialValue }`                              | `useState(initialValue)` 返回state變量的當前值和state的設置函數(function) ( `[value, setValue]`)                            |
| 更改時，不會觸發重新渲染。                                                               | 更改時，會觸發重新渲染。                                                                                                    |
| 可變，您可以在渲染過程之外修改和更新"current"的值。                                       | 不可變，你必須使用state設置函數來修改state變量並重新渲染。                                                                    |
| 您不應該在渲染期間讀取（或寫入）"current"值。                                            | 您可以隨時讀取state。但是，每次渲染都有自己的[snapshot](/learn/state-as-a-snapshot)狀態，不會改變。                            |

這是一個用實現state的計數器按鈕：

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
      你點擊了{count}次
    </button>
  );
}
```

</Sandpack>

因為顯示了`count`值，所以為它使用state值是有意義的。當使用setCount()來設置計數器的值時，React會重新渲染component並更新屏幕以反映新的count。

如果你用一個ref來實現它，React永遠不會重新渲染組件，所以你也永遠不會看到計數器發生變化！來看看點擊此按鈕如何**不更新值**：

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let countRef = useRef(0);

  function handleClick() {
    // 這不會重新渲染component！
    countRef.current = countRef.current + 1;
  }

  return (
    <button onClick={handleClick}>
      你點擊了{countRef.current}次
    </button>
  );
}
```

</Sandpack>

這就是為什麼在渲染期間讀取`ref.current`會導致代碼不可靠的原因。如有需要，請改用state。

<DeepDive>

#### useRef是如何在內部工作的？ {/*how-does-use-ref-work-inside*/}

儘管`useState`和`useRef`都是由React提供的，但原則上`useRef`可以在`useState`之上實現。你可以想像在React內部，`useRef`是這樣實現的：

```js
// React內部
function useRef(initialValue) {
  const [ref, unused] = useState({ current: initialValue });
  return ref;
}
```

在第一次渲染期間，`useRef`返回`{ current: initialValue }`。該對象由React存儲，因此在下一次渲染期間將返回相同的對象。請注意此示例中未使用state設置器的方式。這是不必要的，因為`useRef`總是需要返回同一個對象！

React提供了一個內建的`useRef`，因為它在做法中很常見。但是您可以將其視為沒有設置器的常規state變量。如果您熟悉物件導向程式設計(Object-Oriented Programming)，refs可能會讓您想起實例字段，但您寫的不是`this.something`，而是`somethingRef.current`。

</DeepDive>

## 何時使用refs {/*when-to-use-refs*/}

通常，您會使用ref是在您的component需要”走出”React並與外部API通信時，而大多數瀏覽器API是不會影響組件外觀的。但以下是其中一些罕見的情況：

- 儲存[timeout IDs](https://developer.mozilla.org/docs/Web/API/setTimeout)
- 儲存和操作[DOM elements](https://developer.mozilla.org/docs/Web/API/Element)，我們會在[下一頁](/learn/manipulating-the-dom-with-refs)提到
- 存儲一些計算JSX時不需要的對象(object)。

如果您的component需要存儲一些值，但不會影響渲染邏輯時，請選擇refs。

## Refs的最佳實踐 {/*best-practices-for-refs*/}

遵循這些原則將使您的components更具可預測性：

- **將refs視為逃脫出口。** 當您使用外部系統或瀏覽器API時，refs很有用。但如果您大部分應用邏輯和數據流都依賴於refs，您可能需要重新考慮您的方法。

- **不要在渲染(rendering)期間讀取或寫入`ref.current`。** 如果在渲染期間需要某些信息，請改用[state](/learn/state-a-components-memory)。由於React不知道`ref.current`何時更改，即使在渲染時讀取它也會使您的組件的行為難以預測。（唯一的例外是像`if (!ref.current) ref.current = new Thing()`這樣的代碼，它只在第一次渲染期間設置一次ref。）

React state的限制不適用於refs。例如state就像[每次渲染的快照(snapshot)](/learn/state-as-a-snapshot)和[不同步更新。](/learn/queueing-a-series-of-state-updates)但是當你改變ref當前的值時，它會立刻改變：

```js
ref.current = 5;
console.log(ref.current); // 5
```

這是因為**ref本身就是一個普通的JavaScript對象(object)，** 所以他們的行為也一樣。

當您使用ref時，您也不必擔心[避免突變(mutation)](/learn/updating-objects-in-state)。只要你正在改變的對像(object)不會用於渲染，React就不會關心你對 ref或其內容搞了什麼鬼。

## Refs和DOM {/*refs-and-the-dom*/}

您可以將ref指向任何值。但ref最常見的用例是用於訪問DOM。例如，如果您想以編程方式聚焦(focus)輸入(input)，這會很方便。當您將ref傳遞給JSX中的`ref`屬性時，例如`<div ref={myRef}>`，React會將相應的DOM元素放入`myRef.current`中。您可以在[使用Refs操作DOM](/learn/manipulating-the-dom-with-refs)中閱讀更多相關信息。

<Recap>

- Refs是一個逃脫出口，用於保留"未用於渲染的值"。因此你不會經常需要它們。
- ref是一個純JavaScript對象，具有一個名為"current"的屬性，您可以讀取或設置該屬性。
- 你可以通過調用`useRef` Hook讓React給你一個ref。
- 與state一樣，refs讓您在component重新渲染之間保留信息。
- 與state不同，設置ref的"current"值不會觸發重新渲染。
- 不要在渲染過程中讀取或寫入`ref.current`，這使您的組件難以預測。

</Recap>



<Challenges>

#### 修復損壞的聊天input {/*fix-a-broken-chat-input*/}

鍵入信息並單擊"發送"。您會發現到在看到"已發送！"警報(alert)之前有3秒的延遲。在此延遲期間，您可以看到一個"撤消"按鈕。當你點擊它，這個"撤消"按鈕應該要停止"發送！"出現的信息。它通過調用[`clearTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout)來獲取在`handleSend`期間保存的Timeout ID。但是，即使在單擊"撤消"之後，"已發送！"消息仍然出現。找到它不起作用的原因，並修復它吧！

<Hint>

通常像`let timeoutID`這樣的變量不會在重新渲染(re-renders)之間“存活”，因為每次渲染(render)都會從頭開始運行您的component（並初始化(initializes)其變量）。或許你您應該將timeoutID保存在其他地方...?

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  let timeoutID = null;

  function handleSend() {
    setIsSending(true);
    timeoutID = setTimeout(() => {
      alert('已發送！');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutID);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? '發送中...' : '發送'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          撤消
        </button>
      }
    </>
  );
}
```

</Sandpack>

<Solution>

每當您的component重新渲染時（例如當您設置state時），所有局部變量都會從頭開始初始化。這就是為什麼您不能將timeout ID保存在像`timeoutID`這樣的局部變量中，然後期望另一個事件處理程序(event handler)來"處理"它。相反，將它存儲在一個ref中，React將在渲染之間保留它。

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const timeoutRef = useRef(null);

  function handleSend() {
    setIsSending(true);
    timeoutRef.current = setTimeout(() => {
      alert('已發送！');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutRef.current);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? '發送中...' : '發送'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          撤消
        </button>
      }
    </>
  );
}
```

</Sandpack>

</Solution>


#### 修復無法重新渲染的component {/*fix-a-component-failing-to-re-render*/}

這個按鈕應該在顯示"打開"和"關閉"之間切換。但是，它始終顯示"關閉"。你可以看看這段代碼有什麼問題並修復它嗎？

<Sandpack>

```js
import { useRef } from 'react';

export default function Toggle() {
  const isOnRef = useRef(false);

  return (
    <button onClick={() => {
      isOnRef.current = !isOnRef.current;
    }}>
      {isOnRef.current ? '打開' : '關閉'}
    </button>
  );
}
```

</Sandpack>

<Solution>

在此示例中，ref的當前值用於計算渲染的輸出：`{isOnRef.current ? '打開'：'關閉'}`。這表明此信息不應該放在ref中，而是放在state中。要修復它，可以刪除ref並改用state：

<Sandpack>

```js
import { useState } from 'react';

export default function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button onClick={() => {
      setIsOn(!isOn);
    }}>
      {isOn ? '打開' : '關閉'}
    </button>
  );
}
```

</Sandpack>

</Solution>

#### 修復debouncing {/*fix-debouncing*/}

在此示例中，所有按鈕點擊處理程序都是["debounced"](https://redd.one/blog/debounce-vs-throttle)的。要理解這意味著什麼，你可以按一下按鈕。你可以看到消息是如何在一秒鐘後出現的。如果您在等待消息時按下按鈕，計時器將會重置。因此，如果您連續多次快速點擊同一個按鈕，該消息將會在您停止點擊*之後*一秒後才會出現。Debouncing可以讓你延遲一些action，直到用戶"停止做一些事"。

此示例是可以用的，但并不完美。每一個按鈕都不是獨立的。要查看問題，你可以點擊其中一個按鈕，然後立即點擊另一個按鈕。延遲之後，您應該會看到兩個按鈕的消息。但此示例只顯示到最後一個按鈕的消息。第一個按鈕的消息被丟失了。

為什麼按鈕會被相互干擾呢？你可以查找並修復問題嗎？

<Hint>

最後一個timeout ID的變量在所有`DebouncedButton`組件之間共享。這就是為什麼點擊一個按鈕時，會重置另一個按鈕的timeout。您可以為每個按鈕存儲一個單獨的timeout ID嗎？

</Hint>

<Sandpack>

```js
let timeoutID;

function DebouncedButton({ onClick, children }) {
  return (
    <button onClick={() => {
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('太空船發射！一飛沖天！')}
      >
        發射太空船
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('湯煮好了！過來喝吧！')}
      >
        來煮個湯
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('一閃一閃亮晶晶，滿天都是小星星！')}
      >
        來唱個搖籃曲
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

<Solution>

像`timeoutID`這樣的變量在所有組件之間共享就是為什麼點擊第二個按鈕會重置第一個按鈕timeout的原因。要解決這個問題，您可以在ref中保持timeout。每個按鈕都有自己的ref，因此它們不會相互衝突。你可以看看快速點擊兩個按鈕將如何顯示兩條消息。

<Sandpack>

```js
import { useRef } from 'react';

function DebouncedButton({ onClick, children }) {
  const timeoutRef = useRef(null);
  return (
    <button onClick={() => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('太空船發射！一飛沖天！')}
      >
        發射太空船
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('湯煮好了！過來喝吧！')}
      >
        來煮個湯
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('一閃一閃亮晶晶，滿天都是小星星！')}
      >
        來唱個搖籃曲
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

</Solution>

#### 讀取最新的state {/*read-the-latest-state*/}

在此示例中，在您按下"發送"後，在顯示消息之前會有一小段延遲。輸入"hello"，並按"發送"，然後再次快速編輯輸入。儘管您進行了編輯，警報(alert)仍會顯示"hello"（這是[當時](/learn/state-as-a-snapshot#state-over-time)點擊按鈕時state的值 ）。

通常這會是您希望在應用程序中實現的行為。但有時可能您會想一些異步代碼能夠讀取某些state的*最新*版本。因此你能想出一種方法讓警報(alert)顯示*當前*輸入的文本而不是點擊時的內容嗎？

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');

  function handleSend() {
    setTimeout(() => {
      alert('發送了：' + text);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        onClick={handleSend}>
        發送
      </button>
    </>
  );
}
```

</Sandpack>

<Solution>

State[就像快照](/learn/state-as-a-snapshot)一樣，所以你不能從像timeout這樣的異步操作中讀取最新的狀態。但是，您可以將最新的輸入文本保留在ref中。ref是可變的，因此您可以隨時讀取"current"屬性。由於當前文本也用於渲染，因此在此示例中，您將需要*兩個*狀態變量（用於渲染），*和*一個ref（在timeout時讀取它）。您將需要手動更新當前的ref值。

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const textRef = useRef(text);

  function handleChange(e) {
    setText(e.target.value);
    textRef.current = e.target.value;
  }

  function handleSend() {
    setTimeout(() => {
      alert('發送了：' + textRef.current);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={handleChange}
      />
      <button
        onClick={handleSend}>
        發送
      </button>
    </>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
