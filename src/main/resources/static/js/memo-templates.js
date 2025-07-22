$(document).ready(function() {
    let idCounter = 1;
    let editingRow = null;

    const codeToLabel = {
        id: 'ID',
        store_id: '대리점ID',
        name: '고객명',
        phone: '고객전화번호',
        birth: '고객생년월일'
    };

    // DataTables 초기화
    const table = $('#myTable').DataTable({
        data: [], // DB에서 불러올 초기 데이터 자리
        columns: [
            { data: 'id' },
            { data: 'itemName' },  // ✨ 추가된 컬럼
            {
                data: 'displayText',
                render: function(data) { return data; } // HTML 그대로 표시
            },
            { data: 'dbValue' },
            {
                data: null,
                render: function() {
                    return '<button class="delBtn">삭제</button>';
                }
            }
        ],
        autoWidth: false,
        columnDefs: [
            { width: '50px', targets: 0 },
            { width: '150px', targets: 1 },
            { width: '300px', targets: 2 },
            { width: '300px', targets: 3 },
            { width: '80px', targets: 4 }
        ]
    });

    // 📥 [예시] DB에서 불러온 데이터
    const dbData = [
        { id: 1, itemName: '첫번째 항목', dbValue: 'HP #{phone} / TP #{birth}' },
        { id: 2, itemName: '두번째 항목', dbValue: '고객명 #{name} + 전화 #{phone}' }
    ];

    // DB 데이터 → DataTables에 displayText 변환해서 넣기
    dbData.forEach(row => {
        const displayText = dbValueToDisplay(row.dbValue);
        table.row.add({
            id: row.id,
            itemName: row.itemName,
            displayText: displayText,
            dbValue: row.dbValue
        }).draw();
        idCounter = Math.max(idCounter, row.id + 1);
    });

    // DB값 → 보이는 HTML 변환
    function dbValueToDisplay(dbValue) {
        return dbValue.replace(/#\{(\w+)\}/g, function(_, code) {
            const label = codeToLabel[code] || code;
            return `<span class="chip" contenteditable="false" data-code="${code}">${label}</span>`;
        });
    }

    // 행 추가
    $('#addRowBtn').click(function() {
        const newRow = { id: idCounter++, itemName: '', displayText: '', dbValue: '' };
        table.row.add(newRow).draw();
        renumberRows(); // 순번 재정렬
        selectRowByIndex(':last');
    });

    // 행 클릭 → 편집창 채우기
    $('#myTable tbody').on('click', 'tr', function() {
        const row = table.row(this);
        editingRow = row;
        const rowData = row.data();

        $('#editorInfo').text(`선택된 행: ${rowData.id}`);
        $('#custom-input').html(rowData.displayText || '');
        $('#item-name').val(rowData.itemName || '');
    });

    // Chip 버튼 클릭 → input창에 추가
    $('.add-btn').click(function() {
        moveCursorToEnd($('#custom-input')[0]);
        const label = $(this).data('label');
        const code = $(this).data('code');
        const chip = `<span class="chip" contenteditable="false" data-code="${code}">${label}</span>`;
        document.execCommand('insertHTML', false, chip);
        moveCursorToEnd($('#custom-input')[0]);
    });

    // 저장 버튼 → DataTables 업데이트
    $('#saveBtn').click(function() {
        if (!editingRow) return;

        const rawHtml = $('#custom-input').html();
        const itemName = $('#item-name').val();

        const tempDiv = $('<div>').html(rawHtml);
        tempDiv.find('.chip').each(function() {
            const code = $(this).data('code');
            $(this).replaceWith(`#{${code}}`);
        });
        const dbValue = tempDiv.text();

        editingRow.data({
            ...editingRow.data(),
            itemName: itemName,
            displayText: rawHtml,
            dbValue: dbValue
        }).draw();
    });

    // 삭제 버튼
    $('#myTable tbody').on('click', '.delBtn', function(e) {
        e.stopPropagation();
        table.row($(this).parents('tr')).remove().draw();
        renumberRows(); // 순번 재정렬
        selectRowByIndex(0); // 맨 위 행 클릭
    });

    // 커서를 contenteditable div 맨 끝으로 이동
    function moveCursorToEnd(el) {
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(el);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    function renumberRows() {
        table.rows().every(function(rowIdx, tableLoop, rowLoop) {
            let rowData = this.data();
            rowData.id = rowIdx + 1; // 순번: 1부터
            this.data(rowData);
        });
        table.draw(false); // 화면 리프레시, 페이지 유지
    }
    function selectRowByIndex(rowIndex) {
        const row = table.row(rowIndex);
        if (row.any()) {
            editingRow = row;
            const rowData = row.data();
            $('#editorInfo').text(`선택된 행: ${rowData.id}`);
            $('#custom-input').html(rowData.displayText || '').attr('contenteditable', true);
            $('#item-name').val(rowData.itemName || '').prop('disabled', false);
            $('#saveBtn').prop('disabled', false);
        } else {
            // 테이블에 행이 없을 경우 편집창 초기화 + 비활성화
            $('#editorInfo').text('행을 선택하세요.');
            $('#custom-input').html('').attr('contenteditable', false);
            $('#item-name').val('').prop('disabled', true);
            $('#saveBtn').prop('disabled', true);
            editingRow = null;
        }
    }
    selectRowByIndex(0);
});
