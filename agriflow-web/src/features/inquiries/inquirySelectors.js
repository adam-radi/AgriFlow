export const selectInquiries = (state) => state.inquiries?.inquiries || [];
export const selectCurrentInquiry = (state) => state.inquiries?.currentInquiry || null;
export const selectInquiryLoading = (state) => state.inquiries?.loading || false;
export const selectInquiryActionLoading = (state) => state.inquiries?.actionLoading || false;
export const selectInquiryError = (state) => state.inquiries?.error || null;
export const selectInquirySuccessMessage = (state) => state.inquiries?.successMessage || null;
