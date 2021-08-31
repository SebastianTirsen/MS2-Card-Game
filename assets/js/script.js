/*****Time Area*****/
let firstCard = 0;
let watch = {
    etime : null, // HTML time display
    ereset : null, // HTML reset button
    estart : null, // HTML start/stop button
    init : function () {
      watch.etime = document.getElementById("watch-time");
      watch.ereset = document.getElementById("watch-reset");
      watch.estart = document.getElementById("watch-start");
  
      watch.ereset.addEventListener("click", watch.reset);
      watch.ereset.disabled = false;
      //watch.estart.addEventListener("click", watch.start);
      watch.estart.disabled = false;
    },
  
    timer : null, // timer object
    now : 0, // current elapsed time
    tick : function () {
  
      watch.now++;
      let remain = watch.now;
      let mins = Math.floor(remain / 6000);
      remain -= mins * 6000;
      let secs = Math.floor(remain / 100);
      remain -= secs * 100;
      let hundreds = remain;
  
      if (mins<10) { mins = "0" + mins; }
      if (secs<10) { secs = "0" + secs; }
      if (hundreds<10) { hundreds = "0" + hundreds; }
      watch.etime.innerHTML = mins + ":" + secs + ":" + hundreds;
    },
    
    start : function () {
      watch.timer = setInterval(watch.tick, 10);
      watch.estart.value = "Stop";
      watch.estart.removeEventListener("click", watch.start);
      watch.estart.addEventListener("click", watch.stop);
    },
  
    stop  : function () {
      clearInterval(watch.timer);
      watch.timer = null;
      watch.estart.value = "Start";
      watch.estart.removeEventListener("click", watch.stop);
      watch.estart.addEventListener("click", watch.start);
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
  
  // Resets variables after every round
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
    firstCard += 1;
    if (firstCard === 1) {
      watch.start();
    }
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
    imageArray = [imgOne, imgTwo]; // Assigns images to array
    compareImages(); // and moves to the function for comparison 
  }

