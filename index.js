var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
document.querySelector("body").setAttribute("controls", "");
var createDiv = function (num, row, column, isSub) {
    if (row === void 0) { row = -1; }
    if (column === void 0) { column = -1; }
    if (isSub === void 0) { isSub = false; }
    var div = document.createElement("div");
    div.style.backgroundColor = num == path.unVisited ? "white" : num == path.visited ? "red" : "black";
    div.textContent = "";
    div.style.width = isSub ? "2px" : "100%";
    div.style.height = isSub ? "2px" : "auto";
    div.setAttribute("id", row + "-" + column);
    return div;
};
var drawMaze = function (twoDimNumArray, selector) {
    var puzzel = document.querySelector(selector);
    twoDimNumArray.forEach(function (row, rowIndx) {
        var s = puzzel.appendChild(createDiv(1, rowIndx));
        s.style.display = "flex";
        row.forEach(function (column, columnIndex) {
            s.appendChild(createDiv(column, rowIndx, columnIndex, true));
        });
    });
    puzzel.appendChild(document.createElement("br"));
};
var attemptToSolveX = function (twoDimNumArray, callback) {
    var xorArr = [];
    //   xorArr.push(twoDimNumArray.map((r) => r[0]));
    twoDimNumArray.forEach(function (arr) {
        var temp = [];
        arr.forEach(function (x, i) {
            if (!i) {
                temp.push(x);
            }
            else if (i < arr.length) {
                temp.push(callback(x, arr[i - 1]));
            }
        });
        xorArr.push(temp);
    });
    //   console.log(xorArr);
    return xorArr;
};
var path;
(function (path) {
    path[path["visited"] = 2] = "visited";
    path[path["unVisited"] = 1] = "unVisited";
    path[path["block"] = 0] = "block";
})(path || (path = {}));
var setRow = function (condition) { return function (num) { return (num > -1 && condition ? Number(num) : -1); }; };
var setColumn = setRow;
var solverFlag = false;
var attemptToSolve = function (oldArr, newArr, start, goal) {
    if (solverFlag) {
        return;
    }
    var row = setRow(oldArr.length > start.row);
    var rowIndex = row(start.row);
    if (rowIndex < 0) {
        return;
    }
    var column = setColumn(oldArr[start.row].length > start.column);
    var columnIndex = column(start.column);
    if (columnIndex < 0) {
        return;
    }
    //goal
    if (rowIndex == goal.row && columnIndex == goal.column) {
        solverFlag = true;
        return true;
    }
    var element = null;
    if (oldArr[rowIndex][columnIndex] === path.unVisited) {
        newArr = __spreadArrays(oldArr);
        newArr[rowIndex] = __spreadArrays(oldArr[rowIndex]);
        newArr[rowIndex][columnIndex] = path.visited;
        element = document.getElementById(rowIndex + "-" + columnIndex);
        setTimeout(function () {
            var result = attemptToSolve(newArr, [], { row: row(rowIndex), column: column(columnIndex + 1) }, goal);
            if (result)
                drawMaze(newArr, "#solve");
        }, 0);
        setTimeout(function () {
            var result = attemptToSolve(newArr, [], { row: row(rowIndex - 1), column: column(columnIndex) }, goal);
            if (result)
                drawMaze(newArr, "#solve");
        }, 0);
        setTimeout(function () {
            var result = attemptToSolve(newArr, [], { row: row(rowIndex + 1), column: column(columnIndex) }, goal);
            if (result)
                drawMaze(newArr, "#solve");
        }, 0);
        setTimeout(function () {
            var result = attemptToSolve(newArr, [], { row: row(rowIndex), column: column(columnIndex - 1) }, goal);
            if (result)
                drawMaze(newArr, "#solve");
        }, 0);
        if (element)
            element.style.backgroundColor = "gray";
    }
};
// drawMaze(maze, "#puzzel");
// attemptToSolve(maze, [], 3, 0);
// 2 functions from https://rosettacode.org/wiki/Maze_generation#JavaScript 
//  i couldnt understand the display function too many magic numbers
function mazeStucture(x, y) {
    var n = x * y - 1;
    if (n < 0) {
        alert("illegal maze dimensions");
        return;
    }
    var horiz = [];
    for (var j = 0; j < x + 1; j++)
        horiz[j] = [];
    var verti = [];
    for (var j = 0; j < x + 1; j++)
        verti[j] = [];
    var here = [Math.floor(Math.random() * x), Math.floor(Math.random() * y)];
    var path = [here];
    var unvisited = [];
    for (var j = 0; j < x + 2; j++) {
        unvisited[j] = [];
        for (var k = 0; k < y + 1; k++)
            unvisited[j].push(j > 0 && j < x + 1 && k > 0 && (j != here[0] + 1 || k != here[1] + 1));
    }
    while (0 < n) {
        var potential = [
            [here[0] + 1, here[1]],
            [here[0], here[1] + 1],
            [here[0] - 1, here[1]],
            [here[0], here[1] - 1],
        ];
        var neighbors = [];
        for (var j = 0; j < 4; j++)
            if (unvisited[potential[j][0] + 1][potential[j][1] + 1])
                neighbors.push(potential[j]);
        if (neighbors.length) {
            n = n - 1;
            var next = neighbors[Math.floor(Math.random() * neighbors.length)];
            unvisited[next[0] + 1][next[1] + 1] = false;
            if (next[0] == here[0])
                horiz[next[0]][(next[1] + here[1] - 1) / 2] = true;
            else
                verti[(next[0] + here[0] - 1) / 2][next[1]] = true;
            path.push((here = next));
        }
        else
            here = path.pop();
    }
    return { x: x, y: y, horiz: horiz, verti: verti };
}
function display(m) {
    var text = [];
    for (var j = 0; j < m.x * 2 + 1; j++) {
        var line = [];
        if (0 == j % 2)
            for (var k = 0; k < m.y * 4 + 1; k++)
                if (0 == k % 4)
                    line[k] = "*";
                else if (j > 0 && m.verti[j / 2 - 1][Math.floor(k / 4)])
                    line[k] = "S";
                else
                    line[k] = "J";
        else
            for (var k = 0; k < m.y * 4 + 1; k++)
                if (0 == k % 4)
                    if (k > 0 && m.horiz[(j - 1) / 2][k / 4 - 1])
                        line[k] = "T";
                    else
                        line[k] = "*";
                else
                    line[k] = "S";
        if (0 == j)
            line[1] = line[2] = line[3] = "S";
        if (m.x * 2 - 1 == j)
            line[4 * m.y] = " ";
        text.push(line.join("") + "\r\n");
    }
    return text.join("");
}
var out = display(mazeStucture(30, 110));
var enhanced = out
    .replace(/SSS/gi, "1")
    .replace(/JJJ/gi, "0")
    .replace(/\*/gi, "0")
    .replace(/T/gi, "1")
    .replace(/ /gi, "1")
    .split("\r\n")
    .map(function (x) { return x.split(""); })
    .map(function (x) { return x.map(function (el) { return Number(el); }); });
console.log(enhanced);
drawMaze(enhanced, "#puzzel");
attemptToSolve(enhanced, [], { row: 0, column: 1 }, { row: enhanced.length - 3, column: enhanced[0].length - 1 });
