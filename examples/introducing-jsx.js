function formatName(user) {
  return user.lastName + ' ' + user.firstName;
}

const user = {
  firstName: '王',
  lastName: '小明',
};

const element = <h1>你好, {formatName(user)}!</h1>;

ReactDOM.render(element, document.getElementById('root'));
