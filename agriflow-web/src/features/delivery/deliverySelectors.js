export const selectAllDeliveryGroups = (state) => state.delivery.groups;

export const selectDeliveryGroupById = (state) => state.delivery.selectedGroup;

export const selectDeliveryLoading = (state) => state.delivery.loading;

export const selectDeliveryError = (state) => state.delivery.error;

export const selectDeliverySuccess = (state) => state.delivery.success;

export const selectDeliveryFilters = (state) => state.delivery.filters;

export const selectDeliveryByStatus = (state, status) =>
    state.delivery.groups.filter((g) => g.status === status);

export const selectGroupedByZone = (state) => {
    const zones = {};
    state.delivery.groups.forEach((g) => {
        const zone = g.zone || "Unknown";
        if (!zones[zone]) zones[zone] = [];
        zones[zone].push(g);
    });
    return zones;
};
