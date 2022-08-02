/*
 * Sélection des éléments du DOM
 */
const containerChoise = document.getElementById("container-choise");
const btnNumberProfilsElts = document.querySelectorAll(".btn-numberProfils");
const btnChoiseFemaleElt = document.getElementById("btn-choiseFemale");
const btnChoiseMaleElt = document.getElementById("btn-choiseMale");
const btnProfilGeneratorElt = document.getElementById("btnProfilGenerator");
const usersElt = document.getElementById("users");
const deleteProfilesBtnElt = document.getElementById("deleteProfilesBtn");

/*
 * Activation et désactivation des boutons
 */

// Active un bouton
function activeBtn(btn) {
  btn.classList.add("active-btn");
}

// Désactive un bouton
function desabledBtn(btn) {
  btn.classList.remove("active-btn");
}

// Active et désactive les boutons "nombre de profils" et "Effacer"
btnNumberProfilsElts.forEach((btnNumberProfilsElt) => {
  btnNumberProfilsElt.addEventListener("click", function () {
    btnNumberProfilsElts.forEach((btnElement) => {
      // désactive un bouton "nombre de profils" qui est précédemment cliqué
      if (btnNumberProfilsElt !== btnElement) {
        btnElement.classList.remove("active-btn");
      }
    });
    // active et désactive les boutons "nombre de profils"
    this.classList.toggle("active-btn");
    // Désactive le bouton "Effacer" s'il est activé
    if (deleteProfilesBtnElt.classList.contains("active-btn")) {
      desabledBtn(deleteProfilesBtnElt);
    }
  });
});

/**
 * Choix du genre
 */

// Active et désactive le bouton "Femme"
btnChoiseFemaleElt.addEventListener("click", function () {
  btnChoiseFemaleElt.classList.toggle("active-btn");
});

// Active et désactive le bouton "Homme"
btnChoiseMaleElt.addEventListener("click", function () {
  btnChoiseMaleElt.classList.toggle("active-btn");
});

/*
 * Génération des profils
 */

// Génère des profils aléatoires, change la couleur de fond du bouton en orange et son texte en blanc
function displayUsersItems(numberBtnElt, chosenGender) {
  activeBtn(btnProfilGeneratorElt);
  deleteProfilesBtnElt.disabled = false;
  deleteProfilesBtnElt.classList.add("active");

  fetch(`https://randomuser.me/api/?nat=fr&results=${numberBtnElt}${chosenGender}`)
    .then(function (res) {
      return res.json();
    })
    .then(function (datas) {
      const array = datas.results;
      const displayUser = array.map(function (data) {
        let border;
        if (data.gender == "female") {
          border = "img-border-female";
        } else {
          border = "img-border-male";
        }
        let dateOfBirth = data.dob.date;
        dateOfBirth = dateOfBirth.slice(0, 10).split("-").reverse().join("/");
        return `<div class="user" data-aos="fade-up">
        
                    <img class="user-img ${border}" id="user-img" src="${data.picture.large}" alt="utilisateur">
                    <p class="name">${data.name.first}&nbsp;${data.name.last}</p>
                
                    <div class="contact-information">
                      <img class="icon" src="images/envelope.png" alt="">
                      <p>${data.email}</p>
                    </div>
                
                    <div class="contact-information">
                      <img class="icon" src="images/anniversary.png" alt="">
                      <p>${dateOfBirth}</p>
                    </div>
                
                    <div class="contact-information">
                      <img class="icon" src="images/address.png" alt="">
                      <p>${data.location.street.number}&nbsp;${data.location.street.name},&nbsp;${data.location.postcode}&nbsp;${data.location.city}&nbsp;${data.location.country}</p>
                    </div>
                
                    <div class="contact-information">
                      <img class="icon" src="images/phone.png" alt="">
                      <p>${data.cell}</p>
                    </div>
                
                    <div class="contact-information">
                      <img class="icon" src="images/padlock.png" alt="">
                      <p>${data.login.password}</p>
                    </div>
    
                </div>`;
      });
      usersElt.innerHTML = displayUser.join("");
    })
    .catch(function (err) {
      usersElt.textContent = "Ramdom user ne répond pas: le serveur a peut etre des problèmes !!!";
    });
}

// Filtre le nombre de profils et le genre et appelle la fonction displayUsersItems()
// qui affiche les profils
function filterNumberAndGender() {
  let numberBtn;
  let gender;
  btnNumberProfilsElts.forEach((btnNumberProfilsElt) => {
    // Recupère le nombre d'utilisateur choisi
    if (btnNumberProfilsElt.classList.contains("active-btn")) {
      numberBtn = btnNumberProfilsElt.textContent;
    }
  });
  // Le genre "Femme" est uniquement choisi
  if (btnChoiseFemaleElt.classList.contains("active-btn") && !btnChoiseMaleElt.classList.contains("active-btn")) {
    gender = "&gender=female";
    displayUsersItems(numberBtn, gender);
  }
  //  Le genre "Homme" est uniquement choisi
  else if (btnChoiseMaleElt.classList.contains("active-btn") && !btnChoiseFemaleElt.classList.contains("active-btn")) {
    gender = "&gender=male";
    displayUsersItems(numberBtn, gender);
  }
  // Aucun genre n'est choisi (on aura des hommes et des femmes d'une manière aléatoire)
  else {
    gender = "";
    displayUsersItems(numberBtn, gender);
  }
}

// Appel la fonction "filterNumberAndGender" lors d'un clic sur le bouton "Générer des profils"
// que si l'utilisateur choisi un nombre de profil (2, 4, 8, 16, 32)
// si non un message d'erreur est généré
btnProfilGeneratorElt.addEventListener("click", function () {
  for (let i = 0; i < btnNumberProfilsElts.length; i++) {
    if (btnNumberProfilsElts[i].classList.contains("active-btn")) {
      filterNumberAndGender();
      containerChoise.classList.remove("active-error");
      break;
    } else {
      containerChoise.classList.add("active-error");
      usersElt.textContent = "";
    }
  }
});

/*
 * Supression de tous les profils
 */

// Supprime tous les profils qui ont été générés et désactive tous les boutons
function deleteUsersItems() {
  usersElt.innerHTML = "";
  deleteProfilesBtnElt.disabled = true;
  deleteProfilesBtnElt.classList.remove("active");
  desabledBtn(btnProfilGeneratorElt);
  btnNumberProfilsElts.forEach((btnNumberProfilsElt) => {
    if (btnNumberProfilsElt.classList.contains("active-btn")) {
      desabledBtn(btnNumberProfilsElt);
    }
  });
  if (btnChoiseFemaleElt.classList.contains("active-btn")) {
    desabledBtn(btnChoiseFemaleElt);
  }
  if (btnChoiseMaleElt.classList.contains("active-btn")) {
    desabledBtn(btnChoiseMaleElt);
  }
}
// Appel la fonction deleteUsersItems() lors d'un clic sur le bouton "Effacer"
deleteProfilesBtnElt.addEventListener("click", deleteUsersItems);

/*
 * Librairie Animate On Scroll (Aos)
 */

AOS.init({
  duration: 1000,
  easing: "ease-in-out",
  delay: "800",
  once: "true",
  offset: 20,
});
