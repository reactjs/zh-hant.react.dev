class HelloMessage extends React.Component {
  render() {
    return (
      <div>
        吃飽沒, {this.props.name}？
      </div>
    );
  }
}

ReactDOM.render(
  <HelloMessage name="小明" />,
  document.getElementById('hello-example')
);