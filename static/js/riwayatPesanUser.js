
// Hamburger
const hamburger = document.querySelector("#hamburger");
const navMenu = document.querySelector("#nav-menu");

hamburger.addEventListener("click", function () {
  hamburger.classList.toggle("hamburger-active");
  navMenu.classList.toggle("hidden");
});

// navbar fixed, feature to top
window.onscroll = function () {
  const header = document.querySelector("header");
  const fixedNav = header.offsetTop;

  if (window.pageYOffset > fixedNav) {
    header.classList.add("navbar-fixed");
  } else {
    header.classList.remove("navbar-fixed");
  }
};

function sign_out() {
  Swal.fire({
    title: "Are you sure?",
    text: "You will be logged out of your account.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, sign out!",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      Cookies.remove("mytoken", { path: "/" }); // Menggunakan js-cookie untuk menghapus cookie
      Swal.fire({
        title: "Signed Out",
        text: "You have been successfully signed out.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.href = "/";
      });
    }
  });
}
