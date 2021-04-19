const profileRouter = require('express').Router();
const User = require('../models/user.model');
const fetch = require('node-fetch');
profileRouter.get('/profile', async (req, res) => {
  const user = await User.findById(req.session?.user?._id);
  const liked = user.likes.join(',');

  const response = await fetch(`https://api.spoonacular.com/recipes/informationBulk?ids=${liked}&apiKey=a4fd781de94b4c80ab42261c4f764dc0`)
  const resBody = await response.json();
  console.log(resBody);
  res.render('profile', {resBody});
})

module.exports = profileRouter;
