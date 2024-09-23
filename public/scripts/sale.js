let idx = 0;
let preIdx = idx;
const suggestLiCont = document.querySelector('.sugestionLiContainer');
const msgTag = document.querySelector('.response-msg');

// Show Suggestions just after making any input in Search Bar
function saleSearch(val) {
  if(val.value) {
    const value = val.value;
    fetch(`/medicines/${value}`, {
      method: 'GET',
      headers: { 'Content-Type': 'Application/json' }
    })
    .then((response) => response.json())
    .then((data) => {
      removeSuggest();
      data.forEach((item) => {
        suggestLiCont.innerHTML += 
        `<li class='suggestLi' onclick=printItem(this)>
          <p id='name'>${item.name}<p id='formula'>${item.formula}</p></p>
          <p id='exp'>Exp: ${item.exp}</p>
        </li>`;
      });
    })
    .catch((err) => { console.log('ERR from Sale.js script: error to fetch data', err); });
  } else { removeSuggest(); }
  msgTag.textContent = ''; // error and successfull msg 
  msgTag.style.color = 'rgb(22, 255, 65)';
  idx = 0;
  preIdx = idx;
}

// Empty the Suggestions li
function removeSuggest() {
  suggestLiCont.innerHTML = '';
  msgTag.textContent = '';
  msgTag.style.color = 'rgb(22, 255, 65)';
}

// Adding an Item to the Bill
function printItem(e) {
  const body = {
    name: e.querySelector('.suggestLi #name').textContent,
    formula: e.querySelector('.suggestLi #formula').textContent,
    exp: e.querySelector('.suggestLi #exp').textContent.replaceAll('/', '-'),
  }
  fetch(`/print-item/search/${body.name}/${body.formula}/${body.exp}`, {
    method: 'GET',
    headers: { 'Content-Type': 'Application/json' },
  })
  .then((response) => response.json())
  .then((data) => {
    const trCount = document.querySelector('.itemsContainer').getElementsByTagName('tr').length;
    document.querySelector('.itemsContainer').insertAdjacentHTML('beforeend', `
      <tr class='content'>
      <td colspan="2"><input type="text" id="name" value="${data.name}" disabled><br><p id="formula">${data.formula}<p id="exp" style="display: none">Exp: ${data.exp}</p></p></td>
      <td><input type="text" id="price${trCount}" oninput="discount(${trCount})" value="${data.price}"></td>
      <td><input type="text" id="qty${trCount}" oninput="discount(${trCount})" value="1"></td>
      <td><input type="text" id="discount${trCount}" oninput="discount(${trCount})" value="10%"></td>
      <td><input type="text" id="amount${trCount}" value="" disabled></td>
      <td onclick="removeItem(this)"><input type="text" value="X"></td>
      </tr>
      `);
    document.querySelector('.saleSearch').value = '';
    removeSuggest();
    discount(trCount);
    totalAmt();
    document.querySelector('form').scrollBy(0, 100);
    document.querySelector('.saleSearch').focus();
  })
  .catch((err) => {
    console.log('fetch error in .catch() that shows', err);
  });
  idx = 0;
  preIdx = idx;
}

// selection Movement on sugestion items
document.querySelector('.saleSearch').onkeyup = (e)=> {
  if(e.key == 'ArrowDown') {
    preIdx = idx == 0? 2: idx;
    idx++;
    if(idx > document.querySelectorAll(`.sugestionLiContainer li`).length) { idx = 1; }
    document.querySelector(`.sugestionLiContainer li:nth-child(${preIdx})`).style.background = '#272d39';
    document.querySelector(`.sugestionLiContainer li:nth-child(${idx})`).style.background = 'rgb(94, 93, 93)';
  } else if(e.key == 'ArrowUp') {
    preIdx = idx == 0? 2: idx;
    idx--;
    if(idx < 1) { idx = document.querySelectorAll(`.sugestionLiContainer li`).length; }
    document.querySelector(`.sugestionLiContainer li:nth-child(${preIdx})`).style.background = '#272d39';
    document.querySelector(`.sugestionLiContainer li:nth-child(${idx})`).style.background = 'rgb(94, 93, 93)';
  } else if(e.key == 'Enter') {
    printItem(document.querySelector(`.sugestionLiContainer li:nth-child(${idx})`));
  }
  
}

