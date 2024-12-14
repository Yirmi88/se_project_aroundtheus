import "../pages/index.css";
import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import PopupWithForm from "../components/PopupWithForm.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithConfirmation from "../components/PopupWithConfirmation.js";
import Api from "../components/API.js";
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

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "dd4b1f91-60b7-43bd-863b-bdcf1fa7ef8f",
    "Content-Type": "application/json",
  },
});

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

api
  .getInitialCards()
  .then((cards) => {
    console.log(cards);
    cardList.renderItems(cards);
  })
  .catch((err) => {
    console.error(err);
  });

api
  .getUserInfo()
  .then((data) => {
    userInfo.setUserInfo({
      name: data.name,
      about: data.about,
      avatar: data.avatar,
    });
  })
  .catch((err) => {
    console.error(err);
  });

const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  descriptionSelector: ".profile__description",
  avatarSelector: ".profile__image",
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

const editAvatarPopup = new PopupWithForm(
  "#avatar-edit-modal",
  handleAvatarEditSubmit
);
editAvatarPopup.setEventListeners();

const deleteCardPopup = new PopupWithConfirmation("#delete-card-modal");
deleteCardPopup.setEventListeners();

function createCard(cardData) {
  const cardElement = new Card(
    cardData,
    "#card-template",
    openImagePreview,
    handleDeleteCard,
    handleLikeCard
  );
  return cardElement.getView();
}

function handleDeleteCard(card) {
  deleteCardPopup.setAction(() => {
    api
      .deleteCard(card.getId())
      .then(() => {
        card.remove();
        deleteCardPopup.close();
      })
      .catch((err) => console.error("Error deleting card:", err));
  });
  deleteCardPopup.open(card);
}

function handleLikeCard(card) {
  api

    .handleLikeCard(card._id, card.isLiked)

    .then((res) => {
      console.log(res);
      card.setIsLiked(res.isLiked);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      console.log("Like card complete");
    });
}

function handleProfileEditSubmit(formValues) {
  editProfileModal.renderLoading(true);
  api.setUserInfo(formValues).then((data) => {
    userInfo.setUserInfo({
      name: data.name,
      about: data.about,
    });
    editProfileModal.close();
  });
}
//   userInfo.setUserInfo({
//     name: formValues.title,
//     about: formValues.description,
//   });
//   editProfileModal.close();
// }

function handleAddCardFormSubmit(formValues) {
  const cardData = { name: formValues.title, link: formValues.link };
  createCard(cardData);
  addCardModal.renderLoading(true);
  api.addCard(cardData).then(cardData);
  addCardModal.close();
}

function handleAvatarEditSubmit(input) {
  const link = input.avatar;

  if (link) {
    editAvatarModal.setLoadingState(true);
    api
      .updateAvatar(link)
      .then((userData) => {
        userInfo.setAvatarInfo(userData.avatar);

        editAvatarModal.close();
      })
      .catch((err) => console.error("Error updating avatar:", err))
      .finally(() => {
        editAvatarModal.setLoadingState(false);
      });
  } else {
    console.error("Avatar Link is not defined");
  }
}

// function handleAddCardFormSubmit(formValues) {
//   const name = formValues.title;
//   const link = formValues.link;

//   const card = createCard({ name, link });
//   cardList.addItem(card);
//   addCardFormElement.reset();
//   addCardModal.close();
// }

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
