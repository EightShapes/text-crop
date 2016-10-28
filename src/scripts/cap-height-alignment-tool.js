CapHeightAlignmentTool = function() {
    "use strict";

    function syncLineHeight() {
        $(".code-line-height").text($("#line-height").val());
    }

    function syncFontSize() {
        $(".code-size").text($("#size").val());
        setSampleTextStyles();
    }

    function syncTopMeasurement() {
        $(".code-top-measurement").text($("#top-measurement").val());
    }

    function syncBottomMeasurement() {
        $(".code-bottom-measurement").text($("#bottom-measurement").val());
    }

    function setEventHandlers() {
        $("#line-height").on('keyup change', syncLineHeight);
        $("#size").on('keyup change', syncFontSize);
        $("#top-measurement").on('keyup change', syncTopMeasurement);
        $("#bottom-measurement").on('keyup change', syncBottomMeasurement);
        $("#typeface").on('change', setSampleTextStyles);
    }

    function setSampleTextStyles() {
        var fontSize = $("#size").val() + 'px',
            fontFamily = $("#typeface").val();
        $(".cap-height-measurement__sample-text").css({fontSize: fontSize, fontFamily: fontFamily});
        
        // if ($("#inline-styles").length == 0) {
        //     $("head").append("<style id='inline-styles'>");
        // }

        // $("#inline-styles").append(" .cap-height-measurement__sample-text { font-family: '" + fontFamily + "'; }")
    }

    function syncValuesOnLoad() {
        syncLineHeight();
        syncFontSize();
        syncTopMeasurement();
        syncBottomMeasurement();
        // setSampleTextStyles();
    }


    var initialize = function initialize() {
        setEventHandlers();
        syncValuesOnLoad();
    };

    return {
        "initialize": initialize
    };
}();

$(document).ready(CapHeightAlignmentTool.initialize);