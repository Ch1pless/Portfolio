var home = document.querySelector(".home");
var projects = document.querySelector(".projects");
var transition = document.querySelector(".transition");
var cover = document.querySelector(".cover");

var transitionTiming = 3000; // 3 seconds


function toProjects() {
    flyOver("up");
    setTimeout(() => {
        home.classList.add("d-none");
        projects.classList.remove("d-none");
    }, transitionTiming / 2);
    
}

function toHome() {
    flyOver("down");
    setTimeout(() => {
        projects.classList.add("d-none");
        home.classList.remove("d-none");
    }, transitionTiming / 2);
    
}

function flyOver(direction="up") {
    if (direction == "up") {
        transition.classList.remove("fly-down");
        transition.classList.add("fly-up");
    } else if (direction == "down") {
        transition.classList.remove("fly-up");
        transition.classList.add("fly-down");
    }
}