let slides = null,
  perPage = 10,
  sliderInterval = 1,
  counter = 0,
  playInterval = null;

const clientId = '99ab3726f51790918578fcbab308f1191c07f8e4ae37a7bd71b31e28276f8313';
const url = `https://api.unsplash.com/photos/?per_page=${perPage}&client_id=${clientId}`;

const slider = document.querySelector('#carousel');
const prev = document.querySelector('#prev');
const next = document.querySelector('#next');
const pageSelector = document.querySelector('#pageSelector');
const intervalSelector = document.querySelector('#intervalSelector');
const menu = document.querySelector('#menu');
const play = document.querySelector('#play');
const pause = document.querySelector('#pause');
const fullscreen = document.querySelector('#fullscreen');
const fullscreenIcon = document.querySelector('#fullscreen .material-icons');

const hammer = new Hammer(slider);

hammer.on("panleft", function() {
    nextSlide();
});

hammer.on("panright", function() {
    prevSlide();
});

hammer.on("pandown", function() {
    menu.classList.add('menu-active');
});

play.onclick = playSlider;

pause.onclick = stopSlider;
fullscreen.onclick = toggleFullScreen;

if (document.addEventListener) {
    document.addEventListener('webkitfullscreenchange', exitHandler, false);
    document.addEventListener('mozfullscreenchange', exitHandler, false);
    document.addEventListener('fullscreenchange', exitHandler, false);
    document.addEventListener('MSFullscreenChange', exitHandler, false);
}

function exitHandler() {
    if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
        fullscreenIcon.innerHTML = 'fullscreen';
    }
}

function playSlider() {
    if (playInterval) {
        return;
    }
    pause.classList.remove('active');
    play.classList.add('active');
    playInterval = setInterval(() => nextSlide(), sliderInterval * 1000);
}

function stopSlider() {
    if (playInterval) {
        play.classList.remove('active');
        pause.classList.add('active');
        clearInterval(playInterval);
        playInterval = null;
    }
}

function changeInterval() {
    stopSlider();
    sliderInterval = intervalSelector.value;
    playSlider();
}

function getPerPage() {
    if (slides) {
        slides.forEach(item => item.remove())
    }
    perPage = pageSelector.value;
    let newUrl = `https://api.unsplash.com/photos/?per_page=${perPage}&client_id=${clientId}`;
    getImages(newUrl);
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

// prev.onclick = () => {
//     slides[counter].classList.remove('item-active');
//     counter--;
//
//     if (counter < 0) {
//         counter = slides.length - 1;
//     }
//     slides[counter].classList.add('item-active');
// };

next.onclick = nextSlide;
prev.onclick = prevSlide;

function prevSlide() {
    slides[counter].classList.remove('item-active');
    counter--;

    if (counter < 0) {
        counter = slides.length - 1;
    }
    slides[counter].classList.add('item-active');
}

function nextSlide() {
    slides[counter].classList.remove('item-active');
    counter++;

    if (counter >= slides.length) {
        counter = 0;
    }

    slides[counter].classList.add('item-active');
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        fullscreenIcon.innerHTML = 'fullscreen_exit';
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            fullscreenIcon.innerHTML = 'fullscreen';
            document.exitFullscreen();
        }
    }
}
