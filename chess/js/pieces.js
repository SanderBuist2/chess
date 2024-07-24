const rookCheck = (oldCoord, newCoord) => {
  if (oldCoord[0] == newCoord[0]) return true;
  if (oldCoord[1] == newCoord[1]) return true;
  return false;
};

const bisshopCheck = (oldCoord, newCoord) => {
  let difOne = Math.abs(oldCoord[0] - newCoord[0]);
  let difTwo = Math.abs(oldCoord[1] - newCoord[1]);
  if (difOne == difTwo) return true;
  return false;
};

const queenCheck = (oldCoord, newCoord) => {
  if (bisshopCheck(oldCoord, newCoord) || rookCheck(oldCoord, newCoord))
    return true;
  return false;
};

const kingCheck = (oldCoord, newCoord) => {
  const difOne = oldCoord[0] - newCoord[0];
  const difTwo = oldCoord[1] - newCoord[1];
  if (difOne > -2 && difOne < 2) if (difTwo > -2 && difTwo < 2) return true;

  return false;
};

const pawnCheck = (oldCoord, newCoord, black) => {
  const difOne = oldCoord[0] - newCoord[0];
  const difTwo = oldCoord[1] - newCoord[1];
  if (difOne <= 2 && difOne >= -2 && difTwo <= 1 && difTwo >= -1) {
    if (difOne == 1 || difOne == -1) {
      if (black && difOne < 0) return true;
      if (!black && difOne > 0) return true;
    }
    if (oldCoord[0] == 1 || oldCoord[0] == 6) {
      if (black && difOne < 0 && difTwo == 0) return true;
      if (!black && difOne > 0 && difTwo == 0) return true;
    }
  }
  return false;
};

const knightCheck = (oldCoord, newCoord) => {
  let difOne = Math.abs(oldCoord[0] - newCoord[0]);
  let difTwo = Math.abs(oldCoord[1] - newCoord[1]);
  if ((difOne == 1 && difTwo == 2) || (difOne == 2 && difTwo == 1)) return true;

  return false;
};

const pieces = [
  {
    name: "king",
    check: kingCheck,
    value: 10,
    sprites: {
      black: "./img/BlackKing.svg",
      white: "./img/WhiteKing.svg",
    },
    startingCoords: [0, 4],
    beaten: false,
  },
  {
    name: "queen",
    check: queenCheck,
    value: 10,
    sprites: {
      black: "./img/BlackQueen.svg",
      white: "./img/WhiteQueen.svg",
    },
    startingCoords: [0, 3],
    beaten: false,
  },
  {
    name: "rook",
    check: rookCheck,
    value: 8,
    sprites: {
      black: "./img/BlackRook.svg",
      white: "./img/WhiteRook.svg",
    },
    startingCoords: [0, 0],
    beaten: false,
  },
  {
    name: "bisshop",
    check: bisshopCheck,
    value: 5,
    sprites: {
      black: "./img/BlackBisshop.svg",
      white: "./img/WhiteBisshop.svg",
    },
    startingCoords: [0, 2],
    beaten: false,
  },
  {
    name: "knight",
    check: knightCheck,
    value: 3,
    sprites: {
      black: "./img/BlackKnight.svg",
      white: "./img/WhiteKnight.svg",
    },
    startingCoords: [0, 1],
    beaten: false,
  },
  {
    name: "pawn",
    check: pawnCheck,
    value: 1,
    sprites: {
      black: "./img/BlackPawn.svg",
      white: "./img/WhitePawn.svg",
    },
    startingCoords: [1, 0],
    beaten: false,
  },
];
