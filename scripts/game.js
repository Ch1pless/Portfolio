Decimal.set({
   toExpPos: 4
});
let updateRate = 50;
let costMults = [1e3, 1e5, 1e7, 1e9, 1e11];
let game = {
   nanite: new Decimal(10),
   tick: {
		//testspeed: new Decimal(1e2),
		//normalspeed: new Decimal(1e3),
      speed: new Decimal(1e3),
      cost: new Decimal(1e3),
      decrement: new Decimal(0.89),
		costMult: new Decimal(1e1)
   },
   nsphere: new NanoSphere(),
   nchip: new NanoChip(1),
   researcher: new Researcher(1e4, 0, 0, 1),
   researchPoints: new Decimal(0),
   upgrades: [],
   achievements: []
}
let g = game;

let nanC = [];
/*for (let i = 1; i < 6; i++) {
   let naniteC = new NaniteCreator(Math.pow(10,Math.pow(i,i)), 0, 0, 1);
   nanC.push(naniteC);
}*/
nanC[0] = new NaniteCreator(1e1,0,0,1);
nanC[1] = new NaniteCreator(1e2,0,0,1);
nanC[2] = new NaniteCreator(1e8,0,0,1);
nanC[3] = new NaniteCreator(1e14,0,0,1);
nanC[4] = new NaniteCreator(1e20,0,0,1);


function formatDecimals(item) {
	let temp = item.toSD(3, Decimal.ROUND_DOWN).toString();
	temp = temp.replace("+", "")
	return temp;
}

function format(item) {
   if (item.lt(1000)) return item.trunc().toString();
   let temp = item.toSD(3, Decimal.ROUND_DOWN).toString();
   temp = temp.replace("+", "");
   return temp;
}

function prodPerSec(item) {
	let power = item.pow.times(g.nsphere.pow).times(g.nchip.pow),
	tPS = 1000/g.tick.speed;
   let perSec = item.amount.times(power).times(tPS).div(updateRate);
   return perSec;
}

function canBuy(item, costItem) {
	if (item.available != null || item.available != undefined) {
		if (item.available && costItem.gte(item.cost)) return true; else return false;
	} else {
		if (costItem.gte(item.cost)) return true; else return false;
	}

}

function canBuyTillNext(item, costItem) {

	if (item.available != null || item.available != undefined) {
		if (item.available && costItem.gte(item.cost.times(item.tillNext))) return true; else return false;
	} else {
		if (costItem.gte(item.cost.times(item.tillNext))) return true; else return false;
	}
}

function canChip() {
	if (g.nsphere.pow.gte(16)) return true; else return false;
}

function boostChip() {
	if (canChip()) {
		g.nchip.boost(g.nsphere.pow.div(10));
		g.nanite = new Decimal(10);
	   g.tick.speed = new Decimal(1e1);
	   g.tick.cost = new Decimal(1e3);
	   g.tick.decrement = new Decimal(0.9);
		g.tick.costMult = new Decimal(1e1);
	   g.nsphere = new NanoSphere();
	   g.researcher = new Researcher(1e4, 0, 0, 1);
	   g.researchPoints = new Decimal(0);
		nanC[0] = new NaniteCreator(1e1,0,0,1);
		nanC[0].availtrue();
		nanC[1] = new NaniteCreator(1e2,0,0,1);
		nanC[2] = new NaniteCreator(1e8,0,0,1);
		nanC[3] = new NaniteCreator(1e14,0,0,1);
		nanC[4] = new NaniteCreator(1e20,0,0,1);
	}
}

function buyOneCalc(item, costItem) {
		item.buyOne();
	   if (item.bought.mod(10) == 0 && !item.bought.eq(0)) {
	      item.cost = item.cost.times(costMults[nanC.indexOf(item)]).floor();
	      item.pow = item.pow.times(2);
	   } else {
	      item.cost = item.cost;
	   }
}

