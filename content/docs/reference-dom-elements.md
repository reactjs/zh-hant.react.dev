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

React implements a browser-independent DOM system for performance and cross-browser compatibility. We took the opportunity to clean up a few rough edges in browser DOM implementations.
React 實踐了一個具有效能且跨瀏覽器兼容的 DOM system。並在實踐的過程中，優化 DOM 美中不足之處。

In React, all DOM properties and attributes (including event handlers) should be camelCased. For example, the HTML attribute `tabindex` corresponds to the attribute `tabIndex` in React. The exception is `aria-*` and `data-*` attributes, which should be lowercased. For example, you can keep `aria-label` as `aria-label`.
在 React 裡，所有 DOM property 和 attribute（包括 event handler）都應該以駝峰式命名。舉例來說，HTML 的 attribute `tabindex` 在 React 中對應到 `tabIndex`。`aria-*` 和 `data-*` attribute 則是例外，需要保持全部小寫。舉例來說，`aria-label` 應該保持 `aria-label` 原樣。

## Attributes 相異之處 {#differences-in-attributes}

There are a number of attributes that work differently between React and HTML:
有些 attribute 在 React 和 HTML 之間運作的方式略為不同：

### checked {#checked}

The `checked` attribute is supported by `<input>` components of type `checkbox` or `radio`. You can use it to set whether the component is checked. This is useful for building controlled components. `defaultChecked` is the uncontrolled equivalent, which sets whether the component is checked when it is first mounted.
當 `<input>` 的 type 是 `checkbox` 或是 `radio` 時，可以使用 `checked` 這個 attribute 來設置 component 是否被選取。這在建立 controlled component 時很有幫助。`defaultChecked` 則是被使用在 uncontrolled component，當初始 mount 後設置 component 是否被選取。

### className {#classname}

To specify a CSS class, use the `className` attribute. This applies to all regular DOM and SVG elements like `<div>`, `<a>`, and others.
要指定一個 CSS class 時，使用 `className` attribute。這在所有常規的 DOM 和 SVG element 像是 `<div>`、`<a>` 還有其他的都能適用。

If you use React with Web Components (which is uncommon), use the `class` attribute instead.
如果你在 React 裡使用 Web Components（這不是常見的狀況），則使用 `class`。

### dangerouslySetInnerHTML {#dangerouslysetinnerhtml}

