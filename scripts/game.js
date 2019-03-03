Decimal.set({toExpPos: 4});
let updateRate = 10;
let game = {
	costMult: [],
	energy: new Decimal(10),
	nano1: new nano(10,0,0,1),
	nano2: new nano(100,0,0,1),
	nano3: new nano(1000,0,0,1),
	nanoSpeed: {
		speed: new Decimal(1000),
		cost: new Decimal(100),
		multiplier: new Decimal(10)
	}
}

function prodPerSec(item) {
	let perSec = item.amount.times(item.pow).times(1000/game.nanoSpeed.speed).dividedBy(updateRate);
	return perSec;
}

function clean(number) {
	let clean = number.toPrecision(4,Decimal.ROUND_DOWN).toString();
	if (number.lessThan(1000)) {
		clean = number.toDP(0).toString();
	}
	clean = clean.replace("+","");
	return clean;
	}
	
function cleanTick(number) {
	let cleanTick = number.toSD(4,Decimal.ROUND_DOWN).toString();
	cleanTick = cleanTick.replace("+","");
	return cleanTick;
}

function canBuy(item) {
	return game.energy.greaterThanOrEqualTo(item.cost);
}

function buyOneCalc(item) {
	game.energy = game.energy.sub(item.cost);
	item.buyOne();
}

function buyOne(item) {
	switch (item) {
		case 1:
			if (canBuy(game.nano1)) buyOneCalc(game.nano1);
			break;
		case 2: 
			if (canBuy(game.nano2)) buyOneCalc(game.nano2);
			break;
		case 3:
			if (canBuy(game.nano3)) buyOneCalc(game.nano3);
			break;
		case "t":
			if (canBuy(game.nanoSpeed)) {
			game.energy = game.energy.sub(game.nanoSpeed.cost);
			game.nanoSpeed.speed = game.nanoSpeed.speed.sub(game.nanoSpeed.speed.times(0.11));
			game.nanoSpeed.cost = game.nanoSpeed.cost.times(game.nanoSpeed.multiplier);
			}
			break;
	}
	
}

function buyMaxCalc(item) {
	let total = game.energy.dividedBy(item.cost).floor();
	game.energy = game.energy.sub(item.cost.times(total));
	item.buyMax(total);
}

function buyMax() {
	if (canBuy(game.nanoSpeed)) {
		game.energy = game.energy.sub(game.nanoSpeed.cost);
		game.nanoSpeed.speed = game.nanoSpeed.speed.sub(game.nanoSpeed.speed.times(0.11));
		game.nanoSpeed.cost = game.nanoSpeed.cost.times(game.nanoSpeed.multiplier);		
	}
	if (canBuy(game.nano3)) buyMaxCalc(game.nano3);
	if (canBuy(game.nano2)) buyMaxCalc(game.nano2);
	if (canBuy(game.nano1)) buyMaxCalc(game.nano1);
}


function updateDisplay() {
	document.getElementById("energyAmount").innerHTML = `${clean(game.energy)}`;
	document.getElementById("nanoSpeed").innerHTML = `NanoSpeed: ${cleanTick(game.nanoSpeed.speed)} ms per tick`;
	document.getElementById("nanoSpeedBuy1").innerHTML = `Cost: ${clean(game.nanoSpeed.cost)}`;
	document.getElementById("nano1Amount").innerHTML = `NanoMachines: ${clean(game.nano1.amount)}`;
	document.getElementById("nano1Buy1").innerHTML = `Cost: ${clean(game.nano1.cost)}`;
	document.getElementById("nano2Amount").innerHTML = `NanoCreators: ${clean(game.nano2.amount)}`;
	document.getElementById("nano2Buy1").innerHTML = `Cost: ${clean(game.nano2.cost)}`;
	document.getElementById("nano3Amount").innerHTML = `NanoC2: ${clean(game.nano3.amount)}`;
	document.getElementById("nano3Buy1").innerHTML = `Cost: ${clean(game.nano3.cost)}`;
}

function updateAmounts() {
	game.energy = game.energy.plus(prodPerSec(game.nano1));
	game.nano1.amount = game.nano1.amount.plus(prodPerSec(game.nano2));
	game.nano2.amount = game.nano2.amount.plus(prodPerSec(game.nano3));
}

function updateMilestones() {
	if (game.nano1.amount.lessThan(1)) {
		document.getElementById("energy-container").classList.remove("av");
		document.getElementById("energy-container").classList.add("unav");
		document.getElementById("nano2Section").classList.remove("av");
		document.getElementById("nano2Section").classList.add("unav");
	} else {
		document.getElementById("energy-container").classList.remove("unav");
		document.getElementById("energy-container").classList.add("av");
		document.getElementById("nano2Section").classList.remove("unav");
		document.getElementById("nano2Section").classList.add("av");
	}
	if (game.nano1.amount.lessThan(10)) {
		document.getElementById("nanoSpeedSection").classList.remove("av");
		document.getElementById("nanoSpeedSection").classList.add("unav");
		document.getElementById("nano3Section").classList.remove("av");
		document.getElementById("nano3Section").classList.add("unav");
	} else {
		document.getElementById("nanoSpeedSection").classList.remove("unav");
		document.getElementById("nanoSpeedSection").classList.add("av");
		document.getElementById("nano3Section").classList.remove("unav");
		document.getElementById("nano3Section").classList.add("av");
	}
}

function gameTick() {
	updateAmounts();
	updateMilestones();
	updateDisplay();
}

let gameInterval;
gameInterval = setInterval(gameTick, updateRate);

window.addEventListener("load", updateDisplay);
document.getElementById("nanoSpeedBuy1").addEventListener("click", () => buyOne("t"));
document.getElementById("nano1Buy1").addEventListener("click", () => buyOne(1));
document.getElementById("nano2Buy1").addEventListener("click", () => buyOne(2));
document.getElementById("nano3Buy1").addEventListener("click", () => buyOne(3));
document.getElementById("maxBuy").addEventListener("click", () => buyMax());
window.addEventListener("keydown", (event) => {
	switch (event.keyCode) {
		case 77: //M
			document.getElementById("maxBuy").click();
			break;
		
	}	
});