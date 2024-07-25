// $(document).ready(function () {
//   const socket = io();

//   socket.on("new_order", function (input) {
//     let fileLink = input.file_dp_user
//       ? `<a href="/static/img/uploads/${input.file_dp_user.filename}" target="_blank" class="link link-primary">Bukti pembayaran</a>`
//       : "None";
//     let temp_html = `<div class="card bg-base-100 shadow-xl">
//             <div class="card-body">
//                 <p>Nama Customer : ${input.nama_user}</p>
//                 <p>Nomer Telepon : ${input.notelp_user}</p>
//                 <p>Lokasi terdekat : ${input.droppoint_user}</p>
//                 <p>Jenis Layanan : ${input.layanan_user}</p>
//                 <p>Pilih pembayaran : ${input.dp_user}</p>
//                 <p>Bukti DP (50%) : ${fileLink}</p>
//                 <p>jenis Sepatu Customer : ${input.jenis_sepatu_user}</p>
//                 <p>kondisi Sepatu Customer : ${input.kondisi_sepatu_user}</p>
//                 <p>status pesanan : ${input.status}</p>
//                 <div class="card-actions justify-center mt-4">
//                     <button class="btn btn-success" onclick="updateStatus('${input.id_user}', 'completed')">Approve</button>
//                     <button class="btn btn-error" onclick="showDeclineModal('${input.id_user}')">Decline</button>
//                 </div>
//                 <div class="hidden notes">
//                     <label for="notes">
//                         Notes untuk customer
//                         <input
//                             type="text"
//                             placeholder="Type here"
//                             class="input input-bordered input-sm w-full max-w-xs"
//                             id="notes"
//                         />
//                         <button class="btn btn-sm mt-2">Submit</button>
//                     </label>
//                 </div>
//             </div>
//         </div>`;
//     $("#inputFromUser").append(temp_html);
//   });

//   function fetchInputs() {
//     const statusFilter = $("#statusFilter").val();
//     $.ajax({
//       type: "GET",
//       url: "/fetch_inputs",
//       data: { status: statusFilter },
//       success: function (response) {
//         $("#inputFromUser").empty();
//         response.inputs.forEach(function (input) {
//           let fileLink = input.file_dp_user
//             ? `<a href="/static/img/uploads/user/${input.file_dp_user}" class="link link-primary" target="_blank">Bukti pembayaran</a>`
//             : "None";
//           let declineReason =
//             input.status === "decline"
//               ? `<p>Reason for Decline: ${input.decline_reason}</p>`
//               : "";
//           let cardClass =
//             input.status === "completed"
//               ? "bg-green-500"
//               : input.status === "decline"
//               ? "bg-red-500"
//               : "";
//           let temp_html = `<div class="card bg-base-100 shadow-xl overflow-hidden">
//                         <div class="card-body ${cardClass}">
//                             <p>Nama Customer : ${input.nama_user}</p>
//                             <p>Nomer Telepon : ${input.notelp_user}</p>
//                             <p>Lokasi terdekat : ${input.droppoint_user}</p>
//                             <p>Jenis Layanan : ${input.layanan_user}</p>
//                             <p>Pilih pembayaran : ${input.dp_user}</p>
//                             <p>Bukti DP (50%) : ${fileLink}</p>
//                             <p>jenis Sepatu Customer : ${input.jenis_sepatu_user}</p>
//                             <p>kondisi Sepatu Customer : ${input.kondisi_sepatu_user}</p>
//                             <p>status pesanan : ${input.status}</p>
//                             ${declineReason}
//                             <div class="card-actions justify-center mt-4">
//                                 <button class="btn btn-success" onclick="updateStatus('${input.id_user}', 'completed')">Approve</button>
//                                 <button class="btn btn-error" onclick="showDeclineModal('${input.id_user}')">Decline</button>
//                             </div>
//                         </div>
//                     </div>`;
//           $("#inputFromUser").append(temp_html);
//         });
//       },
//       error: function (error) {
//         alert("Error fetching inputs");
//       },
//     });
//   }



//   // Make fetchInputs globally accessible
//   window.fetchInputs = fetchInputs;

//   fetchInputs();
// });

// function updateStatus(id_user, status, reason = null) {
//   const url = status === "completed" ? "/update_status" : "/decline_status";
//   const data = { id_user: id_user };
//   if (reason) {
//     data.reason = reason;
//   }
//   $.ajax({
//     type: "POST",
//     url: url, // Ganti dengan URL endpoint yang sesuai di backend Anda
//     contentType: "application/json",
//     data: JSON.stringify(data),
//     success: function (response) {
//       if (response.result === "success") {
//         fetchInputs(); // Refresh the list to show updated status
//       } else {
//         // Handle jika ada kesalahan dalam pembaruan
//         alert("Failed to update order status.");
//       }
//     },
//     error: function (xhr, status, error) {
//       // Handle kesalahan AJAX
//       alert("Error updating order status:", error);
//     },
//   });
// }

// // function deleteInput(id_user) {
// //   if (confirm("Are you sure you want to delete this input?")) {
// //     $.ajax({
// //       type: "POST",
// //       url: "/delete_input",
// //       contentType: "application/json",
// //       data: JSON.stringify({ id_user: id_user }),
// //       success: function (response) {
// //         if (response.result === "success") {
// //           fetchInputs(); // Refresh the list to show updated status
// //         } else {
// //           alert("Error deleting input: " + response.message);
// //         }
// //       },
// //       error: function (xhr, status, error) {
// //         alert("Error deleting input: " + error);
// //       },
// //     });
// //   }
// // }

// $(document).ready(function () {
//   $("#declineForm").submit(function (event) {
//     event.preventDefault();

//     // Ambil nilai id_user dan reason dari input form
//     const id_user = $("#declineFullname").val();
//     const reason = $("#declineReason").val();

//     // Panggil fungsi updateStatus untuk mengirim permintaan penolakan
//     updateStatus(id_user, "decline", reason);

//     // Sembunyikan modal setelah mengirim permintaan
//     toggleModal("declineModal");
//   });
// });
