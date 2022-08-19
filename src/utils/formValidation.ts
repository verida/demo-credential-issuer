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
  firstName: yup.string().trim().required().label("First name"),
  did: yup.string().required().min(50).max(50).label("Valid DID"),
  lastName: yup.string().required().min(2).label("Last name"),
  regNumber: yup
    .number()
    .required()
    .min(5, "Registration Number must be greater than or equal to 5")
    .label("Registration Number"),
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
