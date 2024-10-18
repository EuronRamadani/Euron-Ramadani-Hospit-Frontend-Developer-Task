"use client";

import React, { useEffect, useState } from "react";
import { Search, Plus, Edit2, Trash2, X } from "lucide-react";
import { fetchUsers } from "../services/userService"; // Your existing service import
import "../assets/style.scss";

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
    <div className="">
      <div className="">
        {/* Main Card */}
        <div className="">
          {/* Header Section */}
          <div className="">
            <div className="">
              <h1 className="">User Management</h1>
              <div className="">
                <div className="">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search />
                </div>
                <button
                  onClick={() => {
                    setShowAddUserForm(!showAddUserForm);
                    setIsEditing(false);
                    setNewUser({ id: 0, name: "", lastName: "", email: "" });
                  }}
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
            <div>
              <div>
                <h2>{isEditing ? "Edit User" : "Add New User"}</h2>
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
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button type="submit">
                      {isEditing ? "Update User" : "Add User"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Table Section */}
          <div>
            <table>
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
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>
                        <div>
                          {user.name} {user.lastName}
                        </div>
                      </td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.website}</td>
                      <td>
                        <div className="flex gap-3">
                          <button onClick={() => handleEdit(user)}>
                            <Edit2 />
                          </button>
                          <button onClick={() => handleDelete(user.id)}>
                            <Trash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7}>No users found</td>
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
