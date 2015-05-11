var RentDispatcher = new Flux.Dispatcher();

var RentActions = {

  entryClicked: function (data) {
    RentDispatcher.dispatch({
      type: RentConstants.ENTRY_CLICKED,
      load: data
    });
  },

  fetchEntries: function (data) {
    RentDispatcher.dispatch({
      type: RentConstants.FETCH_ENTRIES,
      load: data
    });
  },

  newBooking: function (data) {
    RentDispatcher.dispatch({
      type: RentConstants.NEW_BOOKING,
      load: data
    });
  },

  filterChangeDate: function (data) {
    RentDispatcher.dispatch({
      type: RentConstants.FILTER_CHANGE_DATE,
      load: data
    });
  },

  filterChangeLocation: function (data) {
    RentDispatcher.dispatch({
      type: RentConstants.FILTER_CHANGE_LOCATION,
      load: data
    });
  }

}
