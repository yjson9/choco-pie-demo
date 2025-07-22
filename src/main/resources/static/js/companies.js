// Call the dataTables jQuery plugin
$(document).ready(function () {
  $("#dataTable").DataTable({
    paging: true,
    pageLength: 10, // 기본적으로 10개의 줄을 표시
    language: {
      emptyTable: "No data available",
    },
  });
  // const table = $('#dataTable').DataTable({
  //     paging: true,
  //     pageLength: 10, // 기본적으로 10개의 줄을 표시
  //     language: {
  //         emptyTable: "No data available",
  //     }
  // });

  $("#searchButton").click(function () {
    console.log("버튼클릭");
    const tableBody = $("#dataTable tbody");
    tableBody.empty(); // 기존 테이블 내용 비우기
    $.ajax({
      url: "/choco-pie/companies",
      method: "GET",
      data: { name: $("#name").val() },
      success: function (response) {
        console.log("response:", response);
        // 성공적으로 데이터를 받았을 때 처리

        // 반환된 부분 뷰 (companyRows)만 교체
        $("#companyRows").replaceWith($(response));
        // if (response && Array.isArray(response)) {

        //     // 서버에서 반환된 HTML 조각을 tbody에 삽입
        //     $('#dataTable tbody').html(response);

        //     // if (response.length > 0) {
        //     //     // 데이터가 있을 때 테이블에 추가
        //     //     response.forEach(company => {
        //     //         const row = `
        //     //             <tr>
        //     //                 <td>${company.id}</td>
        //     //                 <td>${company.name}</td>
        //     //                 <td>${company.phone}</td>
        //     //                 <td>${company.businessId}</td>
        //     //                 <td>${company.memo}</td>
        //     //             </tr>`;
        //     //         tableBody.append(row);
        //     //     });
        //     // } else {
        //     //     // 데이터가 없을 때 기본 10줄 추가
        //     //     for (let i = 0; i < 10; i++) {
        //     //         const emptyRow = `
        //     //             <tr>
        //     //                 <td>&nbsp;</td>
        //     //                 <td>&nbsp;</td>
        //     //                 <td>&nbsp;</td>
        //     //                 <td>&nbsp;</td>
        //     //                 <td>&nbsp;</td>
        //     //             </tr>`;
        //     //         tableBody.append(emptyRow);
        //     //     }
        //     // }
        // }
      },
      error: function (xhr, status, error) {
        console.error("데이터를 가져오는 데 실패했습니다:", error);
        alert("데이터를 가져오는 데 실패했습니다.");
      },
    });
  });
});

// $(document).ready(function() {
//     $('#dataTable').DataTable();
//   });
