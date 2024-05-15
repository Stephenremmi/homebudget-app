import { createStore } from 'redux';
import rootReducer from '../reducers/reducers';

const date = new Date();

const initialState = {
  transactions: {
    filter: {
      startDate: date, // Directly use 'date'
      endDate: new Date(),
    },
    transactions: [],
  },
  categories: [],
  typeCategories: {
    income: [],
    expense: []
  },
  isMobileScreen: window.innerWidth < 600,
  // Assuming 'email' is coming from a different source:
  email: '',
  goals: {  // Add the goals state
    data: [],
    loading: false,
    error: null,
  }, // Initialize with an empty string
};

export default createStore(
  rootReducer,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);