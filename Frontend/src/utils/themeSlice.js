import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem('theme');
  return stored === 'dark' ? 'dark' : 'light';
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: getInitialTheme() },
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === 'dark' ? 'light' : 'dark';
    },
    setTheme(state, action) {
      state.mode = action.payload === 'dark' ? 'dark' : 'light';
    }
  }
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
