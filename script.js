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

  for (let i = 0; i < 50; i++) {
    $(".input-cell-container").append(
      `<div class="cell-row" id="cell-row-${i}"></div>`
    );

    for (let j = 1; j < 50; j++) {
      let colCode = $(`.colId-${j}`).attr("id").split("-")[1];
      let cell = $(
        `<div class="input-cell"  id="row-${i}-col-${j} code-${colCode}"></div>`
      );

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

  $(".input-cell").click(function () {
    $(".input-cell.sel").removeClass("sel");
    $(this).addClass("sel");
  });

  $(".input-cell").dblclick(function () {
    $(".input-cell.sel").removeClass("sel");
    $(this).addClass("sel");
    $(this).attr("contenteditable", "true");
    $(this).focus();
  });
});
