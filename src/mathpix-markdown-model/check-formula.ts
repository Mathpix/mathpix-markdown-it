export const checkFormula = (mathString:string, showTimeLog:boolean=false) => {
    const startTime = new Date().getTime();
    let res_mathString = "";

    let idx = 0;
    while ( idx < mathString.length) {
        let startMathPos = idx;
        let endMarker; // eslint-disable-line

        if (mathString.charCodeAt(startMathPos) === 0x24 /* $ */) {
            endMarker = "$";
            if (mathString.charCodeAt(++startMathPos) === 0x24 /* $ */) {
                endMarker = "$$";
            }
        } else {
            if (mathString.charCodeAt(startMathPos) !== 0x5c /* \ */){
                res_mathString = res_mathString + mathString[idx];
                idx++;
                continue;
            }
            const match = mathString
                .slice(++startMathPos)
                .match(/^(?:\\\[|\[|\\\(|\(|$|$$|begin\{([^}]*)\}|eqref\{([^}]*)\})/); // eslint-disable-line

            if (!match) {
                res_mathString = res_mathString + mathString[idx];
                idx++;
                continue;
            }

            startMathPos += match[0].length;

            if (match[0] === "\\[") { endMarker = "\\\\]"; }
            else if (match[0] === "\[") { endMarker = "\\]"; }
            else if (match[0] === "\\(") { endMarker = "\\\\)"; }
            else if (match[0] === "\(") { endMarker = "\\)"; }
            else if (match[0].includes("eqref")) { endMarker = ""; }
            else if (match[1]) { endMarker = `\\end{${match[1]}}`; }
        }

        const endMarkerPos = mathString.indexOf(endMarker, startMathPos);

        if (endMarkerPos === -1) {
            res_mathString = res_mathString + mathString.substr(idx, mathString.length);
            break
        }
        const ln =  mathString.indexOf(endMarker, startMathPos)+endMarker.length;
        const str2 = mathString.substr(idx, ln-idx).split("\n").join("");

        res_mathString = res_mathString + str2;

        const nextPos = endMarkerPos + endMarker.length;
        idx = nextPos;
    }
    const endTime = new Date().getTime();
    if(showTimeLog) {
        console.log(`=> checkFormula: ${endTime - startTime}ms`);
    }
    return res_mathString;
};