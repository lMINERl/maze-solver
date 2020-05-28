var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
document.querySelector("body").setAttribute("controls", "");
var maze = [];
maze.push([0, 0, 0, 0, 0, 0, 0, 1, 0]);
maze.push([0, 1, 1, 1, 1, 1, 0, 1, 0]);
maze.push([0, 1, 0, 0, 0, 1, 0, 1, 0]);
maze.push([1, 1, 1, 1, 0, 1, 1, 1, 0]);
maze.push([0, 0, 0, 1, 0, 0, 0, 0, 0]);
maze.push([0, 1, 1, 1, 1, 1, 1, 1, 0]);
maze.push([0, 0, 0, 0, 0, 0, 0, 1, 0]);
var createDiv = function (num, row, column) {
    if (row === void 0) { row = -1; }
    if (column === void 0) { column = -1; }
    var div = document.createElement("div");
    div.style.backgroundColor = num == path.unVisited ? "white" : num == path.visited ? "red" : "black";
    div.textContent = "";
    div.style.width = "80px";
    div.style.height = "10px";
    div.setAttribute("id", row + "-" + column);
    return div;
};
var drawMaze = function (twoDimNumArray, selector) {
    var puzzel = document.querySelector(selector);
    twoDimNumArray.forEach(function (row, rowIndx) {
        var s = puzzel.appendChild(createDiv(1, rowIndx));
        s.style.display = "flex";
        row.forEach(function (column, columnIndex) {
            s.appendChild(createDiv(column, rowIndx, columnIndex));
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
var setRow = function (condition) { return function (num) { return (num > -1 && condition ? num : -1); }; };
var setColumn = setRow;
var solverFlag = false;
var attemptToSolve = function (oldArr, newArr, rowNum, columnNum) {
    if (solverFlag) {
        return;
    }
    var row = setRow(oldArr.length > rowNum);
    var rowIndex = row(rowNum);
    if (rowIndex < 0) {
        return;
    }
    var column = setColumn(oldArr[rowNum].length > columnNum);
    var columnIndex = column(columnNum);
    if (columnIndex < 0) {
        return;
    }
    //goal
    if ((rowIndex == 0 && columnIndex == 8) || (rowIndex == 6 && columnIndex == 8)) {
        solverFlag = true;
        return true;
    }
    var element = null;
    if (oldArr[rowIndex][columnIndex] === path.unVisited) {
        newArr = __spreadArrays(oldArr);
        newArr[rowIndex] = __spreadArrays(oldArr[rowIndex]);
        newArr[rowIndex][columnIndex] = path.visited;
        element = document.getElementById(rowIndex + "-" + columnIndex);
        setTimeout(function () { return attemptToSolve(newArr, [], row(rowIndex + 1), column(columnIndex)); }, 100);
        setTimeout(function () { return attemptToSolve(newArr, [], row(rowIndex - 1), column(columnIndex)); }, 100);
        setTimeout(function () { return attemptToSolve(newArr, [], row(rowIndex), column(columnIndex + 1)); }, 100);
        setTimeout(function () { return attemptToSolve(newArr, [], row(rowIndex), column(columnIndex - 1)); }, 100);
        if (element)
            element.style.backgroundColor = "gray";
    }
};
drawMaze(maze, "#puzzel");
attemptToSolve(maze, [], 3, 0);
