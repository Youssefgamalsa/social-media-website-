// let loginbtn = document.querySelector("#login");
// let registerbtn = document.querySelector("#register");
// let logoutbtn = document.querySelector("#logout");
let blath = document.querySelector("#blath");
// let userimg = document.querySelector(".user-img");
// let user_username = document.querySelector("#user-username");

let users = document.querySelector(".posts");
function getposts(i) {
  if (i == true) {
    users.innerHTML = ""
  }
  load(true);
  axios
    .get("https://tarmeezacademy.com/api/v1/posts", {
      params: {
        limit: "100",
      },
    })
    .then((response) => {
      let posts = response.data.data;
      for (post of posts) {
        let userauthor = null;
        if (localStorage.getItem("user")) {
          userauthor = JSON.parse(localStorage.getItem("user"));
        }
        let editbtncontent = ``;
        load(false);
        let isauthor = userauthor != null && userauthor.id == post.author.id;
        if (isauthor) {
          editbtncontent = `
          <button class="btn btn-danger" id="deletebtn" style="float:right; margin-left:6px" onclick="deletepost(${post.id})" >Delete</button>
          <button class="btn btn-secondary" id="editbtn" style="float:right" onclick="edit_function(${post.id})" >Edit</button>
          `;
        }

        let postTitle = "";
        if (post.title != null && post.title != "undefined") {
          postTitle = post.title;
        }
        if (typeof post.image == "string") {
          users.innerHTML += `
            <div class="card shadow-lg rounded mb-3" style="cursor: pointer;">
            <div class="card-header mx-1">
            <!-- card-header  -->
               <span onclick = "profileidclicked(${post.author.id})">
          <img src="${post.author.profile_image}" class="rounded-circle" style="width:60px; height:60px;">
          <span>${post.author.username}</span>
            </span>

            ${editbtncontent}
            </div>
            <div class="card-body" onclick="Postdetail(${post.id})" >
            
            <h5 class="card-title">
              <img src="${post.image}" style="width:100%;height:300px;">
            </h5>
            <h6 class="card-text">${postTitle}</h6>
            <p class="text-dark">${post.body}</p>
            <hr>
            <span class="text-dark">
              <i class="fa-solid fa-pen mx-2"></i>
              <b> (${post.comments_count}) comments </b>
            </span>
            </div>
            </div>
            
            `;
        }
      }
    });
}

logout()
function logout() {
  let token = localStorage.getItem("token");
  if (token) {
    loginbtn.style.display = "none";
    registerbtn.style.display = "none";
    logoutbtn.style.display = "block";
    blath.style.display = "block";
    user_username.style.display = "block";
    userimg.style.display = "block";
    getuserimg();
  } else {
    loginbtn.style.display = "block";
    registerbtn.style.display = "block";
    logoutbtn.style.display = "none";
    blath.style.display = "none";
    user_username.style.display = "none";
    userimg.style.display = "none";
  }
}

getposts();

function createnewpost() {

  load(true) ;
  let url = "";
  let postid = document.getElementById("hidden_input").value;
  let is_create = postid == null || postid == "";

  let token = localStorage.getItem("token");
  let upload = document.querySelector("#post_image").files[0];
  let postbody = document.querySelector("#post_body").value;
  let posttitle = document.querySelector("#post_title").value;
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  let formdata = new FormData();
  formdata.append("title", posttitle);
  formdata.append("body", postbody);
  formdata.append("image", upload);

  if (is_create) {
    url = `https://tarmeezacademy.com/api/v1/posts`;
    axios
      .post(url, formdata, config)
      .then(function (response) {
        document.getElementById('close3').click();
        getposts(true);
        create(" Created New Post Successfully ", "success");
      })
      .catch(function (error) {
        console.log(error);
        create(error.response.data.message, "danger");
      })
      .finally(function () {
        load(false);
      });
  } else {
    formdata.append("_method", "put");
    url = `https://tarmeezacademy.com/api/v1/posts/${postid}`;
    axios
      .post(url, formdata, config)
      .then(function (response) {
        getposts(true);
        create(" Edited New Post Successfully ", "success");
      })
      .catch(function (error) {
        console.log(error);
        create(error.response.data.error_message, "danger");
      })
      .finally(function () {
        load(false);
      });
  }

}
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
window.onload =  function () {
  if (window.innerWidth < 995) {

    document.getElementById("nav_width").classList.add("col-12");
    document.getElementById("user-post").classList.add("col-12");
  
  }
};
window.addEventListener('resize' , function () {
  if (window.innerWidth < 995) {
   
    document.getElementById("nav_width").classList.add("col-12");
    document.getElementById("user-post").classList.add("col-12");
 
  }
});



function blathnewpost() {
  document.getElementById("create_post_title").innerHTML =
    " Create A New Post ";
  document.getElementById("create_edit").innerHTML = " Create ";

  document.getElementById("hidden_input").value = "";
  let postmodal = new bootstrap.Modal(
    document.getElementById("createpost"),
    {}
  );
  postmodal.toggle();
}



// function delete post clicked

function deletepostclicked() {
  load(true)
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
      getposts(true);
      create("Deleted Post Successfully ", "success");
    })
    .catch(function (error) {
      create(error.response.data.message, "danger");
    }).finally(function(){
      load(false) ;
    })
}



