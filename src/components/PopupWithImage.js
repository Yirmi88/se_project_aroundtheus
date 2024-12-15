import Popup from "./Popup.js";

export default class PopupWithImage extends Popup {
  constructor(popupSelector) {
    super(popupSelector);
    this._previewImage = this._popupElement.querySelector(".modal__image");
    this._previewTitle = this._popupElement.querySelector(
      ".modal__image-title"
    );
  }

  open(data) {
    this._previewImage.src = data.link;
    this._previewImage.alt = data.name;
    this._previewTitle.textContent = data.name;
    super.open();
  }

  // open(data) {
  //   const img = new Image();
  //   img.src = data.link;

  //   img.onload = () => {
  //     this._previewImage.src = data.link;
  //     this._previewImage.alt = data.name;
  //     this._previewTitle.textContent = data.name;
  //     super.open();
  //   };

  //   img.onerror = () => {
  //     console.error("Error loading image");
  //     // Optionally handle the error case
  //   };
  // }
}
