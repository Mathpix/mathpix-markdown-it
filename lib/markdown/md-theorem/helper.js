"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTheoremNumber = exports.getTheoremNumberByLabel = exports.resetTheoremEnvironments = exports.getTheoremEnvironmentIndex = exports.getTheoremEnvironment = exports.addTheoremEnvironment = exports.getNextCounterProof = exports.counterProof = exports.envNumbers = exports.theoremEnvironments = void 0;
exports.theoremEnvironments = [];
exports.envNumbers = [];
exports.counterProof = 0;
exports.getNextCounterProof = function () {
    exports.counterProof += 1;
    return exports.counterProof;
};
exports.addTheoremEnvironment = function (data) {
    var index = exports.theoremEnvironments.findIndex(function (item) { return item.name === data.name; });
    if (index === -1) {
        exports.theoremEnvironments.push(data);
    }
};
exports.getTheoremEnvironment = function (name) {
    return (exports.theoremEnvironments === null || exports.theoremEnvironments === void 0 ? void 0 : exports.theoremEnvironments.length) ? exports.theoremEnvironments.find(function (item) { return item.name === name; })
        : null;
};
exports.getTheoremEnvironmentIndex = function (name) {
    return (exports.theoremEnvironments === null || exports.theoremEnvironments === void 0 ? void 0 : exports.theoremEnvironments.length) ? exports.theoremEnvironments.findIndex(function (item) { return item.name === name; })
        : -1;
};
exports.resetTheoremEnvironments = function () {
    exports.theoremEnvironments = [];
};
exports.getTheoremNumberByLabel = function (envLabel) {
    var index = exports.envNumbers.findIndex(function (item) { return item.label === envLabel; });
    if (index === -1) {
        return '';
    }
    return exports.envNumbers[index].number;
};
exports.getTheoremNumber = function (envIndex, env) {
    var envItem = exports.theoremEnvironments[envIndex];
    if (!envItem || !envItem.isNumbered) {
        return "";
    }
    if (envItem.counterName) {
        var parentNum = "";
        switch (envItem.counterName) {
            case "section":
                parentNum = (env === null || env === void 0 ? void 0 : env.section) ? env.section.toString() : "0";
                break;
            case "subsection":
                parentNum = (env === null || env === void 0 ? void 0 : env.section) ? env.section.toString() : "0";
                parentNum += ".";
                parentNum += (env === null || env === void 0 ? void 0 : env.subsection) ? env.subsection.toString() : "0";
                break;
            case "subsubsection":
                parentNum = (env === null || env === void 0 ? void 0 : env.section) ? env.section.toString() : "0";
                parentNum += ".";
                parentNum += (env === null || env === void 0 ? void 0 : env.subsection) ? env.subsection.toString() : "0";
                parentNum += ".";
                parentNum += (env === null || env === void 0 ? void 0 : env.subsubsection) ? env.subsubsection.toString() : "0";
                break;
        }
        if (!parentNum) {
            /** Find new env */
            var counterItem = exports.getTheoremEnvironment(envItem.counterName);
            if (counterItem) {
                parentNum = counterItem.lastNumber;
            }
        }
        if (parentNum) {
            if (envItem.parentNumber !== parentNum) {
                envItem.parentNumber = parentNum;
                envItem.counter = 1;
            }
            else {
                envItem.counter += 1;
            }
            envItem.lastNumber = envItem.parentNumber + '.' + envItem.counter.toString();
            return envItem.lastNumber;
        }
    }
    envItem.counter += 1;
    envItem.lastNumber = envItem.counter.toString();
    return envItem.lastNumber;
};
//# sourceMappingURL=helper.js.map