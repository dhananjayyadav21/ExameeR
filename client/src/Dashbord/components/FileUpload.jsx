import React, { useState } from "react";
const blobUrl = process.env.REACT_APP_BLOB_UPLOAD_URL || "https://script.google.com/macros/s/AKfycbykytwFvzKFmKiilEpVRM70vs2WkyXbTGnofLS3fFhYg2oChNSCzyZ2soiaR7zocfQ/exec";
const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setMessage("");
    setInputValue("")
    setFile(e.target.files[0]); // Get the selected file
  };

  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleCopyClick = () => {
    if (inputValue) {
      // Use the Clipboard API to copy the text to the clipboard
      navigator.clipboard
        .writeText(inputValue)
        .then(() => {
          alert("Copied to clipboard!");
        })
        .catch((err) => {
          console.error("Error copying text to clipboard: ", err);
          alert("Failed to copy!");
        });
    } else {
      alert("Input is empty.");
    }
  };

  const uploadFile = async () => {
    setInputValue("");
    setMessage("");
    if (!file) {
      setMessage("Please select a file.");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", await convertToBase64(file));
      formData.append("filename", file.name);
      formData.append("AuthToken", localStorage.getItem("token"));
      formData.append("requestType", "postData");
      const response = await fetch(blobUrl,
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await response.json();
      if (result.success) {
        setLoading(false);
        setInputValue(`${result.fileUrl}`);
        setMessage("File Uploaded Sucessfully!!")
      } else {
        setLoading(false);
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Error uploading file.");
    }
  };
  

  // Utility function to convert a file to Base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]); // Strip the metadata
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="container">
      <h1>Upload File</h1>
      <div className="mb-3 col-12 col-md-5 card p-2">
        <label htmlFor="formFileSm" className="form-label">
          Small file input example
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          className="form-control form-control-sm"
          id="formFileSm"
        />
        {isLoading && (
          <div className="text-center">
            <div className="spinner-border mt-3" role="status"></div>
          </div>
        )}
        <span className="fs-6" >{message}</span>
        <div className="input-group input-group-sm mb-3 mt-3">
          <span className="input-group-text" id="inputGroup-sizing-sm">
            File ULR
          </span>
          <input
            value={inputValue}
            onChange={handleInputChange}
            type="search"
            className="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-sm"
          />
          <button className="btn btn-outline-secondary" type="button" onClick={handleCopyClick} id="button-addon2">Copy Url</button>
        </div>
        <button className="btn btn-sm btn-primary" onClick={uploadFile}>
          Upload
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
