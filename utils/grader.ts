import parseEssay from "./parser";

import wordList from "wordlist-english";
const dictionary: string[] = wordList["english"];
import nastyNoNos from "../data/nasty.json";
import prepositions from "../data/prepositions.json";

function binarySearch(arr: string[], key: string): boolean {
    let left = 0, right = arr.length-1;
    key = key.toLowerCase();

    while (left <= right) {
        const mid = Math.trunc((left+right)/2);

        const comp = key.localeCompare(arr[mid].toLowerCase());

        if (comp < 0) right = mid-1;
        else if (comp > 0) left = mid+1;
        else return true;
    }

    return false;
}

const spellcheck = (word: string): boolean => binarySearch(dictionary, word);
const nastyCheck = (word: string): boolean => binarySearch(nastyNoNos, word);
const prepositionCheck = (word: string): boolean => binarySearch(prepositions, word);

export default function gradeEssay(essayStr: string) {
    const {wordCnt, essay} = parseEssay(essayStr);
    console.log(essay);
    let score = 100;

    // nasty nonos: 1%
    essay.forEach((sentence) => sentence.forEach((word) => {
        if (word.type === "word" && nastyCheck(word.value)) {
            score--;
            word.problem.push("Nasty No-No (-1%)")
        }
    }));

    // correct spelling: 1%
    essay.forEach((sentence) => sentence.forEach((word) => {
        if (word.type === "word" && !spellcheck(word.value)) {
            score--;
            word.problem.push("Misspelled Word (-1%)")
        }
    }));

    // sentences start with the same word: 3%
    // TODO

    // sentences end with a preposition: 5%
    essay.forEach((sentence) => {
        for (let i=sentence.length-1; i>=0; i--) {
            if (sentence[i].type !== "word") continue;

            if (prepositionCheck(sentence[i].value)) {
                score -= 5;
                sentence[i].problem.push("Sentence Ends With Preposition (-5%)")
            }

            break;
        }
    });

    // word count restrictions: 50%
    if (wordCnt < 500 || wordCnt > 1000) {
        score -= 50;
        essay[0][0].problem.push(`Essay Length Is Too ${wordCnt < 500 ? "Short" : "Long"} (-50%)`);
    }

    return {
        score: Math.max(-200, score),
        essay: essay
    };
}

/*
const testEssay =
`This is my very good essay! You might ask me why I have written this essay. Well, I simply don't know.
Maybe you do? Nevertheless, I still want to tell you this: I still don't know what I'm writing; I don't think anyone knows what they're doing anyway.
For 15 years, I have been clueless, writing short-term essays and this and that. Anyway, see you later!`;

console.log(gradeEssay(testEssay));
*/