`dangerouslySetInnerHTML` is React's replacement for using `innerHTML` in the browser DOM. In general, setting HTML from code is risky because it's easy to inadvertently expose your users to a [cross-site scripting (XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting) attack. So, you can set HTML directly from React, but you have to type out `dangerouslySetInnerHTML` and pass an object with a `__html` key, to remind yourself that it's dangerous. For example:
`dangerouslySetInnerHTML` 是 React 用來替代 DOM 的 `innerHTML`。普遍來說，從程式碼中注入 HTML 是個冒險的行為，很輕易地你就會讓使用者暴露在 [cross-site scripting (XSS)](https://zh.wikipedia.org/wiki/跨網站指令碼) 風險之下。所以，在 React 裡你還是可以直接注入 HTML，但是你必須使用 `dangerouslySetInnerHTML`，然後傳入一個有 `__html` 為 key 的物件，藉此來提醒你自己這樣做具有風險。例子如下：

```js
function createMarkup() {
  return {__html: 'First &middot; Second'};
}

function MyComponent() {
  return <div dangerouslySetInnerHTML={createMarkup()} />;
}
```

### htmlFor {#htmlfor}

Since `for` is a reserved word in JavaScript, React elements use `htmlFor` instead.
React element 使用 `htmlFor` 來取代 `for`，因為 `for` 在 JavaScript 是保留字詞。

### onChange {#onchange}

The `onChange` event behaves as you would expect it to: whenever a form field is changed, this event is fired. We intentionally do not use the existing browser behavior because `onChange` is a misnomer for its behavior and React relies on this event to handle user input in real time.
`onChange` event 會表現的跟你預期一樣：當一個表格欄位改變，這個 event 會跟著發生。原先的 `onChange` 是個用詞不夠精確的行為，且 React 依靠這個 event 來處理使用者的即時輸入，所以我們表現出不同於瀏覽器的預設行為。

### selected {#selected}

The `selected` attribute is supported by `<option>` components. You can use it to set whether the component is selected. This is useful for building controlled components.
`selected` 這個 attribute 可以被使用在 `<option>` 裡面，用來標示 component 是否已被選取。這對建立 controlled components 很有幫助。

### style {#style}

>Note
>
>Some examples in the documentation use `style` for convenience, but **using the `style` attribute as the primary means of styling elements is generally not recommended.** In most cases, [`className`](#classname) should be used to reference classes defined in an external CSS stylesheet. `style` is most often used in React applications to add dynamically-computed styles at render time. See also [FAQ: Styling and CSS](/docs/faq-styling.html).
>筆記
>
>為了方便在文件裡某些範例會使用 `style`，但是**基本上不推薦使用 `style` attribute 作為初步修飾 elements 的手段。**在大部分的情形， 應該使用[`className`](#classname) 來對應定義在外部 CSS stylesheet 的 class。`style` 通常在 React 應用中會被用做動態 style 的添加方式。也看看 [FAQ: Styling and CSS](/docs/faq-styling.html)。

The `style` attribute accepts a JavaScript object with camelCased properties rather than a CSS string. This is consistent with the DOM `style` JavaScript property, is more efficient, and prevents XSS security holes. For example:
`style` attribute 接收一個 JavaScript object 裡頭有駝峰式命名的 property，而不是 CSS string。這跟 DOM `style` JavaScript property 是一樣的。

```js
const divStyle = {
  color: 'blue',
  backgroundImage: 'url(' + imgUrl + ')',
};

function HelloWorldComponent() {
  return <div style={divStyle}>Hello World!</div>;
}
```

Note that styles are not autoprefixed. To support older browsers, you need to supply corresponding style properties:
注意 style 不會自動加上前綴。為了要支援舊的瀏覽器，你必須自行提供相對應的 style property。

```js
const divStyle = {
  WebkitTransition: 'all', // 注意這裡是大寫的「W」
  msTransition: 'all' // 「ms」是唯一需要使用小寫前綴的瀏覽器引擎
};

function ComponentWithTransition() {
  return <div style={divStyle}>This should work cross-browser</div>;
}
```

Style keys are camelCased in order to be consistent with accessing the properties on DOM nodes from JS (e.g. `node.style.backgroundImage`). Vendor prefixes [other than `ms`](https://www.andismith.com/blogs/2012/02/modernizr-prefixed/) should begin with a capital letter. This is why `WebkitTransition` has an uppercase "W".
為了使用 JavaScript 來存取 DOM nodes，Style keys 也以駝峰式命名 (e.g. `node.style.backgroundImage`)。瀏覽器引擎前綴[除了`ms`](https://www.andismith.com/blogs/2012/02/modernizr-prefixed/) 都應該以一個大寫字母開頭。這就是 `WebkitTransition` 為什麼有一個大寫「W」的原因。

React will automatically append a "px" suffix to certain numeric inline style properties. If you want to use units other than "px", specify the value as a string with the desired unit. For example:
React 會為 style properties 為數字型態的自動加上「px」。如果你想要使用其他單位，以 string 的形式加上單位。舉例來說：

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

Not all style properties are converted to pixel strings though. Certain ones remain unitless (eg `zoom`, `order`, `flex`). A complete list of unitless properties can be seen [here](https://github.com/facebook/react/blob/4131af3e4bf52f3a003537ec95a1655147c81270/src/renderers/dom/shared/CSSProperty.js#L15-L59).
注意所有 style property 都會轉換成 pixel string。只有某些會保持沒有單位，如 `zoom`、`order`、`flex`。沒有單位的 property 完整清單可以在[這裡](https://github.com/facebook/react/blob/4131af3e4bf52f3a003537ec95a1655147c81270/src/renderers/dom/shared/CSSProperty.js#L15-L59)查看。

### suppressContentEditableWarning {#suppresscontenteditablewarning}

Normally, there is a warning when an element with children is also marked as `contentEditable`, because it won't work. This attribute suppresses that warning. Don't use this unless you are building a library like [Draft.js](https://facebook.github.io/draft-js/) that manages `contentEditable` manually.
通常，當一個 element 的 children 被標示 `contentEditable` 時會有警示訊息，因為這不會有作用。這個 attribute 會抑制警示訊息。除非你在建立一個 library 像是 [Draft.js](https://facebook.github.io/draft-js/)，不要使用它。

### suppressHydrationWarning {#suppresshydrationwarning}

If you use server-side React rendering, normally there is a warning when the server and the client render different content. However, in some rare cases, it is very hard or impossible to guarantee an exact match. For example, timestamps are expected to differ on the server and on the client.
如果你在使用 server-side React rendering 時 server 和 client render 不同時，通常會有一個警示訊息。然而，在一些很少見的案例，很難去保證 server 和 client side 會完全符合。舉例來說，像是 timestamps 就無法保持相同。

If you set `suppressHydrationWarning` to `true`, React will not warn you about mismatches in the attributes and the content of that element. It only works one level deep, and is intended to be used as an escape hatch. Don't overuse it. You can read more about hydration in the [`ReactDOM.hydrate()` documentation](/docs/react-dom.html#hydrate).
如果你設置了 `suppressHydrationWarning` 為 `true`，attribute 和 element 內容不一樣時，React 就不會有警示訊息。這只有一層深度的作用，且必須要有計畫性地使用。請勿濫用。你可以在 [`ReactDOM.hydrate()` documentation](/docs/react-dom.html#hydrate) 讀到更多關於 hydration。

### value {#value}

The `value` attribute is supported by `<input>` and `<textarea>` components. You can use it to set the value of the component. This is useful for building controlled components. `defaultValue` is the uncontrolled equivalent, which sets the value of the component when it is first mounted.
`value` attribute 可以被使用在 `<input>` 和 `<textarea>` component。你可以使用它來設置 component value。這對建立 controlled component 很有幫助。`defaultValue` 則是被使用在 uncontrolled component，當初始 mount 後設置 component 的 value。

## All Supported HTML Attributes {#all-supported-html-attributes}

As of React 16, any standard [or custom](/blog/2017/09/08/dom-attributes-in-react-16.html) DOM attributes are fully supported.
在 React 16 中，任何標準[或是自訂](/blog/2017/09/08/dom-attributes-in-react-16.html) DOM attributes 都可以被使用。

React has always provided a JavaScript-centric API to the DOM. Since React components often take both custom and DOM-related props, React uses the `camelCase` convention just like the DOM APIs:
React 對於 DOM 始終提供以 JavaScript 為中心的 API。React 使用像 DOM API 一樣的 `camelCase` 轉換，因為 React components 通常會有自訂prop，也會有跟 DOM 相關的 prop，

```js
<div tabIndex="-1" />      // 就像 node.tabIndex DOM API
<div className="Button" /> // 就像 node.className DOM API
<input readOnly={true} />  // 就像 node.readOnly DOM API
```

These props work similarly to the corresponding HTML attributes, with the exception of the special cases documented above.
除了上述文件提到的，這些 prop 跟相對應的 HTML attribute 運作方式一樣。

Some of the DOM attributes supported by React include:
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

Similarly, all SVG attributes are fully supported:
同樣地，所有 SVG attribute 也可以被使用：

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

You may also use custom attributes as long as they're fully lowercase.
你也可以使用全部小寫表示自訂 attribute。
