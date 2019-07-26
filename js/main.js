let slides = null;
const prev = document.querySelector('#prev');
const next = document.querySelector('#next');

const perPage = 100;
const url = `https://api.unsplash.com/photos/?per_page=${perPage}&client_id=99ab3726f51790918578fcbab308f1191c07f8e4ae37a7bd71b31e28276f8313`;
let counter = 0;

function httpGet(url) {
    document.body.style.opacity = '0';
    document.body.style.display = 'none';
    document.body.style.transition = 'all .5s';

    return new Promise(function(resolve, reject) {

        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);

        xhr.onload = function() {
            if (this.status === 200) {
                resolve(this.response);
            } else {
                let error = new Error(this.statusText);
                error.code = this.status;
                reject(error);
            }
        };

        xhr.onerror = function() {
            reject(new Error("Network Error"));
        };

        xhr.send();
    });
}

httpGet(url).then(response => {
    document.body.style.display = 'block';
    document.body.style.opacity = '1';

    const slidesData = JSON.parse(response);
    const slider = document.querySelector('#carousel');

    slidesData.forEach((item, i) => {
        let elemImg = document.createElement('img');
        elemImg.classList.add('carousel-item');
        elemImg.setAttribute('src', item.urls.regular);

        if (i === 0) {
            elemImg.classList.add('item-active')
        }

        slider.appendChild(elemImg);
        slides = document.querySelectorAll('.carousel-item');
    })
});

prev.onclick = () => {
    slides[counter].classList.remove('item-active');
    counter--;

    if (counter < 0) {
        counter = slides.length - 1;
    }
    slides[counter].classList.add('item-active');
};

next.onclick = () => {
    slides[counter].classList.remove('item-active');
    counter++;

    if (counter >= slides.length) {
        counter = 0;
    }

    slides[counter].classList.add('item-active');
};
