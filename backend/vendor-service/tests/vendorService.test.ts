import { getVendors, addVendor } from "../src/services/vendorService";
import { Pool } from "pg";

// Mock pg and its Pool
jest.mock("pg", () => {
  const mockQuery = jest.fn();
  const mockPool = {
    query: mockQuery,
  };
  return { Pool: jest.fn(() => mockPool), mockQuery };
});

describe("Vendor Service", () => {
  const { mockQuery } = jest.requireMock("pg");

  beforeEach(() => {
    mockQuery.mockReset(); // Reset mock calls and implementation before each test
  });

  test("should retrieve all vendors", async () => {
    mockQuery.mockResolvedValue({
      rows: [{ id: 1, name: "Vendor A", location: "New York" }],
    });

    const vendors = await getVendors();
    expect(vendors).toEqual([
      { id: 1, name: "Vendor A", location: "New York" },
    ]);
    expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM vendors");
  });

  test("should add a new vendor", async () => {
    const newVendor = {
      name: "Vendor B",
      location: "Los Angeles",
      certifications: [],
      rating: 4.0,
    };
    mockQuery.mockResolvedValue({ rows: [newVendor] });

    const addedVendor = await addVendor(newVendor);
    expect(addedVendor).toEqual(newVendor);
    expect(mockQuery).toHaveBeenCalledWith(
      "INSERT INTO vendors (name, location, certifications, rating) VALUES ($1, $2, $3, $4) RETURNING *",
      ["Vendor B", "Los Angeles", [], 4.0]
    );
  });
});
