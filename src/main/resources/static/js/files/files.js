let currentPage = 1;
let isLoading = false;
let isLastPage = false;
let folderStack = [];

$(document).ready(function () {
  common.sendAuthorize().then((isAuthorized) => {
    if (!isAuthorized) {
      Alert("로그인 세션이 만료되었습니다.<br>다시 로그인해주세요.", function () {
        sessionStorage.clear(); // SessionStorage 전체 삭제
        window.location.href = "/login";
      });
    } else {
      getContentsAPI(currentPage);
    }
  });

  // 전체 선택
  $(".file-table thead input[type='checkbox']").on("change", function () {
    const checked = $(this).is(":checked");
    $("#contents input[type='checkbox']").prop("checked", checked);
  });

  // 개별 선택 및 선택 해제
  $("#contents").on("change", "input[type='checkbox']", function () {
    const allChecked =
      $("#contents input[type='checkbox']").length === $("#contents input[type='checkbox']:checked").length;
    $(".file-table thead input[type='checkbox']").prop("checked", allChecked);
  });

  // 행 클릭 시 선택 및 선택 해제
  $("#contents").on("click", "tr", function (e) {
    // 클릭 대상이 체크박스나 dropdown 등 인터랙션 요소가 아닐 경우만 동작
    if (!$(e.target).is("input[type='checkbox'], .clickable, .clickable *")) {
      const checkbox = $(this).find("input[type='checkbox']");
      checkbox.prop("checked", !checkbox.prop("checked")).trigger("change");
    }
  });

  // 상단 정렬 selectbox 변경 시, 목록 재호출
  $(".form-select").on("change", function () {
    getContentsAPI(1);
  });

  // 테이블 스크롤 이벤트 (다음 페이지)
  $(".file-table-wrap").on("scroll", function () {
    if (isLastPage || isLoading) return;

    const scrollTop = $(this).scrollTop();
    const scrollHeight = this.scrollHeight;
    const clientHeight = this.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 50) {
      currentPage++;
      getContentsAPI(currentPage, true);
    }
  });

  // 폴더 더블 클릭 (목록 재호출)
  $("#contents").on("dblclick", ".clickable-row", function () {
    const type = $(this).data("type");
    const id = $(this).data("id");
    if (type === "folder") {
      $("#folderId").val(id);

      folderStack.push(id);
      $("#backBtn").show();

      getContentsAPI(1);
    }
  });

  // 상위 폴더 클릭
  $("#backBtn").on("click", function () {
    folderStack.pop();
    const prevId = folderStack[folderStack.length - 1] || "";
    $("#folderId").val(prevId);
    if (prevId === "") {
      $("#backBtn").hide();
    }
    getContentsAPI(1);
  });
});

// 폴더, 파일 목록 API 호출
function getContentsAPI(page, appendMode = false) {
  if (isLoading) return;
  isLoading = true;
  isLastPage = false;
  currentPage = page;

  let form = $("#fileListForm");
  let folderId = form.find("#folderId").val();
  let sort = form.find("#sort").val();
  let direction = form.find("#direction").val();
  let url = folderId ? `/api/contents/${folderId}` : `/api/contents`;

  url += `?page=${page}&sort=${sort},${direction}`;

  common.ajaxApi(url, "GET", null, function (response) {
    afterGetContentsAPI(response, appendMode);
    isLoading = false;
  });
}

const listTemp = `
  <tr>
    <td><input type="checkbox" class="form-check-input border-dark" /></td>
            <td class="text-start" title="두번 클릭 시 해당 폴더 상세로 이동됩니다.">
              <i class="fas fa-folder me-2 text-warning"></i> 
{{data}}
            </td>
            <td>폴더</td>
            <td>-</td>
  </tr>
`;

