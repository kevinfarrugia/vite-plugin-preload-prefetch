export default (form) => (e) => {
  e.preventDefault();
  Array.from(form.querySelectorAll(".error-msg")).forEach((el) => el.remove());
  let valid = true;
  Array.from(form.querySelectorAll("input")).forEach((input) => {
    if (input.value === "") {
      // eslint-disable-next-line no-param-reassign
      input.style.border = "1px solid red";
      valid = false;
    } else {
      // eslint-disable-next-line no-param-reassign
      input.style.border = "1px solid green";
    }
  });

  if (!valid) {
    form.insertAdjacentHTML(
      "beforeend",
      "<div class='error-msg'>Invalid input.</div>"
    );
  }
  return false;
};
