type Token = {
    value: string;
    type: "word" | "phrase" | "sentence" | "space";
    problem: string[];
};

function scan(essayStr): Token[] {
    const tokens: Token[] = [];

    [...essayStr].forEach((c) => {
        if (/[.?!]/.test(c)) {
            tokens.push({ value: c, type: "sentence", problem: [] });
        } else if (/[,:;]/.test(c)) {
            tokens.push({ value: c, type: "phrase", problem: [] });
        } else if (/\s/.test(c)) {
            tokens.push({ value: c, type: "space", problem: [] });
        } else {
            if (tokens.length === 0 || tokens[tokens.length-1].type !== "word") {
                tokens.push({ value: c, type: "word", problem: [] });
            } else {
                tokens[tokens.length-1].value += c;
            }
        }
    });

    return tokens;
}

export default function parseEssay(essayStr: string) {
    const tokens = scan(essayStr);

    let wordCnt = 0;
    tokens.forEach((token) => {
        if (token.type === "word")
            wordCnt++;
    });

    const essay: Token[][] = [[]];
    tokens.forEach((token) => {
        essay[essay.length-1].push(token);

        if (token.type === "sentence")
            essay.push([]);
    });

    if (essay[essay.length-1].length === 0)
        essay.pop();

    return {wordCnt: wordCnt, essay: essay};
}

export function unParseEssay(essay: Token[][]): string {
    let essayStr = "";
    essay.forEach((sentence) => sentence.forEach((word) => essayStr += word.value));
    return essayStr;
}

/*
const testEssay =
`This is my very good essay! You might ask me why I have written this essay. Well, I simply don't know.
Maybe you do? Nevertheless, I still want to tell you this: I still don't know what I'm writing; I don't think anyone knows what they're doing anyway.
For 15 years, I have been clueless, writing short-term essays and this and that. Anyway, see you later!`;

const {wordCnt, essay} = parseEssay(testEssay);
console.log(essay);
console.log(unParseEssay(essay));
*/