import { test as base,expect } from './mongo.fixture'
import { getDataFromMongo } from '../utils/getDateFromMongoCollection'


type ClaimData = {
  nino: string;
  citizenId: string;
  status: string;
  jointClaim: boolean;
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
