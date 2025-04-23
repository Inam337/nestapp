"use client";

// components/DynamicDataTable.tsx
import React from "react";
import DataTable, { TableColumn } from "react-data-table-component";

type DynamicDataTableProps<T> = {
  title: string;
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  pagination?: boolean;
  paginationPerPage?: number;
  paginationRowsPerPageOptions?: number[];
  noDataMessage?: string;
};

function DynamicDataTable<T>({
  title,
  columns,
  data,
  isLoading = false,
  pagination = true,
  paginationPerPage = 10,
  paginationRowsPerPageOptions = [10, 20, 30, 50],
  noDataMessage = "No records to display",
}: DynamicDataTableProps<T>) {
  // Simple loading component
  const LoadingComponent = () => (
    <div className="p-6 flex justify-center items-center text-gray-600">
      {isLoading ? "Loading data..." : ""}
    </div>
  );

  // Custom no data component
  const NoDataComponent = () => (
    <div className="p-6 text-center text-gray-500">{noDataMessage}</div>
  );

  return (
    <div>
      <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b">
        <div className="text-lg font-medium">{title}</div>
        {isLoading && <div className="text-sm text-blue-600">Loading...</div>}
      </div>
      <DataTable
        columns={columns}
        data={data}
        progressPending={isLoading}
        progressComponent={<LoadingComponent />}
        pagination={pagination}
        paginationPerPage={paginationPerPage}
        paginationRowsPerPageOptions={paginationRowsPerPageOptions}
        highlightOnHover
        striped
        noDataComponent={<NoDataComponent />}
        persistTableHead
      />
    </div>
  );
}

export default DynamicDataTable;
