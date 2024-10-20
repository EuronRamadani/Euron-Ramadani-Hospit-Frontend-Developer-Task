"use client";
import React, { useEffect, useState } from "react";
import { Search, Plus, Edit2, Trash2, X } from "lucide-react";
import {
  fetchUsers,
  addUser,
  editUser,
  deleteUser,
} from "../services/userService";
import "../assets/style.scss";
import ConfirmationModal from "./modals/Confimation";

const USERS_PER_PAGE = 8;
interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  username?: string;
  phone?: string;
  website?: string;
}

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newUser, setNewUser] = useState({
    id: 0,
    name: "",
    lastName: "",
    email: "",
    username: "",
    phone: "",
  });
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const getUsers = async () => {
      const data = await fetchUsers();
      setUsers(data);
      setFilteredUsers(data);
    };
    getUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) => {
      const fullName = `${user.name} ${user.lastName}`.toLowerCase();
      const username = user.username?.toLowerCase() || "";
      const email = user.email?.toLowerCase() || "";
      const phone = user.phone?.toLowerCase() || "";

      return (
        fullName.includes(searchTerm.toLowerCase()) ||
        username.includes(searchTerm.toLowerCase()) ||
        email.includes(searchTerm.toLowerCase()) ||
        phone.includes(searchTerm.toLowerCase())
      );
    });

    setFilteredUsers(filtered);

    setTotalPages(Math.ceil(filtered.length / USERS_PER_PAGE));
  }, [searchTerm, users]);

  const usersToDisplay = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  const handleEdit = async (user: User) => {
    setIsEditing(true);
    setNewUser(user);
    setShowAddUserForm(true);
  };

  const handleDelete = async (id: number) => {
    setShowConfirmationModal(true);
    setUserToDelete(id);
  };

  const confirmDelete = async () => {
    if (userToDelete !== null) {
      await deleteUser(userToDelete);
      setUsers(users.filter((user) => user.id !== userToDelete));
    }
    setShowConfirmationModal(false);
  };

  const handleAddOrEditUser = async () => {
    if (isEditing) {
      await editUser(newUser.id, newUser);
      setUsers(users.map((user) => (user.id === newUser.id ? newUser : user)));
      setIsEditing(false);
    } else {
      const addedUser = await addUser(newUser);
      const newUserId = users.length ? users[users.length - 1].id + 1 : 1;
      setUsers([...users, { ...newUser, id: newUserId }]);
    }
    setNewUser({
      id: 0,
      name: "",
      lastName: "",
      email: "",
      username: "",
      phone: "",
    });
    setShowAddUserForm(false);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="user-management-container">
      <div className="header-section">
        <h1>User Management</h1>
        <div className="actions">
          <div>
            <input
              type="text"
              placeholder="Search users by name, username, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* <Search /> */}
          </div>
          <button
            onClick={() => {
              setShowAddUserForm(!showAddUserForm);
              setIsEditing(false);
              setNewUser({
                id: 0,
                name: "",
                lastName: "",
                email: "",
                username: "",
                phone: "",
              });
            }}
          >
            {showAddUserForm ? <X /> : <Plus />}
            {showAddUserForm ? "Cancel" : "Add User"}
          </button>
        </div>
      </div>

      {showAddUserForm && (
        <div className="form-section">
          <h2>{isEditing ? "Edit User" : "Add New User"}</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddOrEditUser();
            }}
          >
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                value={newUser.name}
                placeholder="Enter full name"
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                value={newUser.username || ""}
                placeholder="Enter username"
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={newUser.email}
                placeholder="Enter email"
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="text"
                value={newUser.phone || ""}
                placeholder="Enter phone number"
                onChange={(e) =>
                  setNewUser({ ...newUser, phone: e.target.value })
                }
              />
            </div>
            <div>
              <button type="submit">
                {isEditing ? "Update User" : "Add User"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-section">
        <table>
          <thead>
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
            {usersToDisplay.length > 0 ? (
              usersToDisplay.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{`${user.name}`}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.website}</td>
                  <td className="actions">
                    <button onClick={() => handleEdit(user)}>
                      <Edit2 />
                    </button>
                    <button
                      className="trash-btn"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="no-data">
                <td colSpan={7}>No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-controls">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>

      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default UserTable;
