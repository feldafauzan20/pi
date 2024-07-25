// function untuk munculkan form login dan signup
function toggleForm() {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  loginForm.classList.toggle("hidden");
  signupForm.classList.toggle("hidden");
}

$(document).ready(function () {
  $("#signup-id").on("input", function () {
    const id = $(this).val();

    if (id === "") {
      $("#help-id")
        .text(
          "Please check your id. For your id, please enter 2-15 characters, numbers, or the following special characters (._-)"
        )
        .addClass("text-red-600")
        .removeClass("hidden");
      $("#alert-id-available").addClass("hidden"); // Hide "This ID is available" message
      $("#alert-id-used").addClass("hidden");
      $("#signup-id").focus();
      return;
    } else if (!is_id(id)) {
      $("#alert-id-available").addClass("hidden");
      $("#help-id").removeClass("hidden");
    } else if (id > 15) {
      $("#help-id")
        .text(
          "Please check your id. For your id, please enter 2-15 characters, numbers, or the following special characters (._-)"
        )
        .addClass("text-red-600")
        .removeClass("hidden");
    } else {
      $("#help-id").addClass("hidden"); // Hide help message when ID is valid
      $("#alert-id").removeClass("block").addClass("hidden");

      $.ajax({
        type: "POST",
        url: "/check_id",
        data: { id_give: id },
        success: function (response) {
          if (response.exists) {
            $("#alert-id-available").removeClass("block").addClass("hidden");
            $("#alert-id-used").removeClass("hidden").addClass("block");
          } else {
            $("#alert-id-used").removeClass("block").addClass("hidden");
            $("#alert-id-available").removeClass("hidden").addClass("block");
          }
        },
      });
    }
  });
});

// function aturan signup id
function is_id(asValue) {
  var regExp = /^(?=.*[a-zA-Z])[-a-zA-Z0-9_.]{2,15}$/;
  return regExp.test(asValue);
}

// function aturan signup password
function is_password(asValue) {
  var regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,20}$/;
  return regExp.test(asValue);
}

function signup_save() {
  const id = $("#signup-id").val();
  const password = $("#signup-password").val();
  const confirmPassword = $("#signup-confirm-password").val();

  // pengecekan aturan signup id
  if (!is_id(id)) {
    $("#help-id")
      .text(
        "Please check your id. For your id, please enter 2-15 characters, numbers, or the following special characters (._-)"
      )
      .removeClass("text-orange-900")
      .addClass("text-red-600");
    $("#signup-id").focus();
    return;
  } else {
    $("#help-id").addClass("hidden");
  }

  // pengecekan aturan signup password
  if (!is_password(password)) {
    $("#help-password")
      .text(
        "Please check your password. For your password, please enter 8-20 English characters, numbers, or the following special characters (!@#$%^&*)"
      )
      .removeClass("text-orange-900")
      .addClass("text-red-600");
    $("#signup-password").focus();
    return;
  } else {
    $("#help-password").addClass("hidden");
  }

  // cek apakah input id kosong
  if (id === "") {
    const alertId = $("#alert-id");
    alertId.removeClass("hidden");
    alertId.addClass("block");
    $("#signup-id").focus();
    return;
  } else {
    $("#alert-id").removeClass("block").addClass("hidden");
  }

  // cek apakah input password kosong
  if (password === "") {
    const alertPassword = $("#alert-password");
    alertPassword.removeClass("hidden");
    alertPassword.addClass("block");
    $("#signup-password").focus();
    return;
  } else {
    $("#alert-password").removeClass("block").addClass("hidden");
  }

  // cek apakah input confirm password kosong dan tidak sama dengan password
  if (confirmPassword === "") {
    const alertConfirmPassword = $("#alert-confirm-password");
    alertConfirmPassword.removeClass("hidden");
    alertConfirmPassword.addClass("block");
    $("#signup-confirm-password").focus();
    return;
  } else if (confirmPassword != password) {
    const alertConfirmPasswordFalse = $("#alert-confirm-password-false");
    const alertConfirmPassword = $("#alert-confirm-password");
    alertConfirmPassword.addClass("hidden");
    alertConfirmPasswordFalse.removeClass("hidden");
    alertConfirmPasswordFalse.addClass("block");
    return;
  } else {
    $("#alert-confirm-password-false").removeClass("block").addClass("hidden");
    $("#alert-confirm-password").removeClass("block").addClass("hidden");
  }

  $.ajax({
    type: "POST",
    url: "/sign_up/save",
    data: {
      id_give: id,
      password_give: password,
    },
    success: function (response) {
      if (response.result === "success") {
        Swal.fire({
          title: "Signup Successful!",
          text: "Your account has been created successfully. Redirecting to login page...",
          icon: "success",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.replace("/login");
          }
        });
      } else if (response.exist) {
        Swal.fire({
          title: "ID Already Used",
          text: "The ID you entered is already in use. Please choose a different ID.",
          icon: "error",
          confirmButtonText: "OK",
        }).then(() => {
          $("#signup-id").focus();
        });
      } else {
        Swal.fire({
          title: "Signup Failed",
          text: "There was an error while creating your account. Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },
    error: function () {
      Swal.fire({
        title: "Server Error",
        text: "There was a problem with the server. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    },
  });
}

// function login
function sign_in() {
  const id = $("#id").val();
  const password = $("#password").val();

  $.ajax({
    type: "POST",
    url: "/sign_in",
    data: {
      id_give: id,
      password_give: password,
    },
    success: function (response) {
      console.log(response); 
      if (response["result"] === "success") {
        Swal.fire({
          title: "Login Successful",
          text: "Welcome!",
          icon: "success",
          confirmButtonText: "Proceed",
        }).then((result) => {
          if (result.isConfirmed) {
            let token = response["token"];
            $.cookie(`my_token_${id}`, token, { path: "/", samesite: 'Lax' }); 
            window.location.href = `/home_user/${id}`;
          }
        });
      } else {
        Swal.fire({
          title: "Login Failed",
          text: response["msg"],
          icon: "error",
          confirmButtonText: "Try Again",
        });
      }
    },
    error: function (error) {
      console.error("Error in signing in:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to sign in. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    },
  });
}



