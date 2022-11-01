/** @format */

let logBtn = document.querySelectorAll(`.login`);

function handleActive(e) {
  let btn = e.target.parentElement;
  current = document.getElementsByClassName(`active`);
  current[0].className = current[0].className.replace(" active", "");
  btn.className += " active";
}

logBtn.forEach(elm => {
  elm.addEventListener(`click`, handleActive);
});

// table row

// let row = document.querySelector(`.row`);
