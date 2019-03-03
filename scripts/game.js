Decimal.set({toExpPos: 4});
let updateRate = 50;
let costMults = [1,1e3,1e5,1e7,1e9,10];
let game = {
	energy: new Decimal(10),
	tick: {
		speed: new Decimal(1000),
		cost: new Decimal(1e3),
		decrement: new Decimal(0.9)
	},
	upgrades: [],
	achievements: [],
	smallResearch: 0
}

let nanite = [];
for (let i = 1; i < 6; i++) {
	let nanos = new nano(10,0,0,1);
	nanite.push(nanos);
}
function format(item) {
	if (item.lessThan(1000)) return item.trunc().toString();
	item = item.toSD(3,Decimal.ROUND_DOWN).toString();
	item = item.replace("+","");
	return item;
}

function prodPerSec(item) {
	let perSec = item.amount.times(item.pow).times(1000/game.tick.speed).dividedBy(1000/updateRate);
	return perSec;
}

function canBuy(item, costItem) {
	return costItem.greaterThanOrEqualTo(item.cost);
}

function buyOneCalc(item, costItem) {
	item.buyOne();
	if (item.bought.modulo(10) == 0 && !item.bought.equals(0)) {
		item.cost = item.cost.times(costMults[nanite.indexOf(item)]).floor();
		if (item != nanite[0]) {
			item.pow = item.pow.times(2);
		}
	} else {
		item.cost = item.cost;
	}
	
}

function buyOne(item) {
	switch (item) {
		case 0:
			if (canBuy(nanite[0], game.energy)) {
				game.energy = game.energy.minus(nanite[0].cost);
				buyOneCalc(nanite[0], game.energy); 
			}
			break;
		case 1: 
			if (canBuy(nanite[1], nanite[0].amount)) {
				nanite[0].amount = nanite[0].amount.minus(nanite[1].cost);
				buyOneCalc(nanite[1], nanite[0].amount);
			}
			break;
		case 2:
			if (canBuy(nanite[2], nanite[1].amount)) {
				nanite[1].amount = nanite[1].amount.minus(nanite[2].cost);
				buyOneCalc(nanite[2], nanite[1].amount);
			}
			break;
		case 3:
			if (canBuy(nanite[3], nanite[2].amount)) {
				nanite[2].amount = nanite[2].amount.minus(nanite[3].cost);
				buyOneCalc(nanite[3], nanite[2].amount);
			}
			break;
		case 4:
			if (canBuy(nanite[4], nanite[3].amount)) {
				nanite[3].amount = nanite[3].amount.minus(nanite[4].cost);
				buyOneCalc(nanite[4], nanite[3].amount);
			}
			break;	
		case "t":
			if (canBuy(game.tick, game.energy)) {
			game.energy = game.energy.sub(game.tick.cost);
			game.tick.speed = game.tick.speed.sub(game.tick.speed.times(0.11));
			game.tick.cost = game.tick.cost.times(costMults[5]);
			}
			break;
	}
	
}


function buyNextSingle(item, currency, index) {
	if (currency.gte(item.cost.times(item.tillNext))) {
		for (i in item.tillNext) {
			buyOne(index);
		}
	}
}


function buyMaxCalc(item, currency, index) {
	let total = currency.dividedBy(item.cost).floor();
	for (i in total) {
		buyOne(index);
	}
}

function buyMax(item) {
	switch (item) {
		//buyMaxCalc(buy, currency, index);
		case 0:
			buyMaxCalc(nanite[0], game.energy, 0);
			break;
		case 1: 
			buyNextSingle(nanite[1], nanite[0].amount, 1);
			break;
		case 2:
			buyNextSingle(nanite[2], nanite[1].amount, 2);
			break;
		case 3:
			buyNextSingle(nanite[3], nanite[2].amount, 3);
			break;
		case 4:
			buyNextSingle(nanite[4], nanite[3].amount, 4);
			break;	
		case "t":
			buyMaxCalc(game.tick, game.energy, "t");
			break;
	}
}

function buyMaxAll() {
	if (canBuy(game.tick, game.energy)) {
		game.energy = game.energy.sub(game.tick.cost);
		game.tick.speed = game.tick.speed.sub(game.tick.speed.times(0.11));
		game.tick.cost = game.tick.cost.times(costMults[6]);		
	}
	if (canBuy(nanite[4], nanite[3].amount)) buyMaxCalc(nanite[4], 4);
	if (canBuy(nanite[3], nanite[2].amount)) buyMaxCalc(nanite[3], 3);
	if (canBuy(nanite[2], nanite[1].amount)) buyMaxCalc(nanite[2], 2);
	if (canBuy(nanite[1], nanite[0].amount)) buyMaxCalc(nanite[1], 1);
	if (canBuy(nanite[0], game.energy)) buyMaxCalc(nanite[0], 0);
}

function updateDisplay() {
	document.getElementById("energyA").innerHTML = `${format(game.energy)}`;
	//document.getElementById("energyPerSec").innerHTML = `${prodPerSec(game.nano1)}`;
	document.getElementById("tickspeed").innerHTML = `${format(game.tick.speed)}`;
	document.getElementById("tB1").innerHTML = `Cost: ${format(game.tick.cost)} energy`;
	document.getElementById("tBM").innerHTML = `Buy Max`;
	document.getElementById("n0P").innerHTML = `x${format(nanite[0].pow)}`;
	document.getElementById("n0A").innerHTML = `${format(nanite[0].amount)}`;
	document.getElementById("n0B1").innerHTML = `Cost: ${format(nanite[0].cost)} energy`;
	document.getElementById("n0BM").innerHTML = `Buy Max Nanites`;
	document.getElementById("n1P").innerHTML = `x${format(nanite[1].pow)}`;
	document.getElementById("n1A").innerHTML = `${format(nanite[1].amount)}`;
	document.getElementById("n1B1").innerHTML = `Cost: ${format(nanite[1].cost)} nanites`;
	document.getElementById("n1BM").innerHTML = `To Next: ${nanite[1].tillNext}, Cost: ${format(nanite[1].cost.times(nanite[1].tillNext))}`;
	document.getElementById("n2P").innerHTML = `x${format(nanite[2].pow)}`;
	document.getElementById("n2A").innerHTML = `${format(nanite[2].amount)}`;
	document.getElementById("n2B1").innerHTML = `Cost: ${format(nanite[2].cost)} nanite creators`;
	document.getElementById("n2BM").innerHTML = `To Next: ${nanite[2].tillNext}, Cost: ${format(nanite[2].cost.times(nanite[2].tillNext))}`;
	document.getElementById("n3P").innerHTML = `x${format(nanite[3].pow)}`;
	document.getElementById("n3A").innerHTML = `${format(nanite[3].amount)}`;
	document.getElementById("n3B1").innerHTML = `Cost: ${format(nanite[3].cost)} naniteC^2s`;
	document.getElementById("n3BM").innerHTML = `To Next: ${nanite[3].tillNext}, Cost: ${format(nanite[3].cost.times(nanite[3].tillNext))}`;
	document.getElementById("n4P").innerHTML = `x${format(nanite[4].pow)}`;
	document.getElementById("n4A").innerHTML = `${format(nanite[4].amount)}`;
	document.getElementById("n4B1").innerHTML = `Cost: ${format(nanite[4].cost)} naniteC^3s`;
	document.getElementById("n4BM").innerHTML = `To Next: ${nanite[4].tillNext}, Cost: ${format(nanite[4].cost.times(nanite[4].tillNext))}`;
}

function updateAmounts() {
	game.energy = game.energy.plus(prodPerSec(nanite[0]));
	nanite[0].amount = nanite[0].amount.plus(prodPerSec(nanite[1]));
	nanite[1].amount = nanite[1].amount.plus(prodPerSec(nanite[2]));
	nanite[2].amount = nanite[2].amount.plus(prodPerSec(nanite[3]));
	nanite[3].amount = nanite[3].amount.plus(prodPerSec(nanite[4]));
}

