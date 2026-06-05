import { test, expect } from "../../fixtures/get-Mongo-data.fixture"; // adjust path

test("validate claim data", async ({ claimData }) => {
  console.log(claimData);

  expect(claimData.length).toBeGreaterThan(0);
});


/* 
    We connect to multiple MongoDB databases and inject them into the test—just like we inject the API client.

    What happens automatically: 

    mongo.fixture → provides db1, db2
        ↓
    get-Mongo-data.fixture → uses db1, db2 → builds claimData
        ↓
    test → receives claimData (ready-to-use)

*/