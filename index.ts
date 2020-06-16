document.querySelector("body").setAttribute("controls", "");

const createDiv = (num: number | string, row: number = -1, column: number = -1, isSub: boolean = false) => {
  let div = document.createElement("div");
  div.style.backgroundColor = num == path.unVisited ? "white" : num == path.visited ? "red" : "black";
  div.textContent = "";
  div.style.width = isSub ? "2px" : "100%";
  div.style.height = isSub ? "2px" : "auto";
  div.setAttribute("id", `${row}-${column}`);

  return div;
};

const drawMaze = (twoDimNumArray: number[][] | string[][], selector: string) => {
  let puzzel = document.querySelector(selector);
  twoDimNumArray.forEach((row: number[] | string[], rowIndx: number) => {
    let s = puzzel.appendChild(createDiv(1, rowIndx));
    s.style.display = "flex";
    row.forEach((column: number | string, columnIndex: number) => {
      s.appendChild(createDiv(column, rowIndx, columnIndex, true));
    });
  });
  puzzel.appendChild(document.createElement("br"));
};

const attemptToSolveX = (twoDimNumArray, callback) => {
  let xorArr = [];
  //   xorArr.push(twoDimNumArray.map((r) => r[0]));
  twoDimNumArray.forEach((arr) => {
    let temp = [];
    arr.forEach((x, i) => {
      if (!i) {
        temp.push(x);
      } else if (i < arr.length) {
        temp.push(callback(x, arr[i - 1]));
      }
    });
    xorArr.push(temp);
  });
  //   console.log(xorArr);
  return xorArr;
};

enum path {
  visited = 2,
  unVisited = 1,
  block = 0,
}

const setRow = (condition: boolean) => (num: number): number => (num > -1 && condition ? Number(num) : -1);
const setColumn = setRow;

let solverFlag = false;
const attemptToSolve = (oldArr: number[][], newArr: number[][], start: { row: number; column: number }, goal: { row: number; column: number }) => {
  if (solverFlag) {
    return;
  }

  const row = setRow(oldArr.length > start.row);
  const rowIndex = row(start.row);
  if (rowIndex < 0) {
    return;
  }

  const column = setColumn(oldArr[start.row].length > start.column);
  const columnIndex = column(start.column);
  if (columnIndex < 0) {
    return;
  }
  //goal
  if (rowIndex == goal.row && columnIndex == goal.column) {
    solverFlag = true;
    return true;
  }
  let element: HTMLElement = null;

  if (oldArr[rowIndex][columnIndex] === path.unVisited) {
    newArr = [...oldArr];
    newArr[rowIndex] = [...oldArr[rowIndex]];
    newArr[rowIndex][columnIndex] = path.visited;

    element = document.getElementById(`${rowIndex}-${columnIndex}`);

    setTimeout(() => {
      let result = attemptToSolve(newArr, [], { row: row(rowIndex), column: column(columnIndex + 1) }, goal);
      if (result) drawMaze(newArr, "#solve");
    }, 0);
    setTimeout(() => {
      let result = attemptToSolve(newArr, [], { row: row(rowIndex - 1), column: column(columnIndex) }, goal);
      if (result) drawMaze(newArr, "#solve");
    }, 0);
    setTimeout(() => {
      let result = attemptToSolve(newArr, [], { row: row(rowIndex + 1), column: column(columnIndex) }, goal);
      if (result) drawMaze(newArr, "#solve");
    }, 0);
    setTimeout(() => {
      let result = attemptToSolve(newArr, [], { row: row(rowIndex), column: column(columnIndex - 1) }, goal);
      if (result) drawMaze(newArr, "#solve");
    }, 0);

    if (element) element.style.backgroundColor = "gray";
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
  for (var j = 0; j < x + 1; j++) horiz[j] = [];
  var verti = [];
  for (var j = 0; j < x + 1; j++) verti[j] = [];
  var here = [Math.floor(Math.random() * x), Math.floor(Math.random() * y)];
  var path = [here];
  var unvisited = [];
  for (var j = 0; j < x + 2; j++) {
    unvisited[j] = [];
    for (var k = 0; k < y + 1; k++) unvisited[j].push(j > 0 && j < x + 1 && k > 0 && (j != here[0] + 1 || k != here[1] + 1));
  }
  while (0 < n) {
    var potential = [
      [here[0] + 1, here[1]],
      [here[0], here[1] + 1],
      [here[0] - 1, here[1]],
      [here[0], here[1] - 1],
    ];
    var neighbors = [];
    for (var j = 0; j < 4; j++) if (unvisited[potential[j][0] + 1][potential[j][1] + 1]) neighbors.push(potential[j]);
    if (neighbors.length) {
      n = n - 1;
      var next = neighbors[Math.floor(Math.random() * neighbors.length)];
      unvisited[next[0] + 1][next[1] + 1] = false;
      if (next[0] == here[0]) horiz[next[0]][(next[1] + here[1] - 1) / 2] = true;
      else verti[(next[0] + here[0] - 1) / 2][next[1]] = true;
      path.push((here = next));
    } else here = path.pop();
  }
  return { x: x, y: y, horiz: horiz, verti: verti };
}

function display(m) {
  var text = [];
  for (var j = 0; j < m.x * 2 + 1; j++) {
    var line = [];
    if (0 == j % 2)
      for (var k = 0; k < m.y * 4 + 1; k++)
        if (0 == k % 4) line[k] = "*";
        else if (j > 0 && m.verti[j / 2 - 1][Math.floor(k / 4)]) line[k] = "S";
        else line[k] = "J";
    else
      for (var k = 0; k < m.y * 4 + 1; k++)
        if (0 == k % 4)
          if (k > 0 && m.horiz[(j - 1) / 2][k / 4 - 1]) line[k] = "T";
          else line[k] = "*";
        else line[k] = "S";
    if (0 == j) line[1] = line[2] = line[3] = "S";
    if (m.x * 2 - 1 == j) line[4 * m.y] = " ";
    text.push(line.join("") + "\r\n");
  }
  return text.join("");
}

let out = display(mazeStucture(30, 110));

let enhanced = out
  .replace(/SSS/gi, "1")
  .replace(/JJJ/gi, "0")
  .replace(/\*/gi, "0")
  .replace(/T/gi, "1")
  .replace(/ /gi, "1")
  .split("\r\n")
  .map((x) => x.split(""))
  .map((x) => x.map((el) => Number(el)));
console.log(enhanced);

drawMaze(enhanced, "#puzzel");

attemptToSolve(enhanced, [], { row: 0, column: 1 }, { row: enhanced.length - 3, column: enhanced[0].length - 1 });
