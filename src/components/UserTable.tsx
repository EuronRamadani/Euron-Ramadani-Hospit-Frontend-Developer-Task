"use client";

import React, { useEffect, useState } from "react";
import { Search, Plus, Edit2, Trash2, X } from "lucide-react";
import { fetchUsers } from "../services/userService"; // Your existing service import

// If you're using TypeScript, add these interfaces
interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  username?: string;
  phone?: string;
  website?: string;
}

interface NewUser {
  id: number;
  name: string;
  lastName: string;
  email: string;
}

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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

  const handleEdit = (user) => {
    setIsEditing(true);
    setNewUser(user);
    setShowAddUserForm(true);
  };

  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleAddOrEditUser = () => {
    if (isEditing) {
      setUsers(users.map((user) => (user.id === newUser.id ? newUser : user)));
      setIsEditing(false);
    } else {
      const newUserId = users.length ? users[users.length - 1].id + 1 : 1;
      setUsers([...users, { ...newUser, id: newUserId }]);
    }
    setNewUser({ id: 0, name: "", lastName: "", email: "" });
    setShowAddUserForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                User Management
              </h1>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
                </div>
                <button
                  onClick={() => {
                    setShowAddUserForm(!showAddUserForm);
                    setIsEditing(false);
                    setNewUser({ id: 0, name: "", lastName: "", email: "" });
                  }}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200 ease-in-out shadow-sm hover:shadow-md"
                >
                  {showAddUserForm ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Plus className="h-5 w-5" />
                  )}
                  {showAddUserForm ? "Cancel" : "Add User"}
                </button>
              </div>
            </div>
          </div>

          {/* Form Section with smooth transition */}
          {showAddUserForm && (
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 shadow-inner">
                <h2 className="text-xl font-semibold mb-6 text-gray-800">
                  {isEditing ? "Edit User" : "Add New User"}
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddOrEditUser();
                  }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                      value={newUser.name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                      value={newUser.lastName}
                      onChange={(e) =>
                        setNewUser({ ...newUser, lastName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg transition duration-200 ease-in-out shadow-sm hover:shadow-md"
                    >
                      {isEditing ? "Update User" : "Add User"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Table Section */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "ID",
                    "Full Name",
                    "Username",
                    "Email",
                    "Phone",
                    "Website",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition duration-150 ease-in-out"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name} {user.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.website}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-1.5 hover:bg-blue-50 rounded-lg transition duration-200 ease-in-out group"
                          >
                            <Edit2 className="h-4 w-4 text-blue-600 group-hover:text-blue-700" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-1.5 hover:bg-red-50 rounded-lg transition duration-200 ease-in-out group"
                          >
                            <Trash2 className="h-4 w-4 text-red-600 group-hover:text-red-700" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-sm text-gray-500 bg-gray-50"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
