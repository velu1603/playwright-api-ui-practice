/**
 * In my client project, we needed to validate API responses against data coming from 
 * multiple MongoDB collections — but Mongo doesn’t always support complex joins easily in tests.
 * 
 * 👉 So I built an in-memory join engine in TypeScript to simulate relational joins across collections
 * 
 * This works similar to SQL joins — but instead of querying the database multiple times, 
 * we preload collections into memory and join them efficiently using Maps.
 * 
 * The DBs are not physically connected. They are lined using IDs like citizenId , claimantId logically
 * 
 *  Source Data (Collection A)
        ↓ IDs
    Join with Collection B (Map lookup)
        ↓ IDs
    Join with Collection C
        ↓ IDs
    Final enriched test context
 * 
 * Instead of searching arrays (O(n)), we use Maps for O(1) lookups, making joins very efficient.
 * 
 * This utility allows us to simulate multi-collection joins in-memory, 
 * enabling efficient and realistic scenario-based API validation.
 * 
 * Instead of relying on MongoDB for joins, we extract data into memory and use a Map-based join strategy, 
 * which allows us to combine data across multiple databases and collections efficiently.
 * 
 *  Benefits : 
 *
 *       No multiple API calls 
 *       No DB query complexity 
 *       Test data is realistic 
 *       Supports scenario-driven validation 
 *       Very fast (in-memory) 
 * 
 * 
 * 
 * 
 */

type joinDefinition = {
  name: string;

  // extract key from source
  sourceKey: (source: any) => string;

  // prebuilt look up (O(1))
  map: Map<string, any>;

  // how to merge data
  project: (source: any, match: any) => any;

  // Wether this join is mandatory (filters data)
  required?: boolean;
};

export function buildMultiDbContext(
  sourceData: any[],
  joins: joinDefinition[],
) {
  return sourceData
    .map((source) => {
      let result = { ...source };

      for (const join of joins) {
        const key = join.sourceKey(source);
        const match = join.map.get(key);

        // enforce required join (INNER join behaviour)
        if (!match && join.required != false) {
          // If required data is missing, we drop the record
          return null;
        }

        // Allow optional join (LEFT JOIN behavious)
        const projected = join.project(source, match);

        result = {
          ...result,
          ...projected,
        };
      }
      return result;
    })
    .filter(Boolean);
}

/**
 *  usage
 *
 *
 * Data Sources:
 *   claims collection
 *   employment collection
 *   income calculation data
 * 
 * 
 * const result = buildMultiDbContext(claims, [
  {
    name: "employment",
    sourceKey: c => c.userId,
    map: employmentMap,
    project: (c, e) => ({
      employmentType: e?.type
    }),
    required: true
  },
  {
    name: "income",
    sourceKey: c => c.userId,
    map: incomeMap,
    project: (c, i) => ({
      calculatedIncome: i?.amount
    }),
    required: false
  }
])
 *
    Output : 

    [
  {
    userId: "123",
    declaredEmployment: "self-employed",
    employmentType: "self-employed",
    calculatedIncome: 45000
  }
]
 */

