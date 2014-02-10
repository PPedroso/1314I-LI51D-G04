function ValidationLogicObj(errorMessage, validateFunction) {
    this.errorMessage = errorMessage;
    this.validateFuncion = validateFunction;
}

ValidationLogicObj.prototype.validate = function(valueToValidate) {
    return this.validateFuncion(valueToValidate);
}

module.exports = ValidationLogicObj;