import { Rides } from '../both/rides.js'

Meteor.methods(
  {
    'rides.join'( { rideId } ) {
      // TODO: validate args

      if (!Meteor.user()) {
        console.error('rides.join.noauth');
        throw new Meteor.Error('rides.join.noauth', 'No auth');
      }

      if (Rides.find(rideId).coriders) {
        console.error('rides.join.rideClosed');
        throw new Meteor.Error('rides.join.rideClosed', 'Ride is already joined by someone else');
      }

      // TODO: print info to console only on the server
      console.info('User <' + Meteor.user()._id + '> is joining ride <' + rideId + '>.');
      const username = Meteor.user().emails[0].address;
      Rides.update(
        {_id: rideId },
        { $set: { coriders: username } }
      );

      return true;
    },
    // ''() {
    //
    // },
  }
);
