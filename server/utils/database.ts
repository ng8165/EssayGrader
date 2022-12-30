import { Schema, model, connect, set } from "mongoose";

set("strictQuery", true);
connect("mongodb+srv://ng8165:mongodb@cluster0.m0gqwdv.mongodb.net/essay-grader");

type Essay = {
    name: string;
    score: number;
    feedback: number[];
    essay: string[][];
};

const Essay = model<Essay>("essay", new Schema<Essay>({
    name: String,
    score: Number,
    feedback: [Number],
    essay: [[String]]
}));

export async function getGrades() {
    return await Essay.find().select("name score");
}

export async function getEssay(id: string) {
    return await Essay.findById(id);
}

export async function getID(name: string) {
    return (await Essay.findOne({ name }).select("")).id;
}

export async function saveEssay(name: string, score: number, feedback: number[], essay: string[][]): Promise<String> {
    const doc = new Essay({name, score, feedback, essay});
    const { id } = await doc.save();
    return id;
}

export async function deleteEssay(id: string) {
    await Essay.findByIdAndDelete(id);
}
