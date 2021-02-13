/* Put your javascript in here */
"use strict";

let width = 130;
let count = 3;

let list = carousel.querySelector("ul");
let listElems = carousel.querySelectorAll("li");

let position = 0; // scroll position

function arrowPrev() 
{
  // shift left
  position += width * count;
  // clamp position
  position = Math.min(position, 0);
  // transform
  list.style = "Transform: translateX(" + position + "px)";
}

function arrowNext() 
{
  // shift right
  position -= width * count;
  // clamp position
  position = Math.max(position, -width * (listElems.length - count));
  // transform
  list.style = "Transform: translateX(" + position + "px)";
}
