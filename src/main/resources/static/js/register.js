function register() {
  if (!validateForm($("#registerForm"))) {
    return false;
  }

  Confirm("회원가입 하시겠습니까?", function (result) {
    if (result) {
      const data = common.toJson("#registerForm");
      const url = "/users";

      common.ajaxJson(url, "POST", data, function (response) {
        if (response.status) {
          Alert("회원가입되었습니다. <br>[확인]을 클릭하여 로그인을 해주세요.", function () {
            window.location.href = "/login";
          });
        }
      });
    }
  });
}
