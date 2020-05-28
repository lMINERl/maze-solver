document.querySelector("body").setAttribute("controls", "");
let maze: number[][] = [];
maze.push([0, 0, 0, 0, 0, 0, 0, 1, 0]);
maze.push([0, 1, 1, 1, 1, 1, 0, 1, 0]);
maze.push([0, 1, 0, 0, 0, 1, 0, 1, 0]);
maze.push([1, 1, 1, 1, 0, 1, 1, 1, 0]);
maze.push([0, 0, 0, 1, 0, 0, 0, 0, 0]);
maze.push([0, 1, 1, 1, 1, 1, 1, 1, 0]);
maze.push([0, 0, 0, 0, 0, 0, 0, 1, 0]);

const createDiv = (num: number, row: number = -1, column: number = -1) => {
  let div = document.createElement("div");
  div.style.backgroundColor = num == path.unVisited ? "white" : num == path.visited ? "red" : "black";
  div.textContent = "";
  div.style.width = "80px";
  div.style.height = "10px";
  div.setAttribute("id", `${row}-${column}`);

  return div;
};

const drawMaze = (twoDimNumArray: number[][], selector: string) => {
  let puzzel = document.querySelector(selector);
  twoDimNumArray.forEach((row: number[], rowIndx: number) => {
    let s = puzzel.appendChild(createDiv(1, rowIndx));
    s.style.display = "flex";
    row.forEach((column: number, columnIndex: number) => {
      s.appendChild(createDiv(column, rowIndx, columnIndex));
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

const setRow = (condition: boolean) => (num: number): number => (num > -1 && condition ? num : -1);
const setColumn = setRow;

let solverFlag = false;
const attemptToSolve = (oldArr: number[][], newArr: number[][], rowNum: number, columnNum: number) => {
  if (solverFlag) {
    return;
  }

  const row = setRow(oldArr.length > rowNum);
  const rowIndex = row(rowNum);
  if (rowIndex < 0) {
    return;
  }

  const column = setColumn(oldArr[rowNum].length > columnNum);
  const columnIndex = column(columnNum);
  if (columnIndex < 0) {
    return;
  }
  //goal
  if ((rowIndex == 0 && columnIndex == 8) || (rowIndex == 6 && columnIndex == 8)) {
    solverFlag = true;
    return true;
  }
  let element: HTMLElement = null;

  if (oldArr[rowIndex][columnIndex] === path.unVisited) {
    newArr = [...oldArr];
    newArr[rowIndex] = [...oldArr[rowIndex]];
    newArr[rowIndex][columnIndex] = path.visited;

    element = document.getElementById(`${rowIndex}-${columnIndex}`);

    setTimeout(() => attemptToSolve(newArr, [], row(rowIndex + 1), column(columnIndex)), 100);
    setTimeout(() => attemptToSolve(newArr, [], row(rowIndex - 1), column(columnIndex)), 100);
    setTimeout(() => attemptToSolve(newArr, [], row(rowIndex), column(columnIndex + 1)), 100);
    setTimeout(() => attemptToSolve(newArr, [], row(rowIndex), column(columnIndex - 1)), 100);

    if (element) element.style.backgroundColor = "gray";
  }
};

drawMaze(maze, "#puzzel");
attemptToSolve(maze, [], 3, 0);
