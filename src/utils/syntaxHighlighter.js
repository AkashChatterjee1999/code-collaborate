const codeColors = require("../config/jsCodeColors.json");
const codeClassDetector = require("../config/jsCodeMapDetectors.json");

const syntaxHighlighter = code => {
    console.log(code);
    let tokens = code.split(" "), color=codeColors["text"], res = "", codeDiv = "";
    if(tokens.length===0) {
        console.log("YES");
        return `<span style="color: ${color}">${code}</span>`
    }
    tokens.forEach((token, index) => {
        if(token.match(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g)) color = codeColors["punctation"];
            else if(codeClassDetector["keyword"].includes(token)) color = codeColors["keyword"];
            else if(codeClassDetector["operator"].includes(token)) color = codeColors["operator"];
            else if(token.match(/^\"(\d\w)*\"$/ig)) color = codeColors["string"];
            else if(token.includes("(") && token.includes("(")) color = codeColors["function"];   
            if(token === '\n') {
                res = `<code>${res}</code><br/>`;
                codeDiv = ""
            } else {
                res += `<span style="color: ${color}">${token + " "}</span>`
                codeDiv = ""+res;   
            }
    });
    return res;
}

export default syntaxHighlighter;