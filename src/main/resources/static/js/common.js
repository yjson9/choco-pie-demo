/* 
    공통 함수 (common)
    - common.setAccessToken : Access Token 전역 변수 설정 및 SessionStorage 저장
    - common.getAccessToken : 전역 변수에 있는 Access Token 조회, null 인 경우 SessionStorage 조회
    - common.getLoginId : SessionStorage 저장된 로그인 아이디 값
    - common.ajax : 최종 ajax 호출
    - common.ajaxError : ajax 호출 후 오류
    - common.ajaxJson : Json 타입의 ajax 호출
    - common.ajaxForm : Form 형식 ajax 호출
    - common.ajaxApi : API ajax 호출
    - common.ajaxFormApi : Form 형식 API ajax 호출
    - common.downloadApi : 다운로드 API 호출
    - common.getDownloadFilename : 다운로드 API 활용할 파일명 추출
    - common.sendAuthorize : Access Token 검증 및 Refresh Token 재발급 호출
    - common.sendReissue : Refresh Token 재발급 요청 함수
    - common.setUserInfo : User 정보 설정
    - common.login : login 공통 로직
    - common.logout : logout 공통 로직
    - common.toJson : Form 형식 Json 데이터로 변환
    - common.fillTemplate : 백틱 템플릿 적용
    - common.formatIsoDate : ISO Date 타입(ex. 2017-03-16T17:40:00)의 날짜 형식 변환
*/
let accessToken = null;
let common = {};
common.setAccessToken = function (token) {
  accessToken = token;
  sessionStorage.setItem("access-token", token); // sessionStorage에도 저장
};

common.getAccessToken = function () {
  if (!accessToken) {
    accessToken = sessionStorage.getItem("access-token");
  }
  return accessToken;
};

common.getLoginId = function () {
  return sessionStorage.getItem("login-id");
};

common.ajax = function (opts, success, error) {
  showLoading();

  if (typeof error !== "function") {
    $.ajax(opts)
      .done(function (data, _textStatus, jqXHR) {
        success(data);
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        return common.ajaxError(jqXHR, textStatus, errorThrown, opts);
      })
      .always(function () {
        hideLoading(); // AJAX 요청이 끝나면 로딩바 숨김
      });
    return;
  }

  $.ajax(opts)
    .done(function (data, _textStatus, jqXHR) {
      success(data);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      //common.ajaxErrorLog(jqXHR, textStatus, errorThrown, opts);
      return error(jqXHR);
    })
    .always(function () {
      hideLoading(); // AJAX 요청이 끝나면 로딩바 숨김
    });
};

common.ajaxError = function (jqXHR, textStatus, errorThrown, param) {
  console.error("AJAX Error Details:", {
    jqXHR,
    textStatus,
    errorThrown,
    param,
  });

  if (jqXHR.responseJSON) {
    const errorResponse = jqXHR.responseJSON;
    console.error("errorResponse", errorResponse);
    Alert(`${errorResponse.message}`);
  } else {
    Alert("처리 중 오류가 발생했습니다.<br>잠시후 다시 이용해주세요.");
  }

  return false;
};

common.ajaxJson = function (url, type, param, success, error) {
  let opts = {
    type: type,
    url: url,
    data: JSON.stringify(param),
    dataType: "json",
    contentType: "application/json; charset:utf-8",
  };

  return common.ajax(opts, success, error);
};

common.ajaxForm = function (url, type, formId, success, error) {
  let opts = {
    type: type,
    url: url,
    data: $(formId).serialize(),
    dataType: "html",
    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
  };

  return common.ajax(opts, success, error);
};

common.ajaxApi = function (url, type, param, success, error) {
  const token = common.getAccessToken();
  if (!token) {
    console.log("Access Token 없음, 재발급 시도");
    return common.sendAuthorize().then((isAuthorized) => {
      if (isAuthorized) {
        // Access Token이 재발급되면 재요청
        common.ajaxApi(url, type, param, success, error);
      } else {
        Alert("로그인 세션이 만료되었습니다.<br>다시 로그인해주세요.", function () {
          sessionStorage.clear(); // SessionStorage 전체 삭제
          window.location.href = "/login";
        });
      }
    });
  }

  const opts = {
    type: type,
    url: url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    dataType: "json",
    contentType: "application/json; charset=utf-8",
  };

  if (param) {
    opts.data = JSON.stringify(param);
  }

  return common.ajax(opts, success, error);
};

