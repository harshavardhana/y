Template.game.events({
  'click .undo_move': function() {
    var lastMove = Moves.findOne({}, {sort: {step: -1}});
    Moves.remove(lastMove._id);
  },
  'click .reset_board': function() {
    var moves = Moves.find().fetch();
    _.each(moves, function(move) {
      Moves.remove(move._id);
    });
  }
});

/*
Template.game.helpers({
  listMoves: function() {
    var moves = Moves.find({}, {sort: {step: 1}}).fetch();
    console.log(moves);
    var result = "";
    for(var i = 0; i< moves.length; i++) {
      result = result + moves[i].name;
    }
    return result;
  }
});
*/

Deps.autorun(function () {
  //var lastMove = _.max(moves, function(move) { return move.step; });
  var lastMove = Moves.findOne({}, {sort: {step: -1}});
  if (typeof(lastMove) != 'undefined' && lastMove.step > 0) {
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', 'stone.ogg');
    audioElement.load();
    audioElement.play();
  }
});

Template.board.helpers({
  moves: function() {
    return Moves.find();
  },
  stones: function() {
    return Stones.find();
  },
  lastMove: function() {
    return [Moves.findOne({}, {sort: {step: -1}})];
  }
});

Template.lastMoveTemplate.helpers({
  cx: function() {
    var stone = Stones.findOne({name: this.name});
    return stone && stone.x;
  },
  cy: function() {
    var stone = Stones.findOne({name: this.name});
    return stone && stone.y;
  }
});

Template.move.helpers({
  color: function() {
    var color = (this.step === 0) ? "yellow" : (this.step % 2 === 0) ? "white" : "black";
    return color;
  },
  opacity: function() {
    var opacity = (this.step === 0) ? 0 : 1;
    return opacity;
  },
  rsize: function() {
    var rsize = (this.step === 0) ? 17 : 10;
    return rsize;
  },
  cx: function() {
    var stone = Stones.findOne({name: this.name});
    return stone && stone.x;
  },
  cy: function() {
    var stone = Stones.findOne({name: this.name});
    return stone && stone.y;
  }
});

Template.stone.events({
  'click': function() {
    Meteor.call('move', this.name, function(error, id) {
      if(error) {
        console.log(error.reason);
      }
    });
  }
});

Template.listMoves.helpers({
  moves: function() {
    return Moves.find({}, {sort: {step: 1}});
  }
});
