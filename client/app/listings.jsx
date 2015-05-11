var ListContent = React.createClass({

  getInitialState: function() {
  return {
    name: 'Name',
    address : 'Address',
    price : 'Price',
    date: "Date",
    title: "Title",
    user_id: "",
    dateFrom : "Date from",
    dateTo : "Date to"
    };
  },

  componentWillMount: function () {
    AppStore.addFetchUserListener(this.handleFetchUser);
  },

  componentDidMount: function () {
    $( "#datepicker" ).datepicker();
    $( "#datepicker2" ).datepicker();
    AppActions.fetchUser();
  },

  componentWillUnmount: function () {
    AppStore.removeFetchUserListener(this.handleFetchUser);
  },

  handleFetchUser: function (data) {
    this.setState({
      user_id: data._id
    });
  },

  handleSubmit: function (e) {
    var $form = $('#listingForm')[0];

    this.setState({
      name: $form.name.value,
      address: $form.address.value,
      price: $form.price.value,
      dateFrom: $form.dateFrom.value,
      dateTo: $form.dateTo.value,
      file: $form.userPhoto.files[0],
      title: $form.name.title
    }, 
      function () {
        console.log(this.state);
        ListingsActions.listingSubmitted(this.state);
      }.bind(this)
    );
  },

  render: function () {
    return (
      <div className="listView">
        <LoginTransitioner />
        <h1>List a Pool</h1>
        <br />
        <form id="listingForm">
          <input className="listingInput" name="name" placeholder={this.state.name} type="text" />
          <br />
          <br />
          <input className="listingInput" name="address" placeholder={this.state.address} type="text" />
          <br />
          <br />
          <input className="listingInput" name="price" placeholder={this.state.price} type="text" />
          <br />
          <br />
          <input className="listingInput" name="dateFrom" id="datepicker" placeholder={this.state.dateFrom} type="text" />
          <br />
          <br />
          <input className="listingInput" name="dateTo" id="datepicker2" placeholder={this.state.dateTo} type="text" />
          <br />
          <br />
          <input type="file" id="userPhotoInput" name="userPhoto" />
          <br />
          <br />
          <a className="btn-link" type="submit" onClick={this.handleSubmit}>List</a>
        </form>
      </div>
    );
  }

});
