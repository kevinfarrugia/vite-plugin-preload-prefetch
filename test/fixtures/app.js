/* eslint-disable no-undef */
import "./styles.css";
import sum from "./sum";

sum(1, 2);

let formValidationPromise = null;

// dynamically import form-validation on interaction with the form
Array.from(document.querySelectorAll("#myForm input")).forEach((n) =>
  n.addEventListener("blur", async (e) => {
    // Import the form-validation module dynamically
    // This will be a separate chunk in the build
    // and will only be loaded when the form is interacted with
    formValidationPromise = import("./form-validation");

    const { default: validateForm } = await formValidationPromise;
    validateForm(document.querySelector("#myForm"))(e);
  })
);
