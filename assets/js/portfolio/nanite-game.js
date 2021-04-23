
try {
  Decimal.set({
    toExpPos: 4,
    maxE: 9e9999999999,
  });
} catch (e) {
  console.log(e.message);
}

let updateRate = 50;
let costMults = [1e3, 1e5, 1e7, 1e10, 1e13];
let perfection = false;
let perfectionCost = new Decimal(1e4);
let game = {
  nanite: new Decimal(10),
  nanC: [new NaniteCreator(1e1, 0, 0, 1), new NaniteCreator(1e2, 0, 0, 1), new NaniteCreator(1e8, 0, 0, 1), new NaniteCreator(1e14, 0, 0, 1), new NaniteCreator(1e20, 0, 0, 1)],
  tick: {
    speed: new Decimal(1e3),
    cost: new Decimal(1e3),
    decrement: new Decimal(0.89),
    costMult: new Decimal(1e1),
  },
  nsphere: new NanoSphere(0, 1, 1e2, 1e3),
  cnsphere: new ConNanoSphere(1),
  nchip: new Decimal(0),
  researcher: new Researcher(1e10, 0, 0, 1),
  research: new Decimal(0),
  mods: [],
  achievements: [],
  resets: new Decimal(0),
};

function formatDecimals(item) {
  let temp = item.toSD(3, Decimal.ROUND_DOWN).toString();
  temp = temp.replace('+', '');
  return temp;
}

function format(item) {
  if (item.lt(1000)) return item.trunc().toString();
  let temp = item.toSD(3, Decimal.ROUND_DOWN).toString();
  temp = temp.replace('+', '');
  return temp;
}

function prodPerSec(item) {
  let power = item.pow.times(game.nsphere.pow).times(game.cnsphere.pow),
  tPS = new Decimal(1000).div(game.tick.speed);
  let perSec = item.amount.times(power).times(tPS).div(new Decimal(updateRate));
  return perSec;
}

function canBuy(item) {
  if (item.available != null || item.available != undefined) {
   if (item.available && game.nanite.gte(item.cost)) return true; else return false;
  } else {
   if (game.nanite.gte(item.cost)) return true; else return false;
  }
}

function canBuyTillNext(item) {
  if (item.available != null || item.available != undefined) {
   if (item.available && game.nanite.gte(item.cost.times(item.tillNext))) return true; else return false;
  } else {
   if (game.nanite.gte(item.cost.times(item.tillNext))) return true; else return false;
  }
}

function canCondense() {if (game.nsphere.pow.gte(16)) return true; else return false;}

function condense() {
	if (canCondense()) {
		game.cnsphere.boost(game.nsphere.pow.div(10));
		game = {
		   nanite: new Decimal(10),
			nanC: [new NaniteCreator(1e1,0,0,1),new NaniteCreator(1e2,0,0,1),
				new NaniteCreator(1e8,0,0,1),new NaniteCreator(1e14,0,0,1),
				new NaniteCreator(1e20,0,0,1)],
		   tick: {
		      speed: new Decimal(1e3),
		      cost: new Decimal(1e3),
		      decrement: new Decimal(0.89),
		      costMult: new Decimal(1e1)
		   },
		   nsphere: new NanoSphere(0,1,1e2,1e3),
		   cnsphere: game.cnsphere,
			nchip: game.nchip,
		   researcher: game.researcher,
		   research: game.research,
		   mods: [],
			resets: game.resets
		}
		game.nanC[0].availtrue();
	}
}

function toChip() {
	let chips = game.cnsphere.pow.div(100).floor();
	game = {
	   nanite: new Decimal(10),
		nanC: [new NaniteCreator(1e1,0,0,1),new NaniteCreator(1e2,0,0,1),
			new NaniteCreator(1e8,0,0,1),new NaniteCreator(1e14,0,0,1),
			new NaniteCreator(1e20,0,0,1)],
	   tick: {
	      speed: new Decimal(1e3),
	      cost: new Decimal(1e3),
	      decrement: new Decimal(0.89),
	      costMult: new Decimal(1e1)
	   },
	   nsphere: new NanoSphere(0,1,1e2,1e3),
	   cnsphere: new ConNanoSphere(1),
		nchip: game.nchip.plus(chips),
	   researcher: new Researcher(1e10, 0, 0, 1),
	   research: new Decimal(0),
	   mods: [],
	   resets: game.resets.plus(1)
	}
	game.nanC[0].availtrue();
}


function buyOneCalc(item) {
	game.nanite = game.nanite.minus(item.cost);
		item.buyOne();
	   if (item.bought.mod(10) == 0 && !item.bought.eq(0)) {
	      item.cost = item.cost.times(costMults[game.nanC.indexOf(item)]).floor();
	      item.pow = item.pow.times(2);
	   } else {
	      item.cost = item.cost;
	   }
}

function buyOne(item) {
   switch (item) {
      case 0:
         if (canBuy(game.nanC[0])) buyOneCalc(game.nanC[0]);
         break;
      case 1:
         if (canBuy(game.nanC[1])) buyOneCalc(game.nanC[1]);
         break;
      case 2:
         if (canBuy(game.nanC[2])) buyOneCalc(game.nanC[2]);
         break;
      case 3:
         if (canBuy(game.nanC[3])) buyOneCalc(game.nanC[3]);
         break;
      case 4:
         if (canBuy(game.nanC[4])) buyOneCalc(game.nanC[4]);
         break;
      case "t":
         if (canBuy(game.tick)) {
            game.nanite = game.nanite.minus(game.tick.cost);
            game.tick.speed = game.tick.speed.minus(game.tick.speed.times(0.11));
            game.tick.cost = game.tick.cost.times(game.tick.costMult);
         }
         break;
		case "ns":
			if (canBuy(game.nsphere)) {
				game.nsphere.buyOne();
			}
			break;
		case "r":
			if (canBuy(game.researcher)) {
				game.researcher.buyOne();
			}
			break;
		case "p":
			if (game.research.gte(perfectionCost)) {
				perfection = true;
			}
   }

}


function buyNextSingle(item, index) {
   if (game.nanite.gte(item.cost.times(item.tillNext))) {
      for (i in item.tillNext) {
         buyOne(index);
      }
   }
}

function buyMaxCalc(item, index) {
   let total = game.nanite.div(item.cost).floor();
   for (i in total) {
      buyOne(index);
   }
}

function buyMax(item) {
   switch (item) {
      case 0:
         buyMaxCalc(game.nanC[0], 0);
         break;
      case 1:
         buyNextSingle(game.nanC[1], 1);
         break;
      case 2:
         buyNextSingle(game.nanC[2], 2);
         break;
      case 3:
         buyNextSingle(game.nanC[3], 3);
         break;
      case 4:
         buyNextSingle(game.nanC[4], 4);
         break;
      case "t":
         buyMaxCalc(game.tick, "t");
         break;
		case "ns":
			buyMaxCalc(game.nsphere, "ns");
			break;
		case "r":
			buyMaxCalc(game.researcher, "r");
   }
}

function buyMaxAll() {
	if (canBuy(game.nsphere)) buyMaxCalc(game.nsphere, "ns");
   if (canBuy(game.tick)) buyMaxCalc(game.tick, "t");
	for (let i = game.nanC.length-1; i >= 0; i--) {
		if (canBuy(game.nanC[i])) buyMaxCalc(game.nanC[i], i);
	}
	if (canBuy(game.researcher)) buyMaxCalc(game.researcher, "r");
}