// 폴더, 파일 목록
function afterGetContentsAPI(response, appendMode = false) {
  console.log("response", response);
  if (!response.status) return;

  let data = response.data;
  let contents = appendMode ? $("#contents") : $("#contents").empty();

  if (currentPage === 1 && data.folders) {
    let folderHtml = data.folders
      .map((f) => {
        const sharedBtn = f.shared
          ? `<button type="button" class="badge bg-black" onclick="getSharedUsers(this);"><i class="fa-user-friends fa"></i> 공유됨</button>`
          : `-`;

        return `
          <tr data-id="${f.id}" data-type="folder" data-name="${f.folderName}" data-user-id="${
          f.uploadById
        }" class="clickable-row">
            <td><input type="checkbox" class="form-check-input border-dark" /></td>
            <td class="text-start" title="두번 클릭 시 해당 폴더 상세로 이동됩니다.">
              <i class="fas fa-folder me-2 text-warning"></i> 
              ${f.folderName}
            </td>
            <td>폴더</td>
            <td>-</td>
            <td>${common.setUserInfo(f.uploadById, f.uploadBy)}</td>
            <td>${common.formatIsoDate(f.uploadAt)}</td>
            <td class="clickable">${sharedBtn}</td>
            <td>
              <div class="clickable">
                <button class="btn btn-sm border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="fas fa-ellipsis-v text-muted"></i>
                </button>
                ${setPermissionBtn(f.uploadById)}
              </div>
            </td>
          </tr>
        `;
      })
      .join("");
    contents.append(folderHtml);
  }

  if (data.files?.contents) {
    let fileHtml = data.files.contents
      .map((f) => {
        const sharedBtn = f.shared
          ? `<button type="button" class="badge bg-black" onclick="getSharedUsers(this);"><i class="fa-user-friends fa"></i> 공유됨</button>`
          : `-`;

        return `
          <tr data-id="${f.id}" data-type="file" data-name="${f.name}" data-user-id="${f.uploadById}">
            <td><input type="checkbox" class="form-check-input border-dark" /></td>
            <td class="text-start"><i class="fas fa-file me-2 text-secondary"></i> ${f.name}</td>
            <td>파일</td>
            <td>${common.formatSize(f.fileSize)}</td>
            <td>${common.setUserInfo(f.uploadById, f.uploadBy)}</td>
            <td>${common.formatIsoDate(f.uploadAt)}</td>
            <td class="clickable">${sharedBtn}</td>
            <td>
              <div class="clickable">
                <button class="btn btn-sm border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="fas fa-ellipsis-v text-muted"></i>
                </button>
                ${setPermissionBtn(f.uploadById)}
              </div>
            </td>
          </tr>
        `;
      })
      .join("");

    contents.append(fileHtml);
    isLastPage = data.files.last;
  }

  if (data.folders.length === 0 && data.files.contents.length === 0) {
    let emptyHtml = `
      <tr><td colspan="7">조회된 폴더 또는 파일이 없습니다.<br>폴더 또는 파일 추가해주세요.</td></tr>
    `;
    contents.html(emptyHtml);
  }

  $(".file-table thead input[type='checkbox']").prop("checked", false);
}

function setPermissionBtn(uploadById) {
  const loginId = common.getLoginId();
  if (loginId === uploadById) {
    return `
      <ul class="dropdown-menu dropdown-menu-end">
        <li><a class="dropdown-item" href="javascript:void(0);" onclick="renameContents(this);">이름 변경</a></li>
        <li><a class="dropdown-item" href="javascript:void(0);" onclick="downloadContents(this);">다운로드</a></li>
        <li><hr class="dropdown-divider" /></li>
        <li><a class="dropdown-item text-danger" href="javascript:void(0);" onclick="deleteContents(this);">삭제</a></li>
      </ul>
    `;
  } else {
    return `
      <ul class="dropdown-menu dropdown-menu-end">
        <li><a class="dropdown-item" href="javascript:void(0);" onclick="renameContents(this);">이름 변경</a></li>
        <li><a class="dropdown-item" href="javascript:void(0);" onclick="downloadContents(this);">다운로드</a></li>
      </ul>
    `;
  }
}

// 새폴더 생성
function submitNewFolder(formId) {
  const form = $(formId);
  if (!validateForm(form)) {
    return false;
  }

  const folderId = $("#folderId").val();
  if (folderId) {
    $("#parentId").val(folderId);
  }

  const data = common.toJson(form);
  const url = "/api/folders/add";
  common.ajaxApi(url, "POST", data, function (response) {
    if (response.status) {
      Alert("폴더가 생성되었습니다.", function () {
        form[0].reset();

        getContentsAPI(1);
        closeCustomModal("createFolderModal");
      });
    }
  });
}

// 파일 업로드
function handleFileUpload(files) {
  if (!files || files.length === 0) {
    return;
  }

  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
  }

  // 현재 선택된 폴더 ID가 있다면 함께 전송
  const folderId = $("#folderId").val();
  if (folderId) {
    formData.append("folderId", folderId);
  }

  const url = "/api/files";
  common.ajaxFormApi(url, formData, function (response) {
    if (response.status) {
      const data = response.data;
      let message = `<p>${data.message}</p>`;

      if (data.count > 0) {
        message += "<ul class='m-0'>";
        data.fail.forEach((file) => {
          message += `<li><strong>${file.fileName}</strong><br><span class="text-danger text-decoration-underline">${file.reason}</span></li>`;
        });
        message += "</ul>";
      }

      Alert(message, function () {
        getContentsAPI(1);
      });
    }
  });
}

