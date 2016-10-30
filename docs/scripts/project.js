// DO NOT EDIT: The contents of this file are dynamically generated and will be overwritten
CapHeightAlignmentTool = function() {
    "use strict";
    var measurementLineLockedClass = "cap-height-measurement__line--locked",
        topMeasurementLineListClass = "cap-height-measurement__lines--top",
        bottomMeasurementLineListClass = "cap-height-measurement__lines--bottom",
        fineTuneAdjustmentClass = "measurement-fine-tune";

    function syncLineHeight() {
        $(".code-line-height").text($("#line-height").val());
        setSampleTextStyles();
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

    function moveFineTuneAdjustment($lockedLine, $lineList) {
        var $fineTuneAdjustment = $lineList.find("." + fineTuneAdjustmentClass);
        $fineTuneAdjustment.appendTo($lockedLine);
    }

    function lockMeasurementLine(event) {
        var $target = $(event.target),
            $lineList = $target.closest(".cap-height-measurement__lines");
        $lineList.find("." + measurementLineLockedClass).removeClass(measurementLineLockedClass);
        $target.addClass(measurementLineLockedClass);

        moveFineTuneAdjustment($target, $lineList);

        if ($lineList.hasClass(topMeasurementLineListClass)) {
            // Update the top measurement input
            var measurement = $target.index() + 1;
            $("#top-measurement").val(measurement).trigger("change");
        } else {
            // Update the bottom measurement input
            var measurement = $target.index() + 1;
            $("#bottom-measurement").val(measurement).trigger("change");
        }
    }

    function updateIndicator(event, ui) {
        var $target = $(event.target);

            $target.closest(".cap-height-measurement__line").find(".cap-height-measurement__offset").text(Math.abs(ui.position.top)),
            $target.closest(".cap-height-measurement__line").find(".offset-input").val(Math.abs(ui.position.top)).trigger("change");
    }

    function increaseAdjustment(event) {
        var $target = $(event.target),
            $offsetIndicator = $target.closest(".cap-height-measurement__line").find(".cap-height-measurement__offset"),
            currentPosition = $offsetIndicator.text(),
            $measurementLine = $target.closest(".cap-height-measurement__line"),
            $offsetInput = $measurementLine.find(".offset-input"),
            newPosition = parseInt(currentPosition, 10) + 1;

        $offsetIndicator.text(newPosition);
        $offsetInput.val(newPosition).trigger("change");
        if ($measurementLine.hasClass("cap-height-measurement__line--bottom")) {
            newPosition = -(newPosition);
        }

        $measurementLine.css({top: newPosition + "px"});
    }

    function decreaseAdjustment(event) {
        var $target = $(event.target),
            $offsetIndicator = $target.closest(".cap-height-measurement__line").find(".cap-height-measurement__offset"),
            currentPosition = $offsetIndicator.text(),
            $measurementLine = $target.closest(".cap-height-measurement__line"),
            $offsetInput = $measurementLine.find(".offset-input"),
            newPosition = Math.max(0, parseInt(currentPosition, 10) - 1);

        $offsetIndicator.text(newPosition);
        $offsetInput.val(newPosition).trigger("change");
        if ($measurementLine.hasClass("cap-height-measurement__line--bottom")) {
            newPosition = -(newPosition);
        }

        $measurementLine.css({top: newPosition + "px"});
    }

    function setEventHandlers() {
        $("#line-height").on('keyup change', syncLineHeight);
        $("#size").on('keyup change', syncFontSize);
        $("#top-measurement").on('keyup change', syncTopMeasurement);
        $("#bottom-measurement").on('keyup change', syncBottomMeasurement);
        $("#typeface").on('change', setSampleTextStyles);
        $(".measurement-fine-tune__increment--increase").on('click', increaseAdjustment)
        $(".measurement-fine-tune__increment--decrease").on('click', decreaseAdjustment)
        // $(".cap-height-measurement__line").on('click', lockMeasurementLine);

        $(".cap-height-measurement__line").draggable({ 
            axis: 'y', 
            containment: 'parent', 
            handle: ".measurement-fine-tune__grip",
            drag: updateIndicator,
            stop: updateIndicator
        });
    }

    function setSampleTextStyles() {
        var fontSize = $("#size").val() + 'px',
            fontFamily = $("#typeface").val(),
            lineHeight = $("#line-height").val();
        $(".cap-height-measurement__sample-text").css({fontSize: fontSize, fontFamily: fontFamily, lineHeight: lineHeight});
        
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