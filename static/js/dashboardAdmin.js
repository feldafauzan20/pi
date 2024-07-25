const menuButton = document.getElementById("menu-button");
const sidebar = document.getElementById("sidebar");
const menuIcon = document.getElementById("menu-icon");
const closeIcon = document.getElementById("close-icon");

menuButton.addEventListener("click", () => {
  sidebar.classList.toggle("-translate-x-full");
  sidebar.classList.toggle("translate-x-0");
  menuIcon.classList.toggle("hidden");
  closeIcon.classList.toggle("hidden");
});

// tutup sidebar saat mengklik di luar menu pada perangkat mobile
document.addEventListener("click", (e) => {
  if (!sidebar.contains(e.target) && !menuButton.contains(e.target)) {
    sidebar.classList.add("-translate-x-full");
    sidebar.classList.remove("translate-x-0");
    menuIcon.classList.remove("hidden");
    closeIcon.classList.add("hidden");
  }
});

function sign_out() {
  Swal.fire({
    title: 'Apakah Anda yakin?',
    text: 'Anda akan keluar!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, keluar',
    cancelButtonText: 'Batal',
    reverseButtons: true,
    customClass: {
      popup: 'z-50' 
    }
  }).then((result) => {
    if (result.isConfirmed) {
      // Jika pengguna mengonfirmasi logout
      $.removeCookie('mytoken', { path: '/' });
      Swal.fire({
        title: 'Berhasil Keluar!',
        text: 'Anda telah berhasil keluar.',
        icon: 'success',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false
      }).then(() => {
        // Redirect ke halaman login setelah logout
        window.location.href = '/';
      });
    }
  });
}
