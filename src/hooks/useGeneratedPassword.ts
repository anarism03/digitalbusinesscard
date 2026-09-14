import { useState } from "react";
import { copyToClipboard } from "../utils/feedback";
import { generateTemporaryPassword } from "../utils/password";

export function useGeneratedPassword(
  initialValue = generateTemporaryPassword(),
) {
  const [value, setValue] = useState(initialValue);

  const regenerate = () => setValue(generateTemporaryPassword());
  const copy = () => copyToClipboard(value);

  return { value, setValue, regenerate, copy };
}
