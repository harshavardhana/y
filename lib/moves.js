Moves = new Meteor.Collection('moves');
Stones = new Meteor.Collection('stones');

Meteor.methods({
  move: function(position) {
    var lastMove = Moves.findOne({}, {sort: {step: -1}});
    var step = 1;
    if(typeof(lastMove) != 'undefined') {
      step = lastMove.step + 1;
    }
    if(step > 2) {
      var conflictingMove = Moves.findOne({name: position});
      if(typeof(conflictingMove) != 'undefined') {
        throw new Meteor.Error(500, "Position already played");
      }
    }
    var stone = Stones.findOne({name: position});
    if(stone) {
      Moves.insert({name: position, step: step});
    } else {
      throw new Meteor.Error(500, "Position is not valid");
    }
  },

  undo: function() {
    var lastMove = Moves.findOne({}, {sort: {step: -1}});
    if (typeof(lastMove) != 'undefined') {
      Moves.remove(lastMove._id);
    }
  },

  reset: function() {
    var moves = Moves.find().fetch();
    _.each(moves, function(move) {
      Moves.remove(move._id);
    });
  }
}
);
