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
  firstName: yup.string().required().label("Firstname"),
  did: yup
    .string()
    .required()
    .min(50)
    .max(50)
    .label("Valid did must contain 50 characters"),
  lastName: yup.string().required().min(2).label("Last name"),
  regNumber: yup
    .number()
    .required()
    .min(5)
    .label("Registration Number must be greater than or equal to 5"),
  regExpDate: yup.date().transform(parseDateString).min(today).required(),
  healthType: yup.string().required(),
});
