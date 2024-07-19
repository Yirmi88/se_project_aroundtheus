// let isValid = true;

// if (!nameInput.validity.valid) {
//   showInputError(profileTitleInput);
//   isValid = false;
// } else {
//   hideInputError(profileTitleInput);
// }

// if (!descriptionInput.validity.valid) {
//   showInputError(profileDescriptionInput);
//   isValid = false;
// } else {
//   hideInputError(profileDescriptionInput);
// }

// if (isValid) {
//   profileTitle.textContent = profileTitleInput.value;
//   profileDescription.textContent = profileDescriptionInput.value;
// }
// closemodal();

function showInputError(formEl, inputEl, options) {
  const errorMessageEl = formEl.querySelector(`#${inputEl.id}-error`);
  if (!errorMessageEl) {
    return;
  }
  inputEl.classList.add(options.inputErrorClass);
  errorMessageEl.textContent = inputEl.validationMessage;
  errorMessageEl.classList.add(options.errorClass);
  // errorMessageEl.style.visibility = "visible";
}
function hideInputError(formEl, inputEl, options) {
  const errorMessageEl = formEl.querySelector(`#${inputEl.id}-error`);
  inputEl.classList.remove(options.inputErrorClass);
  errorMessageEl.textContent = "";
  errorMessageEl.classList.remove(options.errorClass);
}

function checkInputValidity(formEl, inputEl, options) {
  if (!inputEl.validity.valid) {
    return showInputError(formEl, inputEl, options);
  }
  hideInputError(formEl, inputEl, options);
}

function hasInvalidInput(inputList) {
  return !inputList.every((inputEl) => inputEl.validity.valid);
}

function disableButton() {
  if (!isValid) {
    button.classList.add(inactiveButtonClass);
    button.disabled = true;
  } else {
    button.classList.remove(inactiveButtonClass);
    button.disabled = true;
  }
}

// function enableButtton(submitButton) {
//   const { inactiveButtonClass } = options;
//   submitButton.classList.add(inactiveButtonClass);
//   submitButton.disabled = false;
//   return;
// }

// function disableButton(submitButton) {
//   const { inactiveButtonClass } = options;
//   submitButton.classList.remove(inactiveButtonClass);
//   submitButton.disabled = true;
//   return;
// }

function toggleButtonState(inputEls, submitButton, { inactiveButtonClass }) {
  if (hasInvalidInput(inputEls)) {
    submitButton.classList.add(inactiveButtonClass);
    return submitButton.disabled - true;
  }

  submitButton.classList.remove(inactiveButtonClass);
  submitButton.disabled = false;
}

function setEventListeners(formEl, options) {
  const { inputSelector } = options;
  const { submitButtonSelector } = options;

  const submitButton = formEl.querySelector(submitButtonSelector);
  const inputEls = Array.from(formEl.querySelectorAll(inputSelector));
  inputEls.forEach((inputEl) => {
    inputEl.addEventListener("input", (e) => {
      checkInputValidity(formEl, inputEl, options);
      toggleButtonState(inputEls, submitButton, options);
    });
  });
}

const options = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__button",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};
enableValidation(options);

function enableValidation(options) {
  const { formSelector } = options;
  const formEls = Array.from(document.querySelectorAll(options.formSelector));
  formEls.forEach((formEl) => {
    formEl.addEventListener("submit", (e) => {
      e.preventDefault();
    });
    setEventListeners(formEl, options);
  });
}
