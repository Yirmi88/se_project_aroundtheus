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

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "fd75a5c6-0c34-4591-90ec-6f1fc1e0d0b3",
    "Content-Type": "application/json",
  },
});

const addCardFormValidator = new FormValidator(configItems, addCardFormElement);
const profileEditValidator = new FormValidator(configItems, profileEditForm);

addCardFormValidator.enableValidation();
profileEditValidator.enableValidation();

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
    console.log("Cards from API:", cards); // Should show full card data including IDs
    if (Array.isArray(cards)) {
      cards.forEach((card) => {
        const cardElement = createCard(card);
        cardList.addItem(cardElement);
      });
    }
  })
  .catch((err) => {
    console.error("Error loading cards:", err);
  });
// api
//   .getInitialCards()
//   .then((cards) => {
//     console.log("API Response cards:", cards);
//     cardList.renderItems(cards);
//   })
//   .catch((err) => {
//     console.error(err);
//   });

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
  console.log("Creating card with data:", cardData);
  const cardElement = new Card(
    cardData,
    "#card-template",
    openImagePreview,
    handleLikeCard,
    handleDeleteCard
  );
  const view = cardElement.getView();
  console.log("Card element created:", {
    id: cardElement.getCardId(),
    element: view,
  });
  return view;
}
// return cardElement.getView();

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

// function handleLikeCard(card) {
//   api

//     .handleLikeCard(card._id, card.isLiked)

//     .then((res) => {
//       console.log(res);
//       card.setIsLiked(res.isLiked);
//     })
//     .catch((err) => {
//       console.error(err);
//     })
//     .finally(() => {
//       console.log("Like card complete");
//     });
// }

function handleProfileEditSubmit(formValues) {
  // First, transform the form values to match what the API expects
  const apiData = {
    name: formValues.title, // Convert from form's 'title' to API's 'name'
    about: formValues.description, // Convert from form's 'description' to API's 'about'
  };

  editProfileModal.renderLoading(true);
  api
    .setUserInfo(apiData)
    .then((data) => {
      console.log("API Response:", data);
      const currentUserInfo = userInfo.getUserInfo();

      userInfo.setUserInfo({
        name: data.name,
        about: data.about,
        avatar: currentUserInfo.avatar,
      });
      editProfileModal.close();
    })
    .catch((err) => {
      console.error("Error updating profile:", err);
    })
    .finally(() => {
      editProfileModal.renderLoading(false);
    });
}
//   userInfo.setUserInfo({
//     name: formValues.title,
//     about: formValues.description,
//   });
//   editProfileModal.close();
// }

// function handleAddCardFormSubmit(formValues) {
//   const cardData = { name: formValues.title, link: formValues.link };
//   createCard(cardData);
//   addCardModal.renderLoading(true);
//   api.addCard(cardData).then(cardData);
//   addCardModal.close();
// }

function handleAddCardFormSubmit(formValues) {
  const cardData = { name: formValues.title, link: formValues.link };

  addCardModal.renderLoading(true);
  api
    .addCard(cardData)
    .then((newCard) => {
      const cardElement = createCard(newCard); // Create card from API response
      cardList.addItem(cardElement); // Add it to the section
      addCardModal.close();
    })
    .catch((err) => {
      console.error("Error adding card:", err);
    })
    .finally(() => {
      addCardModal.renderLoading(false);
    });
}

function handleAvatarEditSubmit(input) {
  const link = input.avatar;

  if (link) {
    editAvatarModal.renderLoading(true);
    api
      .updateAvatar(link)
      .then((userData) => {
        userInfo.setAvatarInfo(userData.avatar);

        editAvatarModal.close();
      })
      .catch((err) => console.error("Error updating avatar:", err))
      .finally(() => {
        editAvatarModal.renderLoading(false);
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
