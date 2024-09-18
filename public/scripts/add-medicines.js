const video = document.querySelector('video');
let playForword = true;
video.addEventListener('ended', (e)=> {
    if(playForword) {
        video.src = '/img/add-med1-reverse.mp4';
    } else {
        video.src = '/img/add-med1.mp4';
    }
    playForword = !playForword;
    video.play(); 
})

document.querySelectorAll('input').forEach((input)=> {
    input.addEventListener('click', (e)=> {
        document.querySelector('.msg').textContent = '';
        document.querySelector('.msg span').textContent = '';
    })
})