import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User, UsersState, UpdateUserStatusRequest } from "@/types/user.types";
import UserService from "@/services/api/user.service";

// Create an instance of the UserService
const userService = new UserService();

const initialState: UsersState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
  total: 0,
};

// Async thunks
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await userService.getUsers();
  return response;
});

export const updateUserStatus = createAsyncThunk(
  "users/updateUserStatus",
  async ({ id, isActive }: { id: number; isActive: boolean }) => {
    const updatedUser = await userService.updateUserStatus(id, isActive);
    return updatedUser;
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users cases
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.total = action.payload.total;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      })

      // Update user status cases
      .addCase(updateUserStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Update the user in the array
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update user status";
      });
  },
});

export const { setSelectedUser, clearErrors } = usersSlice.actions;
export default usersSlice.reducer;
