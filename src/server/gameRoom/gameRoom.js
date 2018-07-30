const auth = require("../users/users");
const games = require("../games/games");
const gameUtils = require("../../utils/gameUtils");

function buildRelativePlayersArray(user, players){
  const result = [];

  if (user.status === gameUtils.STATUS_CONSTS.IDLE){
        players.forEach((player)=>result.push(player));
    }
    // the user is player, should get his data only
    else if (user.status === gameUtils.STATUS_CONSTS.PLAYING){
        const playerAmount = players.length;
        let i = 0;

        //first need to add the user itself to the result
        for( ; i<playerAmount ; i++){
            if (players[i].name === user.name){
                result.push(players[i]);
                break;
            }
        }
        i = (i+1) % playerAmount;

        //then add the other players by order
        for(let j=0 ; j<playerAmount-1 ; j++){
            let player = {
                name: players[i].name,
                type: players[i].type,
                hand: undefined,
                cardsAmount: players[i].cardsAmount,
                stats: players[i].stats,
                place: players[i].place
            };
            result.push(player);
            i = (i+1) % playerAmount;
        }
    }

    return result;
}

function buildRelativeBoardState(id, boardState){
  const user = auth.userList.getUserById(id);
  const players = buildRelativePlayersArray(user, boardState.players);
  const playerTurnName = boardState.players[boardState.turn].name;
  return {
      players: players,
      playerTurnName: playerTurnName,
      playZone: boardState.playZone,
      history: boardState.history,
      stats: boardState.stats
  };
}

function getBoardState(id) {
  const gameName = auth.userList.getUserById(id).gameName;
  const game = games.gamesList.getGameByGameName(gameName);
  const boardState = game.logic.getBoardState();

  //TODO: this should send a smaller version of boardState. it returns the whole boarState only for debugging reasons.
  return buildRelativeBoardState(id, boardState);
}

function playCard(req, res, next) {
  const player = auth.userList.getUserById(req.session.id);
  const gameName = player.gameName;
  const game = games.gamesList.getGameByGameName(gameName);

  const gameLogic = game.logic;

  //TODO: drawCadsWhenNoLegal should accept LOGIC player object insted of SERVER player object
  gameLogic.drawCardsWhenNoLegal(player);
  next();
}

function drawCard(req, res, next) {
  const card = req.body.card;

}

module.exports = {
  getBoardState,
  playCard,
  drawCard
};
