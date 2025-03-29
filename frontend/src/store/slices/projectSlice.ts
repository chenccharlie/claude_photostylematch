import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../index';

// Types
interface Photo {
  id: string;
  type: 'reference' | 'target';
  originalFilename: string;
  storagePath: string;
  format: string;
  size: number;
  width?: number;
  height?: number;
}

interface Style {
  id: string;
  name?: string;
  description?: string;
  llmAnalysisText?: string;
  confirmedByUser: boolean;
  parameterAdjustments: Record<string, any>;
}

interface Edit {
  id: string;
  photoId: string;
  styleId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  originalPhotoUrl?: string;
  editedPhotoUrl?: string;
  parametersApplied?: Record<string, any>;
  completedAt?: string;
  errorMessage?: string;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'processing' | 'completed' | 'failed';
  photos: Photo[];
  styles: Style[];
  edits: Edit[];
}

interface ProjectState {
  currentProject: Project | null;
  projectList: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  currentProject: null,
  projectList: [],
  loading: false,
  error: null,
};

// Async thunks
export const createProject = createAsyncThunk(
  'project/createProject',
  async (projectData: { name: string; description?: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/projects`,
        projectData,
        {
          headers: {
            Authorization: `Bearer ${state.auth.token}`,
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create project');
    }
  }
);

export const fetchProjects = createAsyncThunk(
  'project/fetchProjects',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
        },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects');
    }
  }
);

export const fetchProjectDetails = createAsyncThunk(
  'project/fetchProjectDetails',
  async (projectId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
        },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch project details');
    }
  }
);

// Slice
const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    clearCurrentProject(state) {
      state.currentProject = null;
    },
    setPhotoUploadProgress(state, action: PayloadAction<{ photoId: string; progress: number }>) {
      // Implement if needed for UI feedback
    },
  },
  extraReducers: (builder) => {
    // Create project
    builder.addCase(createProject.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createProject.fulfilled, (state, action) => {
      state.loading = false;
      state.currentProject = action.payload;
      state.projectList.push(action.payload);
    });
    builder.addCase(createProject.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch projects
    builder.addCase(fetchProjects.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProjects.fulfilled, (state, action) => {
      state.loading = false;
      state.projectList = action.payload;
    });
    builder.addCase(fetchProjects.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch project details
    builder.addCase(fetchProjectDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProjectDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.currentProject = action.payload;
    });
    builder.addCase(fetchProjectDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearCurrentProject, setPhotoUploadProgress } = projectSlice.actions;

export default projectSlice.reducer;
