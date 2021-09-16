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
    console.log(alignment);
    $(".align-icon-" + alignment).addClass("select");
    $(".color-picker").val(cellInfo["background-color"]);
    console.log(cellInfo["background-color"]);
    $(".color-picker-text").val(cellInfo["color"]);
  }

  $(".input-cell").blur(function () {
    $(".input-cell.sel").attr("contenteditable", "false");
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
  });
}
