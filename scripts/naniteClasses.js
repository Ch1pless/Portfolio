function NaniteCreator(c, a, b, p) {
	this.cost = new Decimal(c);
	this.amount = new Decimal(a);
	this.bought = new Decimal(b);
	this.pow = new Decimal(p);
	this.tillNext = new Decimal(10 - this.bought.mod(10));
	this.available = false;

	this.buyOne = function () {
		this.amount = this.amount.plus(1);
		this.bought = this.bought.plus(1);
		this.tillNext = new Decimal(10 - this.bought.mod(10));
	};

	this.availtrue = function () {
		this.available = true;
	}

	this.availfalse = function () {
		this.available = false;
	}
}

function Researcher(c, a, b, p) {
	this.cost = new Decimal(c);
	this.costMult = new Decimal(1e5);
	this.amount = new Decimal(a);
	this.bought = new Decimal(b);
	this.pow = new Decimal(p);

	this.buyOne = function () {
		this.amount = this.amount.plus(1);
		this.bought = this.bought.plus(1);
	};
}

function NanoSphere(u,p,m,c,cm) {
	this.upgrades = new Decimal(u);
	this.pow = new Decimal(p);
	this.mult = new Decimal(m);
	this.cost = new Decimal(c);
	this.costMult = new Decimal(cm);



	this.buyOne = function () {
		this.upgrades = this.upgrades.plus(1);
		this.pow = this.pow.times(this.mult);
		this.cost = this.cost.times(Math.pow(1.10,this.upgrades));
	}
}

function NanoChip(pow = 1) {
	this.pow = new Decimal(pow);

	this.boost = function (boost) {
		this.pow = this.pow.plus(boost.minus(1));
	}
}
