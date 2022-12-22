import express, { Request, Response } from "express";
import cors from "cors";
import gradeEssay from "./utils/grader";
import * as db from "./utils/database";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/", (req: Request, res: Response) => {
    const {name, essay: essayStr} = req.body;
    const {score, feedback, essay} = gradeEssay(essayStr);

    db.saveGrade(name, score, feedback, essay).then((id) => {
        res.status(200).json({ id });
    }).catch((err) => {
        console.error("POST /", err.message);
        res.status(500).json({ message: "Submitting your essay for grading failed. Please try again." })
    });
});

app.get("/grades", (req: Request, res: Response) => {
    db.getGrades().then((grades) => {
        if (grades == null) throw Error("grades not found");
        res.status(200).json(grades);
    }).catch((err) => {
        console.error("GET /admin", err.message);
        res.status(500).json({ message: "Getting the students' essays failed. Please try again." })
    });
});

app.get("/grade/id/:id", (req: Request, res: Response) => {
    const { id } = req.params;

    db.getGrade(id).then((grade) => {
        if (grade == null) throw Error("grade not found");
        res.status(200).json(grade);
    }).catch((err) => {
        console.error(`GET /grade/id/${id}: `, err.message);
        res.status(500).json({ message: `We couldn't find ID ${id} in our database. Please try again.` })
    });
});

app.get("/grade/name/:name", (req: Request, res: Response) => {
    const { name } = req.params;

    db.getID(name).then((id) => {
        res.status(200).json({ id });
    }).catch((err) => {
        console.error(`GET /grade/name/${name}: `, err.message);
        res.status(500).json({ message: `We couldn't find ${name}'s essay. Please try again.` })
    });
})

app.delete("/grade/id/:id", (req: Request, res: Response) => {
    const { id } = req.params;

    db.deleteGrade(id).then(() => {
        res.status(204).end();
    }).catch((err) => {
        console.error(`DELETE /grade/id/${id}: `, err.message);
        res.status(500).json({ message: `Deleting the essay with ID ${id} failed. Please try again.` })
    });
});

app.listen(process.env.PORT || 2020);