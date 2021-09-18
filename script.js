let defaultProperties = {
  text: "",
  "font-weight": "",
  "font-style": "",
  "text-decoration": "",
  "text-align": "left",
  "background-color": "#ffffff",
  color: "black",
  "font-family": "Noto Sans",
  "font-size": "14",
};

let cellData = {
  Sheet1: {},
};

let selectedSheet = "Sheet1";
let totalSheets = 1;

$(document).ready(function () {
  let cellContainer = $(".input-cell-container");

  for (let i = 1; i < 100; i++) {
    let ans = "";
    let n = i;
    while (n > 0) {
      let rem = n % 26;
      if (rem == 0) {
        ans = "Z" + ans;
        n = Math.floor(n / 26) - 1;
      } else {
        ans = String.fromCharCode(rem - 1 + 65) + ans;
        n = Math.floor(n / 26);
      }
    }
    let column = $(
      `<div class="column-name colId-${i}" id="colCode-${ans}">${ans}</div>`
    );

    $(".column-name-container").append(column);
    let row = $(`<div class="row-name" id=rowId-${i}>${i}</div>`);
    $(".row-name-container").append(row);
  }

  for (let i = 1; i < 50; i++) {
    $(".input-cell-container").append(
      `<div class="cell-row" id="cell-row-${i}"></div>`
    );

    for (let j = 1; j < 50; j++) {
      let colCode = $(`.colId-${j}`).attr("id").split("-")[1];

      let cell = $(`<div class="input-cell"  id="row-${i}-col-${j}"></div>`);

      $(`#cell-row-${i}`).append(cell);
    }
  }
  $(".align-icon").click(function () {
    $(".align-icon.select").removeClass("select");
    $(this).addClass("select");
  });

  let Bclick = 0;
  let Iclick = 0;
  let Uclick = 0;
  $(".style-icon").click(function () {
    if ($(this).hasClass("icon-bold")) {
      Bclick++;
      console.log(Bclick);
      if (Bclick % 2 === 0) {
        $(this).removeClass("select");
      } else {
        $(this).addClass("select");
      }
    }
    if ($(this).hasClass("icon-italic")) {
      Iclick++;
      if (Iclick % 2 == 0) {
        $(this).removeClass("select");
      } else {
        $(this).addClass("select");
      }
    }
    if ($(this).hasClass("icon-underline")) {
      Uclick++;
      if (Uclick % 2 == 0) {
        $(this).removeClass("select");
      } else {
        $(this).addClass("select");
      }
    }
  });

  $(".input-cell").click(function (e) {
    if (e.ctrlKey) {
      let [rowId, colId] = getRowCol(this);

      if (rowId > 1) {
        let topCellSelected = $(`#row-${rowId - 1}-col-${colId}`).hasClass(
          "sel"
        );
        if (topCellSelected) {
          $(this).addClass("top-cell-selected");
          $(`#row-${rowId - 1}-col-${colId}`).addClass("bottom-cell-selected");
        }
      }
      if (colId < 50) {
        let rightCellSelected = $(`#row-${rowId}-col-${colId + 1}`).hasClass(
          "sel"
        );
        if (rightCellSelected) {
          $(this).addClass("right-cell-selected");
          $(`#row-${rowId}-col-${colId + 1}`).addClass("left-cell-selected");
        }
      }
      if (rowId < 50) {
        let bottomCellSelected = $(`#row-${rowId + 1}-col-${colId}`).hasClass(
          "sel"
        );
        if (bottomCellSelected) {
          $(this).addClass("bottom-cell-selected");
          $(`#row-${rowId + 1}-col-${colId}`).addClass("top-cell-selected");
        }
      }
      if (colId > 1) {
        let leftCellSelected = $(`#row-${rowId}-col-${colId - 1}`).hasClass(
          "sel"
        );
        if (leftCellSelected) {
          $(this).addClass("left-cell-selected");
          $(`#row-${rowId}-col-${colId - 1}`).addClass("right-cell-selected");
        }
      }
    } else {
      $(".input-cell.sel").removeClass("sel");
    }
    $(this).addClass("sel");
    changeHeader(this);
  });

  $(".input-cell").dblclick(function () {
    $(".input-cell.sel").removeClass("sel");
    $(this).addClass("sel");
    $(this).attr("contenteditable", "true");
    $(this).focus();
  });
  $(".align-icon-center").click(function () {
    if ($(this).hasClass("select")) {
      updateCell("text-align", "center", true);
    }
  });
  $(".align-icon-left").click(function () {
    if ($(this).hasClass("select")) {
      updateCell("text-align", "left", true);
    }
  });
  $(".align-icon-right").click(function () {
    if ($(this).hasClass("select")) {
      updateCell("text-align", "right", true);
    }
  });

  function changeHeader(ele) {
    let [rowId, colId] = getRowCol(ele);
    let cellInfo = defaultProperties;
    if (
      cellData[selectedSheet][rowId] &&
      cellData[selectedSheet][rowId][colId]
    ) {
      cellInfo = cellData[selectedSheet][rowId][colId];
    }

    cellInfo["font-weight"]
      ? $(".icon-bold").addClass("select")
      : $(".icon-bold").removeClass("select");

    cellInfo["font-style"]
      ? $(".icon-italic").addClass("select")
      : $(".icon-italic").removeClass("select");

    cellInfo["text-decoration"]
      ? $(".icon-underline").addClass("select")
      : $(".icon-underline").removeClass("select");

    let alignment = cellInfo["text-align"];
    $(".align-icon.select").removeClass("select");
    $(".align-icon-" + alignment).addClass("select");
    $(".color-picker").val(cellInfo["background-color"]);
    $(".color-picker-text").val(cellInfo["color"]);
    $(".font-family-selector").val(cellInfo["font-family"]);
    let size = cellInfo["font-size"].split("p");
    $(".font-family-selector").css("font-family", cellInfo["font-family "]);
    $(".size-selector").val(size[0]);
  }

  $(".input-cell").blur(function () {
    $(".input-cell.sel").attr("contenteditable", "false");
    updateCell("text", $(this).text());
  });

  $(".input-cell-container").scroll(function () {
    $(".column-name-container").scrollLeft(this.scrollLeft);
    $(".row-name-container").scrollTop(this.scrollTop);
  });

  $(".icon-bold").click(function () {
    if ($(this).hasClass("select")) {
      updateCell("font-weight", "bold", false);
    } else {
      updateCell("font-weight", "", true);
    }
  });
  $(".icon-italic").click(function () {
    if ($(this).hasClass("select")) {
      updateCell("font-style", "italic", false);
    } else {
      updateCell("font-style", "", true);
    }
  });
  $(".icon-underline").click(function () {
    if ($(this).hasClass("select")) {
      updateCell("text-decoration", "underline", false);
    } else {
      updateCell("text-decoration", "", true);
    }
  });
  $(".color-fill-icon").click(function (e) {
    $(".color-picker").click();
  });
  $(".color-fill-icon-text").click(function (e) {
    $(".color-picker-text").click();
  });
  $(".color-picker").change(function (e) {
    updateCell("background-color", $(this).val());
  });

  $(".color-picker-text").change(function (e) {
    updateCell("color", $(this).val());
  });
  $(".font-family-selector").change(function (e) {
    $(".font-family-selector").css("font-family", $(this).val());
    updateCell("font-family", $(this).val());
  });
  $(".size-selector").change(function (e) {
    updateCell("font-size", $(this).val() + "px");
  });
  $(".icon-add").click(function (e) {
    emptySheet();
    $(".sheet-tab-container.selected").removeClass("selected");
    let sheetName = "Sheet" + (totalSheets + 1);
    cellData[sheetName] = {};
    totalSheets += 1;
    selectedSheet = sheetName;
    $(
      ".sheet-bar"
    ).append(`<div class="sheet-tab-container selected" id=${totalSheets}>
    <div class="sheet-tab">Sheet${totalSheets}</div>
       </div>`);
    $(".sheet-tab-container.selected").click(function () {
      $(".sheet-tab-container.selected").removeClass("selected");
      $(this).addClass("selected");
      emptySheet();
      selectedSheet = $(this).text().trim();
      console.log(selectedSheet);
      loadSheet();
    });
    addSheetEvents();
  });
  $(".sheet-tab-container").click(function () {
    $(".sheet-tab-container.selected").removeClass("selected");
    $(this).addClass("selected");
    emptySheet();
    selectedSheet = $(this).text().trim();
    loadSheet();
    addSheetEvents();
  });
  function addSheetEvents() {
    $(".sheet-tab-container.selected").contextmenu(function (e) {
      e.preventDefault();
      $(".sheet-tab-container.selected").removeClass("selected");
      $(this).addClass("selected");
      emptySheet();
      selectedSheet = $(this).text().trim();
      loadSheet();
      if ($(".sheet-options").length == 0) {
        $(".container").append(`<div class="sheet-options">
        <div class="sheet-rename">Rename</div>
        <div class="sheet-delete">Delete</div>
        </div>`);
      }
      $(".sheet-options").css("left", e.pageX + "px");
      $(".sheet-rename").click(function (e) {
        $(".container").css("background-color", "#989899");
        $(".container").append(`
        <div class="sheet-rename-modal">
        <h2 class="head">Rename Sheet</h2>
        <h4 class="sechead">Rename sheet to:</h4>
        <input type="text" class="new-sheet-name" placeholder="Sheet Name" />
        <div class="buttons">
          <div class="submit-button">OK</div>
          <div class="cancel-button">Cancel</div>
        </div>
      </div>
      <div class="layer"></div>`);
        $(".cancel-button").click(function () {
          $(".sheet-rename-modal").remove();
          $(".layer").remove();
        });
        $(".submit-button").click(function () {
          let newSheetName = $(".new-sheet-name").val();
          $(".sheet-tab-container.selected").text(newSheetName);
          let newCellData = {};
          for (let key in cellData) {
            if (key != selectedSheet) {
              newCellData[key] = cellData[key];
            } else {
              newCellData[newSheetName] = cellData[key];
            }
          }
          cellData = newCellData;
          selectedSheet = newSheetName;
          $(".sheet-rename-modal").remove();
          $(".layer").remove();
        });
      });
      $(".sheet-delete").click(function (e) {
        if (Object.keys(cellData).length > 1) {
          let currentSheetName = selectedSheet;
          let sheet = $(".sheet-tab-container.selected");
          let currentSheetIndex = Object.keys(cellData).indexOf(selectedSheet);
          if (currentSheetIndex == 0) {
            $(".sheet-tab-container.selected").next().click();
          } else {
            $(".sheet-tab-container.selected").prev().click();
          }
          sheet.remove();
          delete cellData[currentSheetName];
        } else {
          alert(
            "Sorry,there is only one sheet. So, it's not possible to delete sheet !! "
          );
        }
      });
    });
  }
  $(".container").click(function (e) {
    $(".sheet-options").remove();
  });
});

