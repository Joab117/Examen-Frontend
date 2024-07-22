"use client";
import { ExamForm } from "@/components/ExamForm/ExamForm";
import questions from "@/components/ExamForm/ExamForm.data";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-green-950">
      <ExamForm questions={questions} />
    </main>
  );
}
