export default class Popup {
  constructor(popupSelector) {
    console.log("popupSelector", popupSelector);
    if (!this._popupElement) {
      // This check happens BEFORE assignment!
      throw new Error(`Popup element not found for selector: ${popupSelector}`);
    }
    this._popupElement = document.querySelector(popupSelector); // Assignment happens after
    this._handleEscClose = this._handleEscClose.bind(this);
  }

  open() {
    this._popupElement.classList.add("modal_opened");
    document.addEventListener("keydown", this._handleEscClose);
  }

  close() {
    this._popupElement.classList.remove("modal_opened");
    document.removeEventListener("keydown", this._handleEscClose);
  }

  _handleEscClose = (evt) => {
    if (evt.key === "Escape") {
      this.close();
    }
  };

  setEventListeners() {
    console.log("this._popupElement", this._popupElement);

    this._popupElement.addEventListener("click", (evt) => {
      console.log("evt", evt.target);

      if (
        evt.target.classList.contains("modal_opened") ||
        evt.target.classList.contains("modal__close")
      ) {
        this.close();
      }
    });
  }
}
