---
id: events
title: 合成事件
permalink: docs/events.html
layout: docs
category: Reference
---

這份參考指南紀錄了 `SyntheticEvent` 這個形成 React 事件系統的 wrapper。想了解更多，請參考[事件處理](/docs/handling-events.html)。

## 概觀 {#overview}

你的 event handler 將會是 `SyntheticEvent` 被傳遞的 instance，它是一個跨瀏覽器的、瀏覽器原生事件的 wrapper。它和瀏覽器原生事件有相同的介面，包含 `stopPropagation()` 和 `preventDefault()`，除了原生事件在所有的瀏覽器都以相同的方式運作這點以外。

如果你發現因為某些原因你需要使用瀏覽器的底層事件，你只需要使用 `nativeEvent` 這個 attribute 即可。每個 `SyntheticEvent` object 都有下列的 attribute：

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
DOMEventTarget target
number timeStamp
string type
```

> 注意：
>
> 截至 v0.14 為止，從 event handler 回傳 `false` 並不會停止事件冒泡（event propagation）。因此你可以選擇是情況手寫觸發 `e.stopPropagation()` 或 `e.preventDefault()`。

### 事件結合 {#event-pooling}

`SyntheticEvent` 是透過結合事件而來的。這表示 `SyntheticEvent` 這個 object 會被重複使用，且所有的屬性都會在事件的 callback 被呼叫後變成無效。
這是出於效能考量。
因此，你不能用非同步的方式讀取這些事件：

```javascript
function onClick(event) {
  console.log(event); // => 無效的 object。
  console.log(event.type); // => "click"
  const eventType = event.type; // => "click"

  setTimeout(function() {
    console.log(event.type); // => null
    console.log(eventType); // => "click"
  }, 0);

  // 不會產生任何作用，this.state.clickEvent 只會包含 null
  this.setState({clickEvent: event});

  // 你仍可以導出事件屬性
  this.setState({eventType: event.type});
}
```

> 注意：
>
> 如果你想要用非同步的方式讀取這些事件，你應該在該事件上呼叫 `event.persist()`。此方法將會把該合成事件從事件組合中移出，並允許使用者程式保留對該事件的引用。

## 支援的事件 {#supported-events}

React 將事件規格化，已讓它們在不同的瀏覽器中有ㄧ致的屬性。

以下的 event handler 會在冒泡階段時被一個事件觸發。如果你想註冊捕獲階段的 event handler，請在事件名稱的後面加上 `Capture`。例如，假設你想在捕獲階段捕捉 click 事件的話，你需要用 `onClickCapture` 而不是 `onClick`：

- [Clipboard Events](#clipboard-events)
- [Composition Events](#composition-events)
- [Keyboard Events](#keyboard-events)
- [Focus Events](#focus-events)
- [Form Events](#form-events)
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

## Reference {#reference}

### 剪貼板事件 {#clipboard-events}

事件名：

```
onCopy onCut onPaste
```

屬性：

```javascript
DOMDataTransfer clipboardData
```

* * *

### 複合事件 {#composition-events}

事件名：

```
onCompositionEnd onCompositionStart onCompositionUpdate
```

屬性：

```javascript
string data

```

* * *

### 鍵盤事件 {#keyboard-events}

事件名：

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

```javascript
DOMEventTarget relatedTarget
```

* * *

### 表單事件 {#form-events}

事件名：

```
onChange onInput onInvalid onSubmit
```

想了解關於 onChange 事件的資訊，請參考[表單](/docs/forms.html)。

* * *

### 滑鼠事件 {#mouse-events}

事件名：

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

事件名：

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

關於跨瀏覽器支持的說明：

目前為止，並非所有的瀏覽器都支持指標事件（在這篇文章書寫之時，支持該事件的瀏覽器有：Chrome, Firefox, Edge, and Internet Explorer）。 React 刻意不通過 polyfill 的方式支持其他瀏覽器，因為符合標準的 polyfill 會顯著地增加 `react-dom` 的 bundle 大小。

如果你的應用程式需要指針事件，我們建議你加上第三方的指針事件 polyfill。

* * *

### 選擇事件 {#selection-events}

事件名：

```
onSelect
```

* * *

### 觸摸事件 {#touch-events}

事件名：

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

事件名：

```
onScroll
```

屬性：

```javascript
number detail
DOMAbstractView view
```

* * *

### 滾輪事件 {#wheel-events}

事件名：

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
