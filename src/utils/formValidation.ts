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
  firstName: yup.string().required().label("First Name"),
  did: yup
    .string()
    .required()
    .min(50)
    .max(50)
    .label("A valid `DID` must contain 50 characters"),
  lastName: yup.string().required().min(2).label("Last Name"),
  regNumber: yup.number().required().min(5).label("Registration Number"),
  regExpDate: yup
    .date()
    .transform(parseDateString)
    .min(today)
    .required()
    .label("Registration Expiration Date"),
  healthType: yup.string().required().label("Health Type"),
});
