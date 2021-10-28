function geocoder() {
  const START_ROW = 2;
  const FACILITY_COL = 1;
  const CYO_COL = 8;
  const ADDRESS_COL = 9;

  const LAT_COL = 10;
  const LNG_COL = 11;
  const EHIMEKEN_MATSUYAMASHI = "愛媛県松山市";

  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('シート1');
  var lastrow = spreadsheet.getLastRow();
//  var lastrow = 3;

  for (var i = START_ROW; i <= lastrow; i++) {
    var facility = spreadsheet.getRange(i, FACILITY_COL).getValue();
    var geocoder = Maps.newGeocoder();
    geocoder.setLanguage('ja');

    //  店舗名だけだと検索に引っかからないものがあるので、愛媛県松山市の情報を追加
    var response = geocoder.geocode(EHIMEKEN_MATSUYAMASHI + facility);

    if (response['results'][0] != null) {
      var formatted_address = response['results'][0]['formatted_address'];

      var regexp = new RegExp(EHIMEKEN_MATSUYAMASHI + '(.*)');
      var address = formatted_address.match(regexp);

      if (address == null) {
        continue;
      }

      for (var ii = 0; ii <= response['results'][0]['address_components'].length; ii++) {
        if (response['results'][0]['address_components'][ii] == null) {
          continue;
        }

        var address_component = response['results'][0]['address_components'][ii];
        var types = address_component.types;

        if (types != undefined) {
          if (types.includes('sublocality_level_2')) {
            spreadsheet.getRange(i, CYO_COL).setValue(address_component.short_name);
            break;
          }
          spreadsheet.getRange(i, CYO_COL).setValue("");
        }
      }

      //    spreadsheet.getRange(i,LAT_COL).setValue(response['results'][0]['geometry']['location']['lat']);
      //    spreadsheet.getRange(i,LNG_COL).setValue(response['results'][0]['geometry']['location']['lng']);
      spreadsheet.getRange(i, ADDRESS_COL).setValue(hankaku2Zenkaku(address[0].replace(EHIMEKEN_MATSUYAMASHI, "")));

    }
  }
}

function hankaku2Zenkaku(str) {
  return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
}
