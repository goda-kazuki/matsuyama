/**
 * 計算に不要な行を削除
 */
function removeHeader() {
  const START_ROW = 1;
  const FACILITY_COL = 1;

  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('シート1');
  var lastrow = spreadsheet.getLastRow();
  var removeTargetRows = [];

  var values = spreadsheet.getRange("A:A").getValues();
  for (var i = 1; i < values.length + 1; i++) {
    if (values[i - 1][0] === "店舗名") {
      removeTargetRows.push(i);
    }
  }

  removeTargetRows = removeTargetRows.sort(function (a, b) {
    return b - a;
  });
  Logger.log(removeTargetRows);

  for (var i = 0; i < removeTargetRows.length; i++) {
    spreadsheet.deleteRows(removeTargetRows[i]);
  }
}

