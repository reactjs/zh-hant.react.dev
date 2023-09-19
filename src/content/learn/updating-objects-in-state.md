---
title: 更新 State 內的 Object 
---

<Intro>

State 可以儲存任何 Javascript 的值，包含 object ，但你不應該直接在 React 的 state 中修改 object ；取而代之，當想要更新一個 object 時，你需要建立一個新的（或是複製既有的），接著使用副本設定 state 。

</Intro>

<YouWillLearn>

- 如何在 React state 中正確地更新 object 
- 如何更新一個巢狀的 object 且不改變它
- 什麼是 immutability 與如何避免破壞它
- 如何使用 Immer 減少 object 的重複複製

</YouWillLearn>

## 什麼是 Mutation? {/*whats-a-mutation*/}

你可以在 state 中儲存任何一種 Javascript 的值。

```js
const [x, setX] = useState(0);
```

至今你已經使用數字、字串以及布林值，這些 Javascript 的值是「不可改變的」，代表無法改變或「只能讀取」。你可以觸發一個 re-render 以*更新*值：

```js
setX(5);
```

`x` 的 state 從 `0` 被改成 `5` ，但未改變*數字 `0` 本身*；改變任何內建的 primitive value ，像是 Javascript 中的數字、字串與布林值是不可能的。

現在想像 state 中的 object ：

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

在技術上可以改變 *object 本身*的內容，**稱之為 mutation**：

```js
position.x = 5;
```

然而，雖然技術上在 React state 中的 object 是可改變的，但你仍需將它們**當成**是不可改變的——像數字、布林值與字串；比起改變它們，你應該總是更新它們。

## 將 State 視為只能讀取 {/*treat-state-as-read-only*/}

換句話說，你應該**把任何放到 state 內的 Javascript object 當成只能讀取**。

此案例是在 state 內儲存一個 object ，以顯示目前游標的位置；紅點應該會在你觸摸或超過預覽區域時移動，但點停留在開始的位置：

<Sandpack>

```js
import { useState } from 'react';
export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        position.x = e.clientX;
        position.y = e.clientY;
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

問題出於這段程式碼。

```js
onPointerMove={e => {
  position.x = e.clientX;
  position.y = e.clientY;
}}
```

該程式修改 object 在[上一次 render ](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time)被分配到的 `position` ，但沒有使用 state setting 函數， React 不知道 object 已經被改變，因此 React 沒有任何回應，就像已經吃飽飯後還嘗試修改點餐內容。儘管改變的 state 可以在有些情況下運作，但我們不建議，你應該將在 render 中存取的 state 值視為只能讀取。

為了在此情境中實際[觸發一個 re-render](/learn/state-as-a-snapshot#setting-state-triggers-renders)，**建立一個*新的* object 並將它傳給一個 state setting 函數**：

```js
onPointerMove={e => {
  setPosition({
    x: e.clientX,
    y: e.clientY
  });
}}
```

使用 `setPosition` ，你告訴 React ：

* 使用此新物件更新 `position`
* 並再次 render 該 component

當你的游標碰到或放過預覽區域時，注意紅點現在如何跟著它：

<Sandpack>

```js
import { useState } from 'react';
export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        setPosition({
          x: e.clientX,
          y: e.clientY
        });
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

<DeepDive>

#### Local mutation 是可以的 {/*local-mutation-is-fine*/}

類似這樣的程式碼會有問題，因為它修改 state 內的*既有* object ：

```js
position.x = e.clientX;
position.y = e.clientY;
```

但像這樣的程式是**完全沒有問題的**，因為你正在改變一個*剛建立*的新 object ：

```js
const nextPosition = {};
nextPosition.x = e.clientX;
nextPosition.y = e.clientY;
setPosition(nextPosition);
```

事實上，它完全等同於這樣編寫：

```js
setPosition({
  x: e.clientX,
  y: e.clientY
});
```

