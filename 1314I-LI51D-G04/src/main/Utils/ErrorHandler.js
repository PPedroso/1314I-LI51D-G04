
function handleErrorStatusAndMessage(response, status, message) {
    response.status(status);
    response.end(message);
}

module.exports = {
    handleErrorStatusAndMessage: handleErrorStatusAndMessage
}
