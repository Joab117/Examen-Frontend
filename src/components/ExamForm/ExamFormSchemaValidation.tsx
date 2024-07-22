import * as Yup from "yup";
import { IQuestion } from "./ExamForm";

export const createValidationSchema = (questions: IQuestion[]) => {
  const schemaObject = questions.reduce(
    (acc: Record<string, any>, question) => {
      const { questionValue } = question;
      return {
        ...acc,
        [questionValue]: Yup.string().required("This is required"),
      };
    },
    {}
  );
  console.log(schemaObject);

  return Yup.object().shape(schemaObject);
};
