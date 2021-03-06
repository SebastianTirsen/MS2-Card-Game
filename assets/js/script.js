/*****Timer*****/

// Declares and initiates variable
let firstCard = 0;

// Declares object
let watch = {
    clocktime: null, // Declares and initiates variables
    clockreset: null, 
    clockstart: null,
  
    // Declares init function
    init: function () {
      watch.clocktime = document.getElementById("watch-time"); // Gets DOM elements
      watch.clockreset = document.getElementById("watch-reset");
    },
    
    // Declares and initiates variables
    timer: null, 
    now: 0,

    // Declares function tick, that updates the clock
    tick: function () {
  
      watch.now++;
      let remain = watch.now;
      let mins = Math.floor(remain / 6000);
      remain -= mins * 6000;
      let secs = Math.floor(remain / 100);
      remain -= secs * 100;
      let hundreds = remain;
  
      if ( mins < 10 ) { mins = "0" + mins; }
      if ( secs < 10 ) { secs = "0" + secs; }
      if ( hundreds < 10 ) { hundreds = "0" + hundreds; }
      watch.clocktime.innerHTML = mins + ":" + secs + ":" + hundreds;
    },
    
    // Function that sets the interval and starts the timer
    start: function () {
      watch.timer = setInterval(watch.tick, 10);
    },

    // Function that clears the interval and stops the timer
    stop: function () {
      clearInterval(watch.timer);
      watch.timer = null;
      watch.clockreset.removeEventListener("click", watch.stop);
    },
    
    // Funtion that resets the timer
    reset: function () {
      if (watch.timer != null) { watch.stop(); }
      watch.now = -1;
      watch.tick();
    }
  };

  // Gets variables from DOM when windows reloads
  window.addEventListener("load", watch.init);
  
  /*****Game Area*****/

  // Declares and initiates variables
  let newImg = false;
  let freezeImg = false;
  let imgOne = null;
  let imgTwo = null;
  let gameOver = 0;
  let imageArray = [];
  let modal = document.getElementById("popup1");
  
  // Gets cards / image objects from the DOM
  const $$ = document.querySelectorAll.bind(document);
  let level = document.getElementsByClassName('cardWrap').length / 2;
  
  // IIFE function that shuffles the cards every round 
  (() => {
      $$(".cardWrap").forEach(img => {
        let mixedImages = Math.floor(Math.random() * 16);
        img.style.order = mixedImages;
      });
  })();
  
  // Applies eventlisteners on every image
  $$(".cardWrap").forEach(img => img.addEventListener('click', changeImages));
  
  // Resets variables after every round
  const reAssignVariables = () => [imgOne, imgTwo, imageArray, newImg, freezeImg] = [null, null, null, false, false];
  
  // Function that starts and makes sure the cards doesnt flip back over
  const freezeImages = () => {
      gameOver += 1;
      imageArray.forEach(img => img.removeEventListener("click", changeImages));
      if (gameOver === level) {
        watch.stop();
        document.getElementById("showTime").appendChild(watch.clocktime);
        modal.classList.add("show");
      }
      reAssignVariables();
  };
  
  // Function that turns the cards back again if they dont match
  const hideImages = () => {
      freezeImg = true;
      setTimeout(() => {
        imageArray.forEach(img => img.classList.remove("changeImg"));
        reAssignVariables();
      }, 1000); // how long the cards front side is showing before turning back again
  };
  
  // Chooses new function from stated data-* attribute in index.html (data-dino="dino8") // if both are for example dino8 they make a pair
  const compareImages = () => imgOne.dataset.dino === imgTwo.dataset.dino ? freezeImages() : hideImages();
  
  // Function that turns the cards and starts the timer.
  function changeImages() {
    firstCard += 1;
    if (firstCard === 1) {
      watch.start();
      document.getElementById("start-text").style.display = "none"; 
    }
    if ( freezeImg || this === imgOne ){ // If this sentence is true, ie that freezeImg === true, you have to wait before clicking the next card
      return; 
    }
  
    this.classList.add("changeImg"); // Changes class to ChangeImg, that turns the cards
  
    if (!newImg) { // If newImg is false / not true - the card is the first to be clicked of the two, and makes a pair 
      newImg = true; // and then the variables are set - so that this if-statement does not execute when the next card is clicked
      imgOne = this;
      return; // and you exit the loop
    }
    imgTwo = this; // Invokes when you click the second card
    imageArray = [imgOne, imgTwo]; // Assigns images to array
    compareImages(); // and moves to the function for comparison 
  }
