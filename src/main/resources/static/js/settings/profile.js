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
  common.ajaxApi(url, "GET", null, afterGetSettingAPI);
}

function afterGetSettingAPI(response) {
  if (response.data) {
    let data = response.data;
    $("#loginId").text(data.loginId);
    $("#name").text(data.name);
    $("#email").text(data.email);
    $("#createAt").text(common.formatIsoDate(data.createAt, "-"));
  }
}

function deleteAccount() {
  Confirm("회원을 탈퇴하시겠습니까?<br>탈퇴 후 모든 정보는 사라집니다.", function (result) {
    if (result) {
      const url = "/api/settings/me";
      common.ajaxApi(url, "DELETE", null, function (response) {
        if (response.status) {
          Alert("탈퇴되었습니다.", function () {
            sessionStorage.clear();
            window.location.href = "/";
          });
        }
      });
    }
  });
}
