const request = async (url, method, options, auth) => {
  const headers = auth
    ? {
        token: `${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      }
    : {
        "Content-Type": "application/json",
      };

  const payload =
    method === "GET"
      ? {
          method,
          headers,
        }
      : {
          method,
          body: JSON.stringify(options),
          headers,
        };

  return new Promise((resolve, reject) => {
    fetch(url, payload)
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          reject(res);
        } else {
          resolve(res);
        }
      })
      .catch((err) => reject(err));
  });
};

export const get = (url, options, auth) => request(url, "GET", options, auth);

export const post = (url, options, auth) => request(url, "POST", options, auth);

export const put = (url, options, auth) => request(url, "PUT", options, auth);

export const del = (url, options, auth) =>
  request(url, "DELETE", options, auth);
