import express, { Request, Response } from "express";
import cors from "cors";
import gradeEssay from "./utils/grader";
import { getGrades, getGrade, saveGrade, deleteGrade } from "./utils/database";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/", (req: Request, res: Response) => {
    const {name, essay: essayStr} = req.body;
    const {score, feedback, essay} = gradeEssay(essayStr);

    saveGrade(name, score, feedback, essay).then((id) => {
        res.status(200).json({ id });
    })
});

app.get("/admin", (req: Request, res: Response) => {
    getGrades().then((grades) => {
        res.status(200).json(grades);
    });
});

app.get("/grade/:id", (req: Request, res: Response) => {
    getGrade(req.params.id).then((grade) => {
        res.status(200).json(grade);
    });
});

app.delete("/grade/:id", (req: Request, res: Response) => {
    deleteGrade(req.params.id).then(() => {
        res.status(204).end();
    });
});

app.listen(process.env.PORT || 2020);