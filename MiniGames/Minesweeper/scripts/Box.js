class Box {

    constructor(x, y) {
        this.row = x;
        this.col = y;
        this.isUsed = false;
        this.isMine = false;
    }

    static getBoxElement(x, y) {
        return document.getElementById("box-" + x + "-" + y);
    }

    static getRow(cols, row) {
        let elements = new Array(cols);
        for (let i = 0; i < cols; i++) {
            elements[i] = this.getBoxElement(row,i);
        }
        return elements;
    }

    static getCol(rows, col) {
        let elements = new Array(rows);
        for (let i = 0; i < rows; i++) {
            elements[i] = this.getBoxElement(i,col);
        }
        return elements;
    }
}