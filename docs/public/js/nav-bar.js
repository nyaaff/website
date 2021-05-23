const header = document.querySelector('.header');
const hamburger = document.querySelector('.hamburger-wrapper');

hamburger.addEventListener("click", function(e) {
    header.classList.toggle("active");
});
