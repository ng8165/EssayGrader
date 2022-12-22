import { Schema, model, connect, set } from "mongoose";

set("strictQuery", true);
connect("mongodb+srv://ng8165:mongodb@cluster0.m0gqwdv.mongodb.net/essay-grader");

type Grade = {
    name: string;
    score: number;
    feedback: (string | number)[];
    essay: string;
};

const Grade = model<Grade>("grade", new Schema<Grade>({
    name: { type: String, required: true },
    score: { type: Number, required: true },
    feedback: { type: Array, required: true },
    essay: { type: String, required: true },
}));

export async function getGrades() {
    const grades = await Grade.find();
    return grades.map(({name, score, id}) => ({name, score, id}));
}

export async function getGrade(id: string) {
    return await Grade.findById(id);
}

export async function saveGrade(name: string, score: number, feedback: number[], essay: string): Promise<String> {
    const grade = new Grade({name, score, feedback, essay});
    const { id } = await grade.save();
    return id;
}

export async function deleteGrade(id: string) {
    await Grade.deleteOne({ _id: id });
}
