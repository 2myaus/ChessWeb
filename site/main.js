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

let refreshBoardPieces;
let clickSquare;

function resetBoard(){
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

    refreshBoardPieces();
}

function resetGame(){
    if(game){
        chessweb.disposeGame(game);
        game = chessweb.newGame();
    }
    else{
        game = chessweb.newGame();
        refreshRules();
    }

    updateRules();

    resetBoard();
}

const rules_form = document.getElementById("gamerules");

rules_form.elements["submit"].onclick = () => {
    updateRules();
}

function refreshRules(){
    const rules = chessweb.getGameRules(game);

    (Object.entries(rules)).forEach(([key, value]) => {
        const input = rules_form.elements[key];
        if(input.type == "checkbox"){
            input.checked = value;
        }
        else if(input.type == "text"){
            input.value = value;
        }
    });
}

function updateRules(){
    const start_rules = chessweb.getGameRules(game);

    const rules = {...start_rules};

    rules.board_width = parseInt(rules_form.elements["board_width"].value);
    rules.board_height = parseInt(rules_form.elements["board_height"].value);

    rules.ignore_checks = (rules_form.elements["ignore_checks"].checked ? 1 : 0);
    rules.capture_own = (rules_form.elements["capture_own"].checked ? 1 : 0);
    rules.sideways_pawns = (rules_form.elements["sideways_pawns"].checked ? 1 : 0);
    rules.kangaroo_pawns = (rules_form.elements["kangaroo_pawns"].checked ? 1 : 0);
    rules.torpedo_pawns = (rules_form.elements["torpedo_pawns"].checked ? 1 : 0);
    rules.capture_all = (rules_form.elements["capture_all"].checked ? 1 : 0);
    rules.allow_castle = (rules_form.elements["allow_castle"].checked ? 1 : 0);
    rules.allow_passant = (rules_form.elements["allow_passant"].checked ? 1 : 0);

    if(!rules.board_width){
        rules.board_width = start_rules.board_width;
    }
    if(!rules.board_height){
        rules.board_height = start_rules.board_height;
    }

    chessweb.setGameRules(game, rules);

    refreshRules();

    resetBoard();
}

Module.onRuntimeInitialized = function () {

    refreshBoardPieces = () => {
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
                refreshBoardPieces();
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
