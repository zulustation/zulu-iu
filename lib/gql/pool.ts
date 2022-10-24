import { gql, GraphQLClient } from "graphql-request";

const baseAssetQuery = gql`
  query BaseAsset($poolId: Int) {
    pools(where: { poolId_eq: $poolId }) {
      baseAsset
    }
  }
`;

export const getBaseAsset = async (client: GraphQLClient, poolId: number) => {
  const response = await client.request<{
    pools: {
      baseAsset: string;
    }[];
  }>(baseAssetQuery, { poolId });

  return response.pools[0]?.baseAsset;
};