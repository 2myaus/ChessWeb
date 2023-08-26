CC = emcc
CFLAGS = -Wall -Wextra -g -fshort-enums
LFLAGS = -L . -lchesscat -s LLD_REPORT_UNDEFINED
FILENAME = webdemo.js

FUNC_EXPORTS = _chessweb_get_square_row,_chessweb_get_square_col,_chessweb_get_move_origin,_chessweb_get_move_destination,_chesscat_set_default_game,_chessweb_new_game,_chessweb_dispose_game,_chessweb_game_getrules,_chessweb_get_piece_at_pos,_chessweb_get_color_to_move,_chessweb_get_possible_moves_from,_chessweb_free_move_buffer,_chessweb_get_move_in_buffer,_chessweb_play_move,_chessweb_get_piece_color,_chessweb_get_piece_type,_chessweb_get_piece_royalty

main: main.c
	$(CC) $(CFLAGS) main.c $(LFLAGS) -s EXPORTED_FUNCTIONS='$(FUNC_EXPORTS)' -s EXPORTED_RUNTIME_METHODS=ccall,cwrap -o $(FILENAME)

.PHONY: clean

clean:
	rm -f $(FILENAME)
