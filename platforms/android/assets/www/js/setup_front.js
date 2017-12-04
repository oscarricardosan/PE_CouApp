$(function() {
    FastClick.attach(document.body);

    document.addEventListener("backbutton", onBackKeyDown, false);

    function onBackKeyDown(e) {
        e.preventDefault();
        $($('.modal:visible')[$('.modal:visible').length-1]).modal('hide')
    }
});