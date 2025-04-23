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
  const { users } = useSelector((state: RootState) => state.users);
  const [isClient, setIsClient] = useState(false);

  // Define table columns with toggle switch in status and role columns
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
      cell: (row) => (
        <div className="flex items-center">
          <span className="mr-2">{row.role}</span>
        </div>
      ),
      sortable: true,
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
    setIsClient(true);
    dispatch(fetchUsers());
  }, [dispatch]);

  // Avoid hydration errors by only rendering after client-side hydration
  if (!isClient) {
    return null;
  }

  return (
    <MainLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-600">View and manage system users</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <DynamicDataTable
            title={`User List`}
            columns={userColumns}
            data={users}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 20, 30, 50]}
          />
        </div>
      </div>
    </MainLayout>
  );
}
