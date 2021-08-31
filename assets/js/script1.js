/*****Time Area*****/

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

/*****Game Area*****/

// Controlfunction
"use strict"; 

// Declares and initiates variables
let newImg = false;
let freezeImg = false;
let imgOne = null;
let imgTwo = null;
let imageArray = [];

// Gets cards / image objects from the DOM
const $$ = document.querySelectorAll.bind(document);

// Shuffles cards / images every round
(() => {
    $$(".cardWrap").forEach(img => {
      let mixedImages = Math.floor(Math.random() * 16);
      img.style.order = mixedImages;
    });
})();

// Applies eventlisteners on every image
$$(".cardWrap").forEach(img => img.addEventListener('click', changeImages));

// Resets varibles after every round
const reAssignVariables = () => [imgOne, imgTwo, imageArray, newImg, freezeImg] = [null, null, null, false, false];

// Function that starts and makes sure the cards doesnt flip back over
const freezeImages = () => {
    imageArray.forEach(img => img.removeEventListener("click", changeImages));
    reAssignVariables();
}

// Function that turns the cards back again if they dont match
const hideImages = () => {
    freezeImg = true;
    setTimeout(() => {
      imageArray.forEach(img => img.classList.remove("changeImg"));
      reAssignVariables();
    }, 1000); // how long the cards front side is showing before turning back again
}

// Chooses new function from stated data-* attribute in index.html (data-dino="dino8") // if both are for example dino8 they make a pair
const compareImages = () => imgOne.dataset.dino === imgTwo.dataset.dino ? freezeImages() : hideImages();

// Function that turns the cards
function changeImages() {
  if ( freezeImg || this === imgOne ){ // If this sentence is true, ie that freezeImg === true, you have to wait before clicking the next card
    return; // Prevents the eventlistener from dropping out when it was not possible to click two times fast on the same card
  }

  this.classList.add("changeImg"); // Changes class to ChangeImg, that turns the cards

  if (!newImg) { // If newImg is false / not true - the card is the first to be clicked of the two, and makes a pair 
    newImg = true; // and then the variables are set - so that this if-statement does not execute when the next card is clicked
    imgOne = this;
    // console.log(this);
    return; // and you exit the loop
  }
  imgTwo = this; // Invokes when you click the second card
  imageArray = [imgOne, imgTwo]; // instansierar 7 lägger till de två bilderna i arrayen. (Om man i framtiden vill ha flera bilder)
  compareImages(); // and moves to the function for comparison 
}