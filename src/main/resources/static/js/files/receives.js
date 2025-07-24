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
      getReceiveContentsAPI(currentPage);
    }
  });

  // 전체 선택
  $(".file-table thead input[type='checkbox']").on("change", function () {
    const checked = $(this).is(":checked");
    $("#receiveContents input[type='checkbox']").prop("checked", checked);
  });

  // 개별 선택 및 선택 해제
  $("#receiveContents").on("change", "input[type='checkbox']", function () {
    const allChecked =
      $("#receiveContents input[type='checkbox']").length ===
      $("#receiveContents input[type='checkbox']:checked").length;
    $(".file-table thead input[type='checkbox']").prop("checked", allChecked);
  });

  // 행 클릭 시 선택 및 선택 해제
  $("#receiveContents").on("click", "tr", function (e) {
    // 클릭 대상이 체크박스나 dropdown 등 인터랙션 요소가 아닐 경우만 동작
    if (!$(e.target).is("input[type='checkbox'], .clickable, .clickable *")) {
      const checkbox = $(this).find("input[type='checkbox']");
      checkbox.prop("checked", !checkbox.prop("checked")).trigger("change");
    }
  });

  // 더블 클릭 - 폴더 진입
  $("#receiveContents").on("dblclick", ".clickadble-row", function () {
    console.log("더블 클릭", $(this));
    const type = $(this).data("type");
    const id = $(this).data("id");
    const permission = $(this).data("permission");

    if (type === "folder") {
      $("#folderId").val(id);
      folderStack.push(id);

      $("#backBtn").show();
      if (permission === "READ_WRITE") {
        $("#createBtn").show();
      }

      getReceiveContentsAPI(1, true);
    }
  });

  // 상위 폴더 클릭
  $("#backBtn").on("click", function () {
    folderStack.pop();
    const prevId = folderStack[folderStack.length - 1] || "";

    $("#folderId").val(prevId);
    if (prevId === "") {
      $("#backBtn, #createBtn").hide();
      getReceiveContentsAPI(1);
    } else {
      getReceiveContentsAPI(1, true);
    }
  });

  // 상단 정렬 selectbox 변경 시, 목록 재호출
  $(".form-select").on("change", function () {
    getReceiveContentsAPI(1, folderStack.length === 0 ? false : true);
  });

  // 테이블 스크롤 이벤트 (다음 페이지)
  $(".file-table-wrap").on("scroll", function () {
    if (isLastPage || isLoading) return;

    const scrollTop = $(this).scrollTop();
    const scrollHeight = this.scrollHeight;
    const clientHeight = this.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 50) {
      currentPage++;
      getReceiveContentsAPI(currentPage);
    }
  });
});

function getReceiveContentsAPI(page, isChildren = false) {
  if (isLoading) return;
  isLoading = true;
  isLastPage = false;
  currentPage = page;

  const form = $("#receiveListForm");
  const sort = form.find("#sort").val();
  const direction = form.find("#direction").val();
  const folderId = form.find("#folderId").val();

  let url = !isChildren ? `/api/shares/receive` : `/api/shares/receive/${folderId}`;
  url += `?page=${page}&sort=${sort},${direction}`;

  common.ajaxApi(url, "GET", null, function (response) {
    console.log("response", response);
    if (response.status) {
      renderReceiveContents(response.data);
    }
    isLoading = false;
  });
}

function renderReceiveContents(data) {
  if (!data) return;

  const contents = data.contents;
  const targetEl = $("#receiveContents").empty();
  isLastPage = data.last;

  if (contents.length > 0) {
    const html = contents
      .map((c) => {
        let type = `
          <td class="text-start" title="두번 클릭 시 해당 폴더 상세로 이동됩니다.">
            <i class="fas fa-folder me-2 text-warning"></i> 
            ${c.name}
          </td>
          <td>폴더</td>
        `;
        if (c.contentType === "FILE") {
          type = `
            <td class="text-start">
              <i class="fas fa-file me-2 text-secondary"></i> 
              ${c.name}
            </td>
            <td>파일</td>
          `;
        }

        return `
        <tr data-id="${c.contentId}" data-type="${c.contentType.toLowerCase()}" data-name="${
          c.name
        }" data-permission="${c.permission}" class="${c.contentType === "FOLDER" ? "clickadble-row" : ""}">
          <td><input type="checkbox" class="form-check-input border-dark" /></td>
          ${type}
          <td>${c.sharedBy} (${c.sharedById})</td>
          <td>${common.formatIsoDate(c.sharedAt)}</td>
          <td>
            <div class="clickable">
              <button class="btn btn-sm border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fas fa-ellipsis-v text-muted"></i>
              </button>
              ${setPermissionBtn(c.permission, c.sharedById)}
            </div>
          </td>
        </tr>
        `;
      })
      .join("");
    targetEl.append(html);
  } else {
    const html = `
      <tr><td colspan="7">공유된 파일이 없습니다.</td></tr>
    `;
    targetEl.html(html);
  }
}

