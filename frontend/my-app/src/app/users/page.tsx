"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TableColumn } from "react-data-table-component";
import { AppDispatch, RootState } from "@/store/store";
import {
  fetchUsers,
  updateUserStatus,
  clearErrors,
} from "@/store/users/users.slice";
import { User } from "@/types/user.types";
import DynamicDataTable from "@/components/common/table";
import MainLayout from "@/components/MainLayout";
import ToggleSwitch from "@/components/common/ToggleSwitch";
import { toast } from "react-toastify";

export default function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error, total } = useSelector(
    (state: RootState) => state.users
  );
  const [isClient, setIsClient] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [apiStatus, setApiStatus] = useState<
    "connected" | "disconnected" | "unknown"
  >("unknown");
  const [lastErrorDetails, setLastErrorDetails] = useState<string | null>(null);

  // Handle toggle switch change
  const handleStatusChange = (id: number, isActive: boolean) => {
    console.log(
      `Toggling user ${id} status to ${isActive ? "active" : "inactive"}`
    );

    dispatch(updateUserStatus({ id, isActive }))
      .unwrap()
      .then((result) => {
        console.log("Update status success:", result);
        toast.success(
          `User status updated to ${isActive ? "active" : "inactive"}`
        );
        setApiStatus("connected");
        setLastErrorDetails(null);
      })
      .catch((err) => {
        console.error("Update status error:", err);
        const errorMsg = err.message || "Unknown error";

        toast.error(`Failed to update user status: ${errorMsg}`);

        if (errorMsg.includes("404") || errorMsg.includes("PATCH")) {
          setLastErrorDetails(
            "The API endpoint for updating user status might not be available. " +
              "Make sure your backend supports PATCH requests to /users/{id}."
          );
        } else if (
          errorMsg.includes("network") ||
          errorMsg.includes("connect")
        ) {
          setApiStatus("disconnected");
        }
      });
  };

  // Function to refresh the user list
  const refreshUserList = () => {
    setRefreshing(true);
    dispatch(clearErrors()); // Clear any previous errors
    setLastErrorDetails(null);

    dispatch(fetchUsers())
      .unwrap()
      .then((result) => {
        console.log("Refresh success:", result);
        toast.success("User list refreshed successfully");
        setApiStatus("connected");
      })
      .catch((err) => {
        console.error("Refresh error:", err);
        const errorMsg = err.message || "Unknown error";

        toast.error(`Failed to refresh user list: ${errorMsg}`);

        if (errorMsg.includes("network") || errorMsg.includes("connect")) {
          setApiStatus("disconnected");
        }
      })
      .finally(() => {
        setRefreshing(false);
      });
  };

  // Define table columns with toggle switch in actions column
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
      selector: (row) => row.role,
      sortable: true,
    },
    {
      name: "Status",
      width: "150px",
      cell: (row) => (
        <ToggleSwitch
          isChecked={row.isActive ?? true}
          onChange={(checked) => handleStatusChange(row.id, checked)}
          id={`toggle-${row.id}`}
          disabled={refreshing || loading}
        />
      ),
    },
    {
      name: "Created At",
      selector: (row) =>
        row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "N/A",
      sortable: true,
    },
  ];

  useEffect(() => {
    setIsClient(true);
    dispatch(fetchUsers())
      .unwrap()
      .then(() => {
        setApiStatus("connected");
      })
      .catch((err) => {
        console.error("Error fetching users:", err);

        if (
          err.message &&
          (err.message.includes("network") || err.message.includes("connect"))
        ) {
          setApiStatus("disconnected");
        }
      });
  }, [dispatch]);

  // Avoid hydration errors by only rendering after client-side hydration
  if (!isClient) {
    return null;
  }

  const isLoadingData = loading || refreshing;

  // Parse the error message to make it more user-friendly
  const getErrorMessage = (errorMsg: string | null) => {
    if (!errorMsg) return null;

    // If it's a "not a function" error, give specific guidance
    if (errorMsg.includes("not a function")) {
      return "API connection error: The application is not configured correctly to connect to the API.";
    }

    // If it's a 404 PATCH error
    if (errorMsg.includes("404") && errorMsg.includes("PATCH")) {
      return "API endpoint error: The server couldn't process the status update request. The endpoint might not be implemented.";
    }

    return errorMsg;
  };

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
              {isLoadingData && (
                <span className="ml-2 text-blue-600">Loading...</span>
              )}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          {(error || lastErrorDetails) && (
            <div className="p-4 text-red-700 bg-red-100">
              <div className="font-bold mb-1">API Error:</div>
              <div>{getErrorMessage(error)}</div>
              {lastErrorDetails && (
                <div className="mt-2 text-sm border-t pt-2 border-red-200">
                  <p className="font-semibold">Troubleshooting Tips:</p>
                  <p>{lastErrorDetails}</p>
                </div>
              )}
            </div>
          )}

          <DynamicDataTable
            title={`User List (${total} users)${
              isLoadingData ? " - Loading..." : ""
            }`}
            columns={userColumns}
            data={users}
            isLoading={isLoadingData}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 20, 30, 50]}
            noDataMessage={
              error ? "No data available due to an API error" : "No users found"
            }
          />
        </div>
      </div>
    </MainLayout>
  );
}