common.ajaxFormApi = function (url, param, success, error) {
  const token = common.getAccessToken();
  if (!token) {
    console.log("Access Token 없음, 재발급 시도");
    return common.sendAuthorize().then((isAuthorized) => {
      if (isAuthorized) {
        // Access Token이 재발급되면 재요청
        common.ajaxApi(url, type, param, success, error);
      } else {
        Alert("로그인 세션이 만료되었습니다.<br>다시 로그인해주세요.", function () {
          sessionStorage.clear(); // SessionStorage 전체 삭제
          window.location.href = "/login";
        });
      }
    });
  }

  const opts = {
    type: "POST",
    url: url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: param,
    processData: false,
    contentType: false,
  };

  return common.ajax(opts, success, error);
};

common.downloadApi = function (url, method, data) {
  const token = common.getAccessToken();
  if (!token) {
    console.log("Access Token 없음, 재발급 시도");
    return common.sendAuthorize().then((isAuthorized) => {
      if (isAuthorized) {
        // Access Token이 재발급되면 재요청
        common.downloadApi(url, data);
      } else {
        Alert("로그인 세션이 만료되었습니다.<br>다시 로그인해주세요.", function () {
          sessionStorage.clear();
          window.location.href = "/login";
        });
      }
    });
  }

  return fetch(url, {
    method: method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (!res.ok) throw new Error(res);
      const contentDisposition = res.headers.get("Content-Disposition");
      return res.blob().then((blob) => ({ blob, contentDisposition }));
    })
    .then(({ blob, contentDisposition }) => {
      const fileName = common.getDownloadFilename(contentDisposition) || "download.zip";
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);

      link.click();
      link.remove();
    })
    .catch((err) => {
      Alert("다운로드에 실패했습니다.");
      console.error(err);
    });
};

common.getDownloadFilename = function (contentDisposition) {
  if (!contentDisposition) return null;

  const matches = contentDisposition.match(/filename\*=UTF-8''(.+)/);
  if (matches && matches.length > 1) {
    return decodeURIComponent(matches[1]);
  }

  // fallback: 일반 filename
  const fallback = contentDisposition.match(/filename="(.+)"/);
  return fallback && fallback[1] ? fallback[1] : null;
};

