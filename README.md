# Essay Grader Project Design

*Revised December 29, 2022*

[essay-grader.netlify.app](https://essay-grader.netlify.app)

[![Netlify Status](https://api.netlify.com/api/v1/badges/24c2a4e4-6714-4194-8da4-0b1341dde2b2/deploy-status)](https://app.netlify.com/sites/essay-grader/deploys)

**Note**: the backend server instance at [essay-grader.onrender.com](https://essay-grader.onrender.com/) may need ~30 seconds to wake up before the frontend can respond. You can click [here](https://essay-grader.onrender.com/) to wake up the server before visiting [essay-grader.netlify.app](https://essay-grader.netlify.app).

## Overview

### The Problem

Mr. Mark Adams does not want to grade his student’s essays. Since he grades in an algorithmic manner (see [below](#grader) for more details), he has proposed that we create an application for his students to submit essays that can be automatically graded and receive feedback.

In addition, Mr. Adams would like us to include a system to detect plagiarized essays. Any plagiarized essay should get 0%. However, he does not currently need this system.

### The Solution

Our application will have two major components: a submission form for students and an administrative page for Mr. Adams to see the grades.

Students will be able to submit their essays by pasting them into a form. They will then receive feedback and the grade. This feedback will include a summary of the issues in the essay and will also highlight certain words in the essay to show where the errors occurred. Students can also view the feedback for previously submitted essays by entering their names.

Mr. Adams will be able to use the admin page to view the grades of submitted essays. He has told us that he does not care about the content of his students’ essays, but we have built the functionality for him to view the essay and feedback through the admin page. He can also delete grades and essays.

## Design

### Frontend

The frontend (located in the folder `/client`) is made with [Vue.js 3](https://vuejs.org/) and is written in Typescript. I used [Tailwind CSS](https://tailwindcss.com/) for styling and [Popper.js](https://popper.js.org/) for tooltips to provide specific feedback on individual words in the essay. The frontend uses network requests to communicate with the backend. Here is a summary of the webpage routes:

- `/`: used by students to submit new essays and search for submitted essays by name.
- `/feedback/:id`: used to view the feedback of a specific essay through a provided ID. Shows the feedback, grade, and the essay itself.
- `/admin`: used by Mr. Adams to view his students’ grades, view feedback, and delete submissions.

### Backend

The backend (located in the folder `/server`) is made with [Node.js](https://nodejs.org/) and [Express](https://expressjs.com/). I am using the [ts-node](https://typestrong.org/ts-node/) package to use Typescript.

#### REST API

The REST API is used to submit essays, send feedback, and view grades. Here is a summary of the API routes (see the file `server/app.ts`):

- `POST /essay`: used to submit new essays. Uses the server to grade the essay, saves the grade and feedback in the database, and sends back the ID.
- `GET /grades`: used by the admin page to get the scores, names, and IDs of submitted essays.
- `GET /essay/id/:id`: used by the feedback page to get the grade, essay, and feedback by a supplied ID.
- `GET /essay/name/:name`: searches for an essay through a name and returns its ID.
- `DELETE /essay/id/:id`: used by the admin page to delete an essay through its ID.

#### Parser

The parser (located in the file `server/utils/parser.ts`) uses the `scan` function to split an essay string into tokens. The `Token` type represents each token and has the following attributes:

- `value` (string): the value of the token
- `type` (string): the type of the token. Token types include:
    - `word`: a string of alphanumeric characters as well as the underscore, hyphen, and single quotation mark
    - `phrase`: phrase delimiters, including commas, colons, and semicolons
    - `sentence`: sentence delimiters, including periods, question marks, and exclamation marks
    - `space`: any whitespace character, including carriage returns and new lines
    - `unknown`: any other character
- `problems` (string array): stores each error that this token has

The parser then uses the `parseEssay` function to split the token array by sentence delimiters.

#### Grader

The grader (located in the file `server/utils/grader.ts`) uses the `gradeEssay` function to grade with Mr. Adams’s current policy, which is as follows:

Start from 100%. Deduct:

- 1% for nasty no-nos (examples: "very," "really," any tense of get)
    - To do this, I used a list (see `server/data/nasty.json`) and binary searched for every `word` token.
- 1% for any spelling mistake (proper nouns are spelling mistakes)
    - I used an npm library ([wordlist-english](https://www.npmjs.com/package/wordlist-english)) and binary searched for every `word` token.
- 3% for a pair of sentences starting with the same word, separated by no more than 3 sentences in between, exclusive (no double counting)
    - I created a list of the first `word` token of every sentence, then used a nested for loop to iterate through each pair within 3 sentences of each other.
- 5% for any sentence that ends in a preposition (examples: "for," "of")
    - I used a list (see `server/data/prepositions.json`) and binary searched every `word` token.
- 50% for any essay not between 500 and 1000 words
    - I used a for loop to count every single `word` token.

The minimum grade for any essay Mr. Adams will give is -200%. For each error, I also add the error (as a string) to the token in the `problems` array.

### Database

I am using [MongoDB](https://www.mongodb.com/) and [Mongoose](https://mongoosejs.com/) to allow the backend to communicate with the database. I have written various functions to communicate with the database (see `server/utils/database.ts`). The documents are stored in a collection called an `essay`, which is stored in the `essay-grader` database. Each document stores:

- `name` (string):  the student’s name
- `score` (number): the essay score
- `feedback` (number array): the feedback paragraph
    - The feedback includes how many errors of each type were made and how many points were taken off because of that error. This is stored as an array of numbers, with each index in the array representing a specific error.
- `essay` (nested string array): the essay with feedback on individual words
    - In order to compress the essay to store and transmit less data, I combine adjacent tokens with no errors together and only construct a new token if that token has an error. (see the `compressEssay` function in `server/utils/parser.ts`)

## Plans

I currently have not implemented plagiarism detection. To do this, I would need to store the essay string in the database. I could use a text difference package like [diff](https://www.npmjs.com/package/diff) to see differences.