// 폴더 업로드
function handleFolderUpload(files) {
  if (!files || files.length === 0) {
    return;
  }

  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
    formData.append("paths", files[i].webkitRelativePath);
  }

  // 현재 선택된 폴더 ID가 있다면 함께 전송
  const folderId = $("#folderId").val();
  if (folderId) {
    formData.append("baseFolderId", folderId);
  }

  const url = "/api/folders";
  common.ajaxFormApi(url, formData, function (response) {
    if (response.status) {
      const data = response.data;
      let message = `<p>${data.message}</p>`;

      if (data.count > 0) {
        message += "<ul class='m-0'>";
        data.fail.forEach((file) => {
          message += `<li><strong>${file.fileName}</strong><br><span class="text-danger text-decoration-underline">${file.reason}</span></li>`;
        });
        message += "</ul>";
      }

      Alert(message, function () {
        getContentsAPI(1);
      });
    }
  });
}

// 폴더, 파일 다중/단일 삭제
function deleteContents(obj) {
  const selectedFolders = [];
  const selectedFiles = [];

  if (!obj) {
    const loginId = common.getLoginId();
    const selectedRows = $("#contents input[type='checkbox']:checked").closest("tr");
    let isPermission = true;

    selectedRows.each(function () {
      const row = $(this);
      const type = row.data("type");
      const id = row.data("id");
      const userId = row.data("user-id");

      if (userId === loginId) {
        if (type === "folder") selectedFolders.push(id);
        else if (type === "file") selectedFiles.push(id);
      } else {
        isPermission = false;
        return false;
      }
    });

    if (!isPermission) {
      Alert("권한이 없습니다. 소유자를 확인해주세요.");
      return;
    }

    if (selectedFolders.length === 0 && selectedFiles.length === 0) {
      Alert("삭제할 항목을 선택해주세요.");
      return;
    }
  } else {
    const row = $(obj).closest("tr");
    const type = row.data("type");
    const id = row.data("id");
    if (!type || !id) return;

    if (type === "folder") selectedFolders.push(id);
    else if (type === "file") selectedFiles.push(id);
  }

  Confirm("삭제하시겠습니까?", function (result) {
    if (result) {
      const url = "/api/contents";
      const data = {
        folderIds: selectedFolders,
        fileIds: selectedFiles,
      };

      common.ajaxApi(url, "DELETE", data, function (response) {
        if (response.status) {
          Alert("삭제가 완료되었습니다.", function () {
            getContentsAPI(1);
          });
        }
      });
    }
  });
}

// 폴더, 파일 다중/단일 다운로드
function downloadContents(obj) {
  const selectedFolders = [];
  const selectedFiles = [];

  if (!obj) {
    const selectedRows = $("#contents input[type='checkbox']:checked").closest("tr");

    selectedRows.each(function () {
      const row = $(this);
      const type = row.data("type");
      const id = row.data("id");

      if (type === "folder") selectedFolders.push(id);
      else if (type === "file") selectedFiles.push(id);
    });

    if (selectedFolders.length === 0 && selectedFiles.length === 0) {
      Alert("다운로드할 항목을 선택해주세요.");
      return;
    }
  } else {
    const row = $(obj).closest("tr");
    const type = row.data("type");
    const id = row.data("id");
    if (!type || !id) return;

    if (type === "folder") selectedFolders.push(id);
    else if (type === "file") selectedFiles.push(id);
  }

  const url = "/api/contents/download";
  const data = {
    folderIds: selectedFolders,
    fileIds: selectedFiles,
  };
  common.downloadApi(url, "POST", data);
}

// 폴더, 파일 이름 변경
function renameContents(obj) {
  if (!obj) return;

  const row = $(obj).closest("tr");
  const type = row.data("type");
  const id = row.data("id");
  const name = row.data("name");
  if (!type || !id) return;

  const form = $("#renameForm");
  form.find("#id").val(id);
  form.find("#type").val(type);
  form.find("#name").val(name);

  openCustomModal("renameModal");
}

