
$(document).ready(function() {
    let table = $('#myTable').DataTable({
        data: [],
        columns: [
            { data: 'id' },
            { data: 'displayText' },
            {
                data: null,
                render: function() {
                    return '<button class="btn btn-danger btn-sm delBtn">삭제</button>';
                }
            }
        ]
    });

    let tagify;
    let editingRow = null;
    let idCounter = 1;
    // 버튼 클릭 시 Tagify에 추가
    $('#field-buttons').on('click', '.field-btn', function() {
        let fieldLabel = $(this).text(); // 예: "고객명"
        tagify.addTags([fieldLabel]);
    });

    // Tagify 초기화
    function initTagify(value) {
        if (tagify) tagify.destroy();
        let input = document.querySelector('#field-editor');
        tagify = new Tagify(input, {
            whitelist: ["전화번호", "집전화", "팩스"],
            enforceWhitelist: false,
            dropdown: { enabled: 1 }
        });
        tagify.addTags(value ? value.split(' ') : []);
    }

    // 행 추가
    $('#addRowBtn').click(function() {
        table.row.add({
            id: idCounter++,
            displayText: '',
            dbValue: ''
        }).draw();
    });

    // 행 클릭 → 편집 패널 활성화
    $('#myTable tbody').on('click', 'tr', function() {
        let row = table.row(this);
        editingRow = row;
        let rowData = row.data();

        $('#editorInfo').text(`선택된 행: ${rowData.id}`);
        $('#field-editor').prop('disabled', false);
        $('#saveBtn, #cancelBtn').prop('disabled', false);
        initTagify(rowData.displayText);
    });

    // 삭제 버튼
    $('#myTable tbody').on('click', '.delBtn', function(e) {
        e.stopPropagation(); // row 클릭 이벤트 막기
        table.row($(this).parents('tr')).remove().draw();
    });

    // 저장 버튼
    // $('#saveBtn').click(function() {
    //     let tags = tagify.value;  // ⚠️ 여기서만 tags를 선언
    //     let displayText = tags.map(t => {
    //         return ['ID', '대리점ID', '고객명', '고객전화번호', '고객생년월일', '작성메모', '사용여부', '등록자', '수정자', '생성된시간', '업데이트된시간'].includes(t.value) 
    //             ? `(${t.value})` 
    //             : t.value;
    //     }).join(' ');

    //     let dbValue = tags.map(t => {
    //         switch (t.value) {
    //             case 'ID': return '#{id}';
    //             case '대리점ID': return '#{store_id}';
    //             case '고객명': return '#{name}';
    //             case '고객전화번호': return '#{phone}';
    //             case '고객생년월일': return '#{birth}';
    //             case '작성메모': return '#{memo}';
    //             case '사용여부': return '#{use_yn}';
    //             case '등록자': return '#{created_by}';
    //             case '수정자': return '#{updated_by}';
    //             case '생성된시간': return '#{created_at}';
    //             case '업데이트된시간': return '#{updated_at}';
    //             default: return t.value;
    //         }
    //     }).join(' ');

    //     editingRow.data({
    //         ...editingRow.data(),
    //         displayText: displayText,
    //         dbValue: dbValue
    //     }).draw();

    //     resetEditor();
    // });

    // 취소 버튼
    $('#cancelBtn').click(function() {
        resetEditor();
    });

    // 편집 패널 리셋 함수
    function resetEditor() {
        $('#editorInfo').text('행을 선택하세요.');
        $('#field-editor').prop('disabled', true).val('');
        $('#saveBtn, #cancelBtn').prop('disabled', true);
        if (tagify) tagify.destroy();
        editingRow = null;
    }
    
    // 버튼 클릭 → chip 삽입
    $('.add-btn').click(function() {
        const label = $(this).data('label');
        const code = $(this).data('code');
        const chip = `<span class="chip" contenteditable="false" data-code="${code}">${label}</span>`;
        document.execCommand('insertHTML', false, chip);
        moveCursorToEnd($('#custom-input')[0]);
    });

    // 커서를 contenteditable div 맨 끝으로 이동시키는 함수
    function moveCursorToEnd(el) {
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(el);
        range.collapse(false); // false → 끝으로
        sel.removeAllRanges();
        sel.addRange(range);
    }
    // 저장 버튼 클릭 → 화면용/DB용 값 추출
    $('#saveBtn').click(function() {
        const rawHtml = $('#custom-input').html();
        $('#displayResult').html(rawHtml); // 그대로 출력

        // DB용 값 만들기
        const tempDiv = $('<div>').html(rawHtml);
        tempDiv.find('.chip').each(function() {
            const code = $(this).data('code');
            $(this).replaceWith(`#{${code}}`);
        });
        const dbValue = tempDiv.text();
        $('#dbResult').text(dbValue);
    });
});