let slides = null,
    perPage = 10,
    sliderInterval = 1,
    counter = 0;

const clientId = '99ab3726f51790918578fcbab308f1191c07f8e4ae37a7bd71b31e28276f8313';
const url = `https://api.unsplash.com/photos/?per_page=${perPage}&client_id=${clientId}`;

const slider = document.querySelector('#carousel');
const prev = document.querySelector('#prev');
const next = document.querySelector('#next');
const selector = document.querySelector('#selector');
const interval = document.querySelector('#interval');
const menu = document.querySelector('#menu');

function getPerPage() {
    if (slides) {
        slides.forEach(item => item.remove())
    }
    perPage = selector.value;
    let newUrl = `https://api.unsplash.com/photos/?per_page=${perPage}&client_id=${clientId}`;
    getImages(newUrl);
}

function getInterval() {
    sliderInterval = interval.value;
}

function setMenuActive() {
    menu.classList.toggle('menu-active');
}

function httpGet(url) {
    document.body.style.opacity = '0';
    document.body.style.display = 'none';
    document.body.style.transition = 'all .5s';

    return new Promise(function (resolve, reject) {

        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);

        xhr.onload = function () {
            if (this.status === 200) {
                resolve(this.response);
            } else {
                let error = new Error(this.statusText);
                error.code = this.status;
                reject(error);
            }
        };

        xhr.onerror = function () {
            reject(new Error("Network Error"));
        };

        xhr.send();
    });
}

function getImages(url) {
    httpGet(url).then(response => {
        document.body.style.display = 'block';
        document.body.style.opacity = '1';
        counter = 0;

        const slidesData = JSON.parse(response);

        slidesData.forEach(item => {
            let elemImg = document.createElement('img');
            elemImg.classList.add('carousel-item');
            elemImg.setAttribute('src', item.urls.regular);

            slider.appendChild(elemImg);
            slides = document.querySelectorAll('.carousel-item');

            slides.forEach((item, i) => {
                item.classList.remove('item-active')
                item.onclick = setMenuActive;

                if (i === 0) {
                    item.classList.add('item-active')
                }
            })
        })
    })
}

getImages(url);

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