function updateDisplay() {
   let doc = (element) => document.getElementById(element);
   let disp = (element, innerHTML) => doc(element).innerHTML = innerHTML;
	let power = (powerItem) => powerItem.pow.times(game.nsphere.pow).times(game.cnsphere.pow);
   disp("naniteA", `${format(game.nanite)}`);
	disp("nanitePS", `You produce ${format(game.nanC[0].amount.times(game.nsphere.pow).times(game.cnsphere.pow).times(game.nanC[0].pow))} nanites per second.`);
   disp("tickspeed", `${formatDecimals(game.tick.speed)}`);
   disp("tB1", `Cost: ${format(game.tick.cost)} nanites`);
   disp("tBM", `Buy Max`);
	disp("cnsphereBtn", `<b>Condense NanoSpheres<br>Boost: +${formatDecimals(game.nsphere.pow.div(10).minus(1))}</b><br>Current: ${formatDecimals(game.cnsphere.pow)}`);
	disp("nchipBtn", `<b>Collapse NanoSphere into ${format(game.cnsphere.pow.div(100).floor())} Nanochip</b>`);
	disp("rA", `Current Research: ${format(game.research)}`);
	if (game.researcher.amount.equals(1)) disp("nresearcherA", `Researcher: ${format(game.researcher.amount)}`);
	else disp("nresearcherA", `Researchers: ${format(game.researcher.amount)}`);
	for (let i = 0; i < game.nanC.length; i++) {
		disp("n"+(i+1)+"P", `x${format(power(game.nanC[i]))}`);
		disp("n"+(i+1)+"A", `${format(game.nanC[i].amount)}`);
		disp("n"+(i+1)+"B1", `Cost: ${format(game.nanC[i].cost)} nanites`);
		disp("n"+(i+1)+"BM", `To Next: ${game.nanC[i].tillNext}, Cost: ${format(game.nanC[i].cost.times(game.nanC[i].tillNext))}`);

		if (!canBuy(game.nanC[i])) {
			doc("n"+(i+1)+"B1").classList.add("greyed");
		} else {
			doc("n"+(i+1)+"B1").classList.remove("greyed");
		}
		if (!canBuyTillNext(game.nanC[i])) {
	      doc("n"+(i+1)+"BM").classList.add("greyed");
	   } else {
	      doc("n"+(i+1)+"BM").classList.remove("greyed");
	   }
	}

	disp("nRB1", `<b>Buy One Researcher</b><br>Cost: ${format(game.researcher.cost)}`)

	if (game.nsphere.upgrades.lt(1)) disp("nsphereBtn", `<b>Create a NanoSphere<br>Cost: ${format(game.nsphere.cost)} nanites</b>`);
	if (game.nsphere.upgrades.gte(1)) disp("nsphereBtn", `<b>Upgrade NanoSphere<br>Cost: ${format(game.nsphere.cost)} nanites</b><br>Current: x${formatDecimals(game.nsphere.pow)}`);
	if (game.nchip.lt(1)) {
		disp("nchipA", "");
	} else {
		if (game.nchip.equals(1)) disp("nchipA", `You have ${format(game.nchip)} Nanochip.`); else disp("nchipA", `You have ${format(game.nchip)} Nanochips.`);
	}

	if (!canCondense()) {
		doc("cnsphereBtn").classList.add("greyed");
	} else {
		doc("cnsphereBtn").classList.remove("greyed");
	}
	if (!canBuy(game.nsphere)) {
		doc("nsphereBtn").classList.add("greyed");
	} else {
		doc("nsphereBtn").classList.remove("greyed");
	}
   if (!canBuy(game.tick)) {
      doc("tB1").classList.add("greyed");
   } else {
      doc("tB1").classList.remove("greyed");
   }
	if (!game.research.gte(perfectionCost)) {
		doc("perfectBtn").classList.add("greyed");
	} else {
		doc("perfectBtn").classList.remove("greyed");
	}
}

let mods = [];
let modsCosts = [];
mods[0] = "ns-mod1",
modsCosts[0] = 1;

document.getElementById(mods[0]).addEventListener("click", () => buyMod(0));


function buyMod(index) {
	switch (index) {
		case 0:
			game.nchip = game.nchip.minus(1);
			game.researcher.availtrue();
			break;
	}
}




function updateAmounts() {
   game.nanite = game.nanite.plus(prodPerSec(game.nanC[0]));
	for (let i = 0; i < game.nanC.length-1; i++) {
		game.nanC[i].amount = game.nanC[i].amount.plus(prodPerSec(game.nanC[i+1]));
	}
	game.research = game.research.plus(prodPerSec(game.researcher));
}

