"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMathMenuItem = void 0;
var consts_1 = require("./consts");
var parse_mmd_element_1 = require("../../helpers/parse-mmd-element");
exports.createMathMenuItem = function (type, value) {
    try {
        var itemTitle = '';
        var sourceStr = '';
        switch (type) {
            case consts_1.eMathType.latex:
                itemTitle = 'LaTeX';
                sourceStr = parse_mmd_element_1.formatSource(value);
                break;
            case consts_1.eMathType.asciimath:
                itemTitle = 'Asciimath';
                sourceStr = parse_mmd_element_1.formatSource(value);
                break;
            case consts_1.eMathType.mathml:
                itemTitle = 'Mathml';
                sourceStr = parse_mmd_element_1.formatSourceMML(value);
                break;
            case consts_1.eMathType.mathmlword:
                itemTitle = 'Mathml (MS Word)';
                sourceStr = value;
                break;
        }
        if (!itemTitle) {
            return null;
        }
        var elItem = document.createElement('div');
        elItem.setAttribute('class', consts_1.classNameMenuItem);
        elItem.setAttribute('role', 'menuitem');
        elItem.setAttribute('aria-label', itemTitle + ' has been copied to Clipboard');
        elItem.setAttribute('aria-disabled', 'false');
        elItem.setAttribute('tabindex', '-1');
        var elItemContainer = document.createElement('div');
        elItemContainer.setAttribute('class', consts_1.classNameMenuItem + '-container');
        var elItemTitle = document.createElement('div');
        elItemTitle.setAttribute('class', consts_1.classNameMenuItem + '-title');
        elItemTitle.innerText = itemTitle;
        elItemContainer.appendChild(elItemTitle);
        var elItemValue = document.createElement('div');
        elItemValue.setAttribute('class', consts_1.classNameMenuItem + '-value');
        elItemValue.innerText = value.replace(/\n/g, '');
        elItemContainer.appendChild(elItemValue);
        var elItemSource = document.createElement('div');
        elItemSource.setAttribute('class', consts_1.classNameMenuItem + '-source');
        elItemSource.setAttribute('data-type', type);
        elItemSource.style.display = "none";
        elItemSource.innerHTML = sourceStr;
        elItemContainer.appendChild(elItemSource);
        var elIcon = document.createElement('div');
        elIcon.setAttribute('class', consts_1.classNameMenuItem + '-icon');
        elIcon.setAttribute('aria-disabled', 'true');
        elIcon.innerHTML = "<svg width=\"28\" height=\"28\" viewBox=\"0 0 28 28\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M17.625 5.125H8.875V3.875H17.625C18.6605 3.875 19.5 4.71447 19.5 5.75V16.375H18.25V5.75C18.25 5.40482 17.9702 5.125 17.625 5.125Z\" fill=\"currentColor\"></path><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M5.125 8.25C5.125 7.21447 5.96447 6.375 7 6.375H15.125C16.1605 6.375 17 7.21447 17 8.25V18.25C17 19.2855 16.1605 20.125 15.125 20.125H7C5.96447 20.125 5.125 19.2855 5.125 18.25V8.25ZM7 7.625H15.125C15.4702 7.625 15.75 7.90482 15.75 8.25V18.25C15.75 18.5952 15.4702 18.875 15.125 18.875H7C6.65482 18.875 6.375 18.5952 6.375 18.25V8.25C6.375 7.90482 6.65482 7.625 7 7.625Z\" fill=\"currentColor\"></path><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M20 13.5C16.4101 13.5 13.5 16.4101 13.5 20C13.5 23.5899 16.4101 26.5 20 26.5C23.5899 26.5 26.5 23.5899 26.5 20C26.5 16.4101 23.5899 13.5 20 13.5ZM19 22.7071L23.3536 18.3536L22.6465 17.6465L19 21.2929L17.3536 19.6465L16.6465 20.3536L19 22.7071Z\" fill=\"#4DA660\"></path><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M23.3536 18.3536L19 22.7071L16.6465 20.3536L17.3536 19.6464L19 21.2929L22.6465 17.6464L23.3536 18.3536Z\" fill=\"white\"></path></svg>";
        elItem.appendChild(elItemContainer);
        elItem.appendChild(elIcon);
        return elItem;
    }
    catch (err) {
        console.error(err);
        return null;
    }
};
//# sourceMappingURL=menu-item.js.map