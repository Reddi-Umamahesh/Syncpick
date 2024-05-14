const User = require("../models/user.js");

module.exports.renderSignup = (req, res) => {
  res.render("./users/signup.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUSer = new User({ email, username });
    const regUser = await User.register(newUSer, password);
    console.log(regUser);
    req.login(regUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "welcome to Brickup");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};
module.exports.renderLogin = (req, res) => {
  res.render("./users/login.ejs");
};
module.exports.login = async (req, res) => {
  req.flash("Welcome to BrickUp! you are logged in!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};
module.exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you are logged out !");
    res.redirect("/listings");
  });
};
