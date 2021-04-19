const fetch = require('node-fetch');
const userRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user.model');

userRouter.route('/signup')
  .get((req, res) => {
    res.render('user/signup');
  })
  .post(
    // eslint-disable-next-line no-unused-expressions
    async (req, res) => {
      const { name, email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        const saltRound = 10;
        try {
          if (email && password && name) {
            const hashedPassword = await bcrypt.hash(password, saltRound);
            const newUser = await User.create({
              email,
              password: hashedPassword,
              name,
            });
            req.session.user = newUser;
            return res.redirect('/');
          }
          return res.status(418).redirect('/signup');
        } catch (error) {
          console.log(error);
          return res.sendStatus(500);
        }
      }
      return res.sendStatus(302);
    },
  );

userRouter.route('/signin')
  .get((req, res) => res.render('user/signin'))
  .post(async (req, res) => {
    const { email, password } = req.body;
    try {
      if (email && password) {
        const currentUser = await User.findOne({ email });
        if (currentUser && (await bcrypt.compare(password, currentUser.password))) {
          req.session.user = currentUser;
          return res.status(200).redirect('/');
        }
        return res.status(418).redirect('/signin');
      }
      return res.status(418).send('Pole ne zapolneno');
    } catch (error) {
      return res.sendStatus(500);
    }
  });

userRouter.route('/signout')
  .get(async (req, res) => {
    req.session.destroy((err) => {
      if (err) return res.redirect('/');

      res.clearCookie(req.app.get('cookieName'));
      return res.redirect('/');
    });
  });
module.exports = userRouter;
