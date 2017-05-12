// Returns all departments for a given location
function getDepartments(location) {
  
  var headers = {
    // Replace username and password with own
    "Authorization": "Basic " + Utilities.base64Encode("username@domain.com" + ":" + "password")
  };
  
  var url = 'https://api.staffomaticapp.com/v3/username/locations/' + location + '/departments.json';
  var options = {
    'method': 'get',
    'headers': headers
  };

  var response = UrlFetchApp.fetch(url, options);  
  var json = response.getContentText();
  var data = [JSON.parse(json), response];
  return data;
}

// Writes the departments to sheet
function writeDepartments() {
  // Define the sheets
  var locationsSheet = SpreadsheetApp.getActive().getSheetByName("Locations");  
  var departmentsSheet = SpreadsheetApp.getActive().getSheetByName("Departments");  
  // Clear the sheet
  departmentsSheet.getRange(2, 1, departmentsSheet.getLastRow(), 3).clear();
  
  var locations = locationsSheet.getRange(2, 1, locationsSheet.getLastRow(), 1).getValues();
  var departmentsArray = [];
  var i = 0;
  while (locations[i][0] > 0) {
    var departments = getDepartments(locations[i][0])[0];
    i++;
    for (var j = 0; j < departments.length; j++) {
      var row = [];
      row.push(departments[j].name);
      row.push(departments[j].id);
      row.push(departments[j].location_id);
      departmentsArray.push(row);
    }
  }
  var range = departmentsSheet.getRange(2, 1, departmentsArray.length, row.length);
  range.setValues(departmentsArray);
}
