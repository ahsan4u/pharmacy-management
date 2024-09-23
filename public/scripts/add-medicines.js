document.querySelectorAll('input').forEach((input)=> {
    input.addEventListener('click', (e)=> {
        document.querySelector('.msg').textContent = '';
        document.querySelector('.msg span').textContent = '';
    })
})