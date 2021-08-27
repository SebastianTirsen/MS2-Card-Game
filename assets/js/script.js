"use strict"; // Kontrollfunktion

// Deklarerar och initierar variabler för användning nedan
let newImg = false;
let freezeImg = false;
let imgOne = null;
let imgTwo = null;
let imageArray = [];


// Hämtar kort / bild objekten från DOM:en.
const $$ = document.querySelectorAll.bind(document);


// Blandar random korten / bilderna varje gång 
(() => {
    $$(".cardWrap").forEach(img => {
      let mixedImages = Math.floor(Math.random() * 16);
      img.style.order = mixedImages;
    });
})();


// Lägger på eventlyssnare på varje bild
$$(".cardWrap").forEach(img => img.addEventListener('click', changeImages));


// Denna återställer variablerna efter varje omgång
const reAssignVariables = () => [imgOne, imgTwo, imageArray, newImg, freezeImg] = [null, null, null, false, false];
   

// Funktionen som startar och ser till så att korten inte vänds tillbaka, samt
const freezeImages = () => {
    imageArray.forEach(img => img.removeEventListener("click", changeImages));
    reAssignVariables();
}


// Funktionen som vänder tillbaka korten fall det INTE är match.
const hideImages = () => {
    freezeImg = true;
    setTimeout(() => {
      imageArray.forEach(img => img.classList.remove("changeImg"));
      reAssignVariables();
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
    newImg = true; // och då sätts variablarna - så att detta if statement ej exekverar vid nästa bildtryck
    imgOne = this;
    // console.log(this);
    return; // och man går ur loopen.
  }
  imgTwo = this; // Hit kommer man fall det är andra kortet / bilden man trycker på.
  imageArray = [imgOne, imgTwo]; // instansierar 7 lägger till de två bilderna i arrayen. (Om man i framtiden vill ha flera bilder)
  compareImages(); // och går vidare till jämförelsefunktionen 
}
