/*
    모달 공통 함수
    - Alert : alert 모달 호출
    - Confirm : confirm 모달 호출
*/
$(document).ready(function () {
  const alertModalInstance = new bootstrap.Modal(document.getElementById("alertModal"), {
    backdrop: "static",
    keyboard: false,
  });
  const confirmModalInstance = new bootstrap.Modal(document.getElementById("confirmModal"), {
    backdrop: "static",
    keyboard: false,
  });

  window.Alert = function (message, callback) {
    const $message = $("#alertMessage");
    const $okBtn = $("#alertOkBtn");

    $message.html(message);
    $okBtn.off("click").on("click", function () {
      $okBtn.blur(); // 포커스 제거
      alertModalInstance.hide();
      callback?.();
    });

    alertModalInstance.show();
  };

  window.Confirm = function (message, callback) {
    const $message = $("#confirmMessage");
    const $okBtn = $("#confirmOkBtn");
    const $cancelBtn = $("#confirmCancelBtn");

    $message.html(message);
    $okBtn.off("click").on("click", function () {
      $okBtn.blur(); // 포커스 제거
      confirmModalInstance.hide();
      callback?.(true);
    });

    $cancelBtn.off("click").on("click", function () {
      $cancelBtn.blur(); // 포커스 제거
      confirmModalInstance.hide();
      callback?.(false);
    });

    confirmModalInstance.show();
  };
});