function setPermissionBtn(permission, sharedById) {
  const loginId = common.getLoginId();
  if (permission === "READ_ONLY") {
    return `
      <ul class="dropdown-menu dropdown-menu-end">
        <li>
          <a class="dropdown-item" href="javascript:void(0);" onclick="downloadContents(this);">다운로드</a>
        </li>
      </ul>
    `;
  } else {
    if (loginId && loginId === sharedById) {
      return `
        <ul class="dropdown-menu dropdown-menu-end">
          <li>
            <a class="dropdown-item" href="javascript:void(0);" onclick="renameContents(this);">이름 변경</a>
          </li>
          <li>
            <a class="dropdown-item" href="javascript:void(0);" onclick="downloadContents(this);">다운로드</a>
          </li>
          <li><hr class="dropdown-divider" /></li>
          <li>
            <a class="dropdown-item text-danger" href="javascript:void(0);" onclick="deleteContents(this);">삭제</a>
          </li>
        </ul>
      `;
    } else {
      return `
      <ul class="dropdown-menu dropdown-menu-end">
        <li>
          <a class="dropdown-item" href="javascript:void(0);" onclick="renameContents(this);">이름 변경</a>
        </li>
        <li>
          <a class="dropdown-item" href="javascript:void(0);" onclick="downloadContents(this);">다운로드</a>
        </li>
      </ul>
    `;
    }
  }
}

// 다운로드
function downloadContents(obj) {
  const selectedFolders = [];
  const selectedFiles = [];

  if (!obj) {
    const selectedRows = $("#receiveContents input[type='checkbox']:checked").closest("tr");
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

// 이름 변경 모달
function renameContents(obj) {
  if (!obj) return;

  const row = $(obj).closest("tr");
  const id = row.data("id");
  const type = row.data("type");
  const name = row.data("name");

  const form = $("#renameForm");
  form.find("#id").val(id);
  form.find("#type").val(type);
  form.find("#name").val(name);

  openCustomModal("renameModal");
}

// 이름 변경 API 호출
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
        if (response.status) {
          Alert("변경되었습니다.", function () {
            form[0].reset();

            getReceiveContentsAPI(1);
            closeCustomModal("renameModal");
          });
        }
      });
    } else {
      openCustomModal("renameModal");
    }
  });
}

// 새폴더 생성
function submitNewFolder(formId) {
  closeCustomModal("createFolderModal");

  const form = $(formId);
  if (!validateForm(form)) {
    return false;
  }

  const folderId = $("#folderId").val();
  if (folderId) form.find("#parentId").val(folderId);

  Confirm("폴더를 생성하시겠습니까?", function (result) {
    if (result) {
      const data = common.toJson(form);
      const url = "/api/folders/add";
      common.ajaxApi(url, "POST", data, function (response) {
        if (response.status) {
          Alert("폴더가 생성되었습니다.", function () {
            form[0].reset();
            getReceiveContentsAPI(1, true);
          });
        }
      });
    } else {
      openCustomModal("createFolderModal");
    }
  });
}

// 파일 업로드
function handleFileUpload(files) {
  if (!files || files.length === 0) return;

  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
  }

  const folderId = $("#folderId").val();
  if (folderId) formData.append("folderId", folderId);

  Confirm("업로드 하시겠습니까?", function (result) {
    if (result) {
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
            getReceiveContentsAPI(1, true);
          });
        }
      });
    }
  });
}

// 폴더 업로드
function handleFolderUpload(files) {
  if (!files || files.length === 0) return;

  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
    formData.append("paths", files[i].webkitRelativePath);
  }

  const folderId = $("#folderId").val();
  if (folderId) formData.append("baseFolderId", folderId);

  Confirm("업로드 하시겠습니까?", function (result) {
    if (result) {
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
            getReceiveContentsAPI(1, true);
          });
        }
      });
    }
  });
}

function deleteContents(obj) {
  if (!obj) return;

  const selectedFolders = [];
  const selectedFiles = [];

  const row = $(obj).closest("tr");
  const type = row.data("type");
  const id = row.data("id");
  if (!type || !id) return;

  if (type === "folder") selectedFolders.push(id);
  else selectedFiles.push(id);

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
            getReceiveContentsAPI(1, true);
          });
        }
      });
    }
  });
}
