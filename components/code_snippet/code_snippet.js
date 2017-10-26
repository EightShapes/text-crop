$(document).ready(function(){
    function showMixinTab() {
        const language = $("[name='style-preprocessor']:checked").attr("id");

        $(".mixin-code-tab-pane").hide();
        $("#style-preprocessor-" + language).show();
    }

    $("#style-preprocessor-less, #style-preprocessor-stylus").hide();
    $("[name='style-preprocessor']").on("change", showMixinTab);
});
