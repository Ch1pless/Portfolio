
var canvas;
var ctx;
var G;
var interval = 20;
var startCell = new Point(3, 3);
var goalCell = new Point(10,10);
var wallCells = [];
var cellSize = 50;
var selected_algorithm = Algorithm.BFS;
var selected_cell = CellType.START;
var running_algorithm = false;
var mousePos = new Point(0, 0);
var cellPos = new Point(0, 0);

function init() {
    document.getElementById("curr-alg").innerHTML = "Currently Selected: " + AlgorithmString(selected_algorithm);
    canvas = document.getElementById("display");
    ctx = canvas.getContext("2d");
    setupGraph();
    ctx.strokeStyle = "gray";
    updateGraphDisplay();
    console.log(G.toString())

    canvas.addEventListener('mousemove', function(e) {
        var mousePosTemp = getMousePos(canvas, e);
        mousePos.x = mousePosTemp.x;
        mousePos.y = mousePosTemp.y;
        cellPos = getCellPos(mousePos);
    }, false);

    canvas.addEventListener('mousedown', function(e) {
        if (cellPos.x < 0 || cellPos.x >= G.width || cellPos.y < 0 || cellPos.y >= G.height) {
            return;
        }
        switch (selected_cell) {
            case CellType.START:
                startCell = cellPos;
                G.setStart(cellPos);
                break;
            case CellType.GOAL:
                goalCell = cellPos;
                G.setGoal(cellPos);
                break;
            case CellType.WALL:
                var index = -1;
                for (var i = 0; i < wallCells.length; i++) {
                    if (wallCells[i].equals(cellPos)) {
                        index = i;
                        break;
                    }
                }
                if (index == -1) {
                    wallCells.push(cellPos);
                    G.setWall(cellPos);
                } else {
                    G.setEmpty(cellPos);
                    wallCells.splice(index, 1);
                }
                break;
        }
        updateGraphDisplay();
    });
    
}



function getMousePos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {x: e.clientX - rect.left, y: e.clientY - rect.top};
}

function getCellPos(mousePos) {
    return new Point(Math.floor(mousePos.x/cellSize), Math.floor(mousePos.y/cellSize));
}

function setupGraph() {
    G = new Graph(canvas.width/cellSize, canvas.height/cellSize);
    G.setStart(startCell);
    G.setGoal(goalCell);
    for (var i = 0; i < wallCells.length; i++) {
        G.setWall(wallCells[i]);
    }
    console.log(G.toString());
}

async function start() {
    stop();
    await sleep(interval);
    running_algorithm = true;
    setupGraph();
    updateGraphDisplay();
    switch(selected_algorithm) {
        case Algorithm.BFS:
            displayBFS();
            break;
        case Algorithm.DFS:
            displayDFS();
            break;
        case Algorithm.BFA:
            displayBFA();
            break;
        case Algorithm.DA:
            displayDA();
            break;
        case Algorithm.ASTAR:
            displayASTAR();
            break;
    }
}

function stop() {
    running_algorithm = false;
}

async function clearGraph() {
    stop();
    await sleep(interval);
    setupGraph();
    updateGraphDisplay();
    document.getElementById("curr-alg").innerHTML = "Currently Selected: " + AlgorithmString(selected_algorithm);
}


function updateGraphDisplay() {
    for (var i = 0; i < G.height; i++) {
        for (var j = 0; j < G.width; j++) {
            drawCell(j, i, CellColor(G.getCell(new Point(j, i))));
        }
    }
    drawCell(G.getStart().x, G.getStart().y, CellColor(CellType.START));
    drawCell(G.getGoal().x, G.getGoal().y, CellColor(CellType.GOAL));
}

function drawCell(x, y, fillColor) {
    ctx.beginPath();
    ctx.rect(cellSize * x, cellSize * y, cellSize, cellSize);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = fillColor;
    ctx.fill();
}


async function displayBFS() {
    var Q = new Queue();
    var parent = {};
    G.setActive(G.getStart());
    Q.enqueue(G.getStart());
    while (!Q.isEmpty()) {
        var point = Q.dequeue();
        G.setVisited(point);
        if (G.getGoal().equals(point))
            break;
        var neighbors = G.getNeighborPoints(point);
        for (var i = 0; i < neighbors.length; i++) {
            var curType = G.getCell(neighbors[i]);
            if (curType != CellType.VISITED && curType != CellType.WALL && curType != CellType.ACTIVE) {
                parent[neighbors[i]] = point;
                G.setActive(neighbors[i]);
                Q.enqueue(neighbors[i]);
            }
        }
        updateGraphDisplay();
        await sleep(interval);
        if (!running_algorithm) return;
    }

    var curPoint = G.getGoal();
    while (curPoint in parent) {
        G.setPath(curPoint);
        curPoint = parent[curPoint];
        updateGraphDisplay();
        await sleep(interval);
        if (!running_algorithm) return;
    }
}

async function displayDFS() {
    var S = new Stack();
    var parent = {};
    G.setActive(G.getStart());
    S.push(G.getStart());
    while (!S.isEmpty()) {
        var point = S.pop();
        G.setVisited(point);
        if (G.getGoal().equals(point))
            break;
        var neighbors = G.getNeighborPoints(point);
        for (var i = 0; i < neighbors.length; i++) {
            var curType = G.getCell(neighbors[i]);
            if (curType != CellType.VISITED && curType != CellType.WALL && curType != CellType.ACTIVE) {
                parent[neighbors[i]] = point;
                G.setActive(neighbors[i]);
                S.push(neighbors[i]);
            }
        }
        updateGraphDisplay();
        await sleep(interval);
        if (!running_algorithm) return;
    }
    
    var curPoint = G.getGoal();
    while (curPoint in parent) {
        G.setPath(curPoint);
        curPoint = parent[curPoint];
        updateGraphDisplay();
        await sleep(interval);
        if (!running_algorithm) return;
    }
}

