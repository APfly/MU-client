'use strict';

var app = app || {};

const ENV = {};
ENV.isProduction = window.location.protocol === 'https:';
// ENV.productionApiUrl = 'https://apfly-map-up.herokuapp.com';
ENV.developmentApiUrl = 'http://localhost:3000';
ENV.apiUrl = ENV.isProduction ? ENV.productionApiUrl : ENV.developmentApiUrl;



(function (module) {

  // function Meetups(rawMeetupsObj) {
  //   console.log('test', rawMeetupsObj);
  //   Object.keys(rawMeetupsObj).forEach(key => this[key] = rawMeetupsObj[key]);
  // }

  function Meetups(rawMeetupsObj) {
    this.name = rawMeetupsObj.name;
    this.groupName = rawMeetupsObj.group.name
    this.date = rawMeetupsObj.local_date;
    this.time = rawMeetupsObj.local_time;
    this.link = rawMeetupsObj.link;    
    this.lon = rawMeetupsObj.venue.lon;
    this.lat = rawMeetupsObj.venue.lat;
    this.venue = rawMeetupsObj.venue.name;
    this.venue = rawMeetupsObj.venue.address_1;
    this.venue = rawMeetupsObj.venue.address_2;
    this.venue = rawMeetupsObj.venue.city;
    this.venue = rawMeetupsObj.venue.state;
    this.venue = rawMeetupsObj.venue.zip;



    // Object.keys(rawMeetupsObj).forEach(key => this[key] = rawMeetupsObj[key]);
    console.log(this);
  }

  Meetups.prototype.toHtml = function () {
    let template = Handlebars.compile($('#meetups-list-template').text());
    console.log('inside meetup proto');
    return template(this);
  };
  console.log('testing 1-2-3');
  
  Meetups.all = [];
  Meetups.loadAll = rows => Meetups.all = JSON.parse(rows.text).events.sort((a, b) => b.title - a.title).map(meetup => new Meetups(meetup));
  
  Meetups.fetchAll = callback =>
  $.get(`${ENV.apiUrl}/meetup/upcoming_events`)
  .then(Meetups.loadAll)
  .then(callback)
  .then(console.log(Meetups.all))      
  .catch(errorCallback);


var locationForm = document.getElementById('location-form');
locationForm.addEventListener('submit', geoCode);
//the geocode function hits the maps api
function geoCode(e){
  var location = document.getElementById('location-input').value;
  e.preventDefault();
  axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
    params:{
      address:location,
      key: 'AIzaSyAVGGzvV04jCERkeyLvyAfLhyw_blWCzZU'
    }
  })
  .then(function(response){
    
      //lng lat info
    var lat = response.data.results[0].geometry.location.lat;
    var lng = response.data.results[0].geometry.location.lng;
    
    var geometryOutput = `
    <ul>
    <li><strong>Latitude</strong>: ${lat}</li>
    <li><strong>Longitude</strong>: ${lng}</li>    
    </ul>
    `;

    document.getElementById('geometry').innerHTML = geometryOutput;    
    initMap(lat, lng)
    
  })
  initMap(47.6179985, -122.3516122);
}

//the initmap function puts marker on map at lng, lat pos
  function initMap(lat, lng){
  var uluru = {lat: lat, lng: lng};
  var location = uluru;
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: uluru
  });
  var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });
  }
  

  function errorCallback(err) {
    console.error(err);
    module.errorView.initErrorPage(err);
  }

  // Meetups.fetchOne = (ctx, callback) =>
  //   $.get(`${ENV.apiUrl}/api/v1/meetups/${ctx.params.meetup_id}`)
  //     .then(results => ctx.meetup = results[0])
  //     .then(callback)
  //     .catch(errorCallback);

  // Meetups.create = meetup =>
  //   $.post(`${ENV.apiUrl}/api/v1/meetups`, meetup)
  //     .then(() => page('/'))
  //     .catch(errorCallback);

  // Meetups.update = (meetup, meetupId) =>
  //   $.ajax({
  //     url: `${ENV.apiUrl}/api/v1/meetups/${meetupId}`,
  //     method: 'PUT',
  //     data: meetup,
  //   })
  //     .then(() => page(`/meetups/${meetupId}`))
  //     .catch(errorCallback);

  // Meetups.destroy = id =>
  //   $.ajax({
  //     url: `${ENV.apiUrl}/api/v1/meetups/${id}`,
  //     method: 'DELETE',
  //   })
  //     .then(() => page('/'))
  //     .catch(errorCallback);

  // // COMMENT: Where is this method invoked? What is passed in as the 'book' argument when invoked? What callback will be invoked after Book.loadAll is invoked?
  // Meetups.find = (meetup, callback) =>
  //   $.get(`${ENV.apiUrl}/api/v1/meetups/find`, meetup)
  //     .then(Meetups.loadAll)
  //     .then(callback)
  //     .catch(errorCallback);

  // // COMMENT: Where is this method invoked? How does it differ from the Book.find method, above?
  // Meetups.findOne = isbn =>
  //   $.get(`${ENV.apiUrl}/api/v1/meetups/find/${isbn}`)
  //     .then(Meetups.create)
  //     .catch(errorCallback);

  module.Meetups = Meetups;
})(app);

