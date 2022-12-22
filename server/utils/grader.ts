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

    const feedback = [0, 0, 0, 0, wordCnt, 100];
    // 0: nasty no nos, 1: spelling errors, 2: same starting word, 3: ending with preposition, 4: word count, 5: score

    // nasty nonos: 1%
    essay.forEach((sentence) => sentence.forEach((word) => {
        if (word.type === "word" && nastyCheck(word.value)) {
            feedback[5]--; // score
            feedback[0]++; // nasty no nos
            word.problems.push("Nasty No-No (-1%)")
        }
    }));

    // correct spelling: 1%
    essay.forEach((sentence) => sentence.forEach((word) => {
        if (word.type === "word" && !spellcheck(word.value)) {
            feedback[5]--; // score
            feedback[1]++; // spelling
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
                feedback[5] -= 3; // score
                feedback[2]++; // same starting word
                firstWords[j].problems.push("Sentence Starts With The Same Word (-3%)");
            }
        }
    }

    // sentences end with a preposition: 5%
    essay.forEach((sentence) => {
        let i = sentence.length-1;
        while (i>=0 && sentence[i].type !== "word") i--;

        if (prepositionCheck(sentence[i].value)) {
            feedback[5] -= 5; // score
            feedback[3]++; // ending with preposition
            sentence[i].problems.push("Sentence Ends With Preposition (-5%)")
        }
    });

    // word count restrictions: 50%
    if (wordCnt < 500 || wordCnt > 1000)
        feedback[5] -= 50; // score

    return {
        score: Math.max(-200, feedback[5]),
        essay: getHTML(essay),
        feedback
    };
}

/*
const testEssay =
`This is my very good essay! You might ask me why I have written this essay. Well, I simply don't know.
Maybe you do? Nevertheless, I still want to tell you this: I still don't know what I'm writing; I don't think anyone knows what they're doing anyway.
For 15 years, I have been clueless, writing short-term essays and this and that. Anyway, see you later!`;

console.log(gradeEssay(testEssay));
*/