function getRowCol(ele) {
  let idArray = $(ele).attr("id").split("-");
  let rowId = parseInt(idArray[1]);
  let colId = parseInt(idArray[3]);
  return [rowId, colId];
}
function updateCell(property, value, defaultPossibe) {
  $(".input-cell.sel").each(function () {
    $(this).css(property, value);
    let [rowId, colId] = getRowCol(this);
    if (cellData[selectedSheet][rowId]) {
      if (cellData[selectedSheet][rowId][colId]) {
        cellData[selectedSheet][rowId][colId][property] = value;
      } else {
        cellData[selectedSheet][rowId][colId] = { ...defaultProperties };
        cellData[selectedSheet][rowId][colId][property] = value;
      }
    } else {
      cellData[selectedSheet][rowId] = {};
      cellData[selectedSheet][rowId][colId] = { ...defaultProperties };
      cellData[selectedSheet][rowId][colId][property] = value;
      console.log(cellData[selectedSheet][rowId][colId]);
    }
    if (
      defaultPossibe &&
      JSON.stringify(cellData[selectedSheet][rowId][colId]) ===
        JSON.stringify(defaultProperties)
    ) {
      delete cellData[selectedSheet][rowId][colId];
      if (cellData[selectedSheet][rowId]) {
        if (Object.keys(cellData[selectedSheet][rowId].length) === 0) {
          delete cellData[selectedSheet][rowId];
        }
      }
    }
    console.log(cellData[selectedSheet][rowId][colId]);
  });
}

