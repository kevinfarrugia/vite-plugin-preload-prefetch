export default (form) => (e) => {
  e.preventDefault();
  form.querySelectorAll(".error-msg").forEach((el) => el.remove());
  form.querySelectorAll("input").forEach((input) => {
    // eslint-disable-next-line no-param-reassign
    input.style.border = "1px solid red";
  });
  form.insertAdjacentHTML(
    "beforeend",
    "<div class='error-msg'>Invalid input.</div>"
  );
  return false;
};
