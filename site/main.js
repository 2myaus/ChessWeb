const board = document.getElementsByClassName("board")[0];

function getSquare(row, col){
    return board.children[row].children[col];
}

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

let refreshBoard;

Module.onRuntimeInitialized = function () {
    game = chessweb.newGame();

    const rules = chessweb.getGameRules(game);

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
    }

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
};
