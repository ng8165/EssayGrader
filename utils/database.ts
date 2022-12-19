import { Schema, model, connect, set } from "mongoose";

set("strictQuery", true);
connect("mongodb+srv://ng8165:mongodb@cluster0.m0gqwdv.mongodb.net/essay-grader");

type Grade = {
    name: string;
    score: number;
};

const Grade = model<Grade>("grade", new Schema<Grade>({
    name: { type: String, required: true },
    score: { type: Number, required: true }
}));

export async function getGrades() {
    return await Grade.find();
}

export async function saveGrade(name: string, score: number) {
    const grade = new Grade({name, score});
    await grade.save();
}

export async function deleteGrade(id: string) {
    await Grade.deleteOne({ _id: id });
}
