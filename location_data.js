// Gets all locations in for the Staffomatic account
function getLocations() {
  
  var headers = {
    // Replace username and password with own
    "Authorization": "Basic " + Utilities.base64Encode("username@domain.com" + ":" + "password")
  };
  
  var url = 'https://api.staffomaticapp.com/v3/username/locations.json';
  var options = {
    'method': 'get',
    'headers': headers
  };

  var response = UrlFetchApp.fetch(url, options);  
  var json = response.getContentText();
  var data = [JSON.parse(json), response];
  return data;
}

// Writes the locations to sheet
function writeLocations() {
  // Define the sheet
  var locationsSheet = SpreadsheetApp.getActive().getSheetByName("Locations");  
  // Clear the sheet
  locationsSheet.getRange(2, 1, locationsSheet.getLastRow(), 2).clear();
  
  var locations = getLocations()[0];
  var locationsArray = [];
  for (location in locations) {
    var row = [];
    row.push(locations[location].id);
    row.push(locations[location].name);
    locationsArray.push(row);
  }
  var range = locationsSheet.getRange(2, 1, locationsArray.length, row.length);
  range.setValues(locationsArray);
}
