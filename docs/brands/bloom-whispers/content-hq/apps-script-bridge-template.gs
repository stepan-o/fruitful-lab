const CONFIG = {
  SPREADSHEET_ID: "1YN2hC9Tap5S5Uk8blyP6NLjYu-FwdQIc8_HtR-FuunI",
  SHEET_NAME: "Content HQ",
  TOKEN: "REPLACE_WITH_PRIVATE_BRIDGE_TOKEN",
};

function json_(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}

function clean_(value) {
  return typeof value === "string" ? value.trim() : "";
}

function authorize_(token) {
  if (!CONFIG.TOKEN || clean_(token) !== CONFIG.TOKEN) {
    throw new Error("Content HQ bridge token is missing or incorrect.");
  }
}

function sheet_() {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);

  if (!sheet) {
    throw new Error(`Sheet tab not found: ${CONFIG.SHEET_NAME}`);
  }

  return sheet;
}

function rows_() {
  return sheet_().getDataRange().getDisplayValues();
}

function itemFromRow_(headers, row) {
  const item = {};

  headers.forEach((header, index) => {
    item[header] = row[index] || "";
  });

  return item;
}

function doGet(event) {
  try {
    authorize_(event.parameter.token);

    return json_({
      generatedAt: new Date().toISOString(),
      ok: true,
      rows: rows_(),
      source: "apps-script",
    });
  } catch (error) {
    return json_({
      message: error instanceof Error ? error.message : "Content HQ bridge read failed.",
      ok: false,
    });
  }
}

function doPost(event) {
  try {
    const body = JSON.parse((event.postData && event.postData.contents) || "{}");
    authorize_(body.token || event.parameter.token);

    if (body.type !== "update-field" || !clean_(body.id) || !clean_(body.key)) {
      throw new Error("Send type, id, key, and value.");
    }

    if (body.key === "HQ ID") {
      throw new Error("HQ ID cannot be edited from the dashboard.");
    }

    const sheet = sheet_();
    const values = sheet.getDataRange().getDisplayValues();
    const headers = values[0] || [];
    const idColumn = headers.indexOf("HQ ID");
    const targetColumn = headers.indexOf(body.key);
    const lastUpdatedColumn = headers.indexOf("Last Updated");

    if (idColumn === -1) throw new Error("The Sheet is missing the HQ ID header.");
    if (targetColumn === -1) throw new Error(`The Sheet is missing the ${body.key} header.`);

    const rowIndex = values.findIndex((row, index) => index > 0 && clean_(row[idColumn]) === clean_(body.id));

    if (rowIndex === -1) {
      throw new Error(`No Content HQ row found for ${body.id}.`);
    }

    const rowNumber = rowIndex + 1;
    sheet.getRange(rowNumber, targetColumn + 1).setValue(typeof body.value === "string" ? body.value : "");

    if (lastUpdatedColumn !== -1 && body.key !== "Last Updated") {
      sheet.getRange(rowNumber, lastUpdatedColumn + 1).setValue(new Date().toISOString().slice(0, 10));
    }

    SpreadsheetApp.flush();

    const updatedRow = sheet.getRange(rowNumber, 1, 1, headers.length).getDisplayValues()[0];

    return json_({
      item: itemFromRow_(headers, updatedRow),
      ok: true,
      savedAt: new Date().toISOString(),
    });
  } catch (error) {
    return json_({
      message: error instanceof Error ? error.message : "Content HQ bridge write failed.",
      ok: false,
    });
  }
}
