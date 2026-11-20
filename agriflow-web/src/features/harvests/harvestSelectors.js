export const selectHarvests = (state) => state.harvests.harvests;

export const selectSelectedHarvest = (state) => state.harvests.selectedHarvest;

export const selectFarmerHarvests = (state) => state.harvests.farmerHarvests;

export const selectAdminHarvests = (state) => state.harvests.adminHarvests;

export const selectHarvestForecast = (state) => state.harvests.forecast;

export const selectHarvestOrders = (state) => state.harvests.orders;

export const selectHarvestLoading = (state) => state.harvests.loading;

export const selectHarvestError = (state) => state.harvests.error;

export const selectHarvestSuccess = (state) => state.harvests.successMessage;

export const selectHarvestPagination = (state) => state.harvests.pagination;

export const selectHarvestFilters = (state) => state.harvests.filters;
