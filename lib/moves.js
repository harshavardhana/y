Moves = new Meteor.Collection('moves');
Stones = new Meteor.Collection('stones');

Meteor.methods({
  move: function(position) {
    var lastMove = Moves.findOne({}, {sort: {step: -1}});
    var step = 1;
    if(typeof lastMove != 'undefined') {
      step = lastMove.step + 1;
    }
    if(step > 2) {
      var conflictingMove = Moves.findOne({name: position});
      if(typeof conflictingMove != 'undefined') {
        throw "Position already played";
      }
    }
    Moves.insert({name: position, step: step});
  }
});
