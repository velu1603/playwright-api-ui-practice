import { buildMultiDbContext } from "./getMultiMongoDbContext";

export async function getDataFromMongo(db1: any, db2: any, db3?: any) {
  /*1. Fetch from db1 */
  const citizenData = await db1
    .collection("personData")
    .find({
      nino: { $exists: true, $ne: null },
      "_id.citizenId ": { $exists: true },
    })
    .project({
      nino: 1,
      citizenId: "$_id.citizenId",
    })
    .toArray();

  if (!citizenData.length) {
    throw new Error("No claimants found");
  }

  /*2. Fetch data from db2  */
  const claims = await db2.collection("claims").find({}).toArray();

  /* Build Claim map (O(1)) */
  const claimMap = new Map<string, any>();

  for (const claim of claims) {
    for (const cl of claim.claimants || []) {
      const key = cl.claimId?.toString();
      if (key) {
        claimMap.set(key, claim); // e.g. claimMap.set(claimantId,claim) => fast lookup : O(1)
      }
    }
  }

  /* Optional : DB3 */

  let paymentMap = new Map<string, any>();
  if (db3) {
    const payments = await db3.collection("payments").find().toArray();

    for (const payment of payments) {
      const key = payment.citizenId ?.toString();
      if (key) {
        paymentMap.set(key, payment);
      }
    }
  }

  /*  Build final context*/
  // what it does conceptually
  /*
        citizenData from Db1 -> Join with DB2 (claims) -> join with payments (optional) -> return final dataset
        
    */
  const results = buildMultiDbContext(citizenData, [
    // ✅ Required: DB2 join b2
    {
      name: "db2",
      required: true,
      sourceKey: (c) => c.citizenId ?.toString(),
      map: claimMap,

      project: (c, claim) => ({
        nino: c.nino.trim().toUpperCase(),
        citizenId: c.citizenId ,
        status: claim.status?.toUpperCase(),
        jointClaim: claim.jointClaim ?? false,
      }),
      // Final object becomes,
      /* 
            nino: 'ABC123',
            citizenId: '12345',
            status:'IN_PAYMENT' or 'CLOSED'
            jointClaim: true
        */
    },
    // OPTIONAL: payments join
    ...(paymentMap.size > 0
      ? [
          {
            name: "payments",
            required: false, // optional enrichment
            sourceKey: (c: any) => c.citizenId ?.toString(),
            map: paymentMap,
            project: (_c: any, payment: any) => ({
              paymentAmount: payment?.amount,
            }),
          },
        ]
      : []),
  ]);

  if (!results.length) {
    throw new Error("No collection found");
  }

  return results;
}
