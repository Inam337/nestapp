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

// Keep track of user status changes that have been requested but may not be reflected in the API response yet
let pendingStatusChanges: { [userId: number]: boolean } = {};

// Async thunks
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await userService.getUsers();
  return response;
});

export const updateUserStatus = createAsyncThunk(
  "users/updateUserStatus",
  async ({ userId, isActive }: { userId: number; isActive: boolean }) => {
    try {
      const data: UpdateUserStatusRequest = { isActive };

      // Record this pending status change
      pendingStatusChanges[userId] = isActive;

      // First update the user's status
      const updatedUser = await userService.updateUserStatus(userId, data);
      console.log("Status updated for user:", updatedUser);

      // Then fetch all users to get the latest data
      const response = await userService.getUsers();
      console.log("Fetched updated users after status change:", response);

      // Apply all pending status changes, including this one
      const updatedUsers = response.users.map((user) => {
        if (user.id in pendingStatusChanges) {
          return {
            ...user,
            status: pendingStatusChanges[user.id], // Apply the pending status change
          };
        }
        return user;
      });

      return {
        ...response,
        users: updatedUsers,
      };
    } catch (error) {
      console.error("Error updating user status:", error);
      // Remove the pending status change for this user
      delete pendingStatusChanges[userId];
      throw error;
    }
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

        // Apply any pending status changes to the newly fetched data
        const users = action.payload.users.map((user) => {
          if (user.id in pendingStatusChanges) {
            return {
              ...user,
              status: pendingStatusChanges[user.id],
            };
          }
          return user;
        });

        state.users = users;
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
        state.users = action.payload.users;
        state.total = action.payload.total;
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update user status";
      });
  },
});

export const { setSelectedUser, clearErrors } = usersSlice.actions;
export default usersSlice.reducer;