// Change Amount value by the input of Discount value
function discount(i) {
  let price = document.getElementById(`price${i}`);
  let discount = document.getElementById(`discount${i}`);
  let qty = document.getElementById(`qty${i}`);
  let amount = document.getElementById(`amount${i}`);
  
  if (!price || !discount || !qty || !amount) {
    console.error('Elements not found for discount calculation');
    return;
  }

  let total = (Number(price.value) * Number(qty.value));
  
  if (discount.value.includes('%')) {
    total -= (total * Number(discount.value.replace('%', ''))) / 100;
  } else {
    total -= Number(discount.value);
  }
  amount.value = `${total.toFixed(0)}₹`;
  totalDiv();
  totalAmt();
}
  
// Remove an Items by clicking on X
function removeItem(e) {
  e.parentNode.remove();
  document.querySelectorAll('.content').forEach((tr, i)=> {
    tr.querySelectorAll('td').forEach((td)=> {
      let value = td.querySelector('input').id;
      
      value = value.replace(/\d+/, '');
      td.querySelector('input').id = `${value}${i+1}`;
      console.log(`${i} is ${td.querySelector('input').id}`);
    })
  })
  totalDiv();
  totalAmt();
}

// Submit button Apear and Hide
function totalDiv() {
  if(document.querySelector('.itemsContainer').getElementsByTagName('tr').length != 1) {
    setTimeout(()=> { document.querySelector('.total button').style.opacity = '1'; },100);
    document.querySelector('.total button').style.display='inline-block';
  } else {
    document.querySelector('.total button').style.opacity = '0';
    document.querySelector('.total button').style.display='none';
  }
}

// Total Amount for All Medicines
function totalAmt() {
  let val = 0;
  document.querySelectorAll('.content').forEach((tr)=> {
    val += Number(tr.querySelector('td:nth-child(5) input').value.replace('₹', ''));
  })
  document.querySelector('.totalAmt').textContent = `${val.toFixed(0)}₹`;
  document.querySelector('#given').value = val.toFixed(0);
}

// Upload Bill to Database
function submit() {
  const obj = {
    username: document.querySelector('#username').value,
    totalAmt: document.querySelector('.totalAmt').textContent,
    pendingAmount: String(Number(document.querySelector('.totalAmt').textContent.replace('₹', '')) - Number(document.querySelector('#given').value)),
    products: []
  }
  
  document.querySelectorAll('.content').forEach((tr, i)=> {
    obj.products.push({});
    obj.products[i].name = tr.querySelector('td:nth-child(1) input').value;
    obj.products[i].formula = tr.querySelector('td:nth-child(1) #formula').textContent;
    obj.products[i].exp = tr.querySelector('td:nth-child(1) #exp').textContent;
    obj.products[i].price = tr.querySelector('td:nth-child(2) input').value;
    obj.products[i].qty = tr.querySelector('td:nth-child(3) input').value;
    obj.products[i].discount = tr.querySelector('td:nth-child(4) input').value;
    obj.products[i].amount = tr.querySelector('td:nth-child(5) input').value;
  });

  fetch('/upload-bill', {
    method: 'POST',
    headers: { 'Content-Type': 'Application/json' },
    body: JSON.stringify(obj)
  })
  .then((response)=> response.json())
  .then((msg)=> {
    if(msg.err) {
      msgTag.textContent = msg.err;
      msgTag.style.color = 'red';
      return;
    }
    msgTag.textContent = msg.msg;
    document.querySelectorAll('.content').forEach((tr)=> {tr.remove()});
    document.querySelector('#username').value = '';
    document.querySelector('.totalAmt').textContent = '0';
    document.querySelector('#given').value = '0';
    totalDiv();
  }).catch((err)=> {
    console.log('error to upload [from catch()]');
  })

}