import express, { Request, Response } from "express";
import gradeEssay from "./utils/grader";

const app = express();
app.set("view engine", "ejs");
app.use("/css", express.static("css"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
    res.render("index");
});

app.post("/", (req: Request, res: Response) => {
    res.render("feedback", gradeEssay(req.body.essay));
});

app.listen(2020);