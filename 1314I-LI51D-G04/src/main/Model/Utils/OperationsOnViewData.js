function checkAvailability(arrayRealEstates) {
    arrayRealEstates.forEach(function(entry) {
        entry['availability'] = entry.isCurrentlyAvailable();
    });
}

module.exports = {
    checkAvailability: checkAvailability
}