common.sendAuthorize = function () {
  return new Promise((resolve, reject) => {
    const token = common.getAccessToken();
    if (!token) {
      console.warn("Access Token 없음, Refresh Token 사용");
      return common
        .sendReissue()
        .then(() => common.sendAuthorize().then(resolve).catch(reject))
        .catch((error) => {
          resolve(error);
        });
    }

    $.ajax({
      url: "/auth",
      type: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .done((response) => {
        console.log("Access Token 유효", response);
        //common.setUserInfo(response);
        resolve(true);
      })
      .fail((error) => {
        console.warn("Access Token 검증 오류, Refresh Token 사용", error);
        common
          .sendReissue()
          .then(() => common.sendAuthorize().then(resolve).catch(reject))
          .catch((error) => {
            resolve(error);
          });
      });
  });
};

common.sendReissue = function () {
  return new Promise((resolve, reject) => {
    const refreshTokenId = sessionStorage.getItem("refresh-token-id");
    const loginId = sessionStorage.getItem("login-id");

    if (!refreshTokenId || !loginId) {
      console.warn("Refresh Token 없음");
      reject(false);
      return;
    }

    $.ajax({
      url: "/auth/reissue",
      type: "POST",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify({ loginId: loginId, refreshToken: refreshTokenId }),
    })
      .done((response) => {
        console.log("새 Access Token 발급 성공", response);
        common.setAccessToken(response.data.accessToken);
        sessionStorage.setItem("refresh-token-id", response.data.refreshToken); // 새 UUID 저장
        resolve(true);
      })
      .fail((error) => {
        console.warn("Refresh Token 검증 실패", error);
        reject(false);
      });
  });
};

common.setUserInfo = function (userId, userName) {
  const loginId = common.getLoginId();
  if (userId === loginId) {
    return `나 (${userId})`;
  } else {
    return `${userName} (${userId})`;
  }
};

common.login = function (data) {
  $.ajax({
    url: "/auth/login",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(data),
    success: function (response) {
      console.log("response", response);
      if (response.status && response.data) {
        // Access Token 저장
        common.setAccessToken(response.data.accessToken);

        // Refresh Token & LoginId 저장
        sessionStorage.setItem("refresh-token-id", response.data.refreshToken);
        sessionStorage.setItem("login-id", data.loginId);

        // 이전 페이지로 리다이렉트
        window.location = "/dashboard";
      }
    },
    error: function (error) {
      console.error("error", error);
      Alert("로그인 실패하였습니다.<br>아이디와 비밀번호를 확인해주세요.");
    },
  });
};

common.logout = function () {
  const token = common.getAccessToken();
  const loginId = sessionStorage.getItem("login-id");

  if (!token || !loginId) {
    console.warn("token, loginId 없음");
    Alert("처리 중 오류가 발생했습니다.<br>잠시후 다시 이용해주세요.");
    return;
  }

  Confirm("로그아웃 하시겠습니까?", function (result) {
    if (result) {
      $.ajax({
        url: "/auth/logout",
        type: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { loginId: loginId },
      })
        .done(() => {
          console.log("로그아웃 성공");
          sessionStorage.clear(); // SessionStorage 전체 삭제
          window.location.href = "/login"; // 로그인 페이지로 이동
        })
        .fail(() => {
          Alert("처리 중 오류가 발생했습니다.<br>잠시후 다시 이용해주세요.", function () {
            window.location.href = "/";
          });
        });
    } else {
      return;
    }
  });
};

common.toJson = function (formId) {
  var unindexed_array = $(formId).serializeArray();
  var json = {};
  var addProps = function (parent, prop, value) {
    var delim = prop.indexOf(".");
    if (prop.indexOf(".") != -1) {
      var propName = prop.substr(0, delim);
      var currentObject = parent[propName];
      if (currentObject === undefined) {
        currentObject = {};
        parent[propName] = currentObject;
      }
      addProps(currentObject, prop.substr(delim + 1), value);
    } else {
      if (Array.isArray(value)) {
        parent[prop] = value.join(",");
      } else {
        parent[prop] = value;
      }
    }
  };
  var keyMap = {};
  $.map(unindexed_array, function (n, _i) {
    var name = n.name;
    var value = n.value.trim();
    if (keyMap[name]) {
      if (Array.isArray(keyMap[name])) {
        keyMap[name].push(value);
      } else {
        keyMap[name] = [keyMap[name], value];
      }
    } else {
      keyMap[name] = value;
    }
  });
  $.map(keyMap, function (value, name) {
    if (name.search("\\.") > -1) {
      addProps(json, name, value);
    } else {
      if (Array.isArray(value)) {
        json[name] = value.join(",");
      } else {
        json[name] = value;
      }
    }
  });
  return json;
};

common.fillTemplate = function (template, data) {
  return template.replace(/{{(.*?)}}/g, (match, key) => {
    return data[key.trim()] || "";
  });
};

common.formatIsoDate = function (isoDate, type) {
  try {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    const datePart = type ? `${year}${type}${month}${type}${day}` : `${year}-${month}-${day}`;
    const timePart = `${hours}:${minutes}`;

    return `${datePart} ${timePart}`; // 예: "2025.04.10 14:35"
  } catch (error) {
    console.error("Invalid date format:", isoDate);
    return isoDate;
  }
};

common.formatSize = function (bytes) {
  if (bytes === 0) return `0 B`;
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/*
    공통 함수 (단일)
    - showLoading : 로딩바 
    - hideLoading : 로딩바 숨기기
    - setSidebarMenu : 사이드바 메뉴 활성화 처리 (Path 기준)
    - openCustomModal : 커스텀 모달 함수
    - closeCustomModal : 커스텀 모달 함수
*/
const showLoading = function () {
  $("#loadingBar").fadeIn(200);
};

const hideLoading = function () {
  $("#loadingBar").fadeOut(200);
};

const openCustomModal = function (elementId) {
  if (!elementId) {
    console.error("openCustomModal - elementId is undefined");
    return;
  }

  const $modal = $("#" + elementId);
  $modal.modal("show");
};

const closeCustomModal = function (elementId) {
  if (!elementId) {
    console.error("openCustomModal - elementId is undefined");
    return;
  }

  const $modal = $("#" + elementId);
  $modal.find("button").blur();
  $modal.modal("hide");
};

const setSidebarMenu = function () {
  let currentPath = window.location.pathname;
  let menuItems = document.querySelectorAll("#sidebarMenu .nav-link");

  menuItems.forEach((item) => {
    const itemPath = item.getAttribute("data-path");
    if (currentPath.includes(itemPath)) {
      item.classList.add("active");

      // 만약 상위에 collapse 서브메뉴가 있으면 열어준다
      const collapseParent = item.closest(".collapse");
      if (collapseParent) {
        collapseParent.classList.add("show");

        const parentToggle = document.querySelector(`a[href="#${collapseParent.id}"]`);
        parentToggle?.setAttribute("aria-expanded", "true");
        parentToggle?.classList.add("active");

        const chevronIcon = parentToggle?.querySelector(".chevron-icon");
        if (chevronIcon) {
          chevronIcon.classList.remove("fa-chevron-right");
          chevronIcon.classList.add("fa-chevron-down");
        }
      }
    }
  });
};

/*
  공통 이벤트
  - [data-bs-dismiss='modal'] : 부트스트랩 모달 관련 접근성 처리
*/
document.addEventListener("click", function (e) {
  if (e.target.closest("[data-bs-dismiss='modal']")) {
    document.activeElement.blur();
  }
});
