import Popup from "./Popup.js";

export default class PopupWithConfirmation extends Popup {
  constructor(popupSelector) {
    super(popupSelector);
    this._form = this._popupElement.querySelector(".modal__form");
    this._submitButton = this._form.querySelector(".modal__button");
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  setAction(action) {
    this._handleFormSubmit = action;
  }

  _handleSubmit(evt) {
    evt.preventDefault();
    if (typeof this._handleFormSubmit === "function") {
      this._handleFormSubmit();
    } else {
      console.error("No submit action set for PopupWithConfirmation");
    }
  }

  setEventListeners() {
    super.setEventListeners();
    this._form.addEventListener("submit", this._handleSubmit);
  }

  close() {
    super.close();
    this._handleFormSubmit = null;
  }

  open() {
    super.open();
    if (this._submitButton) {
      this._submitButton.disabled = false;
    }
  }
}
