function nano(cost, amount, bought, power) {
	this.cost = new Decimal(cost);
	this.amount = new Decimal(amount);
	this.bought = new Decimal(bought);
	this.pow = new Decimal(power);
	
	this.buyOne = function () {
		this.amount = this.amount.plus(1);
		this.bought = this.bought.plus(1);
	}
	this.buyMax = function (total) {
		this.amount = this.amount.plus(total);
		this.bought = this.bought.plus(total);
	}
}

