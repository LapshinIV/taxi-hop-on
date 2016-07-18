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
    return Rides.find({
      // TODO: if coriders is null (instead of empty string), this query woun't match it
      coriders: ''
    });
  },
  isRidesEmpty() {
    return Rides.find({
      // TODO: if coriders is null (instead of empty string), this query woun't match it
      coriders: ''
    }).count() == 0;
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

  selectedRide() {
    const instance = Template.instance();
    const selectedRideFromState = instance.state.get('selectedRide');
    return (selectedRideFromState) ? Rides.findOne({_id: selectedRideFromState._id}) : null;
  },
  selectedRideClass(rideId) {
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
    return true;
  },
});

Template.hello.events({
  'click .js-ride-join'(event, instance) {
    if (Meteor.user()) {
      // TODO: Meteor.user().emails[0].address - user name is an email address so far; a user must have a username, so far they don't
      const username = Meteor.user().emails[0].address;
      // TODO: here update happens without checking with back-end (the ride might've been deleted/become not available to join)
      Rides.update(
        {_id: instance.state.get('selectedRide')._id },
        { $set: { coriders: username } }
      );
    }
  },
  'click .ride-item'(event, instance) {
    instance.state.set('selectedRide', this);
  },
  'click .js-pick-from-my-rides'(event, instance) {
    instance.state.set('selectedRide', this)
  }
});
