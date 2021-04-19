const fetch = require('node-fetch');
async function test() {
  const response = await fetch('https://api.spoonacular.com/recipes//findByIngredients?ingredients=apples,+flour,+sugar&number=2&apiKey=75394c9595834c66a0134cb61d11b86f');
  const resBody = await response.json();
  console.log(resBody);
}
test()
