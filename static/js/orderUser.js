// Hamburger
const hamburger = document.querySelector("#hamburger");
const navMenu = document.querySelector("#nav-menu");

hamburger.addEventListener("click", function () {
  hamburger.classList.toggle("hamburger-active");
  navMenu.classList.toggle("hidden");
});


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

$(document).ready(function () {
  $("#submitForm").click(function (e) {
    e.preventDefault(); // Mencegah pengiriman formulir bawaan

    // Ambil nilai dari setiap input
    let inputId = $("#input_id").val().trim();
    let inputNama = $("#input_nama").val().trim();
    let inputNotelp = $("#input_notelp").val().trim();
    let inputDroppoint = $("#input_droppoint").val();
    let input_ambilantar = $("#input_ambilantar").val();
    let inputLayanan = $("#input_layanan").val();
    let inputJumlahDp = $("#input_jumlah_dp").val();
    let inputDp = $("#input_dp").val();
    let inputBuktiDp = $("#input_bukti_dp")[0].files[0];
    let inputJenisSepatu = $("#input_jenis_sepatu").val().trim();
    let inputKondisi = $("#input_kondisi").val().trim();

    // Lakukan validasi untuk memastikan tidak ada input yang kosong
    if (
      inputNama === "" ||
      inputNotelp === "" ||
      inputDroppoint === null ||
      inputLayanan === null ||
      inputDp === null ||
      inputBuktiDp === undefined ||
      inputJenisSepatu === "" ||
      inputKondisi === ""
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Mohon lengkapi semua field yang diperlukan.",
      });
      return;
    }

    // Jika semua input terisi, buat objek FormData dan kirimkan ke server
    let formData = new FormData();
    formData.append("input_id", inputId);
    formData.append("input_nama", inputNama);
    formData.append("input_notelp", inputNotelp);
    formData.append("input_droppoint", inputDroppoint);
    formData.append("input_ambilantar", input_ambilantar);
    formData.append("input_layanan", inputLayanan);
    formData.append("input_jumlah_dp", inputJumlahDp);
    formData.append("input_dp", inputDp);
    formData.append("input_bukti_dp", inputBuktiDp);
    formData.append("input_jenis_sepatu", inputJenisSepatu);
    formData.append("input_kondisi", inputKondisi);

    $.ajax({
      type: "POST",
      url: "/submitdatabase",
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Data telah berhasil dikirim.",
        }).then(() => {
          // Append template HTML dinamis setelah sukses
          let newCard = `
            <p>Beritahu admin bahwa anda sudah melakukan pemesanan <button class="btn btn-success text-white mt-1" type="submit">Beritahu Admin</button> </p>
          `;
          $(".notif").append(newCard);
          // window.location.href = `/riwayatPesan_user/${inputId}`;
        });
      },
      error: function (xhr, status, error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Terjadi kesalahan dalam pengiriman data: " + error,
        });
      },
    });
  });
});



// Fungsi untuk mengubah harga DP berdasarkan pilihan layanan
document.getElementById('input_layanan').addEventListener('change', function() {
  let layanan = this.value;
  let dp;

  if (layanan === 'Deep Clean') {
    dp = 40000 ;
  } else if (layanan === 'Fast Clean') {
    dp = 35000 ;
  } else if (layanan === 'Unyellowing' || layanan === 'Leather/Suede') {
    dp = 45000 ;
  } else if (layanan === 'Sandals') {
    dp = 30000 ;
  }
  
  else {
    dp = 0;
  }

  document.getElementById('input_jumlah_dp').value = 'Rp ' + dp.toLocaleString('id-ID');
});
