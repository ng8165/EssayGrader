import { Schema, model, connect, set } from "mongoose";

set("strictQuery", true);
connect("mongodb+srv://ng8165:mongodb@cluster0.m0gqwdv.mongodb.net/essay-grader");

type Grade = {
    name: string;
    score: number;
    feedback: number[];
    essay: string[][];
};

const Grade = model<Grade>("grade", new Schema<Grade>({
    name: String,
    score: Number,
    feedback: [Number],
    essay: [[String]]
}));

export async function getGrades() {
    return await Grade.find().select("name score");
}

export async function getGrade(id: string) {
    return await Grade.findById(id);
}

export async function getID(name: string) {
    return (await Grade.findOne({ name }).select("")).id;
}

export async function saveGrade(name: string, score: number, feedback: number[], essay: string[][]): Promise<String> {
    const grade = new Grade({name, score, feedback, essay});
    const { id } = await grade.save();
    return id;
}

export async function deleteGrade(id: string) {
    await Grade.findByIdAndDelete(id);
}
