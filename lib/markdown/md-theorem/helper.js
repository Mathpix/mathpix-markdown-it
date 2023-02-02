"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTheoremNumber = exports.addTheoremLabel = exports.getTheoremNumberByLabel = exports.resetTheoremEnvironments = exports.getTheoremEnvironmentIndex = exports.getTheoremEnvironment = exports.setCounterTheoremEnvironment = exports.addTheoremEnvironment = exports.getNextCounterProof = exports.getEnvironmentsCounterIndex = exports.addEnvironmentsCounter = exports.environmentsCounter = exports.counterProof = exports.theoremLabels = exports.theoremEnvironments = void 0;
var tslib_1 = require("tslib");
exports.theoremEnvironments = [];
/** Global list containing information about references to theorems: reference name, theorem number */
exports.theoremLabels = [];
exports.counterProof = 0;
exports.environmentsCounter = [];
exports.addEnvironmentsCounter = function (data) {
    var index = exports.environmentsCounter.findIndex(function (item) { return item.environment === data.environment; });
    if (index === -1) {
        exports.environmentsCounter.push(data);
    }
};
exports.getEnvironmentsCounterIndex = function (environment) {
    return (exports.environmentsCounter === null || exports.environmentsCounter === void 0 ? void 0 : exports.environmentsCounter.length) ? exports.environmentsCounter.findIndex(function (item) { return item.environment === environment; })
        : -1;
};
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
exports.setCounterTheoremEnvironment = function (envName, num) {
    var _a;
    var envIndex = envName
        ? exports.getTheoremEnvironmentIndex(envName)
        : -1;
    var counterIndex = exports.getEnvironmentsCounterIndex(envName);
    if (envIndex === -1 || counterIndex === -1) {
        return false;
    }
    var envItem = exports.theoremEnvironments[envIndex];
    envItem.counter = num;
    for (var i = 0; i < exports.theoremEnvironments.length; i++) {
        if (exports.theoremEnvironments[i].name === envName && exports.theoremEnvironments[i].lastNumber) {
            var lastNumberArr = exports.theoremEnvironments[i].lastNumber.split(".");
            exports.theoremEnvironments[i].lastNumber = (lastNumberArr === null || lastNumberArr === void 0 ? void 0 : lastNumberArr.length) > 1
                ? lastNumberArr.slice(0, lastNumberArr.length - 1).join(".") + '.' + num.toString()
                : num.toString();
        }
        if ((_a = exports.theoremEnvironments[i].parents) === null || _a === void 0 ? void 0 : _a.length) {
            for (var j = 0; j < exports.theoremEnvironments[i].parents.length; j++) {
                var item = exports.theoremEnvironments[i].parents[j];
                if (item.env === envName) {
                    item.num = num;
                }
            }
            exports.theoremEnvironments[i].parentNumber = getParentNumber(exports.theoremEnvironments[i].parents);
        }
    }
    exports.environmentsCounter[counterIndex].counter = num;
    return true;
};
exports.getTheoremEnvironment = function (name) {
    return (exports.theoremEnvironments === null || exports.theoremEnvironments === void 0 ? void 0 : exports.theoremEnvironments.length) ? exports.theoremEnvironments.find(function (item) { return item.name === name; })
        : null;
};
exports.getTheoremEnvironmentIndex = function (name) {
    return (exports.theoremEnvironments === null || exports.theoremEnvironments === void 0 ? void 0 : exports.theoremEnvironments.length) ? exports.theoremEnvironments.findIndex(function (item) { return item.name === name; })
        : -1;
};
/** Reset global counters for theorems and clear lists storing information about styles and descriptions of theorems */
exports.resetTheoremEnvironments = function () {
    exports.theoremEnvironments = [];
    exports.environmentsCounter = [];
    exports.theoremLabels = [];
    exports.counterProof = 0;
};
exports.getTheoremNumberByLabel = function (envLabel) {
    var index = exports.theoremLabels.findIndex(function (item) { return item.label === envLabel; });
    if (index === -1) {
        return '';
    }
    return exports.theoremLabels[index].number;
};
/** Add a reference to the theorem to the global list theoremLabels
 *  whose elements contain information:
 *    label - reference name
 *    number - theorem number
 * */
