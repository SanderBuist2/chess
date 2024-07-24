const chessBoard = document.getElementById("chessBoard");
const chesspieces = [];
const tiles = [];
const fromTile = [];
const legalEndTiles = [];

let blackturn = false;
let checked = false;
let checkMate = false;

const KingsChecked = (color) => {
  const attackers = checkCheck(color);
  if (attackers.length > 1) checkMate = true;
  else if (attackers.length > 0) {
    mateCheck(color, attackers);
    if (legalEndTiles.length == 0) checkMate = true;
    else checked = true;
  }
  if (checked) console.log(color + " is checked");
  if (checkMate) console.log(color + " is checkemate");
};

const isBetween = (x, big, small) => {
  return x > small && x < big;
};

const checkAttacked = (coords, color) => {
  let enemy = 1;
  if (!isBlack(color)) enemy = 0;

  for (let i = 1; i < chesspieces[enemy].length; i++) {
    if (
      !chesspieces[enemy][i].beaten &&
      checkMove(chesspieces[enemy][i].coords, coords)
    )
      return true;
  }
  return false;
};

const checkCheck = (color, skipTile = []) => {
  let attacker = 1;
  let defender = 0;
  const attackers = [];

  if (!isBlack(color)) {
    attacker = 0;
    defender = 1;
  }
  for (let i = 0; i < chesspieces[attacker].length; i++) {
    if (
      !chesspieces[attacker][i].beaten &&
      checkMove(
        chesspieces[attacker][i].coords,
        chesspieces[defender][0].coords,
        skipTile
      )
    )
      attackers.push(chesspieces[attacker][i]);
  }
  return attackers;
};

const biggestNumber = (a, b) => {
  if (a > b) return a;
  else return b;
};

const addOrSubstract = (x) => {
  if (x > 0) return 1;
  if (x < 0) return -1;
  return x;
};

const blockable = (attacker, king, color) => {
  const verticalDistance = attacker.coords[0] - king.coords[0];
  const horizontalDistance = attacker.coords[1] - king.coords[1];
  const biggest = Math.abs(biggestNumber(verticalDistance, horizontalDistance));
  const betweentiles = [];

  for (let i = 1; i < biggest; i++) {
    const coords = [];
    coords[0] = attacker.coords[0] + addOrSubstract(-verticalDistance) * i;
    coords[1] = attacker.coords[1] + addOrSubstract(-horizontalDistance) * i;
    betweentiles.push(coords);
  }
  betweentiles.forEach((square) => {
    if (checkAttacked(square, color)) legalEndTiles.push(square);
  });
};

const checkKingSurrounding = (coords, color) => {
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      const newCoords = [coords[0] + i, coords[1] + j];
      if (
        isBetween(newCoords[0], 8, -1) &&
        isBetween(newCoords[1], 8, -1) &&
        checkMove(coords, newCoords) &&
        !checkAttacked(newCoords, color)
      ) {
        newCoords[2] = true;
        legalEndTiles.push(newCoords);
      }
    }
  }
};

const canBeatAttacker = (color, attackers) => {
  if (!isBlack(color))
    if (checkAttacked(attackers[0].coords, "black"))
      legalEndTiles.push[attackers[0].coords];
    else if (checkAttacked(attackers[0].coords, "white"))
      legalEndTiles.push(attackers[0].coords);
};

const canBeBlocked = (color, attackers) => {
  if (!isBlack(color)) {
    blockable(attackers[0], chesspieces[1][0], "black");
  } else {
    blockable(attackers[0], chesspieces[0][0], "white");
  }
};

const mateCheck = (color, attackers) => {
  let coords = chesspieces[0][0].coords;
  if (!isBlack(color)) coords = chesspieces[1][0].coords;

  checkKingSurrounding(coords, color);
  canBeatAttacker(color, attackers);
  canBeBlocked(color, attackers);
};

const setSprite = (sprites, color) => {
  const imgItem = document.createElement("img");
  imgItem.setAttribute("src", sprites.black);
  if (!isBlack(color)) imgItem.setAttribute("src", sprites.white);
  return imgItem;
};

const promotePawn = (tile) => {
  const newPiece = createPiece(pieces[1], tile.coords);
  tile.piece.beaten = true;
  tile.piece = newPiece;
  if (isBlack(tile.color)) chesspieces[0].push(newPiece);
  else chesspieces[1].push(newPiece);
};

const promote = (tile) => {
  if (!isBlack(tile.color) && tile.coords[0] == 0) promotePawn(tile);
  if (isBlack(tile.color) && tile.coords[0] == 7) promotePawn(tile);
};

