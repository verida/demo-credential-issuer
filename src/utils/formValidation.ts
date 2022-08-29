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
  firstName: yup.string().trim().required().label("First Name"),
  did: yup.string().required().length(50).label("DID"),
  lastName: yup.string().trim().required().min(2).label("Last Name"),
  regNumber: yup
    .number()
    .required()
    .min(10000, "Registration Number must have at least 5 digits")
    .label("Registration Number")
    .typeError(`Registration Number must be a number type`),
  regExpDate: yup
    .date()
    .transform(parseDateString)
    .min(
      today,
      `Registration Expiration Date field must be later than "${today.toLocaleDateString()}"`
    )
    .required()
    .label("Registration Expiration Date"),
  healthType: yup.string().required().label("Health Type"),
});
