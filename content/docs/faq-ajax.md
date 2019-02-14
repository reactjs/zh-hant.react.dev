---
id: faq-ajax
title: AJAX 和 APIs
permalink: docs/faq-ajax.html
layout: docs
category: FAQ
---

### AJAX 怎麼用？ {#how-can-i-make-an-ajax-call}

你可以使用任何你喜歡的 AJAX 函式庫來與 React 搭配。一些流行的函式庫有：[Axios](https://github.com/axios/axios)、[jQuery AJAX](https://api.jquery.com/jQuery.ajax/) 以及瀏覽器內建的 [window.fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)。

### 應該在 Component 的哪個生命週期中使用 AJAX？ {#where-in-the-component-lifecycle-should-i-make-an-ajax-call}

你應該在 [`componentDidMount`](/docs/react-component.html#mounting) 的生命週期方法內，使用 AJAX 呼叫來填充資料。如此一來，你可以在收到資料時，使用 `setState` 來更新 Component。

### 範例：利用 AJAX 的回傳值來設定狀態 {#example-using-ajax-results-to-set-local-state}

你應該在 `componentDidMount` 的生命週期方法內，使用 AJAX 呼叫來填充資料。如此一來，你可以在收到資料時，使用 `setState` 來更新 Component。

假設 API 回傳的 JSON 物件如下：

```
{
  "items": [
    { "id": 1, "name": "Apples",  "price": "$2" },
    { "id": 2, "name": "Peaches", "price": "$5" }
  ]
}
```

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  componentDidMount() {
    fetch("https://api.example.com/items")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.items
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <ul>
          {items.map(item => (
            <li key={item.name}>
              {item.name} {item.price}
            </li>
          ))}
        </ul>
      );
    }
  }
}
```