exports.addTheoremLabel = function (theoremLabel) {
    var index = (exports.theoremLabels === null || exports.theoremLabels === void 0 ? void 0 : exports.theoremLabels.length) ? exports.theoremLabels.findIndex(function (item) { return item.label === theoremLabel.label; })
        : -1;
    if (index === -1) {
        exports.theoremLabels.push(theoremLabel);
    }
};
var addParentsTheoremEnvironment = function (parentsArr, parents) {
    if (!(parentsArr === null || parentsArr === void 0 ? void 0 : parentsArr.length)) {
        return parentsArr = parentsArr.concat(parents);
    }
    var _loop_1 = function (i) {
        var parent_1 = parents[i];
        var index = parentsArr.findIndex(function (item) { return item.env === parent_1.env; });
        if (index === -1) {
            parentsArr.push(parent_1);
        }
        else {
            parentsArr[index].num = parent_1.num;
        }
    };
    for (var i = 0; i < parents.length; i++) {
        _loop_1(i);
    }
    return parentsArr;
};
var getParentNumber = function (parentsArr) {
    if (!parentsArr || !(parentsArr === null || parentsArr === void 0 ? void 0 : parentsArr.length)) {
        return '';
    }
    var res = '';
    for (var i = 0; i < parentsArr.length; i++) {
        res += res ? '.' : '';
        res += parentsArr[i].num.toString();
    }
    return res;
};
var getTheoremParentNumber = function (counterName, env, parentsArr) {
    var parentNum = "";
    switch (counterName) {
        case "section":
            parentNum = (env === null || env === void 0 ? void 0 : env.section) ? env.section.toString() : "0";
            parentsArr = addParentsTheoremEnvironment(parentsArr, [{ env: "section", num: (env === null || env === void 0 ? void 0 : env.section) ? env === null || env === void 0 ? void 0 : env.section : 0 }]);
            break;
        case "subsection":
            parentNum = (env === null || env === void 0 ? void 0 : env.section) ? env.section.toString() : "0";
            parentsArr = addParentsTheoremEnvironment(parentsArr, [{ env: "section", num: (env === null || env === void 0 ? void 0 : env.section) ? env === null || env === void 0 ? void 0 : env.section : 0 }]);
            parentNum += ".";
            parentNum += (env === null || env === void 0 ? void 0 : env.subsection) ? env.subsection.toString() : "0";
            parentsArr = addParentsTheoremEnvironment(parentsArr, [{ env: "subsection", num: (env === null || env === void 0 ? void 0 : env.subsection) ? env === null || env === void 0 ? void 0 : env.subsection : 0 }]);
            break;
        case "subsubsection":
            parentNum = (env === null || env === void 0 ? void 0 : env.section) ? env.section.toString() : "0";
            parentsArr = addParentsTheoremEnvironment(parentsArr, [{ env: "section", num: (env === null || env === void 0 ? void 0 : env.section) ? env === null || env === void 0 ? void 0 : env.section : 0 }]);
            parentNum += ".";
            parentNum += (env === null || env === void 0 ? void 0 : env.subsection) ? env.subsection.toString() : "0";
            parentsArr = addParentsTheoremEnvironment(parentsArr, [{ env: "subsection", num: (env === null || env === void 0 ? void 0 : env.subsection) ? env === null || env === void 0 ? void 0 : env.subsection : 0 }]);
            parentNum += ".";
            parentNum += (env === null || env === void 0 ? void 0 : env.subsubsection) ? env.subsubsection.toString() : "0";
            parentsArr = addParentsTheoremEnvironment(parentsArr, [{ env: "subsubsection", num: (env === null || env === void 0 ? void 0 : env.subsubsection) ? env === null || env === void 0 ? void 0 : env.subsubsection : 0 }]);
            break;
    }
    if (!parentNum) {
        /** Find new env */
        var counterItem = exports.getTheoremEnvironment(counterName);
        var num = "";
        var numRes = "";
        numRes += (counterItem === null || counterItem === void 0 ? void 0 : counterItem.hasOwnProperty("lastNumber")) ? "" : numRes ? ".0" : "0";
        var arr = [];
        if (!counterItem || !counterItem.isNumbered) {
            return {
                parentNum: parentNum,
                parentsArr: parentsArr,
                isNotFoundCounter: true
            };
        }
        if (!counterItem.counterName) {
            parentsArr = addParentsTheoremEnvironment(parentsArr, [{
                    env: counterItem.name,
                    num: (counterItem === null || counterItem === void 0 ? void 0 : counterItem.counter) ? counterItem === null || counterItem === void 0 ? void 0 : counterItem.counter : 0
                }]);
            return {
                parentNum: ((counterItem === null || counterItem === void 0 ? void 0 : counterItem.counter) ? counterItem === null || counterItem === void 0 ? void 0 : counterItem.counter : 0).toString(),
                parentsArr: parentsArr,
                isNotFoundCounter: false
            };
        }
        if (counterItem && counterItem.counterName) {
            parentsArr = addParentsTheoremEnvironment(parentsArr, tslib_1.__spread(counterItem.parents));
        }
        while (counterItem && counterItem.counterName && !num) {
            if (counterItem.hasOwnProperty("lastNumber")) {
                num = counterItem.lastNumber;
                parentsArr = addParentsTheoremEnvironment(parentsArr, [{
                        env: counterItem.name,
                        num: (counterItem === null || counterItem === void 0 ? void 0 : counterItem.counter) ? counterItem === null || counterItem === void 0 ? void 0 : counterItem.counter : 0
                    }]);
            }
            else {
                numRes += numRes ? ".0" : "0";
                arr.push("0");
                parentsArr = addParentsTheoremEnvironment(parentsArr, [{
                        env: counterItem.name,
                        num: 0
                    }]);
                var data = getTheoremParentNumber(counterItem.counterName, env, tslib_1.__spread(counterItem.parents));
                parentsArr = addParentsTheoremEnvironment(parentsArr, tslib_1.__spread(data.parentsArr));
                num = data.parentNum;
                if (data.isNotFoundCounter) {
                    break;
                }
            }
        }
        parentNum = (arr === null || arr === void 0 ? void 0 : arr.length) ? num + '.' + arr.join(".") : num;
    }
    return {
        parentNum: parentNum,
        parentsArr: parentsArr,
        isNotFoundCounter: false
    };
};
exports.getTheoremNumber = function (envIndex, env) {
    var envItem = exports.theoremEnvironments[envIndex];
    if (!envItem || !envItem.isNumbered) {
        return "";
    }
    if (envItem.useCounter) {
        var envIndexP = exports.getTheoremEnvironmentIndex(envItem.useCounter);
        var envItemP = exports.theoremEnvironments[envIndexP];
        if (envItemP && envItemP.isNumbered) {
            var data = getTheoremParentNumber(envItemP.counterName, env, tslib_1.__spread(envItemP.parents));
            var parentNum = getParentNumber(data.parentsArr);
            var indexCounter_1 = exports.getEnvironmentsCounterIndex(envItem.useCounter);
            if (parentNum) {
                envItem.parents = data.parentsArr;
                envItem.parentNumber = parentNum;
                exports.environmentsCounter[indexCounter_1].counter += 1;
                envItem.counter = exports.environmentsCounter[indexCounter_1].counter;
                envItem.lastNumber = envItem.parentNumber + '.' + envItem.counter.toString();
                envItemP.counter = envItem.counter;
                envItemP.lastNumber = envItem.lastNumber;
                envItemP.parents = envItem.parents;
                envItemP.parentNumber = envItem.parentNumber;
                return envItem.lastNumber;
            }
        }
    }
    if (envItem.counterName) {
        var data = getTheoremParentNumber(envItem.counterName, env, tslib_1.__spread(envItem.parents));
        var parentNum = getParentNumber(data.parentsArr);
        var indexCounter_2 = exports.getEnvironmentsCounterIndex(envItem.name);
        if (parentNum) {
            if (envItem.parentNumber !== parentNum) {
                envItem.parents = data.parentsArr;
                envItem.parentNumber = parentNum;
                exports.environmentsCounter[indexCounter_2].counter = 1;
            }
            else {
                exports.environmentsCounter[indexCounter_2].counter += 1;
            }
            envItem.counter = exports.environmentsCounter[indexCounter_2].counter;
            envItem.lastNumber = envItem.parentNumber + '.' + envItem.counter.toString();
            return envItem.lastNumber;
        }
        if (indexCounter_2 !== -1) {
            exports.environmentsCounter[indexCounter_2].counter += 1;
            envItem.counter = exports.environmentsCounter[indexCounter_2].counter;
            envItem.lastNumber = envItem.counter.toString();
            return envItem.lastNumber;
        }
    }
    var indexCounter = exports.getEnvironmentsCounterIndex(envItem.name);
    if (indexCounter !== -1) {
        exports.environmentsCounter[indexCounter].counter += 1;
    }
    envItem.counter += 1;
    envItem.lastNumber = envItem.counter.toString();
    return envItem.lastNumber;
};
//# sourceMappingURL=helper.js.map