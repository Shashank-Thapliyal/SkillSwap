import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  discoverTab: 'skills',
  selectedSkillToLearn: null,
  conversationTab : "chat",
  isConnectionModalOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setDiscoverTab: (state, action) => {
      state.discoverTab = action.payload;
    },
    setSelectedSkillToLearn: (state, action) => {
      state.selectedSkillToLearn = action.payload;
    },
    resetDiscoverUI: (state, action) => {
      state.discoverTab = 'skills';
      state.selectedSkillToLearn = null;
    },
    showConnectionModal : (state, action) => {
       state.isConnectionModalOpen = action.payload;
    },
    setConversationTab : (state, action) => {
      state.conversationTab = action.payload
    },
    resetConversationTab : (state, action)=>{
      state.conversationTab = 'chat'
    }
  },
});

export const { setDiscoverTab, setSelectedSkillToLearn, resetDiscoverUI, showConnectionModal,setConversationTab , resetConversationTab } = uiSlice.actions;
export default uiSlice.reducer;