const clearTile = (tile) => {
  tile.piece = "empty";
  tile.tile.innerHTML = "";
  tile.color = "empty";
};

const moveTile = (fromTile, toTile) => {
  toTile.piece = fromTile.piece;
  toTile.piece.coords = toTile.coords;
  toTile.color = fromTile.color;
  clearTile(fromTile);
};

const move = (from, towards) => {
  checked = false;
  legalEndTiles.length = 0;
  if (towards.piece) {
    towards.piece.beaten = true;
    towards.tile.innerHTML = "";
  }
  moveTile(from, towards);
  if (towards.piece.type.name == "pawn") promote(towards);
  towards.tile.appendChild(
    setSprite(towards.piece.type.sprites, towards.color)
  );
  if (blackturn) KingsChecked("white");
  else KingsChecked("black");
  blackturn = !blackturn;
};

const occupiedSameColor = (from, towards) => {
  return towards.piece != "empty" && from.color == towards.color;
};

const moveToZero = (x) => {
  if (x > 0) return x - 1;
  if (x < 0) return x + 1;
  return x;
};

const checkRookPath = (from, towards, skipTile = []) => {
  let verticalDistance = towards[1] - from[1];
  let horizontalDistance = towards[0] - from[0];

  const current = [];
  current[1] = from[1];
  current[0] = from[0];

  while (!(verticalDistance == 0 && horizontalDistance == 0)) {
    if (verticalDistance == 0) {
      current[0] = current[0] + addOrSubstract(horizontalDistance) * 1;
      horizontalDistance = moveToZero(horizontalDistance);
    } else {
      current[1] = current[1] + addOrSubstract(verticalDistance) * 1;
      verticalDistance = moveToZero(verticalDistance);
    }
    if (
      skipTile.length == 0 ||
      !(skipTile[0] == current[0] && skipTile[1] == current[1])
    ) {
      if (current[0] == towards[0]) return true;
      if (!emptyTile(current[0], current[1])) return false;
    }
  }
  return true;
};

const emptyTile = (xCoord, yCoord) => {
  return tiles[xCoord][yCoord].piece == "empty";
};

const checkBisshopPath = (from, towards, skipTile = []) => {
  let verticalDistance = towards[1] - from[1];
  let horizontalDistance = towards[0] - from[0];

  const current = [];
  current[1] = from[1];
  current[0] = from[0];

  while (verticalDistance != 0) {
    current[1] = current[1] + addOrSubstract(verticalDistance) * 1;
    verticalDistance = moveToZero(verticalDistance);
    current[0] = current[0] + addOrSubstract(horizontalDistance) * 1;

    if (
      skipTile.length == 0 ||
      !(skipTile[0] == current[0] && skipTile[1] == current[1])
    ) {
      if (current[0] == towards[0]) return true;
      if (!emptyTile(current[0], current[1])) return false;
    }
  }
  return true;
};

const checkPawnPath = (from, towards) => {
  const steps = towards[0] - from[0];
  const sideways = Math.abs(towards[1] - from[1]);
  const endTile = tiles[towards[0]][towards[1]];
  const noEnd = endTile.piece == "empty";

  if (steps == 2 || steps == -2) {
    if (steps == 2)
      return tiles[from[0] + 1][from[1]].piece == "empty" && noEnd;

    if (steps == -2)
      return tiles[from[0] - 1][from[1]].piece == "empty" && noEnd;
  }
  if (
    (sideways == 0 && endTile.piece != "empty") ||
    (sideways == 1 && endTile.piece == "empty")
  )
    return false;
  return true;
};

const emptyPath = (piece, from, towards, skipTile = []) => {
  const piecename = piece.type.name;
  if (piecename == "rook") return checkRookPath(from, towards, skipTile);
  if (piecename == "bisshop") return checkBisshopPath(from, towards, skipTile);
  if (piecename == "queen") {
    if (from[0] == towards[0] || from[1] == towards[1])
      return checkRookPath(from, towards, skipTile);
    else return checkBisshopPath(from, towards, skipTile);
  }
  if (piecename == "pawn") return checkPawnPath(from, towards);
  return true;
};

const isLegalEndTile = (coords, isking = false) => {
  let legalmove = false;
  legalEndTiles.forEach((position) => {
    if (coords[0] == position[0] && coords[1] == position[1]) {
      if (position[2]) {
        if (isking) legalmove = true;
      } else legalmove = true;
    }
  });
  return legalmove;
};

