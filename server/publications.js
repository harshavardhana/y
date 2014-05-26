Meteor.publish('moves', function() {
  return Moves.find();
});

Meteor.publish('stones', function() {
  return Stones.find();
});
