import express, { Request, Response } from "express";
import gradeEssay from "./utils/grader";
import { getGrades, saveGrade, deleteGrade } from "./utils/database";

const app = express();
app.set("view engine", "ejs");
app.use("/css", express.static("css"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
    res.render("submit");
});

app.post("/", (req: Request, res: Response) => {
    const {name, essay: essayStr} = req.body;
    const essay = gradeEssay(essayStr);
    const {score} = essay;

    saveGrade(name, score).then(() => {
        res.render("feedback", essay);
    });
});

app.get("/admin", (req: Request, res: Response) => {
    getGrades().then((grades) => {
        res.render("admin", {grades})
    });
});

app.post("/admin", (req: Request, res: Response) => {
    deleteGrade(req.body.id).then(() => {
        res.redirect("/admin");
    });
})

app.listen(process.env.PORT || 2020);