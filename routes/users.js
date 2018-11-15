const Use = require("../models/user").user;
const auth = require("../middleware/auth");
const validate = require("../models/user").validate;
const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

const urlenCodedParser = bodyParser.urlencoded({ extended: false });

router.post("/", urlenCodedParser, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await Use.findOne({ where: { email: req.body.email } });
  if (user) return res.status(400).send("Email Already Exists.");

  //   user = await Use.findOne({ where: { userId: req.body.userId } });
  //   if (user) return res.status(400).send("UserId already exists.");

  user = await Use.findOne({ where: { username: req.body.username } });
  if (user) return res.status(400).send("Username already exists.");

  const salt = await bcrypt.genSalt(5);
  const hashed = await bcrypt.hash(req.body.password, salt);

  Use.create({
    username: req.body.username,
    email: req.body.email,
    password: hashed,
    usertype: "S"
  });
  res.render("../views/signup-success", { data: req.body });
  //   .then(use => res.send(`user registered`));
  //   console.log(req.body);
  //   res.send("user registered");
});

router.get("/:id", auth, async (req, res) => {
  const user = Use.findById(req.user.id);
  res.send(user.username);
});

module.exports = router;
