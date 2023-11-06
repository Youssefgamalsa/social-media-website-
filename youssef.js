// الكود المشترك

let loginbtn = document.querySelector("#login");
let registerbtn = document.querySelector("#register");
let logoutbtn = document.querySelector("#logout");
// let blath = document.querySelector("#blath");
let userimg = document.querySelector(".user-img");
let user_username = document.querySelector("#user-username");
// let users = document.querySelector(".posts");

let close = document.querySelector("#close");
let close1 = document.querySelector("#close1");

function getuserimg() {
  let user = JSON.parse(localStorage.getItem("user"));
  if (typeof user.profile_image == "string") {
    userimg.src = user.profile_image;
  } else {
    userimg.src = "13.jpg";
  }
  user_username.innerHTML = user.username;
}
getuserimg();

function create(mess, color) {
  const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
  const appendAlert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
  };
  appendAlert(mess, color);
}
function logout() {
  let token = localStorage.getItem("token");
  if (token) {
    loginbtn.style.display = "none";
    registerbtn.style.display = "none";
    logoutbtn.style.display = "block";
    // blath.style.display = "block";
    user_username.style.display = "block";
    userimg.style.display = "block";
    getuserimg();
  } else {
    loginbtn.style.display = "block";
    registerbtn.style.display = "block";
    logoutbtn.style.display = "none";
    // blath.style.display = "none";
    user_username.style.display = "none";
    userimg.style.display = "none";
  }
}

logout();
function loginout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  logout();
  create("you logged out insuccessfully ", "success");
}
function RegisterUsers() {
  let uservalue = document.querySelector("#Register-Username").value;
  let namevalue = document.querySelector("#Register-name").value;
  let passvalue = document.querySelector("#register-password").value;
  let userimage = document.querySelector("#register-image").files[0];
  let config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  let formdat = new FormData();
  formdat.append("username", uservalue);
  formdat.append("name", namevalue);
  formdat.append("password", passvalue);
  formdat.append("image", userimage);

  axios
    .post("https://tarmeezacademy.com/api/v1/register", formdat, config)
    .then(function (response) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      logout();
      close1.click();
      create(" Register A New User ", "success");
    })
    .catch(function (error) {
      console.log(error);
      let errormessage = error.response.data.message;
      create(errormessage, "danger");
    });
}

function loginUsers() {
  let usernamevalue = document.querySelector("#Username");
  let passwordvalue = document.querySelector("#password");
  let param = {
    username: usernamevalue.value,
    password: passwordvalue.value,
  };

  axios
    .post("https://tarmeezacademy.com/api/v1/login", param)
    .then(function (response) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      close.click();
      logout();
      create(" Login A New User Successfully ", "info");
    })
    .catch(function (error) {
      create(error.response, "danger");
    });
}

function Postdetail(id) {
  window.location = `postdetails.html?postid=${id}`;
}

function goprofilepage() {
  let user = JSON.parse(localStorage.getItem("user"));
  let userid = user.id;
  window.location = `profile.html?userid=${userid}`;
}

function profileidclicked(userid) {
  window.location = `profile.html?userid=${userid}`;
}
function deletepostclicked() {
  let postid = document.getElementById("delete_hidden_input").value;
  let token = localStorage.getItem("token");

  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  axios
    .delete(`https://tarmeezacademy.com/api/v1/posts/${postid}`, config)
    .then(function (response) {
      getposts();
      create("Deleted Post Successfully ", "success");
    })
    .catch(function (error) {
      create(error.response.data.message, "danger");
    });
}
load(false);
function load(loader = "false") {
  if (loader) {
    document.getElementById("loader").style.visibility = "visible";
  } else {
    document.getElementById("loader").style.visibility = "hidden";
  }
}
function deletepost(postid) {
  let deletemodal = new bootstrap.Modal(document.getElementById("delete_post"));
  deletemodal.toggle();
  document.getElementById("delete_hidden_input").value = `${postid}`;
}

function edit_function(postid) {
  document.getElementById("create_post_title").innerHTML = " Edit Post ";
  document.getElementById("create_edit").innerHTML = "Update";
  document.getElementById("hidden_input").value = `${postid}`;
  let postmodal = new bootstrap.Modal(
    document.getElementById("createpost"),
    {}
  );
  postmodal.toggle();
}

