import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Fetch matching universities for Panel 2
export const fetchMatchingUniversities = createAsyncThunk(
  'courseDiscovery/fetchMatchingUniversities',
  async ({ courseId, filters = {} }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ courseId });
      if (filters.specialization && filters.specialization !== 'All') {
        params.append('specialization', filters.specialization);
      }
      if (filters.state && filters.state !== 'All') {
        params.append('state', filters.state);
      }
      if (filters.city && filters.city !== 'All') {
        params.append('city', filters.city);
      }
      if (filters.universityType && filters.universityType !== 'All') {
        params.append('universityType', filters.universityType);
      }
      if (filters.admissionStatus && filters.admissionStatus !== 'All') {
        params.append('admissionStatus', filters.admissionStatus);
      }
      if (filters.sort) {
        params.append('sort', filters.sort);
      }
      if (filters.minFee) params.append('minFee', filters.minFee);
      if (filters.maxFee) params.append('maxFee', filters.maxFee);

      const res = await api.get(`/course-universities?${params.toString()}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch universities');
    }
  }
);

// Load persisted shortlists from localStorage
const savedShortlist = localStorage.getItem('capton_shortlist')
  ? JSON.parse(localStorage.getItem('capton_shortlist'))
  : [];

const savedComparison = localStorage.getItem('capton_comparison')
  ? JSON.parse(localStorage.getItem('capton_comparison'))
  : [];

const courseDiscoverySlice = createSlice({
  name: 'courseDiscovery',
  initialState: {
    // Panel 1 State
    selectedCategory: null,
    selectedLevel: 'All',
    selectedCourse: null,
    selectedSpecialization: 'All',
    searchQuery: '',

    // Panel 2 State
    matchingUniversities: [],
    loadingUniversities: false,
    universityFilters: {
      state: 'All',
      city: 'All',
      universityType: 'All',
      admissionStatus: 'All',
      sort: 'fee_low',
      minFee: '',
      maxFee: '',
    },

    // Panel 3 State
    shortlisted: savedShortlist, // list of courseUniversity objects
    compared: savedComparison, // up to 4 universities for comparison

    // Mobile wizard active step (1, 2, 3)
    mobileStep: 1,
  },
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSelectedLevel: (state, action) => {
      state.selectedLevel = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    selectCourse: (state, action) => {
      state.selectedCourse = action.payload;
      state.selectedSpecialization = 'All';
      // Reset university filters when switching courses
      state.universityFilters = {
        state: 'All',
        city: 'All',
        universityType: 'All',
        admissionStatus: 'All',
        sort: 'fee_low',
        minFee: '',
        maxFee: '',
      };
      state.mobileStep = 2; // on mobile automatically advance to Panel 2
    },
    setSelectedSpecialization: (state, action) => {
      state.selectedSpecialization = action.payload;
    },
    setUniversityFilters: (state, action) => {
      state.universityFilters = { ...state.universityFilters, ...action.payload };
    },
    resetUniversityFilters: (state) => {
      state.universityFilters = {
        state: 'All',
        city: 'All',
        universityType: 'All',
        admissionStatus: 'All',
        sort: 'fee_low',
        minFee: '',
        maxFee: '',
      };
    },
    setMobileStep: (state, action) => {
      state.mobileStep = action.payload;
    },

    // Shortlist actions
    addToShortlist: (state, action) => {
      const item = action.payload; // CourseUniversity object
      const exists = state.shortlisted.some((s) => s._id === item._id);
      if (!exists) {
        state.shortlisted.push(item);
        localStorage.setItem('capton_shortlist', JSON.stringify(state.shortlisted));
      }
    },
    removeFromShortlist: (state, action) => {
      state.shortlisted = state.shortlisted.filter((s) => s._id !== action.payload);
      localStorage.setItem('capton_shortlist', JSON.stringify(state.shortlisted));
    },
    clearShortlist: (state) => {
      state.shortlisted = [];
      localStorage.removeItem('capton_shortlist');
    },

    // Comparison actions (up to 4)
    toggleCompare: (state, action) => {
      const item = action.payload;
      const index = state.compared.findIndex((c) => c._id === item._id);
      if (index > -1) {
        state.compared.splice(index, 1);
      } else {
        if (state.compared.length < 4) {
          state.compared.push(item);
        }
      }
      localStorage.setItem('capton_comparison', JSON.stringify(state.compared));
    },
    removeFromCompare: (state, action) => {
      state.compared = state.compared.filter((c) => c._id !== action.payload);
      localStorage.setItem('capton_comparison', JSON.stringify(state.compared));
    },
    clearCompare: (state) => {
      state.compared = [];
      localStorage.removeItem('capton_comparison');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatchingUniversities.pending, (state) => {
        state.loadingUniversities = true;
      })
      .addCase(fetchMatchingUniversities.fulfilled, (state, action) => {
        state.loadingUniversities = false;
        state.matchingUniversities = action.payload;
      })
      .addCase(fetchMatchingUniversities.rejected, (state) => {
        state.loadingUniversities = false;
        state.matchingUniversities = [];
      });
  },
});

export const {
  setSelectedCategory,
  setSelectedLevel,
  setSearchQuery,
  selectCourse,
  setSelectedSpecialization,
  setUniversityFilters,
  resetUniversityFilters,
  setMobileStep,
  addToShortlist,
  removeFromShortlist,
  clearShortlist,
  toggleCompare,
  removeFromCompare,
  clearCompare,
} = courseDiscoverySlice.actions;

export default courseDiscoverySlice.reducer;
