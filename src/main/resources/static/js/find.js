function findId() {
  if (!validateForm($("#findIdForm"))) {
    return;
  }

  const data = common.toJson("#findIdForm");
  const url = "/users/findId";

  common.ajaxJson(url, "POST", data, function (response) {
    if (response.status && response.data) {
      renderResult(response.data);
    }
  });
}

function renderResult(data) {
  let modal = $("#findIdResultModal");
  let findIdResult = $("#findIdResult").empty();

  let formatDate = common.formatIsoDate(`${data.createAt}`, "-");
  let render = `
        <p class="m-0 fs-5">
            회원님의 아이디는 <strong>${data.loginId}</strong> 입니다.
        </p>
        <p class="m-0">${formatDate} 가입</p>
    `;

  findIdResult.append(render);
  modal.modal("show");
}

function findPwTab() {
  $("#findIdResultModal").modal("hide");
  $("#findIdForm")[0].reset();

  $("#find-password-tab").click();
}

function findPw() {
  if (!validateForm($("#findPasswordForm"))) {
    return;
  }

  const data = common.toJson("#findPasswordForm");
  const url = "/users/findPw";

  common.ajaxJson(url, "POST", data, function (response) {
    if (response.status) {
      Alert("임시 비밀번호가 메일로 발송되었습니다. <br>로그인 후 비밀번호 변경해주시기 바랍니다.", function () {
        window.location.href = "/login";
      });
    }
  });
}
