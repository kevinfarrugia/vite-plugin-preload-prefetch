/* eslint-disable no-undef */
import "./styles.css";
import sum from "./sum";

sum(1, 2);

// dynamically import form-validation on interaction with the form
document.querySelectorAll("#myForm input").addEventListener(
  "blur",
  async () => {
    // Get the form validation named export from the module through destructuring
    const { validateForm } = await import("./form-validation");

    // Validate the form
    validateForm();
  },
  { once: true }
);
