class Script {

    static init(columnas, filas) {
        this.set(columnas, filas);
        this.create();
    }

    static restart(columnas, filas, turno){
        this.set(columnas, filas);
        this.turno = turno;
        this.create();
    }

    static set(columnas, filas) {
        this.filas = filas;
        this.columnas = columnas;
        this.rowHeight = [];
        this.turno = 0;
        this.colors = ["#ff2e46", "#ffe800"];
        for (let i = 0; i < columnas; i++) this.rowHeight[i] = 0;
        this.win = false;
        this.tablero = new Array(columnas);
        for (let i = 0; i < columnas; i++) {
            this.tablero[i] = new Array(filas);
        }
    }

    static cambiarTurno() {
        this.turno = ++this.turno % 2;
    }

    static create() {
        let turnShow = document.getElementById("turn-show");
        turnShow.innerHTML = '<h2>Turn:</h2><svg height="50" width="50" class="row-3"> <circle cx="25" cy="25" r="20" stroke="#0B4E72" stroke-width="3" class="free" id="turn-selector" />';
        document.getElementById("turn-selector").style.fill = this.colors[this.turno];

        let tablero = document.getElementsByClassName("container")[0];
        tablero.innerHTML = "";
        for (let i = 0; i < this.columnas; i++) {
            let column = document.createElement("div");
            column.classList.add("column");
            column.id = "column-" + (i + 1);
            column.setAttribute("onclick", "Script.usarFicha(" + (i + 1) + ")");
            for (let j = 0; j < this.filas; j++) {
                let row = document.createElement("div");
                row.classList.add("row");
                let idString = "col-" + (i + 1) + "-row-" + (this.filas - j);
                row.innerHTML = '<svg height="100" width="100" class="row-3"> <circle cx="50" cy="50" r="45" stroke="#0B4E72" stroke-width="3" class="free" id="' + idString + '" />';
                column.appendChild(row);
            }
            tablero.appendChild(column);
        }
    }

    static fueraDeRango(row) {
        return row + 1 > this.filas;
    }

    static alert(s, alertType) {
        console.log(s);
        let content = document.getElementById("alert-message");
        content.textContent = s;
        let e = document.getElementById("alert");
        switch (alertType) {
            case "win":
            case "succes":
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

    static usarFicha(col) {
        if (this.win) {
            this.cambiarTurno();
            this.restart(this.columnas, this.filas, this.turno);
            return;
        }

        document.getElementById("alert").style.display = "none";

        if (this.fueraDeRango(this.rowHeight[col - 1])) {
            this.alert("Esa fila ya esta llena");
            return;
        }

        let row = ++this.rowHeight[col - 1];

        this.tablero[col - 1][row - 1] = this.turno;
        let cas = document.getElementById("col-" + col + "-row-" + row);
        cas.style.fill = this.colors[this.turno];

        if (row === 6 && this.compEmpate()) {
            this.alert("Hay un empate", "tie");
            this.win = true;
            return;
        }

        if (this.comp(col, row)) {
            this.alert("El jugador " + this.turno + " ha ganado!", "win");
            return;
        }

        this.cambiarTurno();
        document.getElementById("turn-selector").style.fill = this.colors[this.turno];
    }

    static compLimites(col, row) {
        return col < 0 || row < 0 || col > this.columnas - 1 || row > this.filas - 1
    }

    static compEmpate() {
        for (let i = 0; i < this.rowHeight.length; i++)
            if (this.filas !== this.rowHeight[i]) return false;

        return true;
    }

    static comp(col, row) {
        col--;
        row--;

        let dirs = [
            [-1, -1], [+0, -1], [+1, -1],
            [-1, +0]
        ];

        let casilla = this.tablero[col][row];
        let casillas = [];
        casillas[0] = [col, row];

        for (let k = 0; k < dirs.length; k++) {
            let dirC = dirs[k][0];
            let dirF = dirs[k][1];
            let cont = 0;

            for (let i = 0; i < 2; i++) {
                dirC = -1 * dirC;
                dirF = -1 * dirF;

                for (let j = 1; j < 4; j++) {
                    let compC = col + (dirC * j);
                    let compF = row + (dirF * j);
                    if (this.compLimites(compC, compF)) break;

                    let compCasilla = this.tablero[compC][compF];
                    if (compCasilla !== casilla || compCasilla === undefined)
                        break;

                    cont++;
                    casillas[cont] = [compC,compF];
                    if (cont === 3) {
                        this.win = true;
                        this.iluminar(casillas);
                        return true;
                    }
                }
            }
        }
        return false;
    }

    static iluminar(casillas){
        for (let i = 0; i < casillas.length; i++) {
            let col = casillas[i][0] + 1;
            let row = casillas[i][1] + 1;
            console.log(casillas);
            let s = "col-"+col+"-row-"+row;
            console.log(s);
            let circulo = document.getElementById(s);
            circulo.style.stroke = "#26ff00";
        }
    }

}