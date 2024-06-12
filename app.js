var sign_in_btn = document.querySelector("#sign-in-btn");
var sign_up_btn = document.querySelector("#sign-up-btn");
var container = document.querySelector(".container");
var sign_in_btn2 = document.querySelector("#sign-in-btn2");
var sign_up_btn2 = document.querySelector("#sign-up-btn2");

var email = document.getElementById("email");
var password = document.getElementById("password");
var note = document.getElementById("note");
var list = document.getElementById("list");
var login_container = document.getElementById("login_container");
var home_container = document.getElementById("home_container");
var user_email = document.getElementById("user_email");
var noteCategory = document.getElementById("note-category");
var filterCategory = document.getElementById("filter-category");

// Admin credentials
var adminEmail = "admin@gmail.com";
var adminPassword = "admin";

// Toggle sign-in and sign-up modes
sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

sign_up_btn2.addEventListener("click", () => {
  container.classList.add("sign-up-mode2");
});

sign_in_btn2.addEventListener("click", () => {
  container.classList.remove("sign-up-mode2");
});

function loginUser() {
  if (!email.value || !password.value) {
    return alert("Please add email and password.");
  }

  if (email.value === adminEmail && password.value === adminPassword) {
    localStorage.setItem("isAdmin", "true");
  } else {
    localStorage.setItem("isAdmin", "false");
  }

  localStorage.setItem("email", email.value);
  checkIsUserLogin();
}

function isAdminUser() {
  return localStorage.getItem("isAdmin") === "true";
}

function checkIsUserLogin() {
  var email = localStorage.getItem("email");
  var isAdmin = isAdminUser();

  if (email) {
    login_container.style.display = "none";
    home_container.style.display = "block";
    user_email.innerText = isAdmin ? "Admin" : email;
    displayUserNotes();
  } else {
    login_container.style.display = "block";
    home_container.style.display = "none";
  }
}

checkIsUserLogin();

function logout() {
  localStorage.removeItem("email");
  localStorage.removeItem("isAdmin");
  checkIsUserLogin();
}

function submitNote() {
  var email = localStorage.getItem("email");
  var obj = {
    email: email,
    note: note.value,
    category: noteCategory.value,
    datetime: new Date().toLocaleString(),
    id: Date.now(),
  };
  saveValueToLocalStorage(obj);
  note.value = "";
}

function saveValueToLocalStorage(obj) {
  var notes = localStorage.getItem("notes");
  if (notes) {
    notes = JSON.parse(notes);
    notes.push(obj);
    localStorage.setItem("notes", JSON.stringify(notes));
  } else {
    notes = [obj];
    localStorage.setItem("notes", JSON.stringify(notes));
  }
  displayUserNotes();
}

function displayUserNotes() {
  var notes = localStorage.getItem("notes");
  var currentUserEmail = localStorage.getItem("email");
  var isAdmin = isAdminUser();
  var selectedCategory = filterCategory.value;

  if (notes) {
    list.innerHTML = "";
    notes = JSON.parse(notes);
    notes.forEach(function (data, index) {
      if (
        (data.email === currentUserEmail || isAdmin) &&
        (selectedCategory === "All" || data.category === selectedCategory)
      ) {
        var categoryClass = "";
        switch (data.category.toLowerCase()) {
          case "work":
            categoryClass = "category-work";
            break;
          case "personal":
            categoryClass = "category-personal";
            break;
          case "urgent":
            categoryClass = "category-urgent";
            break;
          default:
            categoryClass = "";
        }

        var liElement = `
          <li class="border rounded p-4 bg-white shadow-md flex justify-between items-center">
            <div>
              <p class="note-text">${data.note}</p>
              <span class="category ${categoryClass}">Category: ${data.category}</span>
              <span class="category">${data.datetime}</span>
              <span class="note-email">${data.email}</span>
            </div>
            <span>
              <button onclick="editNotePrompt(${data.id})" class="edit-btn">Edit</button>
              <button onclick="deleteNote(${data.id})" class="delete-btn">Delete</button>
            </span>
          </li>`;
        list.innerHTML += liElement;
      }
    });
  }
}

function deleteNote(id) {
  var notes = localStorage.getItem("notes");
  if (notes) {
    notes = JSON.parse(notes);
    notes = notes.filter(function (note) {
      return note.id !== id;
    });
    localStorage.setItem("notes", JSON.stringify(notes));
  }
  displayUserNotes();
}

function editNotePrompt(id) {
  var notes = JSON.parse(localStorage.getItem("notes"));
  var noteToEdit = notes.find((note) => note.id === id);
  var newNote = prompt("Edit your note:", noteToEdit.note);
  if (newNote !== null && newNote !== "") {
    noteToEdit.note = newNote;
    localStorage.setItem("notes", JSON.stringify(notes));
    displayUserNotes();
  }
}

filterCategory.addEventListener("change", displayUserNotes);
