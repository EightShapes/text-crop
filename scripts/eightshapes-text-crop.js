/*
    global $
*/

TextCrop = function() {
    "use strict";
    var measurementLineLockedClass = "text-crop-measurement__line--locked",
        topMeasurementLineListClass = "text-crop-measurement__lines--top",
        bottomMeasurementLineListClass = "text-crop-measurement__lines--bottom",
        fineTuneAdjustmentClass = "measurement-fine-tune",
        typefaceVariantMapping = {},
        $configureForm,
        draggableInstance,
        initialLoadComplete = false;

    function syncLineHeight() {
        setSampleTextStyles();
        updateInlineStyles();
        updateCodeSnippet();
        resetBottomSlider();
    }

    function syncFontSize() {
        setSampleTextStyles();
        updateInlineStyles();
        updateCodeSnippet();
        resetBottomSlider();
    }

    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    var updateUrl = debounce(function(){
            if (initialLoadComplete) {
                var serializedForm = $configureForm.serialize();
                $(".code-serialized-form").text(serializedForm);
                window.history.pushState(false, false, '/?' + serializedForm);
            }
        }, 500, true);

    function resetBottomSlider() {
        // If font is sized down after being large, the drag handle can be hanging outside the sample box, check for that and move it
        var sampleBoxHeight = $(".text-crop-measurement__actions").height();
        var bottomLineMeasurePosition = parseInt($(".text-crop-measurement__line--bottom").css("top"), 10);
        if (bottomLineMeasurePosition > sampleBoxHeight) {
            $(".text-crop-measurement__line--bottom").css("top", sampleBoxHeight - 1 + "px");
        }
    }

    function updateCodeSnippet() {
        $(".code-line-height").text($("#line-height").val());
        $(".code-size").text($("#size").val());
        $(".code-top-measurement").text($("#top-crop").val());
        $(".code-bottom-measurement").text($("#bottom-crop").val());
    }

    function processTopCropAdjustment() {
        const topValue = $("#top-crop").val();
        $(".text-crop-measurement__line--top").css('top', topValue + "px");
        updateInlineStyles();
        updateCodeSnippet();
    }

    function processBottomCropAdjustment() {
        const bottomValue = $("#bottom-crop").val(),
                heightOfSampleBox = $(".text-crop-measurement__sample-text").outerHeight() - 1,
                newPositionOfSlider = heightOfSampleBox - bottomValue;
        $(".text-crop-measurement__line--bottom").css('top', newPositionOfSlider + "px");
        updateInlineStyles();
        updateCodeSnippet();
    }

    function updateInlineStyles() {
        if ($("style#text-crop-inline-styles").length === 0) {
            $("head").append("<style id='text-crop-inline-styles'>");
        }

        var fontSize = parseInt($("#size").val(), 10),
            lineHeight = parseFloat($("#line-height").val(), 10),
            measuredLineHeight = lineHeight,
            topMeasurement = parseInt($("#top-crop").val(), 10),
            bottomMeasurement = parseInt($("#bottom-crop").val(), 10),
            topOffsetEm = Math.max((topMeasurement + (lineHeight - measuredLineHeight) * (fontSize / 2)), 0) / fontSize,
            bottomOffsetEm = Math.max((bottomMeasurement + (lineHeight - measuredLineHeight) * (fontSize / 2)), 0) / fontSize,
            inlineStyle = ".text-crop { line-height: " + lineHeight + " } .text-crop::before { margin-bottom: -" + topOffsetEm + "em; } .text-crop::after { margin-top: -" + bottomOffsetEm + "em; }";

        $("#text-crop-inline-styles").html(inlineStyle);
        updateUrl();
    }

    function processSliderMeasurement(event, ui) {
        const $target = $(event.target);
        let $formField;

            if ($target.closest(".text-crop-measurement__line--bottom").length > 0) {
                var offset = ui.position.top,
                    heightOfSampleBox = $(".text-crop-measurement__sample-text").outerHeight() - 1,
                    value = parseInt(heightOfSampleBox - offset, 10);
                $formField = $("#bottom-crop");
            } else {
                value = parseInt(ui.position.top, 10);
                $formField = $("#top-crop");
            }

        $formField.val(value).trigger("change");
        updateInlineStyles();
        updateCodeSnippet();
    }

    function increaseAdjustment(event) {
        const $target = $(event.target);

        if ($target.closest(".text-crop-measurement__line--top").length > 0) {
            const $formField = $("#top-crop");
            $formField.val(parseInt($formField.val(), 10) + 1);
            processTopCropAdjustment();
        } else {
            const $formField = $("#bottom-crop");
            $formField.val(parseInt($formField.val(), 10) + 1);
            processBottomCropAdjustment();
        }
    }

    function decreaseAdjustment(event) {
        const $target = $(event.target);

        if ($target.closest(".text-crop-measurement__line--top").length > 0) {
            const $formField = $("#top-crop");
            $formField.val(parseInt($formField.val(), 10) - 1);
            processTopCropAdjustment();
        } else {
            const $formField = $("#bottom-crop");
            $formField.val(parseInt($formField.val(), 10) - 1);
            processBottomCropAdjustment();
        }
    }

    function toggleTypefaceInputVisiblity() {
        $(".typeface-action--hidden").removeClass("typeface-action--hidden");

        if ($("#use-custom-typeface").is(":checked")) {
            $(".typeface-action--typeface, .typeface-action--weight-and-style").addClass("typeface-action--hidden");
        } else {
            $(".typeface-action--custom-typeface-name, .typeface-action--custom-typeface-url, .typeface-action--custom-typeface-weight, .typeface-action--custom-typeface-style").addClass("typeface-action--hidden")
        }
        setSampleTextStyles();
    }

    function setEventHandlers() {
        $("#line-height").on('keyup change click', syncLineHeight);
        $("#size").on('keyup change click', syncFontSize);
        $(".text-crop-measurement__sample-text").on('keyup', resetBottomSlider);
        // $("#top-measurement").on('keyup change', processTopCropAdjustment);
        // $("#bottom-measurement").on('keyup change', processBottomCropAdjustment);
        $("#typeface").on('change', buildWeightAndStyleSelectBox);
        $("#weight-and-style").on('change', setSampleTextStyles);
        $("input[name='typeface-selection']").on('change', toggleTypefaceInputVisiblity);
        $("#custom-typeface-name").on('keyup change', setSampleTextStyles);
        $("#custom-typeface-weight").on('keyup change', setSampleTextStyles);
        $("#custom-typeface-style").on('keyup change', setSampleTextStyles);
        $("#custom-typeface-url").on('keyup change', setSampleTextStyles);
        $(".measurement-fine-tune__increment--increase").on('click', increaseAdjustment);
        $(".measurement-fine-tune__increment--decrease").on('click', decreaseAdjustment);
        $("#top-crop").on('keyup change click', processTopCropAdjustment);
        $("#bottom-crop").on('keyup change click', processBottomCropAdjustment);
        $(window).on('resize', resetBottomSlider);

        $(".text-crop-measurement__line").draggable({ 
            axis: 'y', 
            containment: 'parent', 
            handle: ".measurement-fine-tune__grip",
            drag: processSliderMeasurement,
            stop: processSliderMeasurement
        });
    }

    function parseWeightAndStyle(string) {
        var weightAndStyle = {
            weight: '400',
            style: 'normal',
            originalString: string
        };

        if (string === 'regular') {
            // Nothing to do, just use defaults
        } else if (string === 'italic') {
            weightAndStyle.style = 'italic';
        } else if (string.indexOf('italic') !== -1) {
            var weight = string.replace('italic', '');
            weightAndStyle.style = 'italic';
            weightAndStyle.weight = weight;
        } else {
            weightAndStyle.weight = string;
        }

        return weightAndStyle;
    }

    function setSampleTextStyles() {
        var fontSize = $("#size").val() + 'px',
            fontFamily = $("#typeface").val(),
            lineHeight = $("#line-height").val(),
            weightAndStyle = parseWeightAndStyle($("#weight-and-style").val()),
            useCustomTypeface = $("#use-custom-typeface").is(":checked"),
            style = "";


        if (useCustomTypeface) {
            var fontUrl = false;

            fontFamily = $("#custom-typeface-name").val();
            weightAndStyle = {
                weight: $("#custom-typeface-weight").val(),
                style: $("#custom-typeface-style").val()
            };
    
            if ($("#custom-typeface-url").length > 0) {
                fontUrl = $("#custom-typeface-url").val();
            }

            if (fontUrl && $("link[href='" + fontUrl + "']").length === 0) {
                $("head").append("<link rel='stylesheet' href='" + fontUrl + "'>");
            }
        } else {
            var fontUrl = "https://fonts.googleapis.com/css?family=" + fontFamily.replace(/ /g, '+') + ':' + weightAndStyle.originalString;
            WebFont.load({
              google: {
                families: [fontFamily + ":" + weightAndStyle.originalString]
              }
            });
        }

        $(".text-crop-measurement__sample-text").css({fontSize: fontSize, fontFamily: fontFamily + ", monospace", lineHeight: lineHeight, fontWeight: weightAndStyle.weight, fontStyle: weightAndStyle.style});
        $(".sample-font-result").css({fontFamily: fontFamily + ", monospace", fontWeight: weightAndStyle.weight, fontStyle: weightAndStyle.style });
        $(".text-crop-measurement__sample-text")[0].offsetHeight; // Force redraw so resetBottomSlider() will work correctly
        resetBottomSlider();
        updateUrl();
    }

    function getWeightAndStyleVariants() {
        var currentTypeface = $("#typeface").val();
        return typefaceVariantMapping[currentTypeface];
    }

    function buildWeightAndStyleSelectBox() {
        var variants = getWeightAndStyleVariants(),
            $variantSelect = $("#weight-and-style"),
            options = "";

        for (var style in variants) {
            var filepath = variants[style];
            options += '<option value="' + style + '">' + style + '</option>';
        }

        return $variantSelect.html(options).trigger('change');
    }

    function getGoogleFontTypefaces() {
        var typefaces = [];
        for (var i = 0; i < googleFonts.items.length; i++) {
            var font = googleFonts.items[i];
            typefaces.push(font.family);
            typefaceVariantMapping[font.family] = font.files;
        }

        return typefaces;
    }

    function buildFontSelectBox() {
        var googleFonts = getGoogleFontTypefaces(),
            $typefaceSelect = $("#typeface"),
            options = "";

        for (var i = 0; i < googleFonts.length; i++) {
            var selected = '',
                typeface = googleFonts[i];

            if (typeface === 'Lato') {
                selected = 'selected';
            }

            options += '<option value="' + typeface + '" ' + selected + '>' + typeface + '</option>';
        }

        $typefaceSelect.html(options);
    }

    function syncValuesOnLoad() {
        loadFormDataFromUrl();
        syncLineHeight();
        syncFontSize();
        processTopCropAdjustment();
        processBottomCropAdjustment();
        toggleTypefaceInputVisiblity();
        buildWeightAndStyleSelectBox();
        loadFormDataFromUrl();
        setSampleTextStyles();
        initialLoadComplete = true;
    }

    function highlightCode() {
        var $codeSnippets = $(".esds-doc-code-snippet code");
        $codeSnippets.each(function(){
            var $snippet = $(this);
            Prism.highlightElement($snippet[0], false, function(){
                var html = $snippet.html(),
                    replacedHtml;
                replacedHtml = html.replace(/!!TOPCROP!!/g, '<span class="code-top-measurement">FOO</span>');
                replacedHtml = replacedHtml.replace(/!!BOTTOMCROP!!/g, '<span class="code-bottom-measurement"></span>');
                replacedHtml = replacedHtml.replace(/!!FONTSIZE!!/g, '<span class="code-size"></span>');
                replacedHtml = replacedHtml.replace(/!!LINEHEIGHT!!/g, '<span class="code-line-height"></span>');
                replacedHtml = replacedHtml.replace(/!!SERIALIZEDFORM!!/g, '<span class="code-serialized-form"></span>');

                $snippet.html(replacedHtml);
            });
        });
    }

    function setConfigurationRowFixedPosition($configurationRow, elementWatcher) {
        var fixedClass = "es-text-crop-configuration-row--fixed";

        if (elementWatcher.isAboveViewport && !$configurationRow.hasClass(fixedClass)) {
            $configurationRow.height($configurationRow.height());
            $configurationRow.addClass(fixedClass);
        } else if (!elementWatcher.isAboveViewport && $configurationRow.hasClass(fixedClass)) {
            $configurationRow.height('auto');
            $configurationRow.removeClass(fixedClass);
        }
    }

    function monitorConfigurationFixedStatus() {
        var $configurationRow = $(".es-text-crop-configuration-row-fixed-wrap"),
            elementWatcher = scrollMonitor.create($configurationRow[0], {top: -96});

        // setFixedPosition(pageNavigation, elementWatcher);
        elementWatcher.stateChange(function(){
            setConfigurationRowFixedPosition($configurationRow, elementWatcher);
        });
    }

    function loadFormDataFromUrl() {
        if (location.search.substr(1).length > 0) {
            $configureForm.deserialize(location.search.substr(1));
        }
    }


    var initialize = function initialize() {
        $configureForm = $(".es-text-crop-font-form");
        highlightCode();
        buildFontSelectBox();
        setEventHandlers();
        syncValuesOnLoad();
        monitorConfigurationFixedStatus();
    };

    return {
        "initialize": initialize
    };
}();

$(document).ready(TextCrop.initialize);
