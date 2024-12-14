import Popup from "./Popup.js";

export default class PopupWithConfirmation extends Popup {
  constructor(popupSelector) {
    super(popupSelector);
    this._form = document.querySelector(".modal__form");
    this._submitButton = this._form.querySelector(".modal__button");
  }

  setAction(action) {
    this._handleFormSubmit = action;
  }

  setEventListeners() {
    super.setEventListeners();
    this._form.addEventListener("submit", (evt) => {
      evt.preventDefault();
      if (typeof this._handleFormSubmit === "function") {
        this._handleFormSubmit();
      } else {
        console.error("No submit action set for PopupWithConfirmation");
      }
    });
  }
}
