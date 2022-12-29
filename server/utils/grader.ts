import { parseEssay, compressEssay } from "./parser";

import { english as dictionary } from "wordlist-english";
import nastyNoNos from "../data/nasty.json";
import prepositions from "../data/prepositions.json";

function binarySearch(arr: string[], key: string): boolean {
    let left = 1; // "OK" is at position 0; the rest of the list is sorted correctly
    let right = arr.length-1;
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
    const essay = parseEssay(essayStr);
    let nasty = 0, spelling = 0, start = 0, prep = 0, words = 0, score = 100;

    // nasty nonos: 1%
    essay.forEach((sentence) => sentence.forEach((word) => {
        if (word.type === "word" && nastyCheck(word.value)) {
            score--;
            nasty++;
            word.problems.push("Nasty No-No (-1%)")
        }
    }));

    // correct spelling: 1%
    essay.forEach((sentence) => sentence.forEach((word) => {
        if (word.type === "word" && !spellcheck(word.value)) {
            score--;
            spelling++;
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
                start++;
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
            prep++;
            sentence[i].problems.push("Sentence Ends With Preposition (-5%)")
        }
    });

    // word count restrictions: 50%
    essay.forEach((sentence) => sentence.forEach((word) => {
        if (word.type === "word" || word.type === "unknown")
            words++;
    }));

    if (words < 500 || words > 1000)
        score -= 50;

    return {
        score: Math.max(-200, score),
        essay: compressEssay(essay),
        feedback: [nasty, spelling, start, prep, words, score]
    };
}