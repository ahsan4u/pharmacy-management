const btn = document.querySelector('button');
const SearchInput = document.querySelector('#search');

function card(name, formula, price, qty, exp) {
        return `<div class="card">
            <p class="name">${name}</p>
            <div class="forflex">
                <div class="content">
                    <div class="row three">
                        <p>Quantity:</p>
                        <p class="total">${qty}</p>
                    </div>

                    <div class="row two">
                        <p>Price: </p>
                        <p class="price">${price}</p>
                    </div>

                    <div class="row four">
                        <p>Expiry:</p>
                        <p class="exp">${exp}</p>
                    </div>

                    <div class="row one">
                        <p>Formula:</p>
                        <p class="formula">${formula}</p>
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