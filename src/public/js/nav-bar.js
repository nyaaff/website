const header = document.querySelector('.header');
const hamburger = document.querySelector('.hamburger-wrapper');

hamburger.addEventListener('click', () => {
    header.classList.toggle('active');
});
