Meteor.publish('moves', function() {
  return Moves.find();
});

Meteor.publish('stones', function() {
  return Stones.find();
});

Meteor.publish('users', function() {
  return Meteor.users.find({ "status.online": true })
});
