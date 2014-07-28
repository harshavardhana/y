function userLoggedIn(user) {
  var options = {
    userCloseable: false,
    timeout: 3000
  };

  if (user)
    return true;

  Notifications.warn('Sign in',
                     'Board changes not allowed, please sign in or feel free to watch :-)',
                     options);
  return false;
}

function CopyMoves(moves) {
  bootbox.dialog({
    message: moves.toString(),
    title: "Ctrl-C to Copy",
    buttons: {
      main: {
        label: "Okay",
        classname: "btn-primary",
        callback: function() {
          console.log (moves);
        }
      }
    }
  });
}

Template.game.events({
  'click .undo_move': function() {
    var user = Meteor.user();
    if (!userLoggedIn(user))
      return;
    Meteor.call('undo');
  },

  'click .reset_board': function() {
    var user = Meteor.user();
    if (!userLoggedIn(user))
      return;
    Meteor.call('reset');
  },

  'click .mute': function() {
    var mute = Session.get("mute");
    if (mute === true) {
      document.getElementById("mute-button").value = "Mute";
      Session.set("mute", false);
    } else {
      document.getElementById("mute-button").value = "UnMute";
      Session.set("mute", true);
    }
  },

  'click .copymoves': function() {
    var moves = Moves.find({},
                           {name: 1,
                            sort: {step: 1}}).map(function (x)
                                                  { return x.name });
    if (typeof(moves) != 'undefined')
      CopyMoves (moves);
  }
});

Deps.autorun(function () {
  Meteor.subscribe('moves');
  Meteor.subscribe('stones');
  Meteor.subscribe('users');
  var lastMove = Moves.findOne({}, {sort: {step: -1}});
  if (typeof(lastMove) != 'undefined' && lastMove.step > 0) {
    if (Session.get("mute"))
      return;
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
    var lastMove = Moves.findOne({}, {sort: {step: -1}});
    if (typeof(lastMove) != 'undefined')
      return [lastMove];
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
    var user = Meteor.user();
    if (!userLoggedIn(user))
      return;

    Meteor.call('move', this.name, function(error, id) {
      if(error) {
        console.log(error.reason);
      }
    });
  }
});

/*
Template.listMoves.helpers({
  moves: function() {
    return Moves.find({}, {sort: {step: 1}});
  }
});
*/

Template.listMovesBlack.helpers({
  moves: function() {
    return Moves.find({step: {$mod: [2, 1]}}, {sort: {step: 1}});
  }
});

Template.listMovesWhite.helpers({
  moves: function() {
    return Moves.find({step: {$mod: [2, 0]}}, {sort: {step: 1}});
  }
});

Template.usersOnline.helpers({
  users: function() {
    return Meteor.users.find({ "status.online": true })
        .map(function (user) {
      return (user.profile && user.profile.name) || user.username;
    });
  }
});
