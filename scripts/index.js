const initialCards = [
  {
    name: "Yosemite Valley",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/yosemite.jpg",
  },
  {
    name: "Lake Louise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lake-louise.jpg",
  },
  {
    name: "Bald Mountains",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/bald-mountains.jpg",
  },
  {
    name: "Latemar",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/latemar.jpg",
  },
  {
    name: "Vanoise National Park",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/vanoise.jpg",
  },
  {
    name: "Lago di Braies",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lago.jpg",
  },
];

const profileEditButton = document.querySelector("#profile-edit-button");
const profileEditModal = document.querySelector("#profile-edit-modal");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileTitleInput = document.querySelector("#profile-title-input");
const profileDescriptionInput = document.querySelector(
  "#profile-description-input"
);
const profileEditForm = profileEditModal.querySelector(".modal__form");

const modalImage = document.querySelector("#image-preview");
const modalImageForm = modalImage.querySelector(".modal__container");
const addCardFormElement = document.querySelector("#add-card-form");
const cardListEl = document.querySelector(".cards__list");
const cardTemplate =
  document.querySelector("#card-template").content.firstElementChild;
const addNewCardButton = document.querySelector(".profile__add-button");
const addCardModal = document.querySelector("#add-card-modal");
const addCardModalCloseButton = addCardModal.querySelector(".modal__close");
const cardTitleInput = addCardFormElement.querySelector(
  ".modal__input_type_title"
);
const cardUrlInput = addCardFormElement.querySelector(".modal__input_type_url");

function openModal(modal) {
  // profileTitleInput.value = profileTitle.textContent;
  // profileDescriptionInput.value = profileDescription.textContent;
  modal.classList.add("modal_opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

function renderCard(cardData, wrapper) {
  const cardElement = getCardElement(cardData);
  wrapper.prepend(cardElement);
}

function getCardElement(cardData) {
  // יצירת כרטיס חדש מהתבנית
  const cardElement = cardTemplate.cloneNode(true);
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardTitleEl = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");

  // הוספת אבנט לאירוע לחיצה לכפתור הלייק
  likeButton.addEventListener("click", () => {
    likeButton.classList.toggle("card__like-button_active");
  });

  // הוספת אבנט לאירוע לחיצה לכפתור המחיקה
  const deleteButton = cardElement.querySelector(".card__delete-button");
  deleteButton.addEventListener("click", function (evt) {
    evt.target.closest(".card").remove();
  });

  cardImageEl.src = cardData.link;
  cardTitleEl.textContent = cardData.name;
  // cardImageEl.alt = cardData.name;

  // הוספת אבנט לאירוע לחיצה לתמונה כדי לפתוח את המודאל עם התמונה המוגדלת
  cardImageEl.addEventListener("click", () => {
    openImagePreview(cardData.link, cardData.name);
  });

  return cardElement;
}

// מציאת אלמטים בתוך המודל
function openImagePreview(link, name) {
  const modalImage = document.querySelector("#image-preview");
  const modalImageEl = modalImage.querySelector(".modal__content_type_preview");
  const modalCaptionEl = modalImage.querySelector(".modal__image-title");

  // עדכון המודל
  modalImageEl.src = link;
  modalImageEl.alt = name;
  modalCaptionEl.textContent = name;

  //פתיחת המודל
  openModal(modalImage);
}

profileEditButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  openModal(profileEditModal);
});
const profileCloseModal = profileEditModal.querySelector(
  "#profile-close-modal"
);
profileCloseModal.addEventListener("click", () => closeModal(profileEditModal));
addNewCardButton.addEventListener("click", () => openModal(addCardModal));
addCardModalCloseButton.addEventListener("click", () =>
  closeModal(addCardModal)
);
function handleProfileEditSubmit(e) {
  e.preventDefault();
  profileTitle.textContent = profileTitleInput.value;
  profileDescription.textContent = profileDescriptionInput.value;
  closeModal(profileEditModal);
}

profileEditForm.addEventListener("submit", handleProfileEditSubmit);

function handleAddCardFormSubmit(e) {
  e.preventDefault();
  const name = cardTitleInput.value;
  const link = cardUrlInput.value;
  renderCard({ name, link }, cardListEl);

  closeModal(addCardModal);
}

addCardFormElement.addEventListener("submit", handleAddCardFormSubmit);

initialCards.forEach((cardData) => renderCard(cardData, cardListEl));
//   const cardElement = getCardElement(cardData);
//   cardListEl.prepend(cardElement);
// });
const imagePreviewCloseButton = modalImage.querySelector(".modal__close");

const previewImageModal = document.querySelector(".card__image");
imagePreviewCloseButton.addEventListener("click", () => closeModal(modalImage));
