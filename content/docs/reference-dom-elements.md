---
id: dom-elements
title: DOM Elements
layout: docs
category: Reference
permalink: docs/dom-elements.html
redirect_from:
  - "docs/tags-and-attributes.html"
  - "docs/dom-differences.html"
  - "docs/special-non-dom-attributes.html"
  - "docs/class-name-manipulation.html"
  - "tips/inline-styles.html"
  - "tips/style-props-value-px.html"
  - "tips/dangerously-set-inner-html.html"
---

為了能兼具跨瀏覽器相容與效能，React 實踐了一套獨立於瀏覽器的 DOM 系統，並把握機會優化了瀏覽器 DOM 美中不足之處。

在 React 裡，所有 DOM property 和 attribute（包括 event handler）都應該以小駝峰式命名。舉例來說，HTML 的 attribute `tabindex` 在 React 中對應到 `tabIndex`。`aria-*` 和 `data-*` attribute 則是例外，需要保持全部小寫。舉例來說，`aria-label` 保持原樣即可。

## Attributes 相異之處 {#differences-in-attributes}

有些 attribute 在 React 和 HTML 之間運作的方式略為不同：

### checked {#checked}

當 `<input>` 的 type 是 `checkbox` 或是 `radio` 時，可以使用 `checked` 這個 attribute 來設置 component 是否被選取。這對建立 controlled component 很有幫助。`defaultChecked` 則是使用在 uncontrolled component，當初始 mount 後設置 component 是否被選取。

### className {#classname}

要指定一個 CSS class 時，使用 `className` attribute。這在所有標準的 DOM 和 SVG element 像是 `<div>`、`<a>` 或其他的都能適用。

如果你在 React 裡使用 Web Components（這不是常見的狀況），則使用 `class`。

### dangerouslySetInnerHTML {#dangerouslysetinnerhtml}

