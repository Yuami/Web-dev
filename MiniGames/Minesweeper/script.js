function randomInt(mult) {
    return Math.floor(Math.random() * mult)
}

function child(parent, child) {
    parent.appendChild(child);
}

function alert(title, s, alertType) {
    console.log(s);
    let head = document.getElementById("alert-title");
    let content = document.getElementById("alert-message");
    head.textContent = title;
    content.textContent = s;
    let e = document.getElementById("alert");
    switch (alertType) {
        case "finish":
        case "succes":
        case "win":
            e.style.backgroundColor = "#4ff43c";
            break;
        case "warning":
        case "warn":
        case "tie":
            e.style.backgroundColor = "#f3bb00";
            break;
        default:
            e.style.backgroundColor = "#f44336";
            break;
    }
    e.style.display = "";
}


class Game {

    static restart() {
        this.set(this.rows, this.cols, this.numBombs)
    }

    static set(rows, cols, numBombs) {
        this.dirs = [
            [-1, -1], [+0, -1], [+1, -1],
            [-1, +0],           [+1, -0],
            [-1, +1], [+0, +1], [+1, +1]
        ];
        this.totalOpen = 0;
        this.finish = false;
        this.firstTurn = true;
        if (numBombs > rows * cols) return;
        this.numBombs = numBombs;
        this.rows = rows;
        this.cols = cols;
        this.board = new Array(rows);
        for (let i = 0; i < this.board.length; i++) {
            this.board[i] = new Array(cols);
        }
        this.generate();
        this.setupDisplay();
    }

    static generate() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.board[i][j] = new Box(i, j);
            }
        }
    }

    static bombsGeneration(){
        let numBombs = this.numBombs;
        let rows = this.rows;
        let cols = this.cols;
        while (numBombs > 0) {
            let row = randomInt(rows);
            let col = randomInt(cols);

            if (this.isMine(row,col) || this.isUsed(row,col)) continue;
            this.getBox(row, col).isMine = true;
            numBombs--;
        }
    }

    static setupDisplay() {
        let rows = this.rows;
        let cols = this.cols;
        let game = document.getElementById("minesweeper");
        game.innerHTML = "";

        for (let i = 0; i < rows; i++) {
            let row = document.createElement("div");
            row.classList.add("row");
            for (let j = 0; j < cols; j++) {
                let col = document.createElement("div");
                col.classList.add("box");
                col.id = "box-" + i + "-" + j;
                col.setAttribute("onclick", "Game.open(" + i + ", " + j + ")");
                child(row, col);
            }
            child(game, row);
        }
    }

    static outOfBounds(x, y) {
        return x < 0 || y < 0 || x > this.rows - 1 || y > this.cols - 1;
    }

    static open(x, y) {
        if (this.finish){
            this.restart();
        }

        let dirs = this.dirs;
        let totalMines = 0;
        let board = this.board;

        if (this.isUsed(x, y)) {
            alert("Warning!","This box is already used!", "warn");
            return;
        } else {
            this.getBox(x, y).isUsed = true;
        }

        if (this.firstTurn) {
            this.bombsGeneration();
            this.firstTurn = false;
        }

        if (this.isMine(x, y)) {
            this.lost();
            return;
        }

        for (let i = 0; i < dirs.length; i++) {
            let dir = dirs[i];
            let row = dir[0] + x;
            let col = dir[1] + y;

            if (this.outOfBounds(row, col)) {
                continue;
            }
            if (this.isMine(row, col)) {
                totalMines++;
            }
        }

        let element = document.getElementById("box-" + x + "-" + y);
        let children = document.createElement("div");
        children.classList.add("text");
        children.innerText = "" + totalMines;
        child(element, children);

        this.totalOpen++;
        if (this.win()) {

        }
        if (totalMines === 0) {
            this.openNear(x, y);
        }
    }

    static openNear(x, y) {
        let dirs = this.dirs;
        for (let i = 0; i < dirs.length; i++) {
            let dir = dirs[i];
            let row = dir[0] + x;
            let col = dir[1] + y;

            if (this.outOfBounds(row, col) || this.isUsed(row, col)) {
                continue;
            }
            this.open(row, col);
        }
    }

    static isUsed(x, y) {
        return this.getBox(x, y).isUsed;
    }

    static isMine(x, y) {
        return this.getBox(x, y).isMine;
    }

    static getBox(x, y) {
        return this.board[x][y];
    }

    static lost() {
        this.openAllBombs();
        alert("OOOH!","YOU FOUND A MINE!");
        this.finish = true;
    }

    static win() {
        if (this.totalOpen !== this.rows * this.cols - this.numBombs) return;
        alert("WINNER!","YOU WIN THE GAME!","win");
        this.finish = true;
    }

    static openAllBombs(){
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.isMine(i,j)){
                    let element = Box.getBoxElement(i,j);
                    console.log(element);
                    element.innerHTML = "<img src='bomb.svg'/>";
                }
            }
        }
    }
}