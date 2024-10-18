"use client";

import React, { useEffect, useState } from "react";
import { fetchUsers } from "../services/userService";

interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
}

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showAddUserForm, setShowAddUserForm] = useState(false); // State to toggle form visibility
  const [isEditing, setIsEditing] = useState(false); // Track if we're editing a user
  const [newUser, setNewUser] = useState({
    id: 0,
    name: "",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    const getUsers = async () => {
      const data = await fetchUsers();
      setUsers(data);
    };
    getUsers();
  }, []);

  const handleEdit = (user: User) => {
    setIsEditing(true); // Enable editing mode
    setNewUser(user); // Pre-fill the form with the user's data
    setShowAddUserForm(true); // Show the form
  };

  const handleDelete = (id: number) => {
    setUsers(users.filter((user) => user.id !== id)); // Filter out the deleted user
  };

  const handleAddOrEditUser = () => {
    if (isEditing) {
      // Update the user in the list
      setUsers(users.map((user) => (user.id === newUser.id ? newUser : user)));
      setIsEditing(false); // Reset editing mode
    } else {
      // Add a new user to the list
      const newUserId = users.length ? users[users.length - 1].id + 1 : 1;
      setUsers([...users, { ...newUser, id: newUserId }]);
    }

    setNewUser({ id: 0, name: "", lastName: "", email: "" }); // Clear the form after submission
    setShowAddUserForm(false); // Hide the form after adding or editing a user
  };

  return (
    <div className="container w-100 mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">User List</h1>

      {/* Add or Edit User Button */}
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={() => {
          setShowAddUserForm(!showAddUserForm);
          setIsEditing(false); // Reset editing mode when adding a new user
          setNewUser({ id: 0, name: "", lastName: "", email: "" }); // Clear form for new user
        }}
      >
        {showAddUserForm ? "Cancel" : isEditing ? "Edit User" : "Add User"}
      </button>

      {/* Add or Edit User Form */}
      {showAddUserForm && (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">
            {isEditing ? "Edit User" : "Add New User"}
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddOrEditUser();
            }}
          >
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                value={newUser.lastName}
                onChange={(e) =>
                  setNewUser({ ...newUser, lastName: e.target.value })
                }
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded-md"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                required
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {isEditing ? "Update User" : "Add User"}
            </button>
          </form>
        </div>
      )}

      {/* User Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Last Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="py-3 px-6">{user.id}</td>
                  <td className="py-3 px-6">{user.name}</td>
                  <td className="py-3 px-6">{user.lastName}</td>
                  <td className="py-3 px-6">{user.email}</td>
                  <td className="py-3 px-6 text-center">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded mr-2"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-6">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
