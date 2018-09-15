class Box {

    constructor(x, y) {
        this.row = x;
        this.col = y;
        this.isUsed = false;
        this.isMine = false;
    }

    static getBoxElement(x, y){
        return document.getElementById("box-" + x + "-" + y);
    }
}