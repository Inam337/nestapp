"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TableColumn } from "react-data-table-component";
import { AppDispatch, RootState } from "@/store/store";
import { fetchUsers } from "@/store/users/users.slice";
import { User } from "@/types/user.types";
import DynamicDataTable from "@/components/common/table";
import MainLayout from "@/components/MainLayout";

export default function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error, total } = useSelector(
    (state: RootState) => state.users
  );

  // Define table columns
  const userColumns: TableColumn<User>[] = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "80px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Role",
      width: "150px",
      sortable: true,
      selector: (row) => row.role,
    },
    {
      name: "Status",
      width: "150px",
      sortable: true,
    },
    {
      name: "Created At",
      selector: (row) =>
        row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "N/A",
      sortable: true,
    },
  ];

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <MainLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-600">
              View and manage system users
              {loading && (
                <span className="ml-2 text-blue-600">Loading...</span>
              )}
            </p>
          </div>
          <button
            onClick={() => dispatch(fetchUsers())}
            disabled={loading}
            className={`px-4 py-2 rounded ${
              loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          {error && (
            <div className="p-4 text-red-700 bg-red-100">
              <div className="font-bold mb-1">Error:</div>
              <div>{error}</div>
              <p className="mt-2 text-sm">
                <strong>Server Error:</strong> There may be an issue with the
                backend server. Check the server logs for more details.
              </p>
            </div>
          )}

          <DynamicDataTable
            title={`User List (${total || 0} users)`}
            columns={userColumns}
            data={users || []}
            isLoading={loading}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 20, 30, 50]}
            noDataMessage={
              error
                ? "No data available due to a server error"
                : "No users found"
            }
          />
        </div>
      </div>
    </MainLayout>
  );
}
