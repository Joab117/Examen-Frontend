"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import { createValidationSchema } from "./ExamFormSchemaValidation";

export interface IOptions {
  optionValue: string;
  optionName: string;
}

export interface IQuestion {
  questionValue: string;
  question: string;
  options: IOptions[];
  correctOption: string;
}

interface IQuestionResult {
  questionValue: string;
  option: string;
}

interface IFormData {
  [question: string]: string;
}

interface IFormResult {
  totalCorrectAnswers: number;
  totalAnswers: number;
}

export const ExamForm = () => {
  const [questionList, setQuestionList] = useState<IQuestion[]>([]);
  const [formResult, setFormResult] = useState<IFormResult>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3004/questions");
        const jsonData = await response.json();
        setQuestionList(jsonData);
      } catch (error) {
        console.error("error when trying to retrieve the data", error);
      }
    };

    fetchData();
  }, []);

  const castIFormDataToIQuestionResultList = (values: IFormData) => {
    const questionResultList: IQuestionResult[] = Object.entries(values).map(
      ([questionValue, option]) => ({ questionValue, option })
    );

    return questionResultList;
  };

  const sendToApi = async (questionResultList: IQuestionResult[]) => {
    try {
      const response = await fetch("http://localhost:3004/questions/result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionResult: questionResultList }),
      });

      if (!response.ok) {
        throw new Error("Failed to post data");
      }

      const responseData: IFormResult = await response.json();
      setFormResult(responseData);
      console.log("response data:", responseData);
    } catch (error) {
      console.error("error when trying to send data to API", error);
    }
  };

  const handleSubmit = (
    values: IFormData,
    { resetForm }: { resetForm: () => void }
  ) => {
    console.log(values);
    const questionResultList: IQuestionResult[] =
      castIFormDataToIQuestionResultList(values);

    sendToApi(questionResultList);
    resetForm();
  };
  return (
    <div className="flex flex-col gap-[10px]">
      <h1 className=" font-bold">Test de Halo</h1>
      <Formik
        validationSchema={createValidationSchema(questionList)}
        initialValues={Object.fromEntries(
          questionList.map((question) => [question.questionValue, ""])
        )}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className="flex flex-col gap-[15px]">
            {questionList.map((question) => (
              <div
                className="flex flex-col gap-[10px] bg-orange-400 rounded-md text-slate-950 p-[5px]"
                key={question.questionValue}
              >
                <label htmlFor={question.questionValue}>
                  {question.question}
                </label>
                <Field
                  as="select"
                  name={question.questionValue}
                  id={question.questionValue}
                >
                  <option value="">Select an Option</option>
                  {question.options.map((option) => (
                    <option key={option.optionValue} value={option.optionValue}>
                      {option.optionName}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  className="text-red-700 font-medium"
                  name={question.questionValue}
                  component="div"
                />
              </div>
            ))}
          </div>
          <button
            className="rounded-md p-[5px] bg-orange-600 mt-3"
            type="submit"
          >
            Submit
          </button>
        </Form>
      </Formik>
      {formResult && <ShowResult result={formResult} />}
    </div>
  );
};

interface ShowResultProps {
  result: IFormResult;
}

const ShowResult = ({ result }: ShowResultProps) => {
  return (
    <div className="p-[10px] bg-orange-600 rounded-md">
      <div className="p-[5px] flex flex-col gap-[10px] text-[20px] bg-slate-50 text-zinc-950 font-light">
        <h2>Correct Answers:</h2>
        {result.totalCorrectAnswers}
        <h2>Total Answers:</h2>
        {result.totalAnswers}
      </div>
    </div>
  );
};
