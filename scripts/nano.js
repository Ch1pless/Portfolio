function nano(cost, amount, bought, power) {
	this.cost = new Decimal(cost);
	this.amount = new Decimal(amount);
	this.bought = new Decimal(bought);
	this.pow = new Decimal(power);
	
	this.buyOne = function () {
		this.amount = this.amount.plus(1);
		this.bought = this.bought.plus(1);
	}
}

function productionPerSec(item, tickSpeed, updateRate) {
	let perSec = item.amount.times(item.pow).times(1000/tickSpeed).dividedBy(updateRate);
	return perSec;
}

function cleanDisp(number) {
		let clean = number.toDP(3,Decimal.ROUND_DOWN).toString();
		clean = clean.replace("+","");
		return clean;
	}