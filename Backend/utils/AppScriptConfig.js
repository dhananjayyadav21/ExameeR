function doPost(e) {
    try {
  
      const token = e.parameter.AuthToken;
  
      // Check if token is present
      if (!token || !verifyTokenWithBackend(token)) {
        return ContentService.createTextOutput(
          JSON.stringify({ success: false, message: "Unauthorized" })
        ).setMimeType(ContentService.MimeType.JSON);
      }
  
      // Parse request parameters
      const fileName = e.parameter.filename || "uploaded_file";
      const fileData = e.parameter.file;
  
      if (!fileData) {
        throw new Error("File data is missing.");
      }
  
      // Decode the file from base64
      const blob = Utilities.newBlob(Utilities.base64Decode(fileData), "application/octet-stream", fileName);
  
  
      // Save the file to Google Drive
      const folderId = '1zMwuO2s9nMGlemURM-lM-rl72kHG4UIm';
      const folder = DriveApp.getFolderById(folderId);
  
      const file = folder.createFile(blob);
  
      return ContentService.createTextOutput(
        JSON.stringify({
          success: true,
          fileId: file.getId(),
          fileName: file.getName(),
          fileUrl: file.getUrl(),
        })
      ).setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
      return ContentService.createTextOutput(
        JSON.stringify({
          success: false,
          error: error.message,
          parameter: e.parameter
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  
  // ✅ Keep this outside doPost
  function verifyTokenWithBackend(token) {
    const backendUrl = PropertiesService.getScriptProperties().getProperty("APIBASEURL");
    const isVerifyToken = PropertiesService.getScriptProperties().getProperty("VERIFY_TOKEN");
  
    if(isVerifyToken =="false"){
      return true;
    }
  
    const options = {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "AuthToken": token,
      },
      muteHttpExceptions: true,
    };
  
    try {
      const response = UrlFetchApp.fetch(backendUrl, options);
      const result = JSON.parse(response.getContentText());
      return result.success === true;
    } catch (error) {
      return false;
    }
  }
  
  