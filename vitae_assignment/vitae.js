const slides = document.querySelector(".slides");
const slide = document.querySelectorAll(".slide");

const dots = document.querySelectorAll(".dot");

const next = document.querySelector(".next");
const prev = document.querySelector(".prev");

let current = 0;

function showSlide(index){

    if(index >= slide.length){
        current = 0;
    }

    if(index < 0){
        current = slide.length - 1;
    }

    slides.style.transform =
        `translateX(-${current * 100}%)`;

    dots.forEach(dot => dot.classList.remove("active"));

    dots[current].classList.add("active");
}

/* Next */

next.addEventListener("click",()=>{

    current++;

    showSlide(current);

});

/* Previous */

prev.addEventListener("click",()=>{

    current--;

    showSlide(current);

});

/* Dots */

dots.forEach((dot,index)=>{

    dot.addEventListener("click",()=>{

        current=index;

        showSlide(current);

    });

});

/* Auto Slide */

setInterval(()=>{

    current++;

    showSlide(current);

},5000);