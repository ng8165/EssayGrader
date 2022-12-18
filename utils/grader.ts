import { parseEssay, getHTML } from "./parser";

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

    let score = 100;
    const feedback = {
        nastyNoNos: 0,
        spelling: 0,
        sameStart: 0,
        prepositionEnd: 0,
        wordCnt: "",
        score: ""
    };

    // nasty nonos: 1%
    essay.forEach((sentence) => sentence.forEach((word) => {
        if (word.type === "word" && nastyCheck(word.value)) {
            score--;
            feedback.nastyNoNos++;
            word.problems.push("Nasty No-No (-1%)")
        }
    }));

    // correct spelling: 1%
    essay.forEach((sentence) => sentence.forEach((word) => {
        if (word.type === "word" && !spellcheck(word.value)) {
            score--;
            feedback.spelling++;
            word.problems.push("Misspelled Word (-1%)")
        }
    }));

    // sentences start with the same word: 3%
    const firstWords = essay.map((sentence) => {
        let i = 0;
        while (i<sentence.length-1 && sentence[i].type !== "word") i++;
        return sentence[i];
    });

    for (let i=0; i<firstWords.length; i++) {
        for (let j=i+1; j<firstWords.length; j++) {
            if (firstWords[i].value === firstWords[j].value && j-i < 3) {
                score -= 3;
                feedback.sameStart++;
                firstWords[j].problems.push("Sentence Starts With The Same Word (-3%)");
            }
        }
    }

    // sentences end with a preposition: 5%
    essay.forEach((sentence) => {
        let i = sentence.length-1;
        while (i>=0 && sentence[i].type !== "word") i--;

        if (prepositionCheck(sentence[i].value)) {
            score -= 5;
            feedback.prepositionEnd++;
            sentence[i].problems.push("Sentence Ends With Preposition (-5%)")
        }
    });

    // word count restrictions: 50%
    if (wordCnt < 500 || wordCnt > 1000) {
        score -= 50;
        feedback.wordCnt = `${wordCnt} words — Too ${wordCnt < 500 ? "Short" : "Long"} (-50%)`;
    } else {
        feedback.wordCnt = `${wordCnt} words — Good`;
    }

    if (score >= -200) feedback.score = `${score}%`;
    else feedback.score = `${score}% was rounded up to -200%`;

    return {
        score: Math.max(-200, score),
        essay: getHTML(essay),
        feedback: feedback
    };
}

/*
const testEssay =
`This is my very good essay! You might ask me why I have written this essay. Well, I simply don't know.
Maybe you do? Nevertheless, I still want to tell you this: I still don't know what I'm writing; I don't think anyone knows what they're doing anyway.
For 15 years, I have been clueless, writing short-term essays and this and that. Anyway, see you later!`;

console.log(gradeEssay(testEssay));
*/