// 폴더, 파일 이름 변경 API 호출
function submitRename(formId) {
  closeCustomModal("renameModal");

  const form = $(formId);
  if (!validateForm(form)) {
    return false;
  }

  const id = form.find("#id").val();
  const type = form.find("#type").val();
  const name = form.find("#name").val();

  Confirm("이름을 변경하시겠습니까?", function (result) {
    if (result) {
      const url = type === "folder" ? `/api/folders/${id}/name` : `/api/files/${id}/name`;
      const data = { name: name };

      common.ajaxApi(url, "PATCH", data, function (response) {
        console.log("response", response);
        if (response.status) {
          Alert("변경되었습니다.", function () {
            form[0].reset();

            getContentsAPI(1);
            closeCustomModal("renameModal");
          });
        }
      });
    } else {
      openCustomModal("renameModal");
    }
  });
}

// 이동 버튼
function moveContents() {
  const loginId = common.getLoginId();
  const selectedFolders = [];
  const selectedFiles = [];
  const selectedRows = $("#contents input[type='checkbox']:checked").closest("tr");
  let isPermission = true;

  selectedRows.each(function () {
    const row = $(this);
    const type = row.data("type");
    const id = row.data("id");
    const userId = row.data("user-id");

    if (userId === loginId) {
      if (type === "folder") selectedFolders.push(id);
      else if (type === "file") selectedFiles.push(id);
    } else {
      isPermission = false;
      return false;
    }
  });

  if (!isPermission) {
    Alert("권한이 없습니다. 소유자를 확인해주세요.");
    return;
  }

  if (selectedFolders.length === 0 && selectedFiles.length === 0) {
    Alert("이동할 항목을 선택해주세요.");
    return;
  }

  const sumitData = {
    folderIds: selectedFolders,
    fileIds: selectedFiles,
  };

  const excludeIds = selectedFolders;
  let url = "/api/contents/folders";
  if (excludeIds && excludeIds.length !== 0) {
    url += "?" + excludeIds.map((id) => `excludeIds=${id}`).join("&");
  }

  common.ajaxApi(url, "GET", null, function (response) {
    if (response.status) {
      const folders = response.data || [];
      renderFolderTree(folders, sumitData);
    }
  });
}

// 이동 모달 렌더링
function renderFolderTree(folders, sumitData) {
  if (!sumitData) return;
  initRenderFolderTree();

  const currnetFolderId = $("#folderId").val();
  const folderRows = $("#contents tr[data-type='folder']");
  let flag = true;
  if (sumitData.folderIds.length === 0 && folderRows.length === 0) {
    flag = false;
  }

  const treeData = folders.map((f) => ({
    id: f.id.toString(),
    parent: f.parentId ? f.parentId.toString() : "#",
    text: f.folderName,
    state: {
      disabled: flag ? f.disabled : f.id.toString() === currnetFolderId,
    },
  }));

  $("#folderTree")
    .jstree("destroy")
    .empty()
    .jstree({
      core: {
        data: treeData,
        multiple: false,
        themes: {
          variant: "large",
          icons: true,
        },
      },
      types: {
        default: {
          icon: "fa fa-folder text-warning",
        },
        file: {
          icon: "fa fa-file",
        },
      },
      plugins: ["types", "wholerow"],
    });

  // 선택 이벤트
  $("#folderTree").on("select_node.jstree", function (e, data) {
    const folderId = data.node.id;
    const folderName = data.node.text;

    const tree = $("#folderTree").jstree(true);
    const parentIds = [...data.node.parents].reverse(); // 최상단 → 선택한 부모 순서
    const pathParts = [];

    parentIds.forEach((id) => {
      if (id !== "#") {
        const node = tree.get_node(id);
        pathParts.push(node.text);
      }
    });

    pathParts.push(folderName); // 마지막 본인까지 포함
    const fullPath = pathParts.join(" / ");

    $("#selectedPath").text(fullPath);
    $("#targetFolderId").val(folderId);
    $("#submitMoveBtn").prop("disabled", false);
  });

  $("#submitMoveBtn").on("click", function () {
    const targetFolderId = $("#targetFolderId").val();
    sumitData.targetFolderId = targetFolderId;

    const folderId = $("#folderId").val();
    if (folderId.toString() === sumitData.targetFolderId) {
      Alert("이미 해당 경로에 속해있습니다.<br>경로를 다시 확인해주세요.");
      return;
    }

    moveContentsAPI(sumitData);
  });

  openCustomModal("moveModal");
}

