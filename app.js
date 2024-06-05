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

// Admin credentials
var adminEmail = "admin@gmail.com";
var adminPassword = "admin";


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
  if (!email.value || !password.value)
    return alert("Please add email and password.");
  localStorage.setItem("email", email.value);
  checkIsUserLogin();
}


// Function to login as admin
function loginAdmin() {
  if (email.value === adminEmail && password.value === adminPassword) {
    localStorage.setItem("isAdmin", true);
    checkIsUserLogin();
  } else {
    alert("Invalid admin credentials.");
  }
}

// Function to check if user is admin
function isAdminUser() {
  return localStorage.getItem("isAdmin");
}

function checkIsUserLogin() {
  var email = localStorage.getItem("email");
  var isAdmin = localStorage.getItem("isAdmin");
  if (email) {
    login_container.style.display = "none";
    home_container.style.display = "block";
    user_email.innerText = email;
    if (isAdmin) {
      user_email.innerText = "Admin";
    } else {
      user_email.innerText = email;
    }
    displayUserNotes();
  } else {
    login_container.style.display = "block";
    home_container.style.display = "none";
  }
}

checkIsUserLogin();

function logout() {
  localStorage.removeItem("email");
  checkIsUserLogin();
}

function submitNote() {
  var email = localStorage.getItem("email");

  var obj = {
    email: email,
    note: note.value,
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

function displayAllNotes() {
  var notes = JSON.parse(localStorage.getItem("notes"));
  var list = document.getElementById("list");

  if (notes) {
    list.innerHTML = "";
    notes.forEach(function (data, index) {
      var liElement = `
        <li class="border rounded p-2 my-2">
          <p class="font-medium">${data.note}</p>
          <p>${data.email}</p>
          <button onclick="deleteNote(${index})" class="delete-btn">Delete</button>
        </li>`;
      list.innerHTML += liElement;
    });
  }
}

function displayUserNotes() {
    var notes = localStorage.getItem("notes");
    var list = document.getElementById("list");
    var currentUserEmail = localStorage.getItem("email");

    if (notes) {
        list.innerHTML = "";
        notes = JSON.parse(notes);
        notes.forEach(function(data, ind) {
            if (data.email === currentUserEmail) {
                var liElement = `
                    <li class="border rounded p-2 my-2">
                        <p class="font-medium">${data.note}</p>
                        <p>${data.email}</p>
                        <button onclick="deleteNote(${ind})" class="delete-btn">Delete</button>
                    </li>`;
                list.innerHTML += liElement;
            }
        });
    }
}

function deleteNote(index) {
    var notes = JSON.parse(localStorage.getItem("notes"));
    notes.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    displayUserNotes();
}



// Initial check to see if user is logged in
checkIsUserLogin();
