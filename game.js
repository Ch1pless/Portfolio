Decimal.set({toExpPos: 4});
let updateRate = 33;
let game = {
	energy: new Decimal(10),
	nano1: new nano(10,0,0,1),
	nano2: new nano(100,0,0,1),
	nanoSpeed: new Decimal(1000),
	nanoSpeedCost: new Decimal(10)
	
}




function buyOne(item) {
	switch (item) {
		case 1:
			game.energy = game.energy.sub(game.nano1.cost);
			game.nano1.buyOne();
			
			break;
		case 2: 
			game.energy = game.energy.sub(game.nano2.cost);
			game.nano2.buyOne();
			break;
		case "t":
			game.energy = game.energy.sub(game.nanoSpeedCost);
			game.nanoSpeed = game.nanoSpeed.sub(game.nanoSpeed.times(0.11));
			game.nanoSpeedCost = game.nanoSpeedCost.times(10);
			break;
	}
	
}

function updateDisplay() {
	document.getElementById("energyAmount").innerHTML = `${cleanDisp(game.energy.toDP(0))}`;
	document.getElementById("nanoSpeed").innerHTML = `NanoSpeed: ${cleanDisp(game.nanoSpeed)} seconds per tick`;
	document.getElementById("nanoSpeedBuy1").innerHTML = `Cost: ${cleanDisp(game.nanoSpeedCost)}`;
	document.getElementById("nano1Amount").innerHTML = `NanoMachines: ${cleanDisp(game.nano1.amount.toDP(0))}`;
	document.getElementById("nano1Buy1").innerHTML = `Cost: ${cleanDisp(game.nano1.cost)}`;
	document.getElementById("nano2Amount").innerHTML = `NanoCreaters: ${cleanDisp(game.nano2.amount.toDP(0))}`;
	document.getElementById("nano2Buy1").innerHTML = `Cost: ${cleanDisp(game.nano2.cost)}`;
}

function updateEnergy() {
	game.energy = game.energy.plus(productionPerSec(game.nano1,game.nanoSpeed,updateRate));
}

function updateItems() {
	game.nano1.amount = game.nano1.amount.plus(productionPerSec(game.nano2,game.nanoSpeed,updateRate));
}

function gameTick() {
	updateEnergy();
	updateItems();
	updateDisplay();
}

let gameInterval;
gameInterval = setInterval(gameTick, updateRate);

window.addEventListener("load", updateDisplay);
document.getElementById("nanoSpeedBuy1").addEventListener("click", () => buyOne("t"));
document.getElementById("nano1Buy1").addEventListener("click", () => buyOne(1));
document.getElementById("nano2Buy1").addEventListener("click", () => buyOne(2));
