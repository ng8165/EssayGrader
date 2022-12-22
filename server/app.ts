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
        res.status(500).json({ message: err.message })
    });
});

app.get("/admin", (req: Request, res: Response) => {
    db.getGrades().then((grades) => {
        res.status(200).json(grades);
    }).catch((err) => {
        res.status(500).json({ message: err.message })
    });
});

app.get("/grade/id/:id", (req: Request, res: Response) => {
    db.getGrade(req.params.id).then((grade) => {
        res.status(200).json(grade);
    }).catch((err) => {
        res.status(500).json({ message: err.message })
    });
});

app.get("/grade/name/:name", (req: Request, res: Response) => {
    db.getID(req.params.name).then((id) => {
        res.status(200).json({ id });
    }).catch((err) => {
        res.status(500).json({ message: err.message })
    });
})

app.delete("/grade/id/:id", (req: Request, res: Response) => {
    db.deleteGrade(req.params.id).then(() => {
        res.status(204).end();
    }).catch((err) => {
        res.status(500).json({ message: err.message })
    });
});

app.listen(process.env.PORT || 2020);