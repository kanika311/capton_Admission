import { createSlice } from '@reduxjs/toolkit';

const enquiryModalSlice = createSlice({
  name: 'enquiryModal',
  initialState: {
    isOpen: false,
    prefillCourse: null,
    prefillUniversity: null,
    prefillSpecialization: '',
  },
  reducers: {
    openEnquiryModal: (state, action) => {
      state.isOpen = true;
      if (action.payload) {
        state.prefillCourse = action.payload.course || null;
        state.prefillUniversity = action.payload.university || null;
        state.prefillSpecialization = action.payload.specialization || '';
      }
    },
    closeEnquiryModal: (state) => {
      state.isOpen = false;
      state.prefillCourse = null;
      state.prefillUniversity = null;
      state.prefillSpecialization = '';
    },
  },
});

export const { openEnquiryModal, closeEnquiryModal } = enquiryModalSlice.actions;
export default enquiryModalSlice.reducer;