// 이동 API 호출
function moveContentsAPI(sumitData) {
  closeCustomModal("moveModal");

  const url = "/api/contents/move";
  Confirm("해당 경로로 이동하시겠습니까?", function (result) {
    if (result) {
      common.ajaxApi(url, "PATCH", sumitData, function (response) {
        if (response.status) {
          Alert("이동되었습니다.", function () {
            getContentsAPI(1);
            closeCustomModal("moveModal");
          });
        }
      });
    } else {
      openCustomModal("moveModal");
    }
  });
}

// 이동 모달 렌더링 초기화
function initRenderFolderTree() {
  $("#selectedPath").text("");
  $("#targetFolderId").val("");
  $("#submitMoveBtn").prop("disabled", true);
}

// 공유 버튼
function shareContents() {
  const loginId = common.getLoginId();
  const selectedFolders = [];
  const selectedFiles = [];
  const selectedRows = $("#contents input[type='checkbox']:checked").closest("tr");
  let isPermission = true;

  selectedRows.each(function () {
    const row = $(this);
    const type = row.data("type");
    const id = row.data("id");
    const userId = row.data("user-id");

    if (userId === loginId) {
      if (type === "folder") selectedFolders.push(id);
      else if (type === "file") selectedFiles.push(id);
    } else {
      isPermission = false;
      return false;
    }
  });

  if (!isPermission) {
    Alert("권한이 없습니다. 소유자를 확인해주세요.");
    return;
  }

  if (selectedFolders.length === 0 && selectedFiles.length === 0) {
    Alert("공유할 항목을 선택해주세요.");
    return;
  }

  const $form = $("#shareForm");
  $form.find("#folderIds").val(selectedFolders);
  $form.find("#fileIds").val(selectedFiles);

  const selectedItemText = `폴더 ${selectedFolders.length}개, 파일 ${selectedFiles.length}개`;
  $form.find("#selectedItemsInfo").text(selectedItemText);

  $("#targetUserId, #searchUserInput").val("");
  $("#selectedUserInfo").text("선택");

  // 공유된 사용자 목록 조회 (공유 항목이 단일인 경우)
  const shareUserList = $form.find("#shareUserList").empty();
  const totalSelected = selectedFolders.length + selectedFiles.length;

  if (totalSelected === 1) {
    const contentType = selectedFolders.length === 1 ? "FOLDER" : "FILE";
    const contentId = selectedFolders[0] || selectedFiles[0];
    const url = `/api/shares?contentType=${contentType}&contentId=${contentId}`;
    common.ajaxApi(url, "GET", null, function (response) {
      if (response.status) {
        const users = response.data;
        if (users.length === 0) {
          shareUserList.append(`<li class="list-group-item text-muted">공유된 사용자가 없습니다.</li>`);
        } else {
          users.forEach((user) => {
            const permissionText = user.permission === "READ_ONLY" ? "뷰어" : "편집자";
            const listHtml = `<li class="list-group-item text-muted" data-id="${user.userId}">${user.name} (${user.loginId} / ${permissionText})</li>`;
            shareUserList.append(listHtml);
          });
        }
      }
    });
  } else {
    // 다중 선택 시에는 안내만 표시
    shareUserList.append(
      `<li class="list-group-item text-muted">단일 항목 선택 시만 공유된 사용자를 확인할 수 있습니다.</li>`
    );
  }

  openCustomModal("shareModal");
}

// 공유 대상 사용자 조회 API 호출
function searchUsersAPI(value) {
  if (!value.trim()) {
    $("#userSearchResult").hide();
    return;
  }

  const url = "/api/users/search?loginId=" + value.trim();
  const result = $("#userSearchResult").empty().show();
  common.ajaxApi(
    url,
    "GET",
    null,
    function (response) {
      if (response.status) {
        response.data.forEach((user) => {
          const itemValue = `${user.name} (${user.loginId})`;
          const item = $(`<li class="list-group-item list-group-item-action" style="cursor: pointer;">
            ${itemValue}
          </li>`);

          item.on("click", function () {
            $("#targetUserId").val(user.id);
            $("#searchUserInput").val("");
            result.hide();

            $("#selectedUserInfo").text(itemValue);
          });

          result.append(item);
        });
      }
    },
    function (err) {
      if (err.responseJSON) {
        const errorResponse = err.responseJSON;
        result.append(`<li class="list-group-item disabled">${errorResponse.message}</li>`);
      } else {
        Alert("처리 중 오류가 발생했습니다.<br>잠시후 다시 이용해주세요.");
      }
    }
  );
}

