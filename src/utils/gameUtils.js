const _ = require("lodash");

const STATUS_CONSTS = {
  IDLE: "idle",
  PLAYING: "playing",
  CREATED: "created",
  JOINED: "joined"
};

function getGamesForUser(games, userid) {
  const username = userid.name;
  return _.filter(games, game => _.includes(game.players, username));
}

function findFullGames(games) {
  return _.filter(games, isGameFull);
}

function isGameFull(game) {
  if (!game) throw "game not defined!";
  return game.players.length === game.playerLimit;
}

function createGameRecord(name, creator, playerLimit) {
  return {
    name: name,
    creator: creator,
    playerLimit: playerLimit
  };
}

module.exports = {
  getGamesForUser,
  findFullGames,
  isGameFull,
  createGameRecord,
  STATUS_CONSTS
};