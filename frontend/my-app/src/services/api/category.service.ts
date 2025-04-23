import axiosInstance from "./axios.config";

export interface Category {
  id?: number;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

// For form compatibility (our form uses 'title' but API expects 'name')
export interface CategoryFormData {
  title: string;
  description: string;
}

const categoryService = {
  getAll: async () => {
    try {
      const response = await axiosInstance.get<Category[]>("/categories");
      return response;
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  create: async (formData: CategoryFormData) => {
    try {
      console.log("Creating category with data:", formData);
      // Convert from form data to API format
      const apiData = {
        name: formData.title,
        description: formData.description,
      };

      const response = await axiosInstance.post<Category>(
        "/categories",
        apiData
      );
      return response;
    } catch (error: any) {
      // Log the complete error object for debugging
      console.error("Complete error object:", error);

      // If it's an AxiosError with a response, extract the relevant data
      if (error.response) {
        console.error("Error response data:", error.response.data);
        throw new Error(
          error.response.data.message || "Failed to create category"
        );
      }

      // If there's no response, it might be a network error
      throw new Error(error.message || "Failed to create category");
    }
  },

  update: async (id: number, formData: CategoryFormData) => {
    try {
      // Convert from form data to API format
      const apiData = {
        name: formData.title,
        description: formData.description,
      };

      const response = await axiosInstance.put<Category>(
        `/categories/${id}`,
        apiData
      );
      return response;
    } catch (error: any) {
      console.error("Error updating category:", error);
      throw error;
    }
  },

  delete: async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/categories/${id}`);
      return response;
    } catch (error: any) {
      console.error("Error deleting category:", error);
      throw error;
    }
  },
};

export default categoryService;
