/*Game Area*/
"use strict"; // Kontrollfunktion

// Deklarerar och initierar letiabler för användning nedan
let newImg = false;
let freezeImg = false;
let imgOne = null;
let imgTwo = null;
let imageArray = [];

// Hämtar kort / bild objekten från DOM:en.
const $$ = document.querySelectorAll.bind(document);

// Blandar random korten / bilderna letje gång 
(() => {
    $$(".cardWrap").forEach(img => {
      let mixedImages = Math.floor(Math.random() * 16);
      img.style.order = mixedImages;
    });
})();

// Lägger på eventlyssnare på letje bild
$$(".cardWrap").forEach(img => img.addEventListener('click', changeImages));

// Denna återställer letiablerna efter letje omgång
const reAssignletiables = () => [imgOne, imgTwo, imageArray, newImg, freezeImg] = [null, null, null, false, false];

// Funktionen som startar och ser till så att korten inte vänds tillbaka, samt
const freezeImages = () => {
    imageArray.forEach(img => img.removeEventListener("click", changeImages));
    reAssignletiables();
}

// Funktionen som vänder tillbaka korten fall det INTE är match.
const hideImages = () => {
    freezeImg = true;
    setTimeout(() => {
      imageArray.forEach(img => img.classList.remove("changeImg"));
      reAssignletiables();
    }, 500); // Här kan du kanske ställa in svårighetsgraden dvs hur länge man ser bilderna innan de vänds tillbaka.
}

// som väljer ny funktion utifrån satta data-* attribut i index.html (data-dino="dino8") // är båda tex dino8 är det samma då da...
const compareImages = () => imgOne.dataset.dino === imgTwo.dataset.dino ? freezeImages() : hideImages();

// Funktionen som byter sida på korten
function changeImages() {
  if ( freezeImg || this === imgOne ){ // Fall denna sats är sann, dvs att freezeImg === true, måste man vänta en stund innan man kan trycka på ett till kort.
    return; // Förhindrar att eventlyssnaren försvinner då det gick att klicka två gånger fort på samma kort. Det hänger sig då.
  }

  this.classList.add("changeImg"); // Ändrar klassen till bytsida, som "vänder" kortet.

  if (!newImg) { // Om newImg är false / dvs not true - är kortet, det första som trycks på (av två, dvs ett par då), 
    newImg = true; // och då sätts letiablarna - så att detta if statement ej exekverar vid nästa bildtryck
    imgOne = this;
    // console.log(this);
    return; // och man går ur loopen.
  }
  imgTwo = this; // Hit kommer man fall det är andra kortet / bilden man trycker på.
  imageArray = [imgOne, imgTwo]; // instansierar 7 lägger till de två bilderna i arrayen. (Om man i framtiden vill ha flera bilder)
  compareImages(); // och går vidare till jämförelsefunktionen 
}

/*Stopwatch*/
let watch = {
  etime : null, // HTML time display
  erst : null, // HTML reset button
  ego : null, // HTML start/stop button
  init : function () {
    watch.etime = document.getElementById("watch-time");
    watch.erst = document.getElementById("watch-reset");
    watch.ego = document.getElementById("watch-start");

    watch.erst.addEventListener("click", watch.reset);
    watch.erst.disabled = false;
    watch.ego.addEventListener("click", watch.start);
    watch.ego.disabled = false;
  },

  timer : null, // timer object
  now : 0, // current elapsed time
  tick : function () {
  
    watch.now++;
    let remain = watch.now;
    let hours = Math.floor(remain / 3600);
    remain -= hours * 3600;
    let mins = Math.floor(remain / 60);
    remain -= mins * 60;
    let secs = remain;

    if (hours<10) { hours = "0" + hours; }
    if (mins<10) { mins = "0" + mins; }
    if (secs<10) { secs = "0" + secs; }
    watch.etime.innerHTML = hours + ":" + mins + ":" + secs;
  },
  
  start : function () {
    watch.timer = setInterval(watch.tick, 1000);
    watch.ego.value = "Stop";
    watch.ego.removeEventListener("click", watch.start);
    watch.ego.addEventListener("click", watch.stop);
  },

  stop  : function () {
    clearInterval(watch.timer);
    watch.timer = null;
    watch.ego.value = "Start";
    watch.ego.removeEventListener("click", watch.stop);
    watch.ego.addEventListener("click", watch.start);
  },

  reset : function () {
    if (watch.timer != null) { watch.stop(); }
    watch.now = -1;
    watch.tick();
  }
};
window.addEventListener("load", watch.init);