const checkMove = (fromTile, toTile, skipTile = []) => {
  const startTile = tiles[fromTile[0]][fromTile[1]];
  const endTile = tiles[toTile[0]][toTile[1]];
  const isKing = startTile.piece.type.name == "king";

  let legalmove = startTile.piece.type.check(
    fromTile,
    toTile,
    isBlack(startTile.color)
  );

  if (legalmove && checked) legalmove = isLegalEndTile(toTile, isKing);
  if (legalmove) legalmove = !occupiedSameColor(startTile, endTile);
  if (legalmove)
    legalmove = emptyPath(startTile.piece, fromTile, toTile, skipTile);

  if (legalmove && isKing)
    legalmove = !checkAttacked(endTile.coords, startTile.color);

  return legalmove;
};

const isBlack = (color) => {
  return color == "black";
};

const pick = (xCoord, yCoord) => {
  const pickedTile = tiles[yCoord][xCoord];
  if (fromTile.length == 0) {
    if (
      !(pickedTile.piece == "empty" || isBlack(pickedTile.color) != blackturn)
    ) {
      fromTile.push(yCoord, xCoord);
      pickedTile.tile.classList.add("picked");
    }
  } else {
    const startTile = tiles[fromTile[0]][fromTile[1]];
    startTile.tile.classList.remove("picked");

    if (fromTile[0] == yCoord && fromTile[1] == xCoord) fromTile.length = 0;
    else if (startTile.color == pickedTile.color) {
      startTile.tile.classList.remove("picked");
      fromTile.length = 0;
      fromTile.push(yCoord, xCoord);
      pickedTile.tile.classList.add("picked");
      return;
    } else if (checkMove(fromTile, [yCoord, xCoord])) {
      if (checkCheck(startTile.color, fromTile).length == 0)
        move(startTile, pickedTile);
    }
    fromTile.length = 0;
    return;
  }
};

const creatTile = (divItem, coords) => {
  return {
    tile: divItem,
    piece: "empty",
    color: "empty",
    coords: coords,
  };
};

const generateBoard = () => {
  const board = document.createElement("div");
  let white = true;
  for (let i = 0; i < 8; i++) {
    const boardRow = document.createElement("div");
    boardRow.classList.add("chessRow");
    const tileRow = [];
    for (let j = 0; j < 8; j++) {
      const divItem = document.createElement("div");
      divItem.classList.add("tile");

      if (white) divItem.classList.add("whiteTile");
      else divItem.classList.add("blackTile");
      white = !white;
      divItem.addEventListener("click", () => {
        pick(j, i);
      });
      tileRow.push(creatTile(divItem, [i, j]));
      boardRow.appendChild(divItem);
    }
    tiles.push(tileRow);
    board.appendChild(boardRow);
    white = !white;
  }
  return board;
};

const createPiece = (piece, coords) => {
  const chesspiece = {
    type: piece,
    coords: coords,
  };
  return chesspiece;
};

const addOnePiece = (piece, black) => {
  const coords = [];
  coords[0] = piece.startingCoords[0];
  coords[1] = piece.startingCoords[1];
  if (!black) coords[0] = 7 - coords[0];
  return createPiece(piece, coords);
};

const addSecondPiece = (piece, black) => {
  const secondpiece = addOnePiece(piece, black);
  secondpiece.coords[1] = 7 - secondpiece.coords[1];
  return secondpiece;
};

const addPawn = (piece, black, coord) => {
  const pawnPiece = addOnePiece(piece, black);
  pawnPiece.coords[1] = coord;
  return pawnPiece;
};

const addStartingPieces = (black) => {
  const startingPieces = [];
  pieces.forEach((piece) => {
    startingPieces.push(addOnePiece(piece, black));
    if (piece.name == "pawn") {
      for (let i = 1; i < 8; i++) {
        startingPieces.push(addPawn(piece, black, i));
      }
    } else if (piece.name != "king" && piece.name != "queen")
      startingPieces.push(addSecondPiece(piece, black));
  });
  return startingPieces;
};

chessBoard?.appendChild(generateBoard());
chesspieces.push(addStartingPieces(true));
chesspieces.push(addStartingPieces(false));

chesspieces.forEach((color, indexX) => {
  color.forEach((piece) => {
    let color = "black";
    if (indexX == 1) color = "white";
    tiles[piece.coords[0]][piece.coords[1]].color = color;
    tiles[piece.coords[0]][piece.coords[1]].tile.appendChild(
      setSprite(piece.type.sprites, color)
    );
    tiles[piece.coords[0]][piece.coords[1]].piece = piece;
  });
});
