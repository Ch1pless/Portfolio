class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    equals(point) {
        return this.x == point.x && this.y == point.y;
    }

    toString() {
        return "" + this.x + ", " + this.y + "";
    }
}

const CellType = {
    EMPTY: 0,
    START: 1,
    GOAL: 2,
    WALL: 3,
    VISITED: 4,
    ACTIVE: 5,
    PATH: 6
};
Object.freeze(CellType);

function CellColor(type) {
    switch (type) {
        case CellType.EMPTY:
            return "lightgray";
        case CellType.START:
            return "red";
        case CellType.GOAL:
            return "green";
        case CellType.WALL:
            return "black";
        case CellType.VISITED:
            return "white";
        case CellType.ACTIVE:
            return "yellow";
        case CellType.PATH:
            return "purple";
    }   
}

const Algorithm = {
    BFS: 1,
    DFS: 2,
    BFA: 3,
    DA: 4,
    ASTAR: 5
}
Object.freeze(Algorithm);

function AlgorithmString(Alg) {
    switch (Alg) {
        case Algorithm.BFS:
            return "Breadth-First";
        case Algorithm.DFS:
            return "Depth-First";
        case Algorithm.BFA:
            return "Bellman-Ford Algorithm";
        case Algorithm.DA:
            return "Dijkstra's Algorithm";
        case Algorithm.ASTAR:
            return "A*";
    }
}

const SelectedCell = {
    START: 1,
    GOAL: 2,
    WALL: 3
}

class Graph {
    constructor(width, height) {
        this.height = height;
        this.width = width;
        this.createGraph();
    }

    setStart(point) {
        if (this.start)
            this.graph[this.start.x][this.start.y] = CellType.EMPTY;
        this.start = point;
        this.graph[point.x][point.y] = CellType.START;
    }

    getStart() {
        return this.start;
    }

    setGoal(point) {
        if (this.goal)
            this.graph[this.goal.x][this.goal.y] = CellType.EMPTY;
        this.goal = point;
        this.graph[point.x][point.y] = CellType.GOAL;
    }

    getGoal() {
        return this.goal;
    }

    setWall(point) {
        this.graph[point.x][point.y] = CellType.WALL;
    }

    setEmpty(point) {
        this.graph[point.x][point.y] = CellType.EMPTY;
    }

    setActive(point) {
        this.graph[point.x][point.y] = CellType.ACTIVE;
    }

    setVisited(point) {
        this.graph[point.x][point.y] = CellType.VISITED;
    }

    setPath(point) {
        this.graph[point.x][point.y] = CellType.PATH;
    }

    createGraph() {
        this.graph = [];
        for (var i = 0; i < this.width; i++) {
            this.graph[i] = [];
            for (var j = 0; j < this.height; j++) {
                this.graph[i].push(CellType.EMPTY);
            }
        }
    }
    
    getCell(point) {
        return this.graph[point.x][point.y];
    }

    getNeighborPoints(point) {
        var validNeighbors = []
        var upPoint = new Point(point.x, point.y - 1);
        var rightPoint = new Point(point.x + 1, point.y);
        var downPoint = new Point(point.x, point.y + 1);
        var leftPoint = new Point(point.x - 1, point.y);
        if (upPoint.y >= 0) validNeighbors.push(upPoint);
        if (downPoint.y < this.height) validNeighbors.push(downPoint);
        if (leftPoint.x >= 0) validNeighbors.push(leftPoint);
        if (rightPoint.x < this.width) validNeighbors.push(rightPoint);
        return validNeighbors;
    }


    toString() {
        var str = "";
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                str = str+ " " + this.graph[j][i];
            }
            str = str + "\n";
        }
        return str
    }
}

class Queue {
    constructor() {
        this.items = [];
    }

    enqueue(element) {
        this.items.push(element);
    }

    dequeue() {
        if (this.isEmpty())
            return "Underflow";
        return this.items.shift();
    }

    front() {
        if (this.isEmpty())
            return "No elements in queue";
        return this.items[0];
    }

    isEmpty() {
        return this.items.length == 0;
    }

    toString() {
        var str = "";
        for (var i = 0; i < this.items.length; i++) {
            str += this.items[i] + ", ";
        }
        return str;
    }
}

class Stack {
    constructor() {
        this.items = [];
    }

    push(element) {
        this.items.push(element);
    }

    pop() {
        if (this.isEmpty())
            return "Underflow";
        return this.items.pop();
    }

    peek() {
        if (this.isEmpty())
            return "No elements in stack";
        return this.items[this.items.length-1];
    }

    isEmpty() {
        return this.items.length == 0;
    }

    toString() {
        var string = "";
        for (var i = 0; i < this.items.length; i++) {
            str += this.items[i] + ", ";
        }
        return str;
    }
}