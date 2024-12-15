export default class Card {
  constructor(
    cardData,
    cardSelector,
    openImagePreview,
    handleLikeCard,
    handleDeleteCard
  ) {
    console.log("Card Data received:", cardData);
    this._name = cardData.name;
    this._link = cardData.link;
    this._id = cardData._id || cardData.id;
    console.log("Stored card ID:", this._id);
    this._isLiked = cardData.isLiked;
    this._cardSelector = cardSelector;
    this._openImagePreview = openImagePreview;
    this._handleLikeCard = handleLikeCard;
    this._handleDeleteCard = handleDeleteCard;
    this._cardElement = this.getView();
  }

  handleDeleteCard() {
    if (this._cardElement) {
      delete this._cardElement.card;
      this._cardElement.remove();
      this._cardElement = null;
    }
  }

  get isLiked() {
    return this._isLiked;
  }

  getCardId() {
    console.log("Getting card ID:", this._id);
    return this._id;
  }

  setCardLikes(isLiked) {
    this._isLiked = isLiked;
    this._updateLikeStatus();
  }

  _updateLikeStatus() {
    if (this._isLiked) {
      this._likeButton.classList.add("card__like-button_active");
    } else {
      this._likeButton.classList.remove("card__like-button_active");
    }
  }

  toggleLike() {
    this._isLiked = !this._isLiked;
    this._updateLikeStatus();
  }

  _setEventListeners() {
    this._likeButton = this._cardElement.querySelector(".card__like-button");
    this._likeButton.addEventListener("click", () => {
      this._handleLikeCard(this);
    });

    const deleteButton = this._cardElement.querySelector(
      ".card__delete-button"
    );
    deleteButton.addEventListener("click", () => {
      this._handleDeleteCard(this);
    });

    this._cardImageElement.addEventListener("click", () => {
      this._openImagePreview(this._name, this._link);
    });
  }

  _handleLikeButton() {
    this._handleLikeCard(this);
  }

  // _handleLikeButton() {
  //   this._cardElement
  //     .querySelector(".card__like-button")
  //     .classList.toggle("card__like-button_active");
  // }

  _handleDeleteButton() {
    if (this._handleDeleteCard) {
      this._handleDeleteCard(this);
    } else {
      (err) => console.error("Failed to delete card:", err);
    }
  }

  _getTemplate() {
    const cardElement = document
      .querySelector(this._cardSelector)
      .content.querySelector(".card")
      .cloneNode(true);
    return cardElement;
  }

  getView() {
    this._cardElement = this._getTemplate();
    this._likeButton = this._cardElement.querySelector(".card__like-button");
    this._cardImageElement = this._cardElement.querySelector(".card__image");
    this._cardElement.querySelector(".card__title").textContent = this._name;
    this._cardImageElement.src = this._link;
    this._cardImageElement.alt = this._name;

    this._cardElement.card = this;

    this._updateLikeStatus();
    this._setEventListeners();

    return this._cardElement;
  }
}
