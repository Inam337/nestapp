import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { closeDrawer } from "@/store/slices/drawerSlice";
import categoryService, {
  Category,
  CategoryFormData,
} from "@/services/api/category.service";

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must not exceed 50 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),
});

interface Props {
  onSuccess: () => void;
  category?: Category; // Optional category for edit mode
}

const CategoryForm: React.FC<Props> = ({ onSuccess, category }) => {
  const dispatch = useDispatch();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isEditMode = !!category;

  // Convert category to form values (name -> title)
  const initialValues: CategoryFormData = {
    title: category ? category.name : "",
    description: category ? category.description : "",
  };

  const handleSubmit = async (
    values: CategoryFormData,
    { setSubmitting, resetForm }: any
  ) => {
    try {
      setSubmitError(null);

      if (isEditMode && category?.id) {
        // Update existing category
        await categoryService.update(category.id, values);
      } else {
        // Create new category
        await categoryService.create(values);
      }

      resetForm();
      onSuccess();
      dispatch(closeDrawer());
    } catch (error: any) {
      setSubmitError(
        error.message ||
          `Failed to ${isEditMode ? "update" : "create"} category`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className="space-y-6">
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {submitError}
            </div>
          )}

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <Field
              type="text"
              id="title"
              name="title"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter category title"
            />
            {errors.title && touched.title && (
              <div className="mt-1 text-sm text-red-600">{errors.title}</div>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <Field
              as="textarea"
              id="description"
              name="description"
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter category description"
            />
            {errors.description && touched.description && (
              <div className="mt-1 text-sm text-red-600">
                {errors.description}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => dispatch(closeDrawer())}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting
                ? "Saving..."
                : isEditMode
                ? "Update Category"
                : "Save Category"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CategoryForm;
