const fetch = require('node-fetch');
const mainRouter = require('express').Router();
const axios = require('axios');
const userModel = require('../models/user.model');
mainRouter.get('/', (req, res) => {
  res.render('main2');
});

mainRouter.get('/receipt', (req, res) => {
  res.render('form');
});
mainRouter.post('/receipt', async (req, res) => {
  const { ing, number } = req.body;
  const response = await fetch(`https://api.spoonacular.com/recipes//findByIngredients?ingredients=${ing}&number=${number}&apiKey=a4fd781de94b4c80ab42261c4f764dc0`);
  const resBody = await response.json();
  return res.status(200).json(resBody);
});

mainRouter.get('/more/:id', async (req, res) => {
  const { id } = req.params;
  const receipt = await fetch(`https://api.spoonacular.com/recipes/${id}/information/?apiKey=a4fd781de94b4c80ab42261c4f764dc0`);
  const resInfo = await receipt.json();
  const response = await fetch(`https://api.spoonacular.com/recipes/${id}/ingredientWidget/?apiKey=a4fd781de94b4c80ab42261c4f764dc0`, {
    method: 'GET',
    headers: { 'Content-Type': 'text/html' },
  });
  const response2 = await fetch(`https://api.spoonacular.com/recipes/${id}/equipmentWidget/?apiKey=a4fd781de94b4c80ab42261c4f764dc0`, {
    method: 'GET',
    headers: { 'Content-Type': 'text/html' },
  });
  // console.log(resInfo.instructions, 'INSTRUCTION');
  const url = 'https://translate.api.cloud.yandex.net/translate/v2/translate';
  const token = 't1.9euelZqYjZyXipKTjJOJm5qXjZeKy-3rnpWanZ6Ky8_Iz5mNnMfNnMiezo7l8_dEPAl9-e9_AmoP_d3z9wRrBn35738Cag_9.J4Pka_OQYVJGXPMV0JVc7DWxJoFEcEBwE5z5ojpkctOViMjGW92m09GnVaZ6rl8A7KfVFxdtEqLTxNp5S5JDCg';
  const result = await axios.post(url, {
    folder_id: 'b1gfo402kiot5flqa8jc',
    texts: [resInfo.instructions],
    sourceLanguageCode: 'en',
    targetLanguageCode: 'ru',
  }, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const rusInfo = result.data.translations[0].text;

  let resBody2 = await response2.text();
  let resBody = await response.text();
  const trash2 = resBody2.match(/<div id="spoonacular-equipment-vis-list">.*<\/div>/);
  const trash = resBody.match(/<div id="spoonacular-ingredient-vis-list">.*<\/div>/);
  resBody = resBody.replace(trash, '');
  resBody2 = resBody2.replace(trash2, '');
  return res.render('detail', { resInfo, resBody, resBody2, rusInfo });
});

mainRouter.get('/same/:id', async (req, res) => {
  const { id } = req.params;
  const response2 = await fetch(`https://api.spoonacular.com/recipes/${id}/similar/?apiKey=a4fd781de94b4c80ab42261c4f764dc0`);
  const sameRec = await response2.json();
  res.render('same', { sameRec });
});

mainRouter.patch('/like/:id', async (req, res) => {
  const id = req.session?.user?._id;
  const user = await userModel.findById(id);
  console.log(user);
  if (!user.likes.includes(req.params.id)) {
    await userModel.findByIdAndUpdate(id, { $push: { likes: req.params.id } });
  } else {
    await userModel.findByIdAndUpdate(id, { $pull: { likes: req.params.id } });
  }
  res.sendStatus(200);
});
module.exports = mainRouter;
