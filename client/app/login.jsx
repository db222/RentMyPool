var LoginContent = React.createClass({

  mixins: [ReactRouter.Navigation],

  getInitialState: function () {
    return {
      username: "Username",
      password: "Password"
    };  
  },

  componentWillMount: function () {
    AppStore.addUserLoginListener(this.handleUserLogin);
  },

  componentWillUnount: function () {
    AppStore.removeUserLoginListener(this.handleUserLogin);
  },

  handleUserLogin: function () {
    this.transitionTo("Home");
  },

  handleSubmit: function (e) {
    var $form = $('#loginForm')[0];

    this.setState({
      username: $form.username.value,
      password: $form.password.value
    },
      function () {
        AppActions.userLogin(this.state);
      }
    );    
  },

  render: function () {
    return (
      <div className="login">
        <h1>Login</h1>
        <br />
        <form id="loginForm">
          <input className="loginInput" name="username" placeholder={this.state.username} onChange={this.handleChange} />
          <br />
          <br />
          <input className="loginInput" type="password" name="password" placeholder={this.state.password} onChange={this.handleChange} />
          <br /> 
          <br />
          <a onClick={this.handleSubmit} className="btn-link">Login</a>
          <Link className="btn-link" to="Sign Up">Sign Up</Link>
        </form>
      </div>
    );
  }
});