Mutation 只在改變*既有的* object 時才會是個問題。改變一個剛建立的是可以的，因為*還未有其他程式碼參考它*，改變它不會意外影響到某些依賴它的東西。這稱為「 local mutation 」，你甚至可以[在 render 期間](/learn/keeping-components-pure#local-mutation-your-components-little-secret)執行局部的改變，非常方便，而且完全是可以的！

</DeepDive>  

## 使用 Spread 語法複製 Object {/*copying-objects-with-the-spread-syntax*/}

在前一個案例中， `position` object 總是由目前的游標位置重新建立，但你經常會希望新建立的 object 包含*既有的*資料；例如，或許你只想在表單內*只*更新*一個*欄位，但仍保留其他所有欄位先前的值。

以下的 input 欄位無法運作，因為 `onChange` 處理器改變 state ：

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    person.firstName = e.target.value;
  }

  function handleLastNameChange(e) {
    person.lastName = e.target.value;
  }

  function handleEmailChange(e) {
    person.email = e.target.value;
  }

  return (
    <>
      <label>
        First name:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

例如，這一行改變上次 render 的 state ：

```js
person.firstName = e.target.value;
```

取得預想動作最可靠的方式是建立一個新 object ，並將它傳給 `setPerson` ，但在此，你還想**將既有的資料複製到其中**，因為只有一個欄位被改變：


```js
setPerson({
  firstName: e.target.value, // New first name from the input
  lastName: person.lastName,
  email: person.email
});
```

你可以使用[ object spread ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals)語法的 `...` ，如此一來，你就不需要個別複製每個 property。

```js
setPerson({
  ...person, // 複製舊的欄位
  firstName: e.target.value // 但覆寫它
});
```

現在表單運作了！

留意你如何沒有為每個 input 欄位分別宣告 state 變數。對大型表單而言，將所有資料組織在同一個 object 是很方便的——只要你正確地更新！

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    setPerson({
      ...person,
      firstName: e.target.value
    });
  }

  function handleLastNameChange(e) {
    setPerson({
      ...person,
      lastName: e.target.value
    });
  }

  function handleEmailChange(e) {
    setPerson({
      ...person,
      email: e.target.value
    });
  }

  return (
    <>
      <label>
        First name:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

注意 `...` spread 語法是「淺的」——它只複製一層深的東西；這使它快速，卻也代表如果你想更新一個巢狀的 property ，你會需要多次使用。

<DeepDive>

#### 為複數欄位使用單一事件處理器 {/*using-a-single-event-handler-for-multiple-fields*/}

你也可以在 object 定義中使用中括號 `[` 和 `]` ，為一個 property 指定動態名稱。以下是一些範例，但使用單一事件處理器取代三個：

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleChange(e) {
    setPerson({
      ...person,
      [e.target.name]: e.target.value
    });
  }

  return (
    <>
      <label>
        First name:
        <input
          name="firstName"
          value={person.firstName}
          onChange={handleChange}
        />
      </label>
      <label>
        Last name:
        <input
          name="lastName"
          value={person.lastName}
          onChange={handleChange}
        />
      </label>
      <label>
        Email:
        <input
          name="email"
          value={person.email}
          onChange={handleChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

這裡， `e.target.name` 參考賦予 `<input>` DOM 元素的 `name` property 。

</DeepDive>

## 更新一個巢狀的 Object {/*updating-a-nested-object*/}

想像一個像這樣的巢狀 object 結構：

```js
const [person, setPerson] = useState({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
});
```

如果你想更新 `person.artwork.city` ，要怎麼改變它是很清楚的：

```js
person.artwork.city = 'New Delhi';
```

但在 React 中，你將 state 當成是不可變的！為了改變 `city` ，首先你需要建立新的 `artwork` object （使用先前的資料預先填入），接著再建立可以指向新 `artwork` 的新 `person` object ：

```js
const nextArtwork = { ...person.artwork, city: 'New Delhi' };
const nextPerson = { ...person, artwork: nextArtwork };
setPerson(nextPerson);
```

或者，寫成單一函數呼叫：

```js
setPerson({
  ...person, // 複製其他欄位
  artwork: { // 但更新藝術品
    ...person.artwork, // 使用相同的
    city: 'New Delhi' // 但是在 New Delhi!
  }
});
```

這會有點囉唆，但它可在許多情況下運作：

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
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
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
        (located in {person.artwork.city})
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

<DeepDive>

#### Objects 並非真的是巢狀的 {/*objects-are-not-really-nested*/}

一個 object 會像這樣「套疊」出現在程式中：

```js
let obj = {
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
};
```

然而，「套疊」是不精確思考 object 行為的方法。當程式執行時，並沒有所謂「套疊的」 object ，你實際上看到的是兩個不同的 object ：

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};
```

`ob1`  object 並非在 `obj2` 「內部」；例如， `obj3` 也可以「指向」 `obj1` ：

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};

let obj3 = {
  name: 'Copycat',
  artwork: obj1
};
```

如果你要改變 `obj3.artwork.city` ，它會影響 `obj.artwork.city` 及 `obj1.city` 兩者，這是因為 `obj3.artwork` 、 `obj2.artwork` 、 `obj1` 是相同的物件。當你將物件視為「套疊」時，很難觀察看到這一點；取而代之，它們是分散的 object ，並透過 property 「指向」彼此。

</DeepDive>  

### 使用 Immer 編寫簡潔的更新邏輯 {/*write-concise-update-logic-with-immer*/}

如果你的 state 套疊得很深，你可能會考慮[將它攤平](/learn/choosing-the-state-structure#avoid-deeply-nested-state)；但假如不想改變 state 的結構，你也許會偏好一個展開套疊的捷徑。 [Immer](https://github.com/immerjs/use-immer) 是一個知名的函數庫，讓你方便編寫卻又可以使用改變的語法，且為你產生一份副本；使用 Immer ，你所編寫的程式看起來像「打破規則」與改變一個 object ：

```js
updatePerson(draft => {
  draft.artwork.city = 'Lagos';
});
```

但不像普通的改變，它不會覆蓋過去的 state ！

<DeepDive>

#### Immer 如何執行？ {/*how-does-immer-work*/}

Immer 提供的 `draft` 是 obkect 的特別型態，稱為 [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) ，「紀錄」任何你做的事情。這是為什麼你可以依照喜好自由地改變它！其原理是 Immer 指出哪些部分的 `draft` 已經改變，藉此產生一個新 object ，且包含你的編輯。 

</DeepDive>

嘗試使用 Immer ：

1. 執行 `npm install use-immer` 將 Immer 加入 dependency 
2. 將 `import { useState } from 'react'` 更新成 `import { useImmer } from 'use-immer'`

這是將上述案例轉換成 Immer ：

<Sandpack>

```js
import { useImmer } from 'use-immer';

export default function Form() {
  const [person, updatePerson] = useImmer({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    updatePerson(draft => {
      draft.name = e.target.value;
    });
  }

  function handleTitleChange(e) {
    updatePerson(draft => {
      draft.artwork.title = e.target.value;
    });
  }

  function handleCityChange(e) {
    updatePerson(draft => {
      draft.artwork.city = e.target.value;
    });
  }

  function handleImageChange(e) {
    updatePerson(draft => {
      draft.artwork.image = e.target.value;
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
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
        (located in {person.artwork.city})
      </p>
      <img 
        src={person.artwork.image} 
        alt={person.artwork.title}
      />
    </>
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

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

注意事件處理器如何變得更加簡潔。你可以依照喜好在單一 component 內混合及搭配 `useState` 和 `useImmer` 。 Immer 是保持更新處理器簡潔的好方法，特別是如果在 state 中有套疊、以及複製 object 導致程式碼重複的時候。

<DeepDive>

#### 為什麼在 React 中不推薦改變的 state ？ {/*why-is-mutating-state-not-recommended-in-react*/}

有幾個原因：

* **除錯:** 如果使用 `console.log` 且不改變 state ，過去的紀錄不會被更多後來的 state 改變所破壞，因此你可以清楚地看見 state 在每次 render 如何改變。
* **最佳化:** 如果上一個 props 或 state 與下一個相同，通常 React 的[最佳化策略](/reference/react/memo)仰賴省略執行。如果從未變異 state ，確認是否有任何修改會非常快速。如果 `prevObj === obj` ，可以確定內部沒有東西改變。
* **新功能:** 我們打造的 React 新功能仰賴於 state [被視為快照](/learn/state-as-a-snapshot)；如果改變過去的 state 版本，可能會阻止你使用新功能
* **請求變更:** 有些應用程式的功能像是取消/重做、顯示歷史修改、或讓使用者重新設定稍早之前的值，在沒有東西被改變時很容易，這是因為可以在記憶體中保留過去的 state ，並在適當時機重新使用它們；如果一開始就使用一個改變的方式，後續難以加上這些功能
* **更簡單的實作:** 因為 React 不仰賴改變，它不需要對你的 object 做任何特別的事情；不需要劫持它們的 property 、總是把它們包進 proxy 內、或其他在初始化時執行許多「反應的」解決辦法。這也是為什麼 React 讓你可以將任何 object 放入 state 中——不管多大——沒有多餘的效能與正確性的陷阱。

在實務中，你可以經常在 React 中改變 state 而不會出錯，但我們強烈建議你不要這樣做，以便你可以使用 React 新開發的功能。未來的貢獻者、甚至未來的你都會非常感謝你！

</DeepDive>

<Recap>

* 將 React 中的所有 state 視為不可改變的
* 當你在 state 中儲存 object 時，改變它們不會觸發 render ，且會改變 state 在上次 render 的「快照」 
* 比起改變一個 object ，為它建立一個*新*版本，並藉由為它設定 state 觸發 re-render
* 你可以使用 `{...obj, something: 'newValue'}` 的 object spread 語法建立一個 object 的副本
* Spread 語法是淺的：它只會複製一層
* 為了更新巢狀的 object ，你需要在從更新的地方一路向上建立副本
* 使用 Immer 減少重複複製的程式，


</Recap>



<Challenges>

#### 修改不正確的 State 更新 {/*fix-incorrect-state-updates*/}

該表單存在一些錯誤。點擊幾次按鈕增加分數，留意它未增加；接著編輯名字，注意分數突然因為你的改變而追趕上來；最後編輯姓氏時，注意分數完全消失。

你的工作是修改全部的錯誤，當你修改它們時，解釋它們為何發生。

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    player.score++;
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Score: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        First name:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 10px; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

這是解決兩個錯誤的方式：

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    setPlayer({
      ...player,
      score: player.score + 1,
    });
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      ...player,
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Score: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        First name:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

`handlePlusClick` 的問題是改變 `player` object ，因此， React 不知道這是 re-render 的理由，而未將畫面上的分數更新。這是為什麼當編輯名字時， state 有更新，觸發 re-render *同時*更新畫面上的分數。

`hanleLastNameChange` 的問題是未複製既有的 `...player` 欄位到新的 object 中，這是為什麼在編輯姓氏後分數消失。

</Solution>

#### 找出並修改 Mutation {/*find-and-fix-the-mutation*/}

有個可拖曳的盒子在靜止的背景中，你可以使用選單改變盒子的顏色。

但這裡存在錯誤，假如你先移動盒子，接著更換它的眼色，背景（未預期它會移動的！）會「跳」到盒子的位置，但這不應該發生： `Background` 的 `position` prop 被設定成 `initialPosition` ，其為 `{ x: 0, y:0 }` 。為什麼背景會在更換顏色時移動呢？

找出錯誤並且解決它。

<Hint>

如果有些東西意外改變，那就存在 mutation 。找出在 `App.js` 內的 mutation 並解決它。

</Hint>

<Sandpack>

```js App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

<Solution>

問題出在 `handleMove` 內部的 mutation ，它改變 `shape.position` ，但又與 `initialPosition` 指著相同的 object ，這是為什麼兩個形狀與背景都會移動。（這是 mutation ，因此改變不會反映在畫面上，直到有非相關的更新——顏色改變——觸發 re-render 。） 

解決辦法是從 `handleMove` 中移除 mutation ，並使用 spread 語法複製形狀。注意 `+=` 是 mutation ，因此你需要使用一個普通運算的 `+` 重寫它。

<Sandpack>

```js App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    setShape({
      ...shape,
      position: {
        x: shape.position.x + dx,
        y: shape.position.y + dy,
      }
    });
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

</Solution>

#### 使用 Immer 更新 Object {/*update-an-object-with-immer*/}

這是與上一個挑戰相同的錯誤範例，這次使用 Immer 解決 mutation 。方便起見，已經匯入 `useImmer` ，因此你需要改變 `shape` state 變數以使用它。

<Sandpack>

```js App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
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

<Solution>

這是使用 Immer 重寫的解法。留意事件處理器由改變的方式編寫，但錯誤並未發生，這是因為 Immer 未改變既有 object 的原理。

<Sandpack>

```js App.js
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, updateShape] = useImmer({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    updateShape(draft => {
      draft.position.x += dx;
      draft.position.y += dy;
    });
  }

  function handleColorChange(e) {
    updateShape(draft => {
      draft.color = e.target.value;
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
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

</Solution>

</Challenges>
