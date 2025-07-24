function login() {
  if (!validateForm($("#loginForm"))) {
    return false;
  }

  common.login({
    loginId: $("#loginId").val(),
    password: $("#password").val(),
  });
}
