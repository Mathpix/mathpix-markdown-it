"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./base/BaseConfiguration.js");
require("./action/ActionConfiguration.js");
require("./ams/AmsConfiguration.js");
require("./ams_cd/AmsCdConfiguration.js");
require("./bbox/BboxConfiguration.js");
require("./boldsymbol/BoldsymbolConfiguration.js");
require("./braket/BraketConfiguration.js");
require("./bussproofs/BussproofsConfiguration.js");
require("./cancel/CancelConfiguration.js");
require("./color/ColorConfiguration.js");
require("./color_v2/ColorV2Configuration.js");
require("./config_macros/ConfigMacrosConfiguration.js");
require("./enclose/EncloseConfiguration.js");
require("./extpfeil/ExtpfeilConfiguration.js");
require("./html/HtmlConfiguration.js");
require("./mhchem/MhchemConfiguration.js");
require("./newcommand/NewcommandConfiguration.js");
require("./noerrors/NoErrorsConfiguration.js");
require("./noundefined/NoUndefinedConfiguration.js");
require("./physics/PhysicsConfiguration.js");
require("./unicode/UnicodeConfiguration.js");
require("./verb/VerbConfiguration.js");
if (typeof MathJax !== 'undefined' && MathJax.loader) {
    MathJax.loader.preLoad('[tex]/action', '[tex]/ams', '[tex]/amsCd', '[tex]/bbox', '[tex]/boldsymbol', '[tex]/braket', '[tex]/bussproofs', '[tex]/cancel', '[tex]/color', '[tex]/enclose', '[tex]/extpfeil', '[tex]/html', '[tex]/mhchem', '[tex]/newcommand', '[tex]/noerrors', '[tex]/noundefined', '[tex]/physics', '[tex]/unicode', '[tex]/verb', '[tex]/configMacros');
}
exports.AllPackages = [
    'base',
    'action',
    'ams',
    'amsCd',
    'bbox',
    'boldsymbol',
    'braket',
    'cancel',
    'color',
    'enclose',
    'extpfeil',
    'html',
    'mhchem',
    'newcommand',
    'noerrors',
    'noundefined',
    'unicode',
    'verb',
    'configMacros'
];
//# sourceMappingURL=AllPackages.js.map