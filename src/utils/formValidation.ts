import { parse, isDate } from "date-fns";
import * as yup from "yup";

const parseDateString = (value: string, originalValue: string) => {
  const parsedDate = isDate(originalValue)
    ? originalValue
    : parse(originalValue, "yyyy-MM-dd", new Date());

  return parsedDate;
};
const today = new Date();

export const formSchema = yup.object({
  firstName: yup.string().required().label("firstname"),
  did: yup
    .string()
    .required()
    .min(50)
    .max(50)
    .label("valid did must contain 50 characters"),
  lastName: yup.string().required().min(4).label("last name"),
  regNumber: yup
    .number()
    .required()
    .min(5)
    .label("min of 5 numbers characters"),
  regExpDate: yup.date().transform(parseDateString).max(today).required(),
  healthType: yup.string().required(),
});
