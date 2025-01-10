export interface Vendor {
  id: string;
  name: string;
  location: string;
  certifications?: string[];
  rating?: number;
}

// Validate vendor data
export const checkVendorData = (vendor: Partial<Vendor>): string | null => {
  if (!vendor.name || !vendor.location) {
    return "Name and location are required.";
  }
  if (vendor.rating && (vendor.rating < 0 || vendor.rating > 5)) {
    return "Rating must be between 0 and 5.";
  }
  return null;
};
