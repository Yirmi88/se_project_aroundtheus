import Popup from "./Popup.js";

export default class PopupWithImage extends Popup {
  constructor(popupSelector) {
    super({ popupSelector });
    this._previewImage = this._popupElement.querySelector(".modal__image");
    this._previewTitle = this._popupElement.querySelector(".modal__title");
  }

  open(data) {
    this._previewImage.src = data.link;
    this._previewImage.alt = data.name;
    this._previewTitle.textContent = data.name;
    super.open();
  }

  //   open({ link, name }) {
  //     this._image.src = link;
  //     this._image.alt = name;
  //     this._caption.textContent = name;
  //     super.open();
  //   }
}
