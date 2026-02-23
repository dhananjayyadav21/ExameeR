const getHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
        'Content-Type': 'application/json',
        "AuthToken": token || ""
    };
};

// GET Request
export const getData = async (URL) => {
    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: getHeaders(),
        });
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
            headers: getHeaders(),
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
            headers: getHeaders(),
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        return result; //return json

    } catch (error) {
        throw error;
    }
};

// PATCH Request -----------------------------
export const patchData = async (URL, payload) => {
    try {
        const response = await fetch(URL, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        return result; // return JSON

    } catch (error) {
        throw error;
    }
};


// DELETE Request ---------------------------
export const deleteData = async (URL) => {
    try {
        const response = await fetch(URL, {
            method: 'DELETE',
            headers: getHeaders(),
        });

        const result = await response.json();
        return result; //return json

    } catch (error) {
        throw error;
    }
};
