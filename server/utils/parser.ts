type Token = {
    value: string;
    type: "word" | "phrase" | "sentence" | "space" | "unknown";
    problems: string[];
};

function scan(essayStr): Token[] {
    const tokens: Token[] = [];

    [...essayStr].forEach((c) => {
        if (/[.?!]/.test(c)) {
            tokens.push({ value: c, type: "sentence", problems: [] });
        } else if (/\s/.test(c)) {
            tokens.push({ value: c, type: "space", problems: [] });
        } else if (/\w|[-'‘’]/.test(c)) {
            if (tokens.length === 0 || tokens[tokens.length-1].type !== "word") {
                tokens.push({ value: c, type: "word", problems: [] });
            } else {
                tokens[tokens.length-1].value += c;
            }
        } else {
            tokens.push({value: c, type: "unknown", problems: [] })
        }
    });

    return tokens;
}

export function parseEssay(essayStr: string) {
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

export function compressEssay(essay2D: Token[][]): string[][] {
    const essay = essay2D.flat();
    const compressed = [];

    essay.forEach(({value, problems}, index) => {
        if (index === 0 || problems.length > 0 || essay[index-1].problems.length > 0) {
            compressed.push([value, problems.join(", ")]);
        } else {
            const prev = compressed.pop();
            prev[0] += value;
            compressed.push(prev);
        }
    });

    return compressed;
}