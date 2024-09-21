const btn = document.querySelector('.searchbar button');
const SearchInput = document.querySelector('#search');

function card(name, formula, price, qty, exp) {
        const obj = { name, formula, exp }
        return `<div class="card">
            <div class = 'space-between'>
                <p class="name">${name}</p>
                <button onclick = "deleteData({name: '${name}', price: '${price}', formula: '${formula}', exp: '${exp}'})">Delete</button>
                <button onclick = "updateData(this, {name: '${name}', formula: '${formula}', exp: '${exp}'})">Edite</button>
            </div>
            <div class="flex-end">
                <div class="content">
                    <div class="row">
                        <p>Quantity:</p>
                        <input type='text' class="qty" value=${qty} disabled>
                    </div>
                        
                    <div class="row">
                        <p>Price: </p>
                        <input type='text' class="price" value=${price} disabled>
                    </div>
                        
                    <div class="row">
                        <p>Expiry:</p>
                        <input type='text' class="exp" value=${exp} disabled>
                    </div>

                    <div class="row">
                        <p>Formula:</p>
                        <p>${formula}</p>
                    </div>
                </div>
            </div>
        </div>`;
}
searchmed();

function btnText() {
    if(btn.textContent == 'Name') {
        btn.textContent = 'Formula';
    } else {
        btn.textContent = 'Name';
    }
    searchmed();
    SearchInput.focus();
}

function searchmed() {
    const key = SearchInput.value || 'empty';
    let type = btn.textContent == 'Name'?'name':'formula';
    fetch(`/medicines/${type}/${key}`, {
        method: 'GET',
        headers: { 'Content-Type': 'Application/json' }
    })
    .then((response)=> response.json())
    .then((data)=> {
        document.querySelector('.container').innerHTML = '';
        data.forEach((item)=> {
            document.querySelector('.container').innerHTML += card(item.name, item.formula, item.price, item.qty, item.exp);
        })
    })
}

function updateData(btn, medicine) {
    const card = btn.parentElement.parentElement;
    const qty = card.querySelector('.qty');
    const price = card.querySelector('.price');

    if(btn.textContent == 'Edite') {
        qty.disabled = false;
        price.disabled = false;
        btn.textContent = 'Save'
    } else {
        qty.disabled = true;
        price.disabled = true;

        fetch(`/medicine/update`, {
            method: 'POST',
            headers: {'Content-Type': 'Application/json'},
            body: JSON.stringify({ name: medicine.name,
                formula: medicine.formula,
                exp: medicine.exp,
                price: price.value,
                qty: qty.value
            })
        })
        btn.textContent = 'Edite'
    }
}

function deleteData(medicine) {
    const user = prompt('Are you sure to delete!  press Y for "yes" or anykey for "No"');
    if(user == 'y' || user == 'Y') {
        fetch(`/medicine/delete`, {
            method: 'POST',
            headers: {'Content-Type': 'Application/json'},
            body: JSON.stringify({
                name: medicine.name,
                formula: medicine.formula,
                exp: medicine.exp
            })
        })
        .then(()=>{
            alert(`${medicine.name} Successfully Deleted`);
            window.location.reload();
        })
    }
}