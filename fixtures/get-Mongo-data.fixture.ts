import { test as base,expect } from './mongo.fixture'
import { getDataFromMongo } from '../utils/getDateFromMongoCollection'


type ClaimData = {
  nino: string;    // Map NINO -> GUID - pass it the test for Get the record
  citizenId: string;
  status: string;   // Map citizenId -> claimantId and get the status : 'IN_PAYMENT' || 'CLOSED'
  jointClaim: boolean;  // Map citizenId -> claimantid , returns true ? false 
  paymentAmount?: number;
};



export const test = base.extend<{
  claimData: ClaimData[]
}>({
  claimData: async ({ db1, db2 }, use) => {
    const data = await getDataFromMongo(db1, db2)

    await use(data)
  }
})

export { expect };
