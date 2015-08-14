$(function() {

    $('input[type="radio"]').change(function() {
        if ($(this).val() === 'dep') {
            console.log('dep');
        } else {
            console.log('arr');
        }
    });
});
