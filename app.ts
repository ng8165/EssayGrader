import express, { Request, Response } from "express";

const app = express();
app.use(express.static("pages"));

app.get("/", (req: Request, res: Response) => {
    res.sendFile(`${__dirname}/pages/index.html`);
});

app.listen(2020);