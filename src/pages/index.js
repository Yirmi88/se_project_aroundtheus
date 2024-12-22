import "../pages/index.css";
import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import PopupWithForm from "../components/PopupWithForm.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithConfirmation from "../components/PopupWithConfirmation.js";
import Api from "../components/API.js";
import Section from "../components/Section.js";
import UserInfo from "../components/UserInfo.js";
import { configItems } from "../utils/constants.js";

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
const profileImageContainer = document.querySelector(
  ".profile__image-container"
);
const avatarForm = document.querySelector("#avatar-edit-form");

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "fd75a5c6-0c34-4591-90ec-6f1fc1e0d0b3",
    "Content-Type": "application/json",
  },
});

profileImageContainer.addEventListener("click", () => {
  editAvatarFormValidator.toggleButtonState();
  editAvatarPopup.open();
});
const addCardFormValidator = new FormValidator(configItems, addCardFormElement);
const profileEditValidator = new FormValidator(configItems, profileEditForm);
const editAvatarFormValidator = new FormValidator(configItems, avatarForm);

addCardFormValidator.enableValidation();
profileEditValidator.enableValidation();
editAvatarFormValidator.enableValidation();

const cardList = new Section(
  {
    items: [],
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
    if (Array.isArray(cards)) {
      cardList.renderItems(cards);
    }
  })
  //     cards.forEach((card) => {
  //       const cardElement = createCard(card);
  //       cardList.addItem(cardElement);
  //     });
  //   }
  // })
  .catch((err) => {
    console.error("Error loading cards:", err);
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

const deleteCardPopup = new PopupWithConfirmation("#confirm-delete-modal");
deleteCardPopup.setEventListeners();

function createCard(cardData) {
  const cardElement = new Card(
    cardData,
    "#card-template",
    openImagePreview,
    handleLikeCard,
    handleDeleteCard
  );
  const view = cardElement.getView();
  return view;
}

function handleDeleteCard(card) {
  deleteCardPopup.setAction(() => {
    api
      .deleteCard(card.getCardId())
      .then(() => {
        card.handleDeleteCard();
        deleteCardPopup.close();
      })
      .catch((err) => console.error("Error deleting card:", err));
  });
  deleteCardPopup.open(card);
}

function handleLikeCard(card) {
  if (card.isLiked) {
    return api
      .removeLike(card.getCardId())
      .then(() => {
        card.setCardLikes(false);
      })
      .catch((err) => console.error("Failed to dislike card:", err));
  } else {
    return api
      .addLike(card.getCardId())
      .then(() => {
        card.setCardLikes(true);
      })
      .catch(console.error);
  }
}

function handleProfileEditSubmit(formValues) {
  const apiData = {
    name: formValues.title,
    about: formValues.description,
  };

  editProfileModal.renderLoading(true);
  api
    .setUserInfo(apiData)
    .then((data) => {
      userInfo.setUserInfo(data);
      profileEditForm.reset();
      profileEditValidator.resetValidation();
      editProfileModal.close();
    })
    .catch((err) => {
      console.error("Error updating profile:", err);
    })
    .finally(() => {
      editProfileModal.renderLoading(false);
    });
}

function handleAddCardFormSubmit(formValues) {
  const cardData = { name: formValues.title, link: formValues.link };

  addCardModal.renderLoading(true);
  api
    .addCard(cardData)
    .then((newCard) => {
      const cardElement = createCard(newCard);
      cardList.addItem(cardElement);
      addCardFormElement.reset();
      addCardModal.close();
    })
    .catch((err) => {
      console.error("Error adding card:", err);
    })
    .finally(() => {
      addCardModal.renderLoading(false);
    });
}

function handleAvatarEditSubmit(formValues) {
  const link = formValues.avatar;

  if (link) {
    editAvatarPopup.renderLoading(true);
    api
      .updateAvatar(link)
      .then((userData) => {
        userInfo.setUserInfo({
          name: userData.name,
          about: userData.about,
          avatar: userData.avatar,
        });
        avatarForm.reset();
        editAvatarPopup.close();
      })
      .catch((err) => console.error("Error updating avatar:", err))
      .finally(() => {
        editAvatarPopup.renderLoading(false);
      });
  }
}

addNewCardButton.addEventListener("click", () => {
  addCardFormValidator.toggleButtonState();
  addCardModal.open();
});

profileEditButton.addEventListener("click", () => {
  const formValues = userInfo.getUserInfo();
  if (!profileTitleInput.value) {
    profileTitleInput.value = formValues.name;
  }
  if (!profileDescriptionInput.value) {
    profileDescriptionInput.value = formValues.about;
  }
  editProfileModal.open();
});
