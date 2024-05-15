export const selectName = state => state.name;
export const selectEmail = state => state.email;

export const selectTransactions = state => {
  const transactions = state.transactions.transactions;
  return transactions.sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });
};

export const selectExpenses = state => {
  const transactions = selectTransactions(state);
  return transactions.filter(e => e.type === "expense");
};

export const selectIncome = state => {
  const transactions = selectTransactions(state);
  return transactions.filter(e => e.type === "income");
};

export const selectCategories = state => state.categories;

export const selectFilterDates = state => {
  return state.transactions.filter;
};

const getUniqueData = (transactions) => {
  let counts = transactions.reduce((prev, curr) => {
    let count = prev.get(curr.category) || 0;
    prev.set(curr.category, curr.amount + count);
    return prev;
  }, new Map());

  return [...counts].map(([category, amount]) => {
    return {category, amount}
  })
};

export const selectUniqueExpenses = state => {
  const expenses = selectExpenses(state);
  return getUniqueData(expenses);
};

export const selectUniqueIncome = state => {
  const income = selectIncome(state);
  return getUniqueData(income);
};

export const selectIsMobileScreen = state => state.isMobileScreen;