Template.game.events({
  'click .undo_move': function() {
    var moves = Moves.find().fetch();
    var lastMove = _.max(moves, function(move) { return move.step; });
    lastMove.step = 0;
    Moves.update(lastMove._id, lastMove);
  },
  'click .reset_board': function() {
    var moves = Moves.find().fetch();
    _.each(moves, function(move) {
      move.step = 0;
      Moves.update(move._id, move);
    });
  },
});

Deps.autorun(function () {
  var moves = Moves.find().fetch();
  var lastMove = _.max(moves, function(move) { return move.step; });
  if (lastMove.step > 0) {
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
  lastMove: function() {
    var moves = Moves.find().fetch();
    var lastMove = _.max(moves, function(move) { return move.step; });
    var lastmovestep = (lastMove.step > 1) ? [lastMove] : [];
    return lastmovestep;
  }
});

Template.move.helpers({
  color: function() {
    var color;
    color = (this.step === 0) ? "yellow" : (this.step % 2 === 0) ? "white" : "black";
    return color;
  },
  opacity: function() {
    var opacity = (this.step === 0) ? 0 : 1;
    return opacity;
  },
  rsize: function() {
    var rsize = (this.step === 0) ? 17 : 10;
    return rsize;
  }
});

Template.move.events({
  'click': function() {
    var moves = Moves.find().fetch();
    var lastMove = _.max(moves, function(move) { return move.step; });
    console.log(lastMove.step);
    if(this.step === 0 || lastMove.step === 1) {
      this.step = lastMove.step + 1;
      Moves.update(this._id, this);
    }
  }
});