function buyOne(item) {
   switch (item) {
      case 0:
         if (canBuy(nanC[0], g.nanite)) {
            g.nanite = g.nanite.minus(nanC[0].cost);
            buyOneCalc(nanC[0], g.nanite);
         }
         break;
      case 1:
         if (canBuy(nanC[1], g.nanite)) {
            g.nanite = g.nanite.minus(nanC[1].cost);
            buyOneCalc(nanC[1], g.nanite);
         }
         break;
      case 2:
         if (canBuy(nanC[2], g.nanite)) {
            g.nanite = g.nanite.minus(nanC[2].cost);
            buyOneCalc(nanC[2], g.nanite);
         }
         break;
      case 3:
         if (canBuy(nanC[3], g.nanite)) {
            g.nanite = g.nanite.minus(nanC[3].cost);
            buyOneCalc(nanC[3], g.nanite);
         }
         break;
      case 4:
         if (canBuy(nanC[4], g.nanite)) {
            g.nanite = g.nanite.minus(nanC[4].cost);
            buyOneCalc(nanC[4], g.nanite);
         }
         break;
      case "t":
         if (canBuy(g.tick, g.nanite)) {
            g.nanite = g.nanite.minus(g.tick.cost);
            g.tick.speed = g.tick.speed.minus(g.tick.speed.times(0.11));
            g.tick.cost = g.tick.cost.times(g.tick.costMult);
         }
         break;
		case "ns":
			if (canBuy(g.nsphere, g.nanite)) {
				g.nanite = g.nanite.minus(g.nsphere.cost);
				g.nsphere.buyOne();
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
   let total = currency.div(item.cost).floor();
   for (i in total) {
      buyOne(index);
   }
}

function buyMax(item) {
   switch (item) {
      //buyMaxCalc(buy, currency, index);
      case 0:
         buyMaxCalc(nanC[0], g.nanite, 0);
         break;
      case 1:
         buyNextSingle(nanC[1], g.nanite, 1);
         break;
      case 2:
         buyNextSingle(nanC[2], g.nanite, 2);
         break;
      case 3:
         buyNextSingle(nanC[3], g.nanite, 3);
         break;
      case 4:
         buyNextSingle(nanC[4], g.nanite, 4);
         break;
      case "t":
         buyMaxCalc(g.tick, g.nanite, "t");
         break;
		case "ns":
			buyMaxCalc(g.nsphere, g.nanite, "ns");
			break;
   }
}

function buyMaxAll() {
	if (canBuy(g.nsphere, g.nanite)) buyMaxCalc(g.nsphere, g.nanite, "ns");
   if (canBuy(g.tick, g.nanite)) buyMaxCalc(g.tick, g.nanite, "t");
   if (canBuy(nanC[4], g.nanite)) buyMaxCalc(nanC[4], g.nanite, 4);
   if (canBuy(nanC[3], g.nanite)) buyMaxCalc(nanC[3], g.nanite, 3);
   if (canBuy(nanC[2], g.nanite)) buyMaxCalc(nanC[2], g.nanite, 2);
   if (canBuy(nanC[1], g.nanite)) buyMaxCalc(nanC[1], g.nanite, 1);
   if (canBuy(nanC[0], g.nanite)) buyMaxCalc(nanC[0], g.nanite, 0);
}

function updateDisplay() {
   let doc = (element) => document.getElementById(element);
   let disp = (element, innerHTML) => doc(element).innerHTML = innerHTML;
	let power = (powerItem) => powerItem.pow.times(g.nsphere.pow).times(g.nchip.pow);
   disp("naniteA", `${format(g.nanite)}`);
   disp("tickspeed", `${formatDecimals(g.tick.speed)}`);
   disp("tB1", `Cost: ${format(g.tick.cost)} nanites`);
   disp("tBM", `Buy Max`);
   disp("n1P", `x${format(power(nanC[0]))}`);
   disp("n1A", `${format(nanC[0].amount)}`);
   disp("n1B1", `Cost: ${format(nanC[0].cost)} nanites`);
   disp("n1BM", `To Next: ${nanC[0].tillNext}, Cost: ${format(nanC[0].cost.times(nanC[0].tillNext))}`);
   disp("n2P", `x${format(power(nanC[1]))}`);
   disp("n2A", `${format(nanC[1].amount)}`);
   disp("n2B1", `Cost: ${format(nanC[1].cost)} nanites`);
   disp("n2BM", `To Next: ${nanC[1].tillNext}, Cost: ${format(nanC[1].cost.times(nanC[1].tillNext))}`);
   disp("n3P", `x${format(power(nanC[2]))}`);
   disp("n3A", `${format(nanC[2].amount)}`);
   disp("n3B1", `Cost: ${format(nanC[2].cost)} nanites`);
   disp("n3BM", `To Next: ${nanC[2].tillNext}, Cost: ${format(nanC[2].cost.times(nanC[2].tillNext))}`);
   disp("n4P", `x${format(power(nanC[3]))}`);
   disp("n4A", `${format(nanC[3].amount)}`);
   disp("n4B1", `Cost: ${format(nanC[3].cost)} nanites`);
   disp("n4BM", `To Next: ${nanC[3].tillNext}, Cost: ${format(nanC[3].cost.times(nanC[3].tillNext))}`);
	disp("n5P", `x${format(power(nanC[4]))}`);
   disp("n5A", `${format(nanC[4].amount)}`);
   disp("n5B1", `Cost: ${format(nanC[4].cost)} nanites`);
   disp("n5BM", `To Next: ${nanC[4].tillNext}, Cost: ${format(nanC[4].cost.times(nanC[4].tillNext))}`);

	if (g.nsphere.upgrades.lt(1)) disp("nsphereBtn", `<b>Create a NanoSphere<br>Cost: ${format(g.nsphere.cost)} nanites</b>`);
	if (g.nsphere.upgrades.gte(1)) disp("nsphereBtn", `<b>Upgrade NanoSphere<br>Cost: ${format(g.nsphere.cost)} nanites</b><br>Current: x${format(g.nsphere.pow)}`);

	disp("nchipBtn", `<b>Condense NanoSpheres<br>Boost: ${g.nsphere.pow.div(10)}</b><br>Current: ${g.nchip.pow}`);

	if (!canChip()) {
		doc("nchipBtn").classList.add("greyed");
	} else {
		doc("nchipBtn").classList.remove("greyed");
	}
	if (!canBuy(g.nsphere, g.nanite)) {
		doc("nsphereBtn").classList.add("greyed");
	} else {
		doc("nsphereBtn").classList.remove("greyed");
	}
   if (!canBuy(nanC[0], g.nanite)) {
      doc("n1B1").classList.add("greyed");
   } else {
      doc("n1B1").classList.remove("greyed");
   }
   if (!canBuyTillNext(nanC[0], g.nanite)) {
      doc("n1BM").classList.add("greyed");
   } else {
      doc("n1BM").classList.remove("greyed");
   }
   if (!canBuy(nanC[1], g.nanite)) {
      doc("n2B1").classList.add("greyed");
   } else {
      doc("n2B1").classList.remove("greyed");
   }
   if (!canBuyTillNext(nanC[1], g.nanite)) {
      doc("n2BM").classList.add("greyed");
   } else {
      doc("n2BM").classList.remove("greyed");
   }
   if (!canBuy(nanC[2], g.nanite)) {
      doc("n3B1").classList.add("greyed");
   } else {
      doc("n3B1").classList.remove("greyed");
   }
   if (!canBuyTillNext(nanC[2], g.nanite)) {
      doc("n3BM").classList.add("greyed");
   } else {
      doc("n3BM").classList.remove("greyed");
   }
   if (!canBuy(nanC[3], g.nanite)) {
      doc("n4B1").classList.add("greyed");
   } else {
      doc("n4B1").classList.remove("greyed");
   }
   if (!canBuyTillNext(nanC[3], g.nanite)) {
      doc("n4BM").classList.add("greyed");
   } else {
      doc("n4BM").classList.remove("greyed");
   }
   if (!canBuy(nanC[4], g.nanite)) {
   	doc("n4B1").classList.add("greyed");
   } else {
   	doc("n4B1").classList.remove("greyed");
   }
   if (!canBuyTillNext(nanC[4], g.nanite)) {
   	doc("n4BM").classList.add("greyed");
   } else {
   	doc("n4BM").classList.remove("greyed");
   }
   if (!canBuy(g.tick, g.nanite)) {
      doc("tB1").classList.add("greyed");
   } else {
      doc("tB1").classList.remove("greyed");
   }
}

function updateAmounts() {
   g.nanite = g.nanite.plus(prodPerSec(nanC[0]));
   nanC[0].amount = nanC[0].amount.plus(prodPerSec(nanC[1]));
   nanC[1].amount = nanC[1].amount.plus(prodPerSec(nanC[2]));
   nanC[2].amount = nanC[2].amount.plus(prodPerSec(nanC[3]));
   nanC[3].amount = nanC[3].amount.plus(prodPerSec(nanC[4]));
}

nanC[0].availtrue();
function updateMilestones() {
	let doc = (element) => document.getElementById(element);
	let clAdd = (element,cl) => doc(element).classList.add(cl);
	let clRem = (element,cl) => doc(element).classList.remove(cl);

   if (nanC[0].amount.gte(1)) {
		clRem("naniteRow", "unav");
		clAdd("naniteRow", "fade");
   } else {
		clAdd("naniteRow", "unav");
		clRem("naniteRow", "fade");
   }
   if (g.nsphere.upgrades.gte(1)) {
		nanC[1].availtrue();
		clRem("tickRow", "unav");
		clRem("n2Row", "unav");
		clAdd("tickRow", "fade");
		clAdd("n2Row", "fade");
   } else {
		clAdd("tickRow", "unav");
		clAdd("n2Row", "unav");
		clRem("tickRow", "fade");
		clRem("n2Row", "fade");
   }
   if (g.nsphere.upgrades.gte(2)) {
		nanC[2].availtrue();
      clRem("n3Row", "unav");
		clAdd("n3Row", "fade");
   } else {
      clAdd("n3Row", "unav");
		clAdd("n3Row", "fade");
   }
   if (g.nsphere.upgrades.gte(3)) {
		nanC[3].availtrue();
		clRem("n4Row", "unav");
		clAdd("n4Row", "fade");
   } else {
		clAdd("n4Row", "unav");
		clAdd("n4Row", "fade");
   }
	if (g.nsphere.upgrades.gte(4)) {
		nanC[4].availtrue();
		clRem("n5Row", "unav");
		clAdd("n5Row", "fade");
   } else {
		clAdd("n5Row", "unav");
		clAdd("n5Row", "fade");
   }
	if (g.nsphere.pow.gte(16)) {
		clRem("nchipBtn", "unav");
		clAdd("nchipBtn", "fade");
	} else {
		clAdd("nchipBtn", "unav");
		clRem("nchipBtn", "fade");
	}
}

let requestLoop,
   startTime = Date.now(),
   fps,
   now,
   then,
   elapsed;

function gameLoop() {
   fps = 1000 / updateRate;
   then = Date.now();
   startTime = then;
   gameTick();
}

function gameTick() {
   requestAnimationFrame(gameTick);

   now = Date.now();
   elapsed = now - then;

   if (elapsed > fps) {
      then = now - (elapsed % fps);

      updateAmounts();
      updateMilestones();
      updateDisplay();
   }

}



requestAnimationFrame(gameLoop)

//cancelAnimationFrame(requestLoop)

//let gameInterval;
//gameInterval = setInterval(gameTick, updateRate);

window.addEventListener("load", updateDisplay);

document.getElementById("tB1").addEventListener("click", () => buyOne("t"));
document.getElementById("tBM").addEventListener("click", () => buyMax("t"));
document.getElementById("n1B1").addEventListener("click", () => buyOne(0));
document.getElementById("n1BM").addEventListener("click", () => buyMax(0));
document.getElementById("n2B1").addEventListener("click", () => buyOne(1));
document.getElementById("n2BM").addEventListener("click", () => buyMax(1));
document.getElementById("n3B1").addEventListener("click", () => buyOne(2));
document.getElementById("n3BM").addEventListener("click", () => buyMax(2));
document.getElementById("n4B1").addEventListener("click", () => buyOne(3));
document.getElementById("n4BM").addEventListener("click", () => buyMax(3));
//document.getElementById("n5B1").addEventListener("click", () => buyOne(4));
//document.getElementById("n5BM").addEventListener("click", () => buyMax(4));
document.getElementById("maxBuy").addEventListener("click", () => buyMaxAll());
document.getElementById("nsphereBtn").addEventListener("click", () => {buyOne("ns"); if (g.nsphere.created == false) g.nsphere.created = true;});
document.getElementById("nchipBtn").addEventListener("click", () => boostChip());

window.addEventListener("keydown", (event) => {
   switch (event.keyCode) {
      case 77: //M
         document.getElementById("maxBuy").click();
         break;

   }
});
