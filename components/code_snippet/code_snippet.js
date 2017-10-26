$(document).ready(function(){
    function showMixinTab() {
        const language = $("[name='style-preprocessor']:checked").attr("id");

        $(".mixin-code-tab-pane").hide();
        $("#style-preprocessor-" + language).show();
    }

    $("#style-preprocessor-less, #style-preprocessor-stylus").hide();
    $("[name='style-preprocessor']").on("change", showMixinTab);


    var clipboard = new Clipboard('.es-code-snippet__copy-button');
    clipboard.on('success', function(e) {
        $(e.trigger).removeClass("es-code-snippet__copy-button--clicked");
        $(e.trigger).prop('offsetHeight');
        $(e.trigger).addClass("es-code-snippet__copy-button--clicked").find(".es-code-snippet__copy-response").text('Copied!');
        e.clearSelection();
    });

    clipboard.on('error', function(e) {
        $(e.trigger).removeClass("es-code-snippet__copy-button--clicked");
        $(e.trigger).prop('offsetHeight');
        $(e.trigger).addClass("es-code-snippet__copy-button--clicked").find(".es-code-snippet__copy-response").text('Press Ctrl + C to copy');
    });

    $("body").on("click", ".es-code-snippet__copy-button", function(e){
        e.preventDefault();
    });
});