function updateMilestones() {
	if (nanite[0].amount.lessThan(1)) {
		document.getElementById("energy-container").classList.remove("av");
		document.getElementById("energy-container").classList.add("unav");
		document.getElementById("n1Row").classList.remove("av");
		document.getElementById("n1Row").classList.add("unav");
	} else {
		document.getElementById("energy-container").classList.remove("unav");
		document.getElementById("energy-container").classList.add("av");
		document.getElementById("n1Row").classList.remove("unav");
		document.getElementById("n1Row").classList.add("av");
	}
	
	if (nanite[1].amount.lessThan(1)) {
		document.getElementById("tickRow").classList.remove("av");
		document.getElementById("tickRow").classList.add("unav");
		document.getElementById("n2Row").classList.remove("av");
		document.getElementById("n2Row").classList.add("unav");
	} else {
		document.getElementById("tickRow").classList.remove("unav");
		document.getElementById("tickRow").classList.add("av");
		document.getElementById("n2Row").classList.remove("unav");
		document.getElementById("n2Row").classList.add("av");
	}
	if (nanite[2].amount.lessThan(1)) {
		document.getElementById("n3Row").classList.remove("av");
		document.getElementById("n3Row").classList.add("unav");
	} else {
		document.getElementById("n3Row").classList.remove("unav");
		document.getElementById("n3Row").classList.add("av");
	}
	if (nanite[3].amount.lessThan(1)) {
		document.getElementById("n4Row").classList.remove("av");
		document.getElementById("n4Row").classList.add("unav");
	} else {
		document.getElementById("n4Row").classList.remove("unav");
		document.getElementById("n4Row").classList.add("av");
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
document.getElementById("tB1").addEventListener("click", () => buyOne("t"));
document.getElementById("tBM").addEventListener("click", () => buyMax("t"));
document.getElementById("n0B1").addEventListener("click", () => buyOne(0));
document.getElementById("n0BM").addEventListener("click", () => buyMax(0));
document.getElementById("n1B1").addEventListener("click", () => buyOne(1));
document.getElementById("n1BM").addEventListener("click", () => buyMax(1));
document.getElementById("n2B1").addEventListener("click", () => buyOne(2));
document.getElementById("n2BM").addEventListener("click", () => buyMax(2));
document.getElementById("n3B1").addEventListener("click", () => buyOne(3));
document.getElementById("n3BM").addEventListener("click", () => buyMax(3));
document.getElementById("n4B1").addEventListener("click", () => buyOne(4));
document.getElementById("n4BM").addEventListener("click", () => buyMax(4));

//document.getElementById("maxBuy").addEventListener("click", () => buyMax());
window.addEventListener("keydown", (event) => {
	switch (event.keyCode) {
		case 77: //M
			document.getElementById("maxBuy").click();
			break;
		
	}	
});

/*
let game = {
	energy: new Decimal(10),
	//new nano(cost, amount, bought, power, upkeep, upEff, upEffMult)
	nano1: new nano(10,0,0,1,0.5,2,upgCM[0]),
	nano2: new nano(100,0,0,1,5,2,0),
	nano3: new nano(1000,0,0,1,50,2,0),
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

function format(item) {
	if (item.isType() == "Decimal") {
	return `${d}e${e}`;
	} else {
		
	}
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
	document.getElementById("energyPerSec").innerHTML = `${prodPerSec(game.nano1)}`;
	document.getElementById("upkeepPerSec").innerHTML = `${upkeepPerSec(game.nano1).plus(upkeepPerSec(game.nano2)).plus(upkeepPerSec(game.nano3)).toSD(3)}`;
	document.getElementById("nanoSpeed").innerHTML = `NanoSpeed: ${cleanTick(game.nanoSpeed.speed)} ms per tick`;
	document.getElementById("nanoSpeedBuy1").innerHTML = `Cost: ${clean(game.nanoSpeed.cost)}`;
	document.getElementById("nano1Amount").innerHTML = `NanoMachines: ${clean(game.nano1.amount)}`;
	document.getElementById("nano1Buy1").innerHTML = `Cost: ${clean(game.nano1.cost)}`;
	document.getElementById("nano1Up").innerHTML = `NanoMachines: ${clean(game.nano1.upgradeCost)}`;
	document.getElementById("nano2Amount").innerHTML = `NanoCreators: ${clean(game.nano2.amount)}`;
	document.getElementById("nano2Buy1").innerHTML = `Cost: ${clean(game.nano2.cost)}`;
	document.getElementById("nano3Amount").innerHTML = `NanoC2: ${clean(game.nano3.amount)}`;
	document.getElementById("nano3Buy1").innerHTML = `Cost: ${clean(game.nano3.cost)}`;
}

function updateAmounts() {
	game.energy = game.energy.plus(prodPerSec(game.nano1)).sub(upkeepPerSec(game.nano1).plus(upkeepPerSec(game.nano2)).plus(upkeepPerSec(game.nano3)));
	game.nano1.amount = game.nano1.amount.plus(prodPerSec(game.nano2));
	game.nano2.amount = game.nano2.amount.plus(prodPerSec(game.nano3));
	game.nano1.updateUpkeep();
	game.nano2.updateUpkeep();
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
document.getElementById("nano1Up").addEventListener("click", () => upgradeEfficiency(1));
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


*/



