var Route = ReactRouter.Route;
var DefaultRoute = ReactRouter.DefaultRoute;
var RouteHandler = ReactRouter.RouteHandler;
var Link = ReactRouter.Link;

// Defines the button used to toggle diplay of user info
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

//defines how to render a users listings
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

<<<<<<< HEAD
var UserBooking = React.createClass({

  render: function  () {
    
    return (
      <div>
        <span>
          {"Date: " + this.props.booking.date}
        </span>
        <br />
        <span>
          {"Name: " + this.props.booking.name}
        </span>
        <br />
        <span>
          {"Address: " + this.props.booking.address}
        </span>
        <br />
        <span>
          {"Price: " + this.props.booking.price}
        </span>
        <br />
        <br />
      </div>
    );
  }

});

=======
//defines rendering of user information
>>>>>>> backend commented!
var UserDetails = React.createClass({

  render: function () {
    var userListings = this.props.listings.map(function (item, index){
      return (
        <UserListing key={index} listing={item} />
      );
    });
    var userBookings = this.props.bookings.map(function (item, index){
      return (
        <UserBooking key={index} booking={item} />
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
          <br />
          <h2>{this.props.bookings.length} Bookings</h2>
          <br />
          {userBookings}
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
    var userListings;
    var userBookings;
    var self = this;

    $.ajax({
      url: "/rentItems",
      contentType: "application/json",
      method: "GET",
      statusCode: {
        200: function (data) {
          userListings = _.filter(data.results, function (item, index) {
            if(item.user_id === self.state.user._id) return true
            else return false;
          });

          if(self.state.user)
            self.setState({
              showDetails: !self.state.showDetails,
              userListings: userListings
            });
        }
      }
    });
    
    $.ajax({
      url: "/userBookings",
      contentType: "application/json",
      method: "GET",
      statusCode: {
        200: function (data) {
          if(self.state.user)
            self.setState({
              userBookings: data.results
            });
        }
      }
    });
  },

  render: function () {
      return (
        <div  onClick={this.handleClick} className="currentUser">
          <UserButton user={this.state.user} />
          <UserDetails show={this.state.showDetails} user={this.state.user || {}} listings={this.state.userListings || []} bookings={this.state.userBookings || []} />
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
          <Route name="Login" handler={LoginContent} />
          <Route name="Sign Up" handler={SignUpContent} />
          <Route name="Confirmation" handler={ConfirmationContent} />
          <DefaultRoute handler={Content} />
        </Route>
      );

  ReactRouter.run(routes, ReactRouter.HistoryLocation, function (Handler) {
    React.render(<Handler />, $('body')[0]);
  });
};



