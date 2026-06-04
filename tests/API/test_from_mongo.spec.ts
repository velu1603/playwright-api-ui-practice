import { test, expect } from "../../fixtures/get-data.fixture"; // adjust path

test("validate claim data", async ({ claimData }) => {
  console.log(claimData);

  expect(claimData.length).toBeGreaterThan(0);
});


/* 
    What happens automatically: 

    mongo.fixture → provides db1, db2
        ↓
    get-data.fixture → uses db1, db2 → builds claimData
        ↓
    test → receives claimData (ready-to-use)

*/