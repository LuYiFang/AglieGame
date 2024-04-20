const api = 'http:127.0.0.1:3000';

const fetchApi = async (url, method, data, auth) => {
  const config = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': 'Bearer your-token (if needed)'
    },
  };

  try {
    if (method === 'POST' || method == 'PATCH' || method === 'PUT') {
      config['body'] = JSON.stringify(data);
    }
    const res = await fetch(url, config);

    const result = await res.json();
    if (res.status >= 400) {
      console.log(
        `Fetch url ${url}\nerror: ${result.message}\ndata:\n${JSON.stringify(data)}`,
      );
    }
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
};

const getApi = async (url, data, auth) => {
  const params = new URLSearchParams(data).toString();
  return fetchApi(`${url}?${params}`, 'GET', {}, auth);
};

const postApi = async (url, data, auth) => {
  return fetchApi(url, 'POST', data, auth);
};

const deleteApi = async (url, data, auth) => {
  const params = new URLSearchParams(data).toString();
  return fetchApi(`${url}?${params}`, 'DELETE', {}, auth);
};

const patchApi = async (url, data, auth) => {
  return fetchApi(url, 'PATCH', data, auth);
};

module.exports = { api, fetchApi, getApi, postApi, deleteApi, patchApi };
