$(document).ready(function(){
    function toggleTextCropSamples() {
        const checked = $(this).is(":checked");

        if (checked) {
            $(".cap-aligned-line-height").removeClass("text-crop--disabled");
        } else {
            $(".cap-aligned-line-height").addClass("text-crop--disabled");
        }
    }

    $("#es-text-crop-toggle").on("change", toggleTextCropSamples);
});
