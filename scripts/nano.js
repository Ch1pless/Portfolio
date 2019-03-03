function nano(c, a, b, p) {
	this.cost = new Decimal(c);
	this.amount = new Decimal(a);
	this.bought = new Decimal(b);
	this.pow = new Decimal(p);	
	this.tillNext = new Decimal(10 - this.bought.mod(10));
	
	this.buyOne = function () {
		this.amount = this.amount.plus(1);
		this.bought = this.bought.plus(1);
		this.tillNext = new Decimal(10 - this.bought.mod(10));
	}
	/*this.buyMax = function (total) {
		this.amount = this.amount.plus(total);
		this.bought = this.bought.plus(total);
		this.tillNext = this.bought.mod(10);
	}*/
}