`dangerouslySetInnerHTML` 是 React 用來替代 DOM 的 `innerHTML`。普遍來說，從程式碼中注入 HTML 是個冒險的行為，你會很輕易地讓使用者暴露在 [cross-site scripting (XSS)](https://zh.wikipedia.org/wiki/跨網站指令碼) 風險之下。所以在 React 裡你還是可以直接注入 HTML，但是你必須使用 `dangerouslySetInnerHTML`，然後傳入一個有 `__html` 為 key 的 object，藉此來提醒你自己這樣做具有風險。例子如下：

```js
function createMarkup() {
  return {__html: 'First &middot; Second'};
}

function MyComponent() {
  return <div dangerouslySetInnerHTML={createMarkup()} />;
}
```

### htmlFor {#htmlfor}

React element 使用 `htmlFor` 來替代 `for`，因為 `for` 在 JavaScript 是保留字。

### onChange {#onchange}

`onChange` event 會表現的跟你預期一樣：每當表格欄位值改變，這個 event 跟著發生。原先的 `onChange` 是個用詞不夠精確的行為，且 React 依靠這個 event 來處理使用者的即時輸入，所以我們表現出不同於瀏覽器的預設行為。

### selected {#selected}

`selected` 這個 attribute 可以使用在 `<option>` 裡面，用來設置 component 是否已被選取。這對建立 controlled component 很有幫助。

### style {#style}

>注意
>
>為了方便在文件裡某些範例會使用 `style`，但是**基本上不推薦使用 `style` attribute 作為初步修飾 elements 的手段。**在大部分的情形，應該使用[`className`](#classname) 來對應定義在外部 CSS stylesheet 的 class。`style` 通常在 React 應用中會被用做動態 style 的添加方式。也看看 [FAQ: Styling and CSS](/docs/faq-styling.html)。

`style` attribute 接收一個 JavaScript object 裡頭有小駝峰式命名的 property，而不是 CSS string。這跟 DOM `style` JavaScript property 一致。

```js
const divStyle = {
  color: 'blue',
  backgroundImage: 'url(' + imgUrl + ')',
};

function HelloWorldComponent() {
  return <div style={divStyle}>Hello World!</div>;
}
```

注意 style 不會自動加上前綴。為了要支援舊的瀏覽器，你必須自行提供相對應的 style property。

```js
const divStyle = {
  WebkitTransition: 'all', // 注意這裡是大寫的「W」
  msTransition: 'all' // 「ms」是唯一需要使用小寫開頭的瀏覽器引擎前綴
};

function ComponentWithTransition() {
  return <div style={divStyle}>This should work cross-browser</div>;
}
```

為了與使用 JavaScript 來存取 DOM node 一致，style key 也以小駝峰式命名 (e.g. `node.style.backgroundImage`)。瀏覽器引擎前綴除了 [`ms`](https://www.andismith.com/blogs/2012/02/modernizr-prefixed/) 都應該以一個大寫字母開頭。這就是 `WebkitTransition` 為什麼有一個大寫「W」的原因。

React 會為某些數字型態的 style property 自動加上「px」。如果你想要使用其他單位，以 string 的形式加上單位。舉例來說：

```js
// 輸出 style: '10px'
<div style={{ height: 10 }}>
  Hello World!
</div>

// 輸出 style: '10%'
<div style={{ height: '10%' }}>
  Hello World!
</div>
```

注意所有 style property 都會轉換成 pixel string。只有某些會保持沒有單位，如 `zoom`、`order`、`flex`。沒有單位的 property 完整清單可以在[這裡](https://github.com/facebook/react/blob/4131af3e4bf52f3a003537ec95a1655147c81270/src/renderers/dom/shared/CSSProperty.js#L15-L59)查看。

### suppressContentEditableWarning {#suppresscontenteditablewarning}

通常當一個 element 的 children 設置 `contentEditable` 時，因為不會有作用，所以會有警示訊息。這個 attribute 會抑制警示訊息。不要使用它，除非你在建立一個像是 [Draft.js](https://facebook.github.io/draft-js/) 的 library。

### suppressHydrationWarning {#suppresshydrationwarning}

如果你在使用 server-side React rendering 時 server 和 client render 不同時，通常會有一個警示訊息。然而，在一些很少見的案例，很難去保證 server 和 client side 會完全符合。舉例來說，像是 timestamp 就無法保持相同。

如果你設置了 `suppressHydrationWarning` 為 `true`，attribute 以及 element 內容不一樣時，React 就不會有警示訊息。這只有作用在一層深度，且需要有計畫性地使用，請勿濫用。你可以在 [`ReactDOM.hydrate()` documentation](/docs/react-dom.html#hydrate) 讀到更多關於 hydration。

### value {#value}

`value` attribute 可以使用在 `<input>` 和 `<textarea>` component。你可以使用它來設置 component value。這對建立 controlled component 很有幫助。`defaultValue` 則是使用在 uncontrolled component，當初始 mount 後設置 component 的 value。

## 可以使用的 HTML Attribute {#all-supported-html-attributes}

在 React 16 中，任何標準或是[自訂](/blog/2017/09/08/dom-attributes-in-react-16.html) DOM attributes 都可以使用。

React 為 DOM 提供了一套以 JavaScript 為中心的 API。因為 React component 通常會有自訂或跟 DOM 相關的 prop，React 使用像 DOM API 一樣的 `小駝峰式命名`。

```js
<div tabIndex="-1" />      // 就像 node.tabIndex DOM API
<div className="Button" /> // 就像 node.className DOM API
<input readOnly={true} />  // 就像 node.readOnly DOM API
```

除了上述文件提到的，這些 prop 跟對應的 HTML attribute 運作方式一樣。

React 中可以使用這些 DOM attributes：

```
accept acceptCharset accessKey action allowFullScreen alt async autoComplete
autoFocus autoPlay capture cellPadding cellSpacing challenge charSet checked
cite classID className colSpan cols content contentEditable contextMenu controls
controlsList coords crossOrigin data dateTime default defer dir disabled
download draggable encType form formAction formEncType formMethod formNoValidate
formTarget frameBorder headers height hidden high href hrefLang htmlFor
httpEquiv icon id inputMode integrity is keyParams keyType kind label lang list
loop low manifest marginHeight marginWidth max maxLength media mediaGroup method
min minLength multiple muted name noValidate nonce open optimum pattern
placeholder poster preload profile radioGroup readOnly rel required reversed
role rowSpan rows sandbox scope scoped scrolling seamless selected shape size
sizes span spellCheck src srcDoc srcLang srcSet start step style summary
tabIndex target title type useMap value width wmode wrap
```

同樣地，所有 SVG attribute 都可以使用：

```
accentHeight accumulate additive alignmentBaseline allowReorder alphabetic
amplitude arabicForm ascent attributeName attributeType autoReverse azimuth
baseFrequency baseProfile baselineShift bbox begin bias by calcMode capHeight
clip clipPath clipPathUnits clipRule colorInterpolation
colorInterpolationFilters colorProfile colorRendering contentScriptType
contentStyleType cursor cx cy d decelerate descent diffuseConstant direction
display divisor dominantBaseline dur dx dy edgeMode elevation enableBackground
end exponent externalResourcesRequired fill fillOpacity fillRule filter
filterRes filterUnits floodColor floodOpacity focusable fontFamily fontSize
fontSizeAdjust fontStretch fontStyle fontVariant fontWeight format from fx fy
g1 g2 glyphName glyphOrientationHorizontal glyphOrientationVertical glyphRef
gradientTransform gradientUnits hanging horizAdvX horizOriginX ideographic
imageRendering in in2 intercept k k1 k2 k3 k4 kernelMatrix kernelUnitLength
kerning keyPoints keySplines keyTimes lengthAdjust letterSpacing lightingColor
limitingConeAngle local markerEnd markerHeight markerMid markerStart
markerUnits markerWidth mask maskContentUnits maskUnits mathematical mode
numOctaves offset opacity operator order orient orientation origin overflow
overlinePosition overlineThickness paintOrder panose1 pathLength
patternContentUnits patternTransform patternUnits pointerEvents points
pointsAtX pointsAtY pointsAtZ preserveAlpha preserveAspectRatio primitiveUnits
r radius refX refY renderingIntent repeatCount repeatDur requiredExtensions
requiredFeatures restart result rotate rx ry scale seed shapeRendering slope
spacing specularConstant specularExponent speed spreadMethod startOffset
stdDeviation stemh stemv stitchTiles stopColor stopOpacity
strikethroughPosition strikethroughThickness string stroke strokeDasharray
strokeDashoffset strokeLinecap strokeLinejoin strokeMiterlimit strokeOpacity
strokeWidth surfaceScale systemLanguage tableValues targetX targetY textAnchor
textDecoration textLength textRendering to transform u1 u2 underlinePosition
underlineThickness unicode unicodeBidi unicodeRange unitsPerEm vAlphabetic
vHanging vIdeographic vMathematical values vectorEffect version vertAdvY
vertOriginX vertOriginY viewBox viewTarget visibility widths wordSpacing
writingMode x x1 x2 xChannelSelector xHeight xlinkActuate xlinkArcrole
xlinkHref xlinkRole xlinkShow xlinkTitle xlinkType xmlns xmlnsXlink xmlBase
xmlLang xmlSpace y y1 y2 yChannelSelector z zoomAndPan
```

你也可以使用全部小寫表示自訂 attribute。
