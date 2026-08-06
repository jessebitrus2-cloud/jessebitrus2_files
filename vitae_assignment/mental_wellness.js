const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

dots.forEach((dot, index) => {

    dot.addEventListener("click", () => {

        slides.forEach(slide => {
            slide.classList.remove("active");
        });

        dots.forEach(dot => {
            dot.classList.remove("active");
        });

        slides[index].classList.add("active");
        dots[index].classList.add("active");

    });

});