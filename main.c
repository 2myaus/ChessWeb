#include <stdlib.h>

#include "libchesscat.h"

chesscat_Game *chessweb_new_game(){
    chesscat_Game *game_ptr = malloc(sizeof(chesscat_Game));

    return game_ptr;
}
