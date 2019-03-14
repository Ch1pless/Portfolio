let hardReset = document.getElementById("hardReset"),
winReset = document.getElementById("winBtn");

hardReset.addEventListener("click", resetHard);
winReset.addEventListener("click", resetHard);

let updateRateSlide = document.getElementById("updateRateSlider"),
updateRateDisp = document.getElementById("updateRateDisp");

updateRateSlide.addEventListener("change", () => {
	updateRate = parseInt(updateRateSlide.value)
	updateRateDisp.innerHTML = `Update Rate: ${updateRate}`;
});

updateRateDisp.innerHTML = `Update Rate: ${updateRate}`;
