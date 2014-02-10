function MVCFunctionCallback(request, response, logicCallback, daoCallback) {
    this.request = request;
    this.response = response;
    this.logicCallback = logicCallback;
    this.daoCallback = daoCallback;
}

module.exports = MVCFunctionCallback;