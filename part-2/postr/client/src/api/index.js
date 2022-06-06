const json = (response) => {
  return response.json();
};

const success = (response) => {
  if (response.ok === false) {
    return response.json().then((data) => {
      const error = new Error(`HTTP Error: ${response.status}`);
      error.response = response;
      error.status = response.status;
      error.messages = data.messages;

      throw error;
    });
  }

  return response;
};

export const all = () => fetch(`/api/posts`).then(success).then(json);

export const one = (id) => fetch(`/api/posts/${id}`).then(success).then(json);

export const create = (body) =>
  fetch(`/api/posts`, { method: "post", body }).then(success).then(json);

export const edit = (id, body) =>
  fetch(`/api/posts/${id}`, { method: "put", body }).then(success).then(json);

export const destroy = (id) =>
  fetch(`/api/posts/${id}`, { method: "delete" }).then(success).then(json);
