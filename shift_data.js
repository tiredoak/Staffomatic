// Returns all shifts in Staffomatic for startDate and endDate
function getShifts(startDate, endDate) {
  
  var headers = {
    // Replace username and password with own
    "Authorization": "Basic " + Utilities.base64Encode("username@domain.com" + ":" + "password")
  };
  
  var url = 'https://api.staffomaticapp.com/v3/username/shifts.json?from=' + startDate + 
            'T00%3A00%3A00%2B02%3A00&until=' + endDate + 'T00%3A00%3A00%2B02%3A00';
  var options = {
    'method': 'get',
    'headers': headers
  };

  var response = UrlFetchApp.fetch(url, options);  
  var json = response.getContentText();
  var data = [JSON.parse(json), response];
  Logger.log(data);
  return data;
}

// Converts JSON response to sheets format
function createShiftArray() {
  // Define the sheet
  var shiftsSheet = SpreadsheetApp.getActive().getSheetByName("Shifts");  
  // Gets dates from first sheet
  var startDate = SpreadsheetApp.getActive().getSheetByName("Dates").getRange(3,2).getValue();
  var endDate = SpreadsheetApp.getActive().getSheetByName("Dates").getRange(4,2).getValue();
  // Creates the array of shifts
  var shifts = [];
  var shiftsFromStaffomatic = getShifts(startDate, endDate)[0];
  // Creating data in way that's convenient to paste as range in sheets
  for (shift in shiftsFromStaffomatic) {
    var row = [];
    row.push(shiftsFromStaffomatic[shift].starts_at);
    row.push(shiftsFromStaffomatic[shift].ends_at);
    row.push(shiftsFromStaffomatic[shift].location_id);
    row.push(shiftsFromStaffomatic[shift].department_id);
    row.push(shiftsFromStaffomatic[shift].assigned_user_ids);
    row.push(shiftsFromStaffomatic[shift].applied_user_ids);
    shifts.push(row);
  }
  Logger.log("Shifts length is %s", shifts.length);
  return shifts;
}

// Returns the unique shifts
function writeShifts() {
  // Define the sheet
  var shiftsSheet = SpreadsheetApp.getActive().getSheetByName("Shifts");  
  // Clear the sheet
  shiftsSheet.getRange(3, 1, shiftsSheet.getLastRow(), 5).clear();

  var shifts = createShiftArray();
  var uniqueShifts = [];
  var count = 0;
  // Creates array with unique shifts
  for (shift in shifts) {
    var registeredPartners = shifts[shift][4];
    if (registeredPartners.length > 0) {
      for (partner in registeredPartners) {
        var row = [];
        row.push(registeredPartners[partner]);
        row.push(shifts[shift][0]);
        row.push(shifts[shift][1]);
        row.push(shifts[shift][2]);
        row.push(shifts[shift][3]);
        uniqueShifts.push(row);
      }
    }
  }
  Logger.log(uniqueShifts);
  Logger.log("Unique shifts length is %s", uniqueShifts.length);
  // Write shifts to the sheet
  var range = shiftsSheet.getRange(3, 1, uniqueShifts.length, row.length);
  range.setValues(uniqueShifts);
}
