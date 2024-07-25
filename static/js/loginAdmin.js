function sign_in_admin() {
  const id = $("#id").val();
  const password = $("#password").val();

  $.ajax({
    type: "POST",
    url: "/sign_in_admin",
    data: {
      id_give: id,
      password_give: password,
    },
    success: function (response) {
      console.log(response);
      if (response["result"] === "success") {
        let token = response["token"];
        $.cookie("my_token", token, { path: "/" });
        alert("Login successful!");
        window.location.href = "/dashboardAdmin";
      } else {
        alert(response["msg"]);
      }
    },
  });
}

