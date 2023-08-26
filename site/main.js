let game
Module.onRuntimeInitialized = function () {
    game = chessweb.newGame();

    console.log(chessweb.getGameRules(game));
};