async function displayBFA() {
    var distance = {};
    var parent = {};

    for (var i = 0; i < G.height; i++) {
        for (var j = 0; j < G.width; j++) {
            distance[new Point(j, i)] = Infinity;
        }
    }

    distance[G.getStart()] = 0;
    for (var h = 0; h < G.height * G.width; h++) {
        for (var i = 0; i < G.height; i++) {
            for (var j = 0; j < G.width; j++) {
                var neighbors = G.getNeighborPoints(new Point(j, i));
                for (var k = 0; k < neighbors.length; k++) {
                    var curType = G.getCell(neighbors[k]);
                    if (curType != CellType.WALL) {
                        var u = new Point(j, i);
                        var v = neighbors[k];
                        if (distance[u] + 1 < distance[v]) {
                            distance[v] = distance[u] + 1;
                            parent[v] = u; 
                        }
                    }
                }
                
            }
        }
    }
    var curPoint = G.getGoal();
    while (!curPoint.equals(G.getStart())) {
        G.setPath(curPoint);
        curPoint = parent[curPoint];
        updateGraphDisplay();
        await sleep(interval);
        if (!running_algorithm) return;
    }
}

async function displayDA() {
    var distance = {};
    var parent = {};
    
    for (var i = 0; i < G.height; i++) {
        for (var j = 0; j < G.width; j++) {
            distance[new Point(j, i)] = Infinity;
        }
    }
    

    distance[G.getStart()] = 0;
    var curPoint = G.getStart();
    while (!curPoint.equals(G.getGoal())) {
        var smallestPoint = null;
        for (var i = 0; i < G.height; i++) {
            for (var j = 0; j < G.width; j++) {
                var curType = G.getCell(new Point(j, i));
                if (curType != CellType.WALL && curType != CellType.VISITED) {
                    if (smallestPoint == null || distance[new Point(j, i)] < distance[smallestPoint]) {
                        smallestPoint = new Point(j, i);
                    }
                }
            }
        }
        if (distance[smallestPoint] == Infinity)
            break;
        curPoint = smallestPoint;
        console.log(G.getCell(curPoint));

        G.setVisited(curPoint);
        if (curPoint.equals(G.getGoal())) break;

        var neighbors = G.getNeighborPoints(curPoint);
        for (var i = 0; i < neighbors.length; i++) {
            var curType = G.getCell(neighbors[i]);
            if (curType != CellType.WALL && curType != CellType.VISITED) {
                var u = curPoint;
                var v = neighbors[i];
                if (distance[u] + 1 < distance[v]) {
                    distance[v] = distance[u] + 1;
                    parent[v] = u;
                    G.setActive(v);
                }
            }
        }
        updateGraphDisplay();
        await sleep(interval);
        if (!running_algorithm) return;
    }
    curPoint = G.getGoal();
    while (!curPoint.equals(G.getStart())) {
        console.log(curPoint.toString());
        G.setPath(curPoint);
        curPoint = parent[curPoint];
        updateGraphDisplay();
        await sleep(interval);
        if (!running_algorithm) return;
    }
}

async function displayASTAR() {
    var distance = {};
    var parent = {};
    var manhattenDistance = {};

    for (var i = 0; i < G.height; i++) {
        for (var j = 0; j < G.width; j++) {
            distance[new Point(j, i)] = Infinity;
        }
    }
    distance[G.getStart()] = 0;

    for (var i = 0; i < G.height; i++) {
        for (var j = 0; j < G.width; j++) {
            manhattenDistance[new Point(j, i)] = Infinity;
        }
    }
    manhattenDistance[G.getStart()] = ManDst(G.getStart());

    var curPoint = G.getStart();
    while (!curPoint.equals(G.getGoal())) {
        curPoint = null;
        for (var i = 0; i < G.height; i++) {
            for (var j = 0; j < G.width; j++) {
                var curType = G.getCell(new Point(j, i));
                if (curType != CellType.WALL && curType != CellType.VISITED) {
                    if (curPoint == null || manhattenDistance[new Point(j, i)] < manhattenDistance[curPoint]) {
                        curPoint = new Point(j, i);
                    }
                }
            }
        }

        G.setVisited(curPoint);
        if (curPoint.equals(G.getGoal())) break;

        var neighbors = G.getNeighborPoints(curPoint);
        for (var i = 0; i < neighbors.length; i++) {
            var curType = G.getCell(neighbors[i]);
            if (curType != CellType.WALL && curType != CellType.VISITED) {
                var u = curPoint;
                var v = neighbors[i];
                if (distance[u] + 1 < distance[v]) {
                    distance[v] = distance[u] + 1;
                    parent[v] = u;
                    manhattenDistance[v] = distance[u] + 1 + ManDst(v);
                    G.setActive(v);
                }
            }
        }
        updateGraphDisplay();
        await sleep(interval);
        if (!running_algorithm) return;
    }
    curPoint = G.getGoal();
    while (!curPoint.equals(G.getStart())) {
        console.log(curPoint.toString());
        G.setPath(curPoint);
        curPoint = parent[curPoint];
        updateGraphDisplay();
        await sleep(interval);
        if (!running_algorithm) return;
    }
}

function ManDst(point) {
    return Math.abs(G.getGoal().x - point.x) + Math.abs(G.getGoal().y - point.y);
}

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));