function emptySheet() {
  let sheetInfo = cellData[selectedSheet];
  console.log(cellData);
  for (let i of Object.keys(sheetInfo)) {
    for (let j of Object.keys(sheetInfo[i])) {
      $(`#row-${i}-col-${j}`).text("");
      $(`#row-${i}-col-${j}`).css("background-color", "#ffffff");
      $(`#row-${i}-col-${j}`).css("color", "#000000");
      $(`#row-${i}-col-${j}`).css("font-weight", "");
      $(`#row-${i}-col-${j}`).css("font-style", "");
      $(`#row-${i}-col-${j}`).css("text-align", "left");
      $(`#row-${i}-col-${j}`).css("text-decoration", "");
      $(`#row-${i}-col-${j}`).css("font-size", "14");
      $(`#row-${i}-col-${j}`).css("font-family", "Noto Sans");
    }
  }
}

function loadSheet() {
  let sheetInfo = cellData[selectedSheet];
  for (let i of Object.keys(sheetInfo)) {
    for (let j of Object.keys(sheetInfo[i])) {
      let cellInfo = sheetInfo[i][j];
      $(`#row-${i}-col-${j}`).text(cellInfo["text"]);
      $(`#row-${i}-col-${j}`).css(
        "background-color",
        cellInfo["background-color"]
      );
      $(`#row-${i}-col-${j}`).css("color", cellInfo["color"]);
      $(`#row-${i}-col-${j}`).css("font-weight", cellInfo["font-weight"]);
      $(`#row-${i}-col-${j}`).css("font-style", cellInfo["font-style"]);
      $(`#row-${i}-col-${j}`).css("text-align", cellInfo["text-align"]);
      $(`#row-${i}-col-${j}`).css(
        "text-decoration",
        cellInfo["text-decoration"]
      );
      $(`#row-${i}-col-${j}`).css("font-size", cellInfo["font-size"]);
      $(`#row-${i}-col-${j}`).css("font-family", cellInfo["font-family"]);
    }
  }
}
