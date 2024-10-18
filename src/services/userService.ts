// src/services/userService.ts
import axios from "axios";

const API_URL = "https://jsonplaceholder.typicode.com/users"; // Replace with your actual API URL

export const fetchUsers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data", error);
    return [];
  }
};
