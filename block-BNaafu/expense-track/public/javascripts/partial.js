/** @format */

let profileBox = document.querySelector(`.profile-img-box`);
let dropDown = document.querySelector(`.dropDown-ul`);
let profilePic = document.querySelector(`.pImg-box`);

function profileDisplay(e) {
  dropDown.classList.toggle(`dis-none`);
  profilePic.classList.toggle(`hover`);
}

profileBox.addEventListener(`click`, profileDisplay);
