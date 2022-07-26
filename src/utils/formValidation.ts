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
  firstName: yup.string().required().label("First name"),
  did: yup
    .string()
    .required()
    .min(50)
    .max(50)
    .label("Valid did must contain 50 characters"),
  lastName: yup.string().required().min(4).label("Last name"),
  regNumber: yup
    .number()
    .required()
    .min(5)
    .label("Registration Number is a required field"),
  regExpDate: yup
    .date()
    .transform(parseDateString)
    .max(today)
    .required()
    .label("Registration Expiration Date"),
  healthType: yup.string().required().label("Health Type"),
});
