const blobUrl = process.env.NEXT_PUBLIC_BLOB_UPLOAD_URL || "https://script.google.com/macros/s/AKfycbzr_p3sD8rZXUYHkBZwGReX1aVoAdC2BRS3PoOD3bkXETlMNSsSQS4wC5Ht7CLMUoUi/exec";

const driveUpload = async (file) => {
    if (!file) {
        throw new Error("File Not Found");
    }

    try {
        const base64Data = await convertToBase64(file);
        const formData = new FormData();
        formData.append("file", base64Data);
        formData.append("filename", file.name);
        formData.append("AuthToken", typeof window !== 'undefined' ? localStorage.getItem("token") : "");
        formData.append("requestType", "postData");

        const response = await fetch(blobUrl, {
            method: "POST",
            body: formData,
        });

        const result = await response.json();
        return result;
    } catch (error) {
        throw new Error(`Error uploading file: ${error.message}`);
    }
}

const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = (error) => reject(error);
    });
};

export default driveUpload;
