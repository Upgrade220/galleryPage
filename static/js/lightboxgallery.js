let pics = document.querySelectorAll('.gallery__img');

let lightbox = document.querySelector('.lightbox');
let lightboxPic = document.querySelector('.lightbox__img');
let prevButton = document.querySelector('.lightbox__prev');
let nextButton = document.querySelector('.lightbox__next');
let closeButton = document.querySelector('.lightbox__close');

let position = 0;

for (let i = 0; i < pics.length; i++) {
    pics[i].addEventListener("click", () => {
        lightbox.style.visibility = "visible";
        lightboxPic.src = pics[i].src;
        position = i;
    })
}

closeButton.addEventListener("click", () => {
    lightbox.style.visibility = "hidden";
})

nextButton.addEventListener("click", () => {
    if (position >= pics.length - 1) {
        position = 0;
    } else {
        position++;
    }
    lightboxPic.src = pics[position].src;
})

prevButton.addEventListener("click", () => {
    if (position <= 0) {
        position = pics.length - 1;
    } else {
        position--;
    }
    lightboxPic.src = pics[position].src;
})