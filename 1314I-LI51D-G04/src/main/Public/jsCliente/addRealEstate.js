$(document).ready(function () {
    $('#addPropertyForm').validate();

    $('input[id^="inputRealEstate"]').each(function () {
        $(this).rules("add", {
            required: true,
            messages: {
                required: this.name + " is a necessary field"
            }
        })
    });

    $('#addPropertyForm').submit(function() {
        $('input[name="photo[]"]').each(function(index, elem) {
            elem.name = 'photo' + index;
        })
    });
});