var readReservationOnRealEstate = {
    fields: {
        realEstateId: {
            required: true
        }
    }
};

var acceptReservation = { };

var insertReservation = { };

module.exports = {
    readReservationOnRealEstate: readReservationOnRealEstate,
    acceptReservation: acceptReservation,
    insertReservation: insertReservation
}