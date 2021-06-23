
var currSize = "";

var projectsList;

var projContainer = document.querySelector(".projects-container");


function ProjectCard(size="normal", props={href: "", imgsrc: "", imgalt: "", title: "", description: ""}) {
    if (props.href == "") {
        props.href = "#";
        props.imgsrc = "images/logo.png";
        props.imgalt = "Default Image";
        props.title = "Default Card";
        props.description = "Default card, should not be visible normally.";
    }

    var card = document.createElement("a");
    card.classList.add("card", "text-decoration-none", "text-reset", "shadow", "w-card", "page-color");
    card.href = props.href;

    var cardImgContainer = document.createElement("div");

    var cardImg = document.createElement("img");
    cardImg.src = props.imgsrc;
    cardImg.alt = props.imgalt;

    var cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.innerHTML = props.title;

    

    var cardBody = document.createElement("div");

    if (size=="normal") {
        cardImgContainer.classList.add("card-header", "p-0");
        cardImg.classList.add("card-img-top");

        var cardText = document.createElement("p");
        cardText.classList.add("card-text");
        cardText.innerHTML = props.description;

        cardBody.classList.add("card-body");

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);

        cardImgContainer.appendChild(cardImg);

        card.appendChild(cardImgContainer);
        card.appendChild(cardBody);
    } else {
        cardImgContainer.classList.add("col-4", "card-sider");
        cardImg.classList.add("w-100");

        var cardRow = document.createElement("div");
        cardRow.classList.add("row", "g-0");

        cardBody.classList.add("col-8", "d-flex", "align-items-center", "justify-content-center", "text-center");

        cardBody.appendChild(cardTitle);

        cardImgContainer.appendChild(cardImg);

        cardRow.appendChild(cardImgContainer);
        cardRow.appendChild(cardBody);

        card.appendChild(cardRow);
    }

    return card;
}


function FillProjectContainer() {
    var size = window.innerWidth <= 768 ? "small" : "normal";
    if (size == currSize) return;
    console.log("Refilling Container");
    // Clear Project Container
    while (projContainer.firstChild) {
        projContainer.removeChild(projContainer.firstChild);
    }
    
    for (var i = 0; i < projectsList.length; i++) {
        projContainer.appendChild(ProjectCard(size, projectsList[i]));
    }

    currSize = size;
}

window.addEventListener("load", () => {
    console.log("Generating Projects List.");
    $.ajax({
        method: "GET",
        url: "getprojects.php"
    }).done(function(response) {
        projectsList = response;
        FillProjectContainer();
    });
    
}, true);

window.addEventListener("resize", ()=>{
    if (!projectsList) {
        console.log("Generating Projects List.");
        $.ajax({
            method: "GET",
            url: "getprojects.php"
        }).done(function(response) {
            projectsList = response;
        });
    }
    FillProjectContainer();
}, true);