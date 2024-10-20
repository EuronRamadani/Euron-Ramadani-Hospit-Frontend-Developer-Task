import axios from "axios";

const API_URL = "https://jsonplaceholder.typicode.com/users";

export const fetchUsers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data", error);
    return [];
  }
};

export const addUser = async (newUser) => {
  try {
    const response = await axios.post(`${API_URL}/add`, newUser);
    console.log("User added successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding user", error);
  }
};

export const editUser = async (userId, updatedUser) => {
  try {
    const response = await axios.put(`${API_URL}/edit/${userId}`, updatedUser);
    console.log("User updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating user", error);
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${userId}`);
    console.log("User deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting user", error);
  }
};
