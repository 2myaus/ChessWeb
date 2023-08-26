const board = document.getElementsByClassName("board")[0];

function getSquare(row, col){
    return board.children[row].children[col];
}

function getSquarePosition(square_elem){
    let col = Array.from(square_elem.parentElement.children).indexOf(square_elem);
    let row = Array.from(square_elem.parentElement.parentElement.children).indexOf(square_elem.parentElement);

    return {
        row: row,
        col: col
    };
}

function getSquareParent(elem){
    if(!board.contains(elem)) return null;
    if(elem.classList.contains("square")) return elem;
    if(elem == board) return null;
    return getSquareParent(elem.parentElement);
}

let setTargetSquare;

function getPieceImage(piece){
    pieceName = "";
    switch(piece.type){
        case chessweb.PieceType.Bishop:
            pieceName+="b";
            break;
        case chessweb.PieceType.King:
            pieceName+="k";
            break;
        case chessweb.PieceType.Knight:
            pieceName+="n";
            break;
        case chessweb.PieceType.Pawn:
            pieceName+="p";
            break;
        case chessweb.PieceType.Queen:
            pieceName+="q";
            break;
        case chessweb.PieceType.Rook:
            pieceName+="r";
            break;
        default:
            break;
    }
    if(piece.color == chessweb.Color.White){
        pieceName += "w";
    }
    else if(piece.color == chessweb.Color.Black){
        pieceName += "b";
    }
    else if(piece.color == chessweb.Color.Green){
        pieceName += "g";
    }
    else if(piece.color == chessweb.Color.Red){
        pieceName += "r"
    }
    return pieceName + ".png";
}

let game;
let rules;

let refreshBoard;
let clickSquare;

function resetGame(){
    if(game){
        chessweb.disposeGame(game);
    }
    game = chessweb.newGame();
    rules = chessweb.getGameRules(game);

    board.innerHTML = "";

    for(let rownum = 0; rownum < rules.board_height; rownum++){
        const row = document.createElement("div");
        row.classList.add("row");
        board.appendChild(row);
        for(let col = 0; col < rules.board_width; col++){
            const square = document.createElement("div");
            square.classList.add("square");
            row.appendChild(square);
        }
    }

    refreshBoard();
}

Module.onRuntimeInitialized = function () {

    refreshBoard = () => {
        for(let rownum = 0; rownum < rules.board_height; rownum++){
            for(let col = 0; col < rules.board_width; col++){
                const piece = chessweb.getPieceAtSquare(game, rownum, col);
                const square = getSquare(rownum, col);
                square.innerHTML = "";
                if(piece.type != chessweb.PieceType.Empty){
                    const image = document.createElement("img");
                    image.src = "images/pieces/" + getPieceImage(piece);
                    square.appendChild(image);
                }
            }
        }
        const posState = chessweb.getPositionState(game);
        if(posState == chessweb.PositionState.Checkmated){
            alert("Checkmate!");
        }
        else if(posState == chessweb.PositionState.Stalemated){
            alert("Stalemate!")
        }
    }

    setTargetSquare = (square) => {
        let squares = document.querySelectorAll(".square.target");
        squares.forEach((removing) => {
            if(removing != square){
                removing.classList.remove("target");
            }
        });
        if(square && !square.classList.contains("target")){
            square.classList.add("target");
            let squarePos = getSquarePosition(square);
            let possible_move_squares = document.querySelectorAll(".square.possible-move");
            possible_move_squares.forEach((square) => {
                square.classList.remove("possible-move");
            });
            let moves = chessweb.getLegalMovesFrom(game, squarePos.row, squarePos.col);
            moves.forEach((move) => {
                getSquare(move.to.row, move.to.col).classList.add("possible-move");
            });
        }
        else if(!square){
            let possible_move_squares = document.querySelectorAll(".square.possible-move");
            possible_move_squares.forEach((square) => {
                square.classList.remove("possible-move");
            });
        }
    }

    clickSquare = (square) => {
        if(!square.classList.contains("possible-move")){
            setTargetSquare(square);
        }
        else{
            square_from = document.querySelector(".square.target");
            if(square_from){
                square_to_pos = getSquarePosition(square);
                square_from_pos = getSquarePosition(square_from);
                move = {
                    from: square_from_pos,
                    to: square_to_pos
                };
                chessweb.playMove(game, move);
                setTargetSquare(null);
                refreshBoard();
            }
        }
    }
    resetGame();
};

board.addEventListener("mousedown", (e) => {
    const targetSquare = getSquareParent(e.target);
    if(targetSquare){
        clickSquare(targetSquare);
    }
});
