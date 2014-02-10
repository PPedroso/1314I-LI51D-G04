/*
 *  To choose a different implementation of either Logic or DAO, just specify on the auxiliary variables, the path for them
 */

var logicFolder = 'Basic';
var daoFolder = 'Mappers';

module.exports.logicFactory = function(wantedLogic) {
    return require('./../Logic/' + logicFolder + '/' + wantedLogic);
};


module.exports.daoFactory = function(wantedDAO) {
    return require('./../Model/' + daoFolder + '/' + wantedDAO);
};


