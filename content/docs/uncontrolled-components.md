---
id: uncontrolled-components
title: Uncontrolled Component
permalink: docs/uncontrolled-components.html
---

在大多數的情況下，我們推薦使用[controlled component](/docs/forms.html#controlled-components)來實作表單。在控制元件裡，表單的資料是被 React component 所處理。另一個選擇是 uncontrolled component，表單的資料是由 DOM 本身所處理的。

如果要寫一個 uncontrolled component，你可以[使用 ref](/docs/refs-and-the-dom.html) 來從 DOM 取得表單的資料，而不是為了每個 state 的更新寫 event handler。

舉例來說，這段程式碼在 uncontrolled component 裡接受一個名字：

```javascript{5,9,18}
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.input = React.createRef();
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.input.current.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" ref={this.input} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

[**在 CodePen 上試試看！**](https://codepen.io/gaearon/pen/WooRWa?editors=0010)

由於 uncontrolled component 保持了 DOM 裡的唯一的真相來源，有的時候使用 uncontrolled component 時更容易整合 React 和非 React 的程式碼。如果你想有個又快又髒的方法，它也可以減少一些程式碼。否則，通常應使用 controlled component。。

如果仍不清楚在特定情況下應使用哪種類型的 component，你可能會覺得[這篇關於控制與不可控制輸入的文章](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/)有所幫助。

### 預設值 {#default-values}

在 React 的 render 生命週期裡，表單上的 `value` attribute 會覆寫掉 DOM 的值。在 uncontrolled component 裡，你常常會希望 React 去指定初始值，但讓之後的更新保持不可控制的。為了處理這種情況，你可以指定 `defaultValue` attribute 而非 `value`。在 component mount 後改變 `defaultValue` 屬性不會造成任何在 DOM 裡面的值更新。

```javascript{7}
render() {
  return (
    <form onSubmit={this.handleSubmit}>
      <label>
        Name:
        <input
          defaultValue="Bob"
          type="text"
          ref={this.input} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}
```

相同地， `<input type="checkbox">` 和 `<input type="radio">` 支援 `defaultChecked`，而 `<select>` 和 `<textarea>` 支援 `defaultValue`。

## 檔案輸入標籤 {#the-file-input-tag}

在 HTML 裡，`<input type="file">` 讓使用者能夠選擇從他們的裝置儲存來上傳一個或多個檔案到伺服器，或由 JavaScript 透過 [File API](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications) 來處理。

```html
<input type="file" />
```

在 React 裡，`<input type="file" />` 永遠都是 uncontrolled component，因為它的值只能被使用者設定，而無法由程式碼來設定。

你應該使用 File API 來與檔案之間互動。以下範例顯示如何建立一個 [ref 到 DOM 節點上](/docs/refs-and-the-dom.html) 來取得在送出的 handler 的檔案：

`embed:uncontrolled-components/input-type-file.js`

[在 CodePen 上試試看！](codepen://uncontrolled-components/input-type-file)