// 공유 API 호출
function submitShare(formId) {
  closeCustomModal("shareModal");

  const targetUserId = $("#targetUserId").val();
  if (!targetUserId) {
    Alert("공유 대상 사용자를 검색/선택해주세요.", function () {
      openCustomModal("shareModal");
    });
    return;
  }

  let isAlreadyShared = false;
  $("#shareUserList li").each(function () {
    const userId = $(this).data("id");
    if (userId && targetUserId == userId) {
      isAlreadyShared = true;
      return false;
    }
  });

  if (isAlreadyShared) {
    Alert("이미 공유된 사용자 입니다.", function () {
      openCustomModal("shareModal");
    });
    return;
  }

  const url = "/api/shares";
  const data = common.toJson(formId);
  if (data.folderIds !== "") {
    data.folderIds = data.folderIds.split(",").map(Number);
  } else {
    delete data.folderIds;
  }

  if (data.fileIds !== "") {
    data.fileIds = data.fileIds.split(",").map(Number);
  } else {
    delete data.fileIds;
  }

  Confirm("공유 하시겠습니까?", function (result) {
    if (result) {
      common.ajaxApi(url, "POST", data, function (response) {
        if (response.status) {
          Alert("공유되었습니다.", function () {
            getContentsAPI(1);
            closeCustomModal("shareModal");
          });
        }
      });
    } else {
      openCustomModal("shareModal");
    }
  });
}

// 공유됨 클릭 시, 공유 목록 조회
function getSharedUsers(obj) {
  const row = $(obj).closest("tr");
  const contentId = row.data("id");
  const contentType = row.data("type").toUpperCase();

  const modalList = $("#shareInfoUserList").empty();
  const url = `/api/shares?contentType=${contentType}&contentId=${contentId}`;
  common.ajaxApi(url, "GET", null, function (response) {
    if (response.status) {
      const users = response.data;
      const listHtml = users.map((user) => {
        return `
          <li data-id="${user.id}" data-org="${
          user.permission
        }" class="align-items-center d-flex justify-content-between list-group-item">
            <strong>${user.name} (${user.loginId})</strong>
            <div>
              <select class="d-inline-block form-select me-2 w-auto">
                <option value="READ_ONLY" ${user.permission == "READ_ONLY" ? "selected" : ""}>뷰어</option>
                <option value="READ_WRITE" ${user.permission == "READ_WRITE" ? "selected" : ""}>편집자</option>
              </select>
              <button class="btn btn-outline-danger delete-share-btn" onclick="deleteShare(${
                user.id
              }, this);">삭제</button>
            </div>
          </li>
        `;
      });

      modalList.append(listHtml);
    }
  });

  openCustomModal("shareUsersModal");
}

// 공유 삭제
function deleteShare(id, obj) {
  if (!id || !obj) return;
  closeCustomModal("shareUsersModal");

  const length = $("#shareInfoUserList li").length - 1;
  Confirm("공유 해제 하시겠습니까?", function (result) {
    if (result) {
      const url = `/api/shares/${id}`;
      common.ajaxApi(url, "DELETE", null, function (response) {
        if (response.status) {
          Alert("공유 해제되었습니다.", function () {
            if (length > 0) {
              $(obj).closest("li").remove();
              openCustomModal("shareUsersModal");
            } else {
              getContentsAPI(1);
              closeCustomModal("shareUsersModal");
            }
          });
        }
      });
    } else {
      openCustomModal("shareUsersModal");
    }
  });
}

// 공유 수정
function submitShareUsers() {
  closeCustomModal("shareUsersModal");

  const changes = [];
  $("#shareInfoUserList li").each(function () {
    const shareId = $(this).data("id");
    const selected = $(this).find("select").val();
    const org = $(this).data("org");

    if (selected !== org) {
      changes.push({
        id: shareId,
        permission: selected,
      });
    }
  });

  if (changes.length === 0) {
    Alert("변경된 사항이 없습니다.", function () {
      openCustomModal("shareUsersModal");
    });

    return;
  }

  Confirm("수정 하시겠습니까?", function (result) {
    if (result) {
      const url = "/api/shares";
      common.ajaxApi(url, "PUT", changes, function (response) {
        if (response.status) {
          Alert("수정 되었습니다.", function () {
            getContentsAPI(1);
            closeCustomModal("shareUsersModal");
          });
        }
      });
    } else {
      openCustomModal("shareUsersModal");
    }
  });
}
