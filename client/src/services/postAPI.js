import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8001/api" });

API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

export const createPost = (postData) => API.post("/posts", postData);
export const getPosts = () => API.get("/getposts");
export const getPostById = (id) => API.get(`/getpost/${id}`);
export const deletePost = (id, token) =>
  API.delete(`/posts/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
export const updatePost = (id, updatedData, token) =>
  API.put(`/posts/${id}`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
export const getComments = (postId) => {
  return API.get(`/${postId}/comments`);
};

export const addComment = (id, content, token) =>
  API.post(
    `/${id}/addcomments`,
    { content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
export const toggleLike = (id, token) =>
  API.post(
    `/${id}/like`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
export const getLikes = async (postId, token) => {
  return API.get(
    `/${postId}/getlikes`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
