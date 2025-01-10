import {
  getProcurements,
  addProcurement,
} from "../src/services/procurementService";
import { ProcurementStatus } from "../src/models/ProcurementStatus";
import { Pool } from "pg";

// Mock the pg module
jest.mock("pg", () => {
  const mockQuery = jest.fn();
  const mockPool = {
    query: mockQuery,
  };
  return { Pool: jest.fn(() => mockPool), mockQuery };
});

describe("Procurement Service", () => {
  const { mockQuery } = jest.requireMock("pg");

  beforeEach(() => {
    mockQuery.mockReset(); // Reset mock calls before each test
  });

  test("should retrieve all procurements", async () => {
    mockQuery.mockResolvedValue({
      rows: [
        {
          id: 1,
          title: "Request A",
          description: "Need 100 units",
          items: [],
          status: "open",
        },
      ],
    });

    const procurements = await getProcurements();
    expect(procurements).toEqual([
      {
        id: 1,
        title: "Request A",
        description: "Need 100 units",
        items: [],
        status: "open",
      },
    ]);
    expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM procurements");
  });

  test("should add a new procurement", async () => {
    const newProcurement = {
      title: "Request B",
      description: "Need 50 units",
      items: [{ itemName: "Item Y", quantity: 50 }],
      status: ProcurementStatus.OPEN, // Use one of the allowed status values
      createdAt: new Date(),
    };

    mockQuery.mockResolvedValue({
      rows: [{ id: 2, ...newProcurement }],
    });

    const addedProcurement = await addProcurement(newProcurement);
    expect(addedProcurement).toEqual({ id: 2, ...newProcurement });
    expect(mockQuery).toHaveBeenCalledWith(
      "INSERT INTO procurements (title, description, items, status, createdAt) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        "Request B",
        "Need 50 units",
        JSON.stringify([{ itemName: "Item Y", quantity: 50 }]),
        "open",
        expect.any(Date),
      ]
    );
  });
});
