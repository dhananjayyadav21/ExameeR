const headers = {
  'Content-Type': 'application/json',
  "AuthToken": localStorage.getItem('token')
};

// GET Request
export const getData = async (URL) => {
  try {
    const response = await fetch(URL);
    const result = await response.json();
    return result; //return json

  } catch (error) {
    throw error;
  }
};

// POST Request ----------------------------
export const postData = async (URL, payload) => {
  try {
    const response = await fetch(URL, { 
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    return result; //return json

  } catch (error) {
    throw error;
  }
};

// PUT Request -----------------------------
export const putData = async (URL, payload) => {
  try {
    const response = await fetch(URL, {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    return result; //return json

  } catch (error) {
    throw error;
  }
};

// DELETE Request ---------------------------
export const deleteData = async (URL) => {
  try {
    const response = await fetch(URL, {
      method: 'DELETE',
      headers,
    });

    const result = await response.json();
    return result; //return json
    
  } catch (error) {
    throw error;
  }
};
