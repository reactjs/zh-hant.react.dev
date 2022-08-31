---
id: events
title: SyntheticEvent
permalink: docs/events.html
layout: docs
category: Reference
---

這份參考指南紀錄了 `SyntheticEvent` 這個形成 React 事件系統的 wrapper。想了解更多，請參考[事件處理](/docs/handling-events.html)。

## 概觀 {#overview}

你的 event handler 將會是 `SyntheticEvent` 被傳遞的 instance，它是一個跨瀏覽器的、瀏覽器原生事件的 wrapper。它和瀏覽器原生事件有相同的介面，包含 `stopPropagation()` 和 `preventDefault()`，除了原生事件在所有的瀏覽器都以相同的方式運作這點以外。

如果你發現因為某些原因你需要使用瀏覽器的底層事件，你只需要使用 `nativeEvent` 這個 attribute 即可。Synthetic event 不同於瀏覽器的 native event 並不會直接 mapping，例如在 `onMouseLeave` `event.nativeEvent` 將會指向到 `mouseout` event。特定 mapping 不是公開 API 的一部分，並且可以隨時更改。每個 `SyntheticEvent` object 都有下列的 attribute：

```javascript
boolean bubbles
boolean cancelable
DOMEventTarget currentTarget
boolean defaultPrevented
number eventPhase
boolean isTrusted
DOMEvent nativeEvent
void preventDefault()
boolean isDefaultPrevented()
void stopPropagation()
boolean isPropagationStopped()
void persist()
DOMEventTarget target
number timeStamp
string type
```

> 注意：
>
> 從 v17 開始，`e.persist()` 將不會再有任何作用，因為 `SyntheticEvent` 已不再被 [pool](/docs/legacy-event-pooling.html) 了。


> 注意：
>
> 截至 v0.14 為止，從 event handler 回傳 `false` 並不會停止事件冒泡（event propagation）。因此你可以視情況手寫觸發 `e.stopPropagation()` 或 `e.preventDefault()`。

## 支援的事件 {#supported-events}

React 將事件規格化，已讓它們在不同的瀏覽器中有ㄧ致的屬性。

以下的 event handler 會在冒泡階段時被一個事件觸發。如果你想註冊捕獲階段的 event handler，請在事件名稱的後面加上 `Capture`。例如，假設你想在捕獲階段捕捉 click 事件的話，你需要用 `onClickCapture` 而不是 `onClick`：

- [Clipboard Events](#clipboard-events)
- [Composition Events](#composition-events)
- [Keyboard Events](#keyboard-events)
- [Focus Events](#focus-events)
- [Form Events](#form-events)
- [Generic Events](#generic-events)
- [Mouse Events](#mouse-events)
- [Pointer Events](#pointer-events)
- [Selection Events](#selection-events)
- [Touch Events](#touch-events)
- [UI Events](#ui-events)
- [Wheel Events](#wheel-events)
- [Media Events](#media-events)
- [Image Events](#image-events)
- [Animation Events](#animation-events)
- [Transition Events](#transition-events)
- [Other Events](#other-events)

* * *

## 參考 {#reference}

### 剪貼板事件 {#clipboard-events}

事件名稱：

```
onCopy onCut onPaste
```

屬性：

```javascript
DOMDataTransfer clipboardData
```

* * *

### 組合事件 {#composition-events}

事件名稱：

```
onCompositionEnd onCompositionStart onCompositionUpdate
```

屬性：

```javascript
string data

```

* * *

### 鍵盤事件 {#keyboard-events}

事件名稱：

```
onKeyDown onKeyPress onKeyUp
```

屬性：

```javascript
boolean altKey
number charCode
boolean ctrlKey
boolean getModifierState(key)
string key
number keyCode
string locale
number location
boolean metaKey
boolean repeat
boolean shiftKey
number which
```

`key` 屬性可以接受 [DOM Level 3 Events spec](https://www.w3.org/TR/uievents-key/#named-key-attribute-values) 內記錄的任意值。

* * *

### 焦點事件 {#focus-events}

事件名稱：

```
onFocus onBlur
```

這些焦點事件在 React DOM 中所有的 element 上都可以使用，不限於表單 element。

屬性：

```js
DOMEventTarget relatedTarget
```

#### onFocus {#onfocus}

`onFocus` 事件將會在元素 (或是元素裡面的元素) 獲得焦點時執行，舉例來說，下方的 `onFocus` 事件會在當使用者點擊一個 input 時觸發。

```javascript
function Example() {
  return (
    <input
      onFocus={(e) => {
        console.log('Focused on input');
      }}
      placeholder="onFocus is triggered when you click this input."
    />
  )
}
```

#### onBlur {#onblur}

The `onBlur` event handler is called when focus has left the element (or left some element inside of it). For example, it's called when the user clicks outside of a focused text input.

```javascript
function Example() {
  return (
    <input
      onBlur={(e) => {
        console.log('Triggered because this input lost focus');
      }}
      placeholder="onBlur is triggered when you click this input and then you click outside of it."
    />
  )
}
```

#### Detecting Focus Entering and Leaving {#detecting-focus-entering-and-leaving}

You can use the `currentTarget` and `relatedTarget` to differentiate if the focusing or blurring events originated from _outside_ of the parent element. Here is a demo you can copy and paste that shows how to detect focusing a child, focusing the element itself, and focus entering or leaving the whole subtree.

```javascript
function Example() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log('focused self');
        } else {
          console.log('focused child', e.target);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus entered self');
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          console.log('unfocused self');
        } else {
          console.log('unfocused child', e.target);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus left self');
        }
      }}
    >
      <input id="1" />
      <input id="2" />
    </div>
  );
}
```


* * *

### 表單事件 {#form-events}

事件名稱：

```
onChange onInput onInvalid onReset onSubmit
```

想了解關於 onChange 事件的資訊，請參考[表單](/docs/forms.html)。

* * *

### Generic 事件 {#generic-events}

事件名稱：

```
onError onLoad
```

* * *

### 滑鼠事件 {#mouse-events}

事件名稱：

```
onClick onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit
onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter onMouseLeave
onMouseMove onMouseOut onMouseOver onMouseUp
```

`onMouseEnter` 和 `onMouseLeave` 事件從離開的 element 向正在進入的 element 傳播，而不是正常的冒泡，也沒有捕獲階段。

屬性：

```javascript
boolean altKey
number button
number buttons
number clientX
number clientY
boolean ctrlKey
boolean getModifierState(key)
boolean metaKey
number pageX
number pageY
DOMEventTarget relatedTarget
number screenX
number screenY
boolean shiftKey
```

* * *

### 指標事件 {#pointer-events}

事件名稱：

```
onPointerDown onPointerMove onPointerUp onPointerCancel onGotPointerCapture
onLostPointerCapture onPointerEnter onPointerLeave onPointerOver onPointerOut
```

`onPointerEnter` 和 `onPointerLeave` 事件從離開的 element 向正在進入的 element 傳播，而不是正常的冒泡，也沒有捕獲階段。

屬性：

如同在 [W3 spec](https://www.w3.org/TR/pointerevents/) 內定義的，指標事件是[滑鼠事件](#mouse-events)的延伸，並帶有以下屬性：

```javascript
number pointerId
number width
number height
number pressure
number tangentialPressure
number tiltX
number tiltY
number twist
string pointerType
boolean isPrimary
```

關於跨瀏覽器支援的說明：

目前為止，並非所有的瀏覽器都支援指標事件（在這篇文章撰寫的時候，支援該事件的瀏覽器有：Chrome、Firefox、Edge 以及 Internet Explorer）。React 刻意不通過 polyfill 的方式支援其他瀏覽器，因為符合標準的 polyfill 會明顯地增加 `react-dom` 的 bundle 大小。

如果你的應用程式需要指標事件，我們建議你加上第三方的指針事件 polyfill。

* * *

### 選擇事件 {#selection-events}

事件名稱：

```
onSelect
```

* * *

### 觸摸事件 {#touch-events}

事件名稱：

```
onTouchCancel onTouchEnd onTouchMove onTouchStart
```

屬性：

```javascript
boolean altKey
DOMTouchList changedTouches
boolean ctrlKey
boolean getModifierState(key)
boolean metaKey
boolean shiftKey
DOMTouchList targetTouches
DOMTouchList touches
```

* * *

### UI 事件 {#ui-events}

事件名稱：

```
onScroll
```

>注意：
>
>從 React 17 開始，`onScroll` 事件就不是冒泡了，這與瀏覽器的行為相符，並且避免了當巢狀滾動元件觸發事件時，在遠處 parent 元件上的混亂現象。

屬性：

```javascript
number detail
DOMAbstractView view
```

* * *

### 滾輪事件 {#wheel-events}

事件名稱：

```
onWheel
```

屬性：

```javascript
number deltaMode
number deltaX
number deltaY
number deltaZ
```

* * *

### 媒體事件 {#media-events}

事件名稱：

```
onAbort onCanPlay onCanPlayThrough onDurationChange onEmptied onEncrypted
onEnded onError onLoadedData onLoadedMetadata onLoadStart onPause onPlay
onPlaying onProgress onRateChange onSeeked onSeeking onStalled onSuspend
onTimeUpdate onVolumeChange onWaiting
```

* * *

### 圖片事件 {#image-events}

事件名稱：

```
onLoad onError
```

* * *

### 動畫事件 {#animation-events}

事件名稱：

```
onAnimationStart onAnimationEnd onAnimationIteration
```

屬性：

```javascript
string animationName
string pseudoElement
float elapsedTime
```

* * *

### 過渡事件 {#transition-events}

事件名稱：

```
onTransitionEnd
```

屬性：

```javascript
string propertyName
string pseudoElement
float elapsedTime
```

* * *

### 其他事件 {#other-events}

事件名稱：

```
onToggle
```
