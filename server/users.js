Accounts.validateNewUser(function (user) {
  if (user.username) {
    if (user.username === "root" || user.username === "admin")
      throw new Meteor.Error(403, "Username used is a reserved word");
    if (user.username.length < 3)
      throw new Meteor.Error(403, "Username must have at least 3 characters");
    if (user.username.length > 32)
      throw new Meteor.Error(403, "Username can be upto 32 characters");
  }
  return true;
});
