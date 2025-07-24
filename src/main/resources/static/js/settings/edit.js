$(document).ready(function () {
  common.sendAuthorize().then((isAuthorized) => {
    if (!isAuthorized) {
      Alert("로그인 세션이 만료되었습니다.<br>다시 로그인해주세요.", function () {
        sessionStorage.clear(); // SessionStorage 전체 삭제
        window.location.href = "/login";
      });
    } else {
      getSettingAPI();
    }
  });
});

function getSettingAPI() {
  const url = "/api/settings/me";
  common.ajaxApi(url, "GET", null, function (res) {
    if (res.data) {
      $("#id").val(res.data.id);

      $("#loginId").val(res.data.loginId);
      $("#email").val(res.data.email);
      $("#name").val(res.data.name);
    }
  });
}

function changePassword() {
  if (!validateForm($("#changePasswordForm"))) {
    return false;
  }

  Confirm("비밀번호를 변경하시겠습니까?", function (result) {
    if (result) {
      const data = common.toJson("#changePasswordForm");
      const url = "/api/settings/password";

      common.ajaxApi(url, "POST", data, function (response) {
        if (response.status) {
          Alert("비밀번호가 변경되었습니다.<br>[확인]을 클릭하여 다시 로그인 해주세요.", function () {
            sessionStorage.clear(); // SessionStorage 전체 삭제
            window.location.href = "/login";
          });
        }
      });
    }
  });
}

function updateProfile() {
  let profileForm = $("#profileEditForm");
  if (!validateForm(profileForm)) {
    return false;
  }

  Confirm("수정하시겠습니까?", function (result) {
    if (result) {
      const data = common.toJson("#profileEditForm");
      const url = profileForm.attr("action");

      common.ajaxApi(url, "PUT", data, function (response) {
        if (response.status) {
          Alert("수정되었습니다.", function () {
            window.location.href = "/settings";
          });
        }
      });
    }
  });
}
