"use client";

import { useEffect, useState } from "react";
import Drawer from "@/components/common/drawer";
import MainLayout from "@/components/MainLayout";
import { openDrawer } from "@/store/slices/drawerSlice";
import { useDispatch } from "react-redux";
import CategoryForm from "@/components/categories/CategoryForm";
import DynamicDataTable from "@/components/common/table";
import categoryService, { Category } from "@/services/api/category.service";
import ConfirmModal from "@/components/common/ConfirmModal";

export default function CategoriesPage() {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await categoryService.getAll();
      setCategories(response.data || []);
    } catch (error: any) {
      setError(error.message || "Failed to load categories");
      console.error("Failed to load categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = () => {
    dispatch(
      openDrawer({
        title: "Add Category",
        contentType: "CATEGORY_FORM",
        contentProps: {
          onSuccess: loadCategories,
        },
        isOverlayClose: false,
      })
    );
  };

  const handleEditCategory = (category: Category) => {
    dispatch(
      openDrawer({
        title: "Edit Category",
        contentType: "CATEGORY_FORM",
        contentProps: {
          onSuccess: loadCategories,
          category: category,
        },
        isOverlayClose: false,
      })
    );
  };

  const handleDeleteClick = (id: number) => {
    setCategoryToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (categoryToDelete === null) return;

    try {
      await categoryService.delete(categoryToDelete);
      await loadCategories(); // Reload the list after deletion
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    } catch (error: any) {
      console.error("Failed to delete category:", error);
      alert(error.message || "Failed to delete category");
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  const columns = [
    {
      name: "Title",
      selector: (row: Category) => row.name,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row: Category) => row.description,
      sortable: true,
      wrap: true,
    },
    {
      name: "Actions",
      cell: (row: Category) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditCategory(row)}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(row.id!)}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
          <button
            onClick={handleAddCategory}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Category
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <Drawer />

        <div className="bg-white rounded-lg shadow">
          <DynamicDataTable
            title="Categories"
            columns={columns}
            data={categories}
            isLoading={loading}
            pagination={true}
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 20, 30, 50]}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </MainLayout>
  );
}