function updateMilestones() {
	let doc = (element) => document.getElementById(element);
	let clAdd = (element,cl) => doc(element).classList.add(cl);
	let clRem = (element,cl) => doc(element).classList.remove(cl);
	game.nanC[0].availtrue();
   if (game.nanC[0].amount.gte(1)) {
		clRem("naniteRow", "unav");
		clAdd("naniteRow", "fade");
   } else {
		clAdd("naniteRow", "unav");
		clRem("naniteRow", "fade");
   }
	if (game.nanite.gte(100) || game.nsphere.upgrades.gte(1)) {
		game.nsphere.availtrue();
		clRem("nsphereBtn", "unav");
		clAdd("nsphereBtn", "fade");
	} else {
		clAdd("nsphereBtn", "unav");
		clRem("nsphereBtn", "fade");
	}
   if (game.nsphere.upgrades.gte(1)) {
		game.nanC[1].availtrue();
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
   if (game.nsphere.upgrades.gte(2)) {
		game.nanC[2].availtrue();
      clRem("n3Row", "unav");
		clAdd("n3Row", "fade");
   } else {
      clAdd("n3Row", "unav");
		clAdd("n3Row", "fade");
   }
   if (game.nsphere.upgrades.gte(3)) {
		game.nanC[3].availtrue();
		clRem("n4Row", "unav");
		clAdd("n4Row", "fade");
   } else {
		clAdd("n4Row", "unav");
		clAdd("n4Row", "fade");
   }
	if (game.nsphere.upgrades.gte(4)) {
		game.nanC[4].availtrue();
		clRem("n5Row", "unav");
		clAdd("n5Row", "fade");
   } else {
		clAdd("n5Row", "unav");
		clAdd("n5Row", "fade");
   }
	if (game.nsphere.pow.gte(16)) {
		clRem("cnsphereBtn", "unav");
		clAdd("cnsphereBtn", "fade");
	} else {
		clAdd("cnsphereBtn", "unav");
		clRem("cnsphereBtn", "fade");
	}
	if (game.cnsphere.pow.gte(100) || game.nchip.gte(1)) {
		clRem("nchips", "unav");
		clAdd("nchips", "fade");
	} else {
		clAdd("nchips", "unav");
		clRem("nchips", "fade");
	}
	if (game.cnsphere.pow.div(100).floor().gte(1)) {
		clRem("nchipBtn", "unav");
		clAdd("nchipBtn", "fade");
	} else {
		clAdd("nchipBtn", "unav");
		clRem("nchipBtn", "fade");
	}
	if (game.resets.gte(1)) {
		nanSPage.classList.remove("noDisplay");
	} else {
		nanSPage.classList.add("noDisplay");
	}
	if (game.researcher.available) {
		clRem("nandepbar", "unav");
		clAdd("nandepbar", "fade");
		clAdd("ns-mod1", "modGet");
	} else {
		clAdd("nandepbar", "unav");
		clRem("nandepbar", "fade");
		clRem("ns-mod1", "modGet");
	}
	if (perfection) {
		document.getElementById("winBox").classList.remove("noDisplay");
	} else {
		document.getElementById("winBox").classList.add("noDisplay");
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

window.addEventListener("load", updateDisplay);

document.getElementById("tB1").addEventListener("click", () => buyOne("t"));
document.getElementById("tBM").addEventListener("click", () => buyMax("t"));
for (let i = 0; i < game.nanC.length; i++) {
	document.getElementById("n"+(i+1)+"B1").addEventListener("click", () => buyOne(i));
	document.getElementById("n"+(i+1)+"BM").addEventListener("click", () => buyMax(i));
}
document.getElementById("maxBuy").addEventListener("click", () => buyMaxAll());
document.getElementById("nsphereBtn").addEventListener("click", () => {buyOne("ns"); if (game.nsphere.created == false) game.nsphere.created = true;});
document.getElementById("cnsphereBtn").addEventListener("click", () => condense());
document.getElementById("nchipBtn").addEventListener("click", () => toChip());
document.getElementById("nRB1").addEventListener("click", () => buyOne("r"));
document.getElementById("perfectBtn").addEventListener("click", () => buyOne("p"));
window.addEventListener("keydown", (event) => {
   switch (event.keyCode) {
      case 77: //M
         document.getElementById("maxBuy").click();
         break;

   }
});


function saveGame() {
	localStorage.setItem("save", JSON.stringify(game));
	localStorage.setItem("lastTime", JSON.stringify(now));
}

function loadGame() {
	let lastTime = JSON.parse(localStorage.getItem("lastTime"));
	let newTime = Date.now();
	let elapsed = newTime - lastTime;

	let savegame = JSON.parse(localStorage.getItem("save"));
	game.nanite = new Decimal(savegame.nanite);
	game.nanC[0] = new NaniteCreator(savegame.nanC[0].cost,savegame.nanC[0].amount,savegame.nanC[0].bought,savegame.nanC[0].pow);
	game.nanC[1] = new NaniteCreator(savegame.nanC[1].cost,savegame.nanC[1].amount,savegame.nanC[1].bought,savegame.nanC[1].pow);
	game.nanC[2] = new NaniteCreator(savegame.nanC[2].cost,savegame.nanC[2].amount,savegame.nanC[2].bought,savegame.nanC[2].pow);
	game.nanC[3] = new NaniteCreator(savegame.nanC[3].cost,savegame.nanC[3].amount,savegame.nanC[3].bought,savegame.nanC[3].pow);
	game.nanC[4] = new NaniteCreator(savegame.nanC[4].cost,savegame.nanC[4].amount,savegame.nanC[4].bought,savegame.nanC[4].pow);
   game.tick.speed = new Decimal(savegame.tick.speed);
   game.tick.cost = new Decimal(savegame.tick.cost);
   game.tick.decrement = new Decimal(savegame.tick.decrement);
	game.tick.costMult = new Decimal(savegame.tick.costMult);
   game.nsphere = new NanoSphere(savegame.nsphere.upgrades,savegame.nsphere.pow,savegame.nsphere.cost,savegame.nsphere.costMult);
   game.cnsphere = new ConNanoSphere(savegame.cnsphere.pow);
	game.nchip = new Decimal(savegame.nchip);
	game.researcher = new Researcher(savegame.researcher.cost,savegame.researcher.amount,savegame.researcher.bought,savegame.researcher.pow);
	game.researcher.available = savegame.researcher.available;
   game.research = new Decimal(savegame.research);
   game.mods = savegame.mods;
	game.resets = new Decimal(savegame.resets);
	updateMilestones();
	updateDisplay();
}

function resetHard() {
	localStorage.removeItem("save");
	location.reload();
}

window.addEventListener("load", loadGame);
window.setInterval(saveGame, 2000);

let nanBtn = document.getElementById("nanPage"),
nanSBtn = document.getElementById("nanSPage"),
settingsBtn = document.getElementById("settingsPage"),
pageBtns = [nanBtn, nanSBtn, settingsBtn];

let nanCont = document.getElementById("nan-container"),
nanSCont = document.getElementById("nanS-container"),
settingsCont = document.getElementById("settings-container"),
pages = [nanCont, nanSCont, settingsCont];

nanBtn.addEventListener("click", () => page(0));
nanSBtn.addEventListener("click", () => page(1));
settingsBtn.addEventListener("click", () => page(2));

function page(index) {
	for(let i = 0; i < pages.length; i++) {
		if (i == index) {
			pages[i].classList.remove("noDisplay");
		} else {
			pages[i].classList.add("noDisplay")
		}
	}
}

page(0);

let nanCBtn = document.getElementById("nanCPage"),
nanRBtn = document.getElementById("nanRPage"),
nanDepBtns = [nanCBtn,nanRBtn];


let nanCDep = document.getElementById("nCs"),
nanRDep = document.getElementById("nRs"),
nanDepartments = [nanCDep,nanRDep];

nanCBtn.addEventListener("click", () => department(0));
nanRBtn.addEventListener("click", () => department(1));

function department(index) {
	for (let i = 0; i < nanDepartments.length; i++) {
		if (i == index) {
			nanDepartments[i].classList.remove("noDisplay");
		} else {
			nanDepartments[i].classList.add("noDisplay")
		}
	}
}

department(0);

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
