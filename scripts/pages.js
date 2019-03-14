

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
