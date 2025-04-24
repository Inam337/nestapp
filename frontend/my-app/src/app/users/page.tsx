"use client";

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TableColumn } from "react-data-table-component";
import { AppDispatch, RootState } from "@/store/store";
import { fetchUsers, updateUserStatus } from "@/store/users/users.slice";
import { User } from "@/types/user.types";
import DynamicDataTable from "@/components/common/table";
import MainLayout from "@/components/MainLayout";
import Switch from "@/components/common/Switch";

export default function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error, total } = useSelector(
    (state: RootState) => state.users
  );
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

  // Cache the user status to prevent UI flicker during rerenders
  const [userStatusCache, setUserStatusCache] = useState<{
    [key: number]: boolean;
  }>({});

  // Update the cache whenever users change
  useEffect(() => {
    if (users?.length) {
      const newCache = { ...userStatusCache };

      // Update cache with latest status from the API
      users.forEach((user) => {
        // Only update if the user is not currently being updated
        if (user.id !== updatingUserId) {
          newCache[user.id] = !!user.status;
        }
      });

      setUserStatusCache(newCache);
    }
  }, [users]);

  // Force refresh data from the server
  const refreshData = useCallback(() => {
    dispatch(fetchUsers()).then((action) => {
      console.log("Users data refreshed:", action.payload);
    });
  }, [dispatch]);

  const handleToggleUserStatus = (userId: number, currentStatus: boolean) => {
    // Track which user is being updated
    setUpdatingUserId(userId);

    // Update the cache optimistically
    const newStatus = !currentStatus;
    setUserStatusCache((prev) => ({
      ...prev,
      [userId]: newStatus,
    }));

    // Make the API call to update the status
    dispatch(updateUserStatus({ userId, isActive: newStatus }))
      .then(() => {
        // Status update was successful
        console.log(`User ${userId} status updated to ${newStatus}`);
        setUpdatingUserId(null);
      })
      .catch((error) => {
        console.error(`Failed to update user ${userId} status:`, error);

        // Revert the cache on error
        setUserStatusCache((prev) => ({
          ...prev,
          [userId]: currentStatus, // Revert to original status
        }));

        setUpdatingUserId(null);
      });
  };

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
      cell: (row) => {
        const isUpdatingThisUser = updatingUserId === row.id;

        // Get the status from cache if available, otherwise use the status from the API
        const currentStatus =
          row.id in userStatusCache ? userStatusCache[row.id] : !!row.status;

        return (
          <div className="flex items-center">
            <Switch
              isOn={currentStatus}
              handleToggle={() => handleToggleUserStatus(row.id, currentStatus)}
              disabled={loading || isUpdatingThisUser}
            />
            <span
              className={`ml-2 ${
                currentStatus ? "text-green-600 font-medium" : "text-red-600"
              }`}
            >
              {isUpdatingThisUser
                ? "Updating..."
                : currentStatus
                ? "Active"
                : "Inactive"}
            </span>
          </div>
        );
      },
    },
    {
      name: "Created At",
      selector: (row) =>
        row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "N/A",
      sortable: true,
    },
  ];

  useEffect(() => {
    // Initial data load
    refreshData();

    // // Clean up when component unmounts
    // return () => {
    //   setUpdatingUserId(null);
    // };
  }, [refreshData]);

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
              {loading && !updatingUserId && (
                <span className="ml-2 text-blue-600">Loading...</span>
              )}
            </p>
          </div>
          <button
            onClick={refreshData}
            disabled={loading && !updatingUserId}
            className={`px-4 py-2 rounded ${
              loading && !updatingUserId
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {loading && !updatingUserId ? "Refreshing..." : "Refresh"}
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
            isLoading={loading && !updatingUserId}
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
