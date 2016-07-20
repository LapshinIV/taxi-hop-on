import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Rides } from '../both/rides.js'

import './main.html';

Template.hello.onCreated(function helloOnCreated() {
  Meteor.subscribe('rides');
  Meteor.subscribe('myRides');

  this.state = new ReactiveDict()
  this.state.setDefault({
    // selectedRide: {...},
  });
});

Template.hello.helpers({
  rides() {
    // TODO: $exists ?
    return Rides.find({coriders: null});
  },
  isRidesEmpty() {
    // TODO: $exists ?
    return Rides.find({coriders: null}).count() == 0;
  },
  myRides() {
    // TODO: Meteor.user() is sometimes not available by the time this helper executes; that's why this ugly if here
    if (Meteor.user()) {
      return Rides.find({
        coriders: Meteor.user().emails[0].address
      });
    } else {
      return null;
    }
  },
  isMyRidesEmpty() {
    if (Meteor.user()) {
      return Rides.find({
        coriders: Meteor.user().emails[0].address
      }).count() === 0;
    } else {
      return null;
    }
  },

  selectedRide() {
    const instance = Template.instance();
    const selectedRideFromState = instance.state.get('selectedRide');
    return (selectedRideFromState) ? Rides.findOne({_id: selectedRideFromState._id}) : null;
  },
  selectedRideStyle(rideId) {
    const instance = Template.instance();
    const selectedRideFromState = instance.state.get('selectedRide')
    if (selectedRideFromState) {
      // TODO: don't use typeof, use https://docs.meteor.com/api/check.html instead, like this: check(selectedRideFromState._id, String)
      if (typeof selectedRideFromState._id === 'string') {
        return (selectedRideFromState && selectedRideFromState._id === rideId) ? "background-color: yellow" : "";
      } else {
        // ObjectID
        return (selectedRideFromState && selectedRideFromState._id.equals(rideId)) ? "background-color: yellow" : "";
      }
    } else {
      return "";
    }
  },
  isSelectedRideMine() {
    const instance = Template.instance();
    const selectedRideFromState = instance.state.get('selectedRide');
    return (selectedRideFromState.coriders === Meteor.user().emails[0].address);
  },
});

Template.hello.events({
  'click .js-ride-join'(event, instance) {
    if (Meteor.user()) {
      Meteor.call('rides.join', { rideId: instance.state.get('selectedRide')._id },
        (err, res) => {
          console.log('b:' + Rides.find().count());
        }
      );
    }
    console.log('a:' + Rides.findOne({_id: this._id}));
    instance.state.set('selectedRide', Rides.find({_id: this._id}).fetch());
  },
  'click .ride-item'(event, instance) {
    instance.state.set('selectedRide', this);
  },
  'click .js-pick-from-my-rides'(event, instance) {
    instance.state.set('selectedRide', this)
  }
});
