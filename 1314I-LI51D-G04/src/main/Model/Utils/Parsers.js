function formQueryString(parameters) {
    var ret = "";
    for(var str in parameters) {
        if(parameters.hasOwnProperty(str) && str != 'pageNr') {
            ret += str + '=' + parameters[str] + '&';
        }
    }
    if(ret.length != 0) {
        ret = ret.substr(0, ret.length-1);
    }
    return ret;
}

module.exports = {
    formQueryString: formQueryString
}