const chessweb = {}

chessweb.Color = {
    White: Symbol("White"),
    Black: Symbol("Black"),
    Green: Symbol("Green"),
    Red: Symbol("Red")
};
chessweb.Color.ByInt = [
    chessweb.Color.White, chessweb.Color.Black, chessweb.Color.Green, chessweb.Color.Red //0-1-2-3
];

chessweb.PieceType = {
    Empty: Symbol("Empty"),
    Pawn: Symbol("Pawn"),
    King: Symbol("King"),
    Queen: Symbol("Queen"),
    Rook: Symbol("Rook"),
    Knight: Symbol("Knight"),
    Bishop: Symbol("Bishop")
};
chessweb.PieceType.ByInt = [
    chessweb.PieceType.Empty, chessweb.PieceType.Pawn, chessweb.PieceType.King, chessweb.PieceType.Queen, chessweb.PieceType.Rook, chessweb.PieceType.Knight, chessweb.PieceType.Bishop
];

chessweb.PositionState = {
    Normal: Symbol("Normal"),
    Checked: Symbol("Checked"),
    Stalemated: Symbol("Stalemated"),
    Checkmated: Symbol("Checkmated")
};
chessweb.PositionState.ByInt = [
    chessweb.PositionState.Normal, chessweb.PositionState.Checked, chessweb.PositionState.Stalemated, chessweb.PositionState.Checkmated
];

chessweb.newGame = () => {
    return Module._chessweb_new_game();
};

chessweb.disposeGame = (game) => {
    return Module._chessweb_dispose_game(game);
};

chessweb._rules_order = [
    "board_width",
    "board_height",
    "ignore_checks",
    "capture_own",
    "sideways_pawns",
    "kangaroo_pawns",
    "torpedo_pawns",
    "capture_all",
    "allow_castle",
    "allow_passant"
]

chessweb.getGameRules = (game) => {
    let rules = Module._chessweb_game_getrules(game);
    return {
        board_width: Module.HEAPU8[rules + chessweb._rules_order.indexOf("board_width")],
        board_height: Module.HEAPU8[rules + chessweb._rules_order.indexOf("board_height")],
        ignore_checks: Module.HEAPU8[rules + chessweb._rules_order.indexOf("ignore_checks")],
        capture_own: Module.HEAPU8[rules + chessweb._rules_order.indexOf("capture_own")],
        sideways_pawns: Module.HEAPU8[rules + chessweb._rules_order.indexOf("sideways_pawns")],
        kangaroo_pawns: Module.HEAPU8[rules + chessweb._rules_order.indexOf("kangaroo_pawns")],
        torpedo_pawns: Module.HEAPU8[rules + chessweb._rules_order.indexOf("torpedo_pawns")],
        capture_all: Module.HEAPU8[rules + chessweb._rules_order.indexOf("capture_all")],
        allow_castle: Module.HEAPU8[rules + chessweb._rules_order.indexOf("allow_castle")],
        allow_passant: Module.HEAPU8[rules + chessweb._rules_order.indexOf("allow_passant")]
    };
};

chessweb.setGameRules = (game, rules) => {
    let rules_ptr = Module._chessweb_game_getrules(game);
    Module.HEAPU8[rules_ptr + chessweb._rules_order.indexOf("board_width")] = rules.board_width;
    Module.HEAPU8[rules_ptr + chessweb._rules_order.indexOf("board_height")] = rules.board_height;
    Module.HEAPU8[rules_ptr + chessweb._rules_order.indexOf("ignore_checks")] = rules.ignore_checks;
    Module.HEAPU8[rules_ptr + chessweb._rules_order.indexOf("capture_own")] = rules.capture_own;
    Module.HEAPU8[rules_ptr + chessweb._rules_order.indexOf("sideways_pawns")] = rules.sideways_pawns;
    Module.HEAPU8[rules_ptr + chessweb._rules_order.indexOf("kangaroo_pawns")] = rules.kangaroo_pawns;
    Module.HEAPU8[rules_ptr + chessweb._rules_order.indexOf("torpedo_pawns")] = rules.torpedo_pawns;
    Module.HEAPU8[rules_ptr + chessweb._rules_order.indexOf("capture_all")] = rules.capture_all;
    Module.HEAPU8[rules_ptr + chessweb._rules_order.indexOf("allow_castle")] = rules.allow_castle;
    Module.HEAPU8[rules_ptr + chessweb._rules_order.indexOf("allow_passant")] = rules.allow_passant;
};

chessweb.getColorToMove = (game) => {
    return chessweb.Color.ByInt[Module._chessweb_get_color_to_move(game)];
};

chessweb.getPieceAtSquare = (game, row, col) => {
    const piece = Module._chessweb_get_piece_at_pos(game, row, col);
    return {
        type: chessweb.PieceType.ByInt[Module._chessweb_get_piece_type(piece)],
        color: chessweb.Color.ByInt[Module._chessweb_get_piece_color(piece)],
        royalty: Module._chessweb_get_piece_royalty(piece)
    }
};

chessweb.getSquare = (square) => {
    return {
        row: Module._chessweb_get_square_row(square),
        col: Module._chessweb_get_square_col(square)
    }
};

chessweb.getMove = (move) => {
    return {
        from: chessweb.getSquare(Module._chessweb_get_move_origin(move)),
        to: chessweb.getSquare(Module._chessweb_get_move_destination(move))
    }
};

chessweb.getLegalMovesFrom = (game, row, col) => {
    const movebuf = Module._chessweb_get_legal_moves_from(game, row, col);
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
};

chessweb.playMove = (game, move, promotion) => {
    Module._chessweb_play_move(game, move.from.row, move.from.col, move.to.row, move.to.col, chessweb.PieceType.ByInt.indexOf(promotion))
};

chessweb.getPositionState = (game) => {
    return chessweb.PositionState.ByInt[Module._chessweb_position_state(game)];
};
