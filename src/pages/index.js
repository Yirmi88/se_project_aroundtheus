import "../pages/index.css";
import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import PopupWithForm from "../components/PopupWithForm.js";
import PopupWithImage from "../components/PopupWithImage.js";
import Section from "../components/Section.js";
import UserInfo from "../components/UserInfo.js";
import { initialCards, configItems } from "../utils/constants.js";

const profileEditModal = document.querySelector("#profile-edit-modal");
const profileEditForm = profileEditModal.querySelector(".modal__form");

const addCardModalEl = document.querySelector("#add-card-modal");
const addCardFormElement = addCardModalEl.querySelector(".modal__form");
const addNewCardButton = document.querySelector(".profile__add-button");
const profileEditButton = document.querySelector("#profile-edit-button");
const profileTitleInput = document.querySelector("#profile-title-input");
const profileDescriptionInput = document.querySelector(
  "#profile-description-input"
);

const addCardFormValidator = new FormValidator(configItems, addCardFormElement);
const profileEditValidator = new FormValidator(configItems, profileEditForm);

addCardFormValidator.enableValidation();
profileEditValidator.enableValidation();

const cardList = new Section(
  {
    items: initialCards,
    renderer: (item) => {
      const cardElement = createCard(item);
      cardList.addItem(cardElement);
    },
  },
  ".cards__list"
);
cardList.renderItems();

const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  descriptionSelector: ".profile__description",
});

const imagePopup = new PopupWithImage("#image-preview");
imagePopup.setEventListeners();

function openImagePreview(name, link) {
  imagePopup.open({ name, link });
}

const addCardModal = new PopupWithForm(
  "#add-card-modal",
  handleAddCardFormSubmit
);

addCardModal.setEventListeners();

const editProfileModal = new PopupWithForm(
  "#profile-edit-modal",
  handleProfileEditSubmit
);
editProfileModal.setEventListeners();

function createCard(cardData) {
  const cardElement = new Card(cardData, "#card-template", openImagePreview);
  return cardElement.getView();
}

function handleProfileEditSubmit(formValues) {
  userInfo.setUserInfo({
    name: formValues.title,
    about: formValues.description,
  });
  editProfileModal.close();
}

function handleAddCardFormSubmit(formValues) {
  const name = formValues.title;
  const link = formValues.link;

  const card = createCard({ name, link });
  cardList.addItem(card);
  addCardFormElement.reset();
  addCardModal.close();
}

addNewCardButton.addEventListener("click", () => {
  addCardFormValidator.toggleButtonState();
  addCardModal.open();
});

profileEditButton.addEventListener("click", () => {
  const formValues = userInfo.getUserInfo();
  profileTitleInput.value = formValues.name;
  profileDescriptionInput.value = formValues.about;
  editProfileModal.open();
  // openModal(profileEditModal);
});
