const chessweb = {}

chessweb.Color = {
    White: Symbol("White"),
    Black: Symbol("Black"),
    Green: Symbol("Green"),
    Red: Symbol("Red")
}
chessweb.Color.FromInt = [
    chessweb.Color.White, chessweb.Color.Black, chessweb.Color.Green, chessweb.Color.Red //0-1-2-3
]

chessweb.PieceType = {
    Empty: Symbol("Empty"),
    Pawn: Symbol("Pawn"),
    King: Symbol("King"),
    Queen: Symbol("Queen"),
    Rook: Symbol("Rook"),
    Knight: Symbol("Knight"),
    Bishop: Symbol("Bishop")
}
chessweb.PieceType.FromInt = [
    chessweb.PieceType.Empty, chessweb.PieceType.Pawn, chessweb.PieceType.King, chessweb.PieceType.Queen, chessweb.PieceType.Rook, chessweb.PieceType.Knight, chessweb.PieceType.Bishop
]

chessweb.newGame = () => {
    return Module._chessweb_new_game();
},

chessweb.disposeGame = (game) => {
    return Module._chessweb_dispose_game(game);
},

chessweb.getGameRules = (game) => {
    let rules = _chessweb_game_getrules(game);
    return {
        board_width: Module.HEAPU8[rules + 0],
        board_height: Module.HEAPU8[rules + 1],
        ignore_checks: Module.HEAPU8[rules + 2],
        allow_castle: Module.HEAPU8[rules + 3],
        allow_passant: Module.HEAPU8[rules + 4]
    };
},

chessweb.getColorToMove = (game) => {
    return chessweb.Color.FromInt[Module._chessweb_get_color_to_move(game)];
},

chessweb.getPieceAtSquare = (game, row, col) => {
    const piece = Module._chessweb_get_piece_at_pos(game, row, col);
    return {
        type: chessweb.PieceType.FromInt[Module._chessweb_get_piece_type(piece)],
        color: chessweb.Color.FromInt[Module._chessweb_get_piece_color(piece)],
        royalty: Module._chessweb_get_piece_royalty(piece)
    }
}

chessweb.getSquare = (square) => {
    return {
        row: Module._chessweb_get_square_row(square),
        col: Module._chessweb_get_square_col(square)
    }
}

chessweb.getMove = (move) => {
    return {
        from: chessweb.getSquare(Module._chessweb_get_move_origin(move)),
        to: chessweb.getSquare(Module._chessweb_get_move_destination(move))
    }
}

chessweb.getPossibleMovesFrom = (game, row, col) => {
    const movebuf = Module._chessweb_get_possible_moves_from(game, row, col);
    let i = 0;
    let nextMove = chessweb.getMove(Module._chessweb_get_move_in_buffer(movebuf, i));
    let moves = [];
    while(nextMove.from.col != -1){
        moves[i] = nextMove;

        i++;
        nextMove = chessweb.getMove(Module._chessweb_get_move_in_buffer(movebuf, i));
    }
    Module._chessweb_free_move_buffer(movebuf);
    return moves;
}
