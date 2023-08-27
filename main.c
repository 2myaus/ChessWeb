#include <stdlib.h>
#include <stdint.h>

#include "libchesscat.h"


int8_t chessweb_get_square_row(chesscat_Square *square){
    return square->row;
}

int8_t chessweb_get_square_col(chesscat_Square *square){
    return square->col;
}

chesscat_Square *chessweb_get_move_origin(chesscat_Move *move){
    return &(move->from);
}

chesscat_Square *chessweb_get_move_destination(chesscat_Move *move){
    return &(move->to);
}



chesscat_Game *chessweb_new_game(){
    chesscat_Game *game_ptr = malloc(sizeof(chesscat_Game));
    chesscat_set_default_game(game_ptr);
    //chesscat_set_game_to_FEN(game_ptr, "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    //game_ptr->position.game_rules.capture_own = true;
    //game_ptr->position.game_rules.sideways_pawns = true;
    //game_ptr->position.game_rules.kangaroo_pawns = true;
    //game_ptr->position.game_rules.torpedo_pawns = true;
    return game_ptr;
}

void chessweb_dispose_game(chesscat_Game *game_ptr){
    free(game_ptr);
}

//Position functions:

chesscat_GameRules *chessweb_game_getrules(chesscat_Game *game){
    return &(game->position.game_rules);
}

chesscat_Piece *chessweb_get_piece_at_pos(chesscat_Game *game, uint8_t row, uint8_t col){
    return &(game->position.board[row][col]);
}

chesscat_EColor chessweb_get_color_to_move(chesscat_Game *game){
    return game->position.to_move;
}

chesscat_Move *chessweb_get_legal_moves_from(chesscat_Game *game, uint8_t row, uint8_t col){
    chesscat_Square from_square = {.row = row, .col = col};
    chesscat_Move *moves_buf = malloc((chesscat_get_legal_moves_from(&(game->position), from_square, NULL) + 1) * sizeof(chesscat_Move)); //TODO again make this more efficient
    uint16_t num_moves = chesscat_get_legal_moves_from(&(game->position), from_square, moves_buf);
    chesscat_Square empty = {.col = -1, .row = -1};
    moves_buf[num_moves].from = empty;
    moves_buf[num_moves].to = empty; //To mark end of the buffer
    return moves_buf;
}

void chessweb_free_move_buffer(chesscat_Move *buffer){
    free(buffer);
}

chesscat_Move *chessweb_get_move_in_buffer(chesscat_Move *buf, uint16_t position){
    return &(buf[position]);
}

void chessweb_play_move(chesscat_Game *game, uint8_t o_row, uint8_t o_col, uint8_t d_row, uint8_t d_col, chesscat_EPieceType promote_to){
    chesscat_Square from = {.row = o_row, .col = o_col};
    chesscat_Square to = {.row = d_row, .col = d_col};
    chesscat_Move move = {.from = from, .to = to};

    if(chesscat_is_move_legal(&(game->position), move, promote_to) && chesscat_is_move_possible(&(game->position), move)){
        chesscat_game_make_move(game, move, promote_to);
    }
}

chesscat_EPositionState chessweb_position_state(chesscat_Game *game){
    return chesscat_get_current_state(&(game->position));
}

//Piece functions:

chesscat_EColor chessweb_get_piece_color(chesscat_Piece *piece){
    return piece->color;
}

chesscat_EPieceType chessweb_get_piece_type(chesscat_Piece *piece){
    return piece->type;
}

bool chessweb_get_piece_royalty(chesscat_Piece *piece){
    return piece->is_royal;
}
