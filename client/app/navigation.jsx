var Route = ReactRouter.Route;
var DefaultRoute = ReactRouter.DefaultRoute;
var RouteHandler = ReactRouter.RouteHandler;
var Link = ReactRouter.Link;

var UserButton = React.createClass({

  render: function () {
    if(this.props.user)
      return (
        <span> 
        {"Logged in as " + this.props.user.username}
        </span>
      );
    else 
      return(
        <span>
          {"Not Logged In."}
        </span>
      );
  }

});

var UserListing = React.createClass({

  render: function  () {
    return (
      <div>
        <span>
          {"Date: " + this.props.listing.date}
        </span>
        <br />
        <span>
          {"Name: " + this.props.listing.name}
        </span>
        <br />
        <span>
          {"Address: " + this.props.listing.address}
        </span>
        <br />
        <span>
          {"Price: " + this.props.listing.price}
        </span>
        <br />
        <br />
      </div>
    );
  }

});

var UserDetails = React.createClass({

  render: function () {
    var userListings = this.props.listings.map(function (item, index){
      return (
        <UserListing key={index} listing={item} />
      );
    });

    return (
      <div className="userDetailsContainer">
        <div className={this.props.show ? "userDetails show" : "userDetails"}>
          <h1>{this.props.user.username}</h1>
          <hr />
          <h2>{this.props.listings.length} Listings</h2>
          <br />
          {userListings}
        </div>
      </div>
    );
  }

});

var CurrentUser = React.createClass({

  getInitialState: function () {
    return {
      showDetails: false,
      user: null
    }
  },

  componentWillMount: function () {
    AppStore.addUserLoginListener(this.handleNewUser);
    AppStore.addFetchUserListener(this.handleNewUser);
    AppActions.fetchUser();
  },

  componentWillUnmount: function () {
    AppStore.removeUserLoginListener(this.handleNewUser);
    AppStore.removeFetchUserListener(this.handleNewUser);
  },

  handleNewUser: function (data) {
    this.setState({
      user: data
    });
  },

  handleClick: function () {
    var userData;
    var self = this;

    $.ajax({
      url: "/rentItems",
      contentType: "application/json",
      method: "GET",
      statusCode: {
        200: function (data) {
          userData = _.filter(data.results, function (item, index) {
            if(item.user_id === self.state.user._id) return true
            else return false;
          });

          if(self.state.user)
            self.setState({
              showDetails: !self.state.showDetails,
              userListings: userData
            });
        }
      }
    });
    
  },

  render: function () {
      return (
        <div  onClick={this.handleClick} className="currentUser">
          <UserButton user={this.state.user} />
          <UserDetails show={this.state.showDetails} user={this.state.user || {}} listings={this.state.userListings || []} />
        </div>
      );
  }

});

var Navigation = React.createClass({

  render: function () {
    return (
      <div className="nav-menu">
        { this.props.items.map(function(m, index){
            return <Link key={index} activeClassName="nav-link-focused" className="nav-link" to={m.name}>{m.name}</Link>;
          }) }
        <CurrentUser />
      </div>
    );
  }
});

var Main = React.createClass({

  render: function () {
    return (
      <div className="viewPort">

        <Navigation items={ [
          {name:'Home'},
          {name:'Rent'},
          {name:'List'},
          {name:'Img Upload'},
          {name: 'Login'}
        ] } />
        <div className="main">
          <RouteHandler />
        </div>
      </div>
    );
  }
});

var routing = function () {
  var routes = (
        <Route path="/" handler={Main}>
          <Route name="Home" handler={Content} />
          <Route name="Rent" handler={RentContent} />
          <Route name="List" handler={ListContent} />
          <Route name="Img Upload" handler={ImgUploadContent} />
          <Route name="Login" handler={LoginContent} />
          <Route name="Sign Up" handler={SignUpContent} />
          <Route name="Payment" handler={PaymentContent} />
          <DefaultRoute handler={Content} />
        </Route>
      );

  ReactRouter.run(routes, ReactRouter.HistoryLocation, function (Handler) {
    React.render(<Handler />, $('body')[0]);
  });
};



