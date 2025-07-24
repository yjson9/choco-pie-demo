/* 
    유효성 검사 공통 함수 (validator)
*/
const patterns = {
  loginId: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/,
  name: /^[가-힣a-zA-Z\s]+$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

const validateForm = function (form) {
  let isValid = true;

  form.find("[data-validate]").each(function () {
    const $el = $(this);
    const type = $el.attr("type");
    const value = $el.val().trim();
    const rules = $el.data("validate").split(" ");

    // 필수 입력
    if (rules.includes("required")) {
      if (type === "checkbox" && !$el.is(":checked")) {
        showError($el, "필수 선택 항목입니다.");
        isValid = false;
        return;
      }
      if (type === "select" && !value) {
        showError($el, "필수 선택 항목입니다.");
        isValid = false;
        return;
      }
      if (!value) {
        showError($el, "필수 입력 항목입니다.");
        isValid = false;
        return;
      }
    }

    // 길이
    const min = $el.data("min");
    const max = $el.data("max");
    if (rules.includes("length")) {
      if (min && value.length < min) {
        showError($el, `최소 ${min}자 이상 입력해주세요.`);
        isValid = false;
        return;
      }
      if (max && value.length > max) {
        showError($el, `최대 ${max}자까지만 입력 가능합니다.`);
        isValid = false;
        return;
      }
    }

    // 패턴
    if (rules.includes("pattern")) {
      const patternId = $el.data("pattern").trim();
      const regex = patterns[patternId];
      if (!regex.test(value)) {
        showError($el, "올바른 형식이 아닙니다.");
        isValid = false;
        return;
      }
    }

    // 값 일치
    if (rules.includes("match")) {
      const matchSelector = $el.data("match");
      const matchName = $el.data("match-name");
      const matchValue = $(matchSelector).val().trim();
      if (value !== matchValue) {
        showError($el, `${matchName}가 일치하지 않습니다.`);
        isValid = false;
        return;
      }
    }

    removeError($el);
  });

  return isValid;
};

// 에러 메시지 표시 함수
const showError = function ($el, message) {
  removeError($el);
  $el.addClass("is-invalid");

  if ($el.attr("type") === "checkbox") {
    $el.parent().append(`<div class="invalid-feedback d-block">${message}</div>`);
  } else {
    $el.after(`<div class="invalid-feedback">${message}</div>`);
  }
};

// 에러 메시지 제거 함수
const removeError = function ($el) {
  $el.removeClass("is-invalid");
  $el.parent().find(".invalid-feedback").remove();
};
