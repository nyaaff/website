const header = document.querySelector('.header');
const hamburger = document.querySelector('.hamburger-wrapper');

window.addEventListener("scroll", function(e) {
    if (e.currentTarget.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

hamburger.addEventListener("click", function(e) {
    header.classList.toggle("active");
});
