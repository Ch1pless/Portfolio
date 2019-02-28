Decimal.set({toExpPos: 4});

let ooniverse = {
	energyAmount: new Decimal(10),
	matterAmount: 0,
	spaceAmount: 0,
	timeAmount: 0,
	ooniverseAmount: 0,
	matterGen: new Type("energy", "matterAmount"),
	spaceGen: new Type("matter", "spaceAmount"),
	timeGen: new Type("space", "timeAmount")
}
function Type(costType,units) {
	this.costType = costType;
	this.units = units;
	this.costMults = [new Decimal(10), new Decimal(1e3), new Decimal(1e5)];

	this.first = {
		cost: new Decimal(10),
		amount: 0,
		bought: 0,
		power: new Decimal(1),
	};
	this.second = {
		cost: new Decimal(100),
		amount: 0,
		bought: 0,
		power: new Decimal(1),
	};
	this.third = {
		cost: new Decimal(1000),
		amount: 0,
		bought: 0,
		power: new Decimal(1),
	};
}

let matter = new Type("energy", "matter");

let space = new Type("matter", "space");

let time = new Type("space", "time");

/*energy is made by matter, matter is bought with energy;
matter is made by space, space is bought with matter;
space is made by time, time is bought with space;
ooniverses give a multiplier or ooniverse saves past production amounts and will start anew?*/


let firstMatterBuy1 = document.getElementById("firstMatterBuy1"),
firstMatterAmount = document.getElementById("firstMatterAmount"),
hoomanEnergy = document.getElementById("energyAmount"),
hoomanMatter = document.getElementById("matterAmount"),
hoomanSpace = document.getElementById("spaceAmount"),
hoomanTime = document.getElementById("timeAmount");
function firstMatterBuy1Clicked() {
	hooman.energy = hooman.energy.sub(space.first.cost);
	space.first.cost = space.first.cost.mul(space.costMults[0]);
	space.first.amount+=1;
	space.first.bought+=1;
	firstSpaceBuy1.innerHTML = `Cost: ${space.first.cost}`;
	firstSpaceAmount.innerHTML = `${space.first.amount}`;
	hoomanEnergy.innerHTML = `${hooman.energy}`;
}

firstSpaceBuy1.addEventListener("click", firstMatterBuy1Clicked);

function displayInit() {
	hoomanEnergy.innerHTML = `${hooman.energy}`;

	firstSpaceBuy1.innerHTML = `Cost: ${space.first.cost}`;
	firstSpaceAmount.innerHTML = `${space.first.amount}`;

}

window.addEventListener("load", displayInit);
