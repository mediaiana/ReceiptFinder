/* eslint-disable no-unused-expressions */
/* eslint-disable no-restricted-syntax */
const form = document.querySelector('.receiptForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.querySelector('#exampleInputEmail1').value;
    const ing = input.replaceAll(', ', ',+');
    const number = document.querySelector('#exampleInputEmail2').value;
    const response = await fetch('http://localhost:3000/receipt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ing,
        number,
      }),
    });
    const resBody = await response.json();
    const receipt = resBody.map((el) => `<div class="card text-white bg-dark m-3 " style="width: 18rem;">
      <img src="${el.image}" class="card-img-top" alt="...">
      <div class="card-body d-flex flex-column align-items-start">
        <h5 class="card-title">${el.title}</h5>
      </div>
      <button type="button" class="btn btn-outline-warning">More<a href="/more/${el.id}" class="text-warning stretched-link"></a></button>
    </div>`).join('');
    console.log(resBody);
    if (response.status === 200) {
      const div = document.querySelector('.container');
      div.insertAdjacentHTML('afterbegin', String(receipt));
    }
  });
}

const like = document.querySelector('#likeID');
if (like) {
  like.addEventListener('click', async (e) => {
    e.preventDefault();
    const id = e.target.dataset.id;
    console.log(id);
    const response = await fetch(`http://localhost:3000/like/${id}`, {
      method: 'PATCH',
    });
    if (response.status === 200) {
      const div = document.querySelector('.image-rec');
      console.log(div);
      const cong = document.createElement('h3');
      cong.innerText = 'Добавлено в избранные';
      cong.color = 'green'
      div.append(cong);
      setTimeout(() => {
        cong.remove()
      }, 1000);
    }
  });
}

// const instructions = document.querySelector('#instructions');
// console.log(instructions);
// if (instructions) {
//   instructions.addEventListener('click', async (e) => {
//     e.preventDefault();
//     const id = e.target.dataset.id
//     console.log(id);
//     const response = await fetch(`http://localhost:3000/more/${id}`, {
//       method: 'GET',
//     });
//     const resBody = await response.json();
//     console.log(resBody);
//     const instuctionId = document.querySelector('#instuctionId');
//     instuctionId.innerText = resBody;
//   })
// }
