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

  $(".style-icon").click(function () {
    $(this).toggleClass("select");
  });

  $(".input-cell").click(function (e) {
    if (e.ctrlKey) {
      $(this).addClass("sel");
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
      $(this).addClass("sel");
      let [rowId, colId] = getRowCol(this);
      console.log(rowId, colId);
      console.log($(this).attr("id"));
      console.log($(`#row-${rowId}-col-${colId}`).hasClass("sel"));
    }
  });

  $(".input-cell").dblclick(function () {
    $(".input-cell.sel").removeClass("sel");
    $(this).addClass("sel");
    $(this).attr("contenteditable", "true");
    $(this).focus();
  });

  $(".input-cell-container").scroll(function () {
    $(".column-name-container").scrollLeft(this.scrollLeft);
    $(".row-name-container").scrollTop(this.scrollTop);
  });
  $(this).addClass("sel");
});

function getRowCol(ele) {
  let idArray = $(ele).attr("id").split("-");
  console.log(idArray);
  let rowId = parseInt(idArray[1]);
  let colId = parseInt(idArray[3]);
  return [rowId, colId];
}
