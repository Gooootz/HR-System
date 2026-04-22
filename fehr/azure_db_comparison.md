# Azure Cosmos DB vs Azure Table Storage for College Institution's Accounting System

## Azure Cosmos DB

- **Scalability**: Handles large volumes of data and high throughput.
- **Global Distribution**: Provides low latency access across multiple regions.
- **Multi-Model Support**: Supports document, key-value, graph, and column-family data models.
- **Consistency Levels**: Offers five consistency levels to balance performance and data accuracy.
- **Advanced Querying**: Supports complex queries, transactions, and joins.

## Azure Table Storage

- **Cost-Effective**: More affordable for simple key-value storage scenarios.
- **Simplicity**: Easy to set up and use for straightforward data storage needs.
- **Scalability**: Can handle large amounts of data, but with fewer advanced features.

## Use Cases

- **Azure Cosmos DB**: Ideal for comprehensive accounting systems with advanced querying, global access, and high scalability needs.
- **Azure Table Storage**: Suitable for simpler accounting systems with straightforward data storage needs and budget constraints.

## Azure Cosmos DB Free Tier and Sandbox Usage

- **Free Tier**: Provides 400 RU/s and 5 GB of storage per month for free.
- **Usage Limits**: No charges if usage stays within these limits.
- **Multiple Accounts**: Limited to one account per Azure subscription.
- **Sandbox Environment**: Occasionally offered for learning and experimentation, often free for a limited time.
- **Exceeding Limits**: Charges apply if usage exceeds free tier limits.
- **Check Terms**: Always review specific terms and conditions to understand potential charges.

## Request Units per Second (RU/s)

- **Definition**: RU/s is a measure of throughput in Azure Cosmos DB, representing the amount of resources required to perform database operations.
- **Unified Measure**: Abstracts the underlying system resources (CPU, IOPS, and memory) consumed by different operations.
- **Provisioning**: Allows provisioning of the required RU/s for predictable performance and cost.
- **Consumption**: Each operation consumes a certain number of RUs based on its complexity and size.
  - **Read Operation**: A simple read operation might consume 1 RU.
  - **Write Operation**: A write operation might consume 5 RUs.
  - **Query Operation**: A complex query might consume 50 RUs.

## Global Distribution Across All Regions

- **Global Distribution**: Azure Cosmos DB allows data replication across multiple Azure regions worldwide.
- **Multi-Region Writes**: Supports writing data to any region with automatic replication to other regions.
- **Automatic Failover**: Ensures continuous availability by automatically failing over to another region in case of an outage.
- **Consistency Levels**: Offers five consistency levels to balance performance and data consistency across regions.
  - **Primary Region**: Example - "East US."
  - **Secondary Regions**: Example - "West Europe" and "Southeast Asia."
  - **Low Latency**: Provides low-latency access for users in different regions.

## Azure Regions

- **Geographic Distribution**: Physical locations around the world where Microsoft has data centers.
- **Redundancy and Resilience**: Provide redundancy and resilience by allowing data and applications to be replicated across multiple locations.
- **Compliance and Data Residency**: Help meet compliance and data residency requirements by allowing data to be stored in specific geographic locations.
- **Scalability**: Enable scalable cloud services by providing additional capacity and resources as needed.
  - **Primary Region**: Example - "East US."
  - **Secondary Region**: Example - "West Europe."

## Use of Regions in Azure

- **Low Latency**: Deploy resources in regions close to your users to reduce latency and improve performance.
- **High Availability**: Ensure high availability by replicating data and services across multiple regions.
- **Disaster Recovery**: Support disaster recovery strategies with geographically dispersed locations for data replication and failover.
- **Compliance and Data Residency**: Meet regulatory and compliance requirements by storing data in specific geographic locations.
- **Scalability**: Provide additional capacity and resources to scale applications as needed.
  - **Primary Region**: Example - "East US."
  - **Secondary Region**: Example - "West Europe."

## Single Region Deployment

### Azure Cosmos DB

- **Single Region**: Can be deployed in a single region, simplifying setup and reducing costs.
- **High Availability**: Provides high availability within the chosen region.
- **Consistency Levels**: Choose from five consistency levels to balance performance and data accuracy.
- **Advanced Features**: Retains advanced features such as complex querying, multi-model support, and automatic indexing.

### Azure Table Storage

- **Single Region**: Can be deployed in a single region, making it cost-effective for simple key-value storage.
- **High Availability**: Provides high availability within the chosen region.
- **Simplicity**: Easy to set up and use for straightforward data storage needs.

### Use Cases for Single Region

- **Azure Cosmos DB**: Suitable for advanced features, complex queries, and high throughput within a single region.
- **Azure Table Storage**: Suitable for cost-effective, simple key-value storage within a single region.

## Throughput

- **Definition**: Throughput refers to the amount of data processed or the number of operations performed in a given period of time.
- **Operations per Second**: Measured by the number of read, write, or query operations a system can handle per second.
- **Data per Second**: Measured by the amount of data (e.g., bytes, megabytes) processed per second.
- **Performance Indicator**: Higher throughput indicates better performance and the ability to handle more concurrent operations or larger volumes of data.
  - **Database Throughput**: Example - A database handling 1,000 read operations per second has a throughput of 1,000 reads per second.
  - **Network Throughput**: Example - A network transferring 100 megabytes of data per second has a throughput of 100 MB/s.

## Cost Considerations

### Azure Cosmos DB

- **Advanced Features**: Offers advanced querying, multi-model support, global distribution, and multiple consistency levels.
- **High Throughput**: Provides high throughput with predictable performance.
- **Cost**: Higher cost due to the advanced features and capabilities.

### Azure Table Storage

- **Cost-Effective**: More affordable for simple key-value storage scenarios.
- **Simplicity**: Easy to set up and use for straightforward data storage needs.
- **Limited Features**: Does not offer the same advanced features as Cosmos DB.

## Cost Comparison: MongoDB API vs SQL (Core) API

### Pricing Factors

- **Provisioned Throughput (RU/s)**: Cost is determined by the amount of provisioned throughput and storage, regardless of the API used.
- **Storage**: The amount of data stored affects the cost.
- **Operations**: The complexity and frequency of operations (reads, writes, queries) impact the required throughput and cost.

### API-Specific Considerations

- **MongoDB API**: Suitable for applications already using MongoDB, simplifying migration and integration, potentially saving development time and costs.
- **SQL (Core) API**: Suitable for applications designed to use SQL-like queries and requiring advanced querying capabilities.

## SQL-Like Capabilities

### Azure Table Storage

- **Query Mechanism**: Uses the OData protocol for basic queries.
- **Limitations**: Limited querying capabilities compared to SQL databases. Supports simple filters and projections but does not support joins, complex queries, or transactions.

### Azure Cosmos DB

- **SQL API**: Supports SQL-like querying with the SQL API.
- **Advanced Querying**: Allows complex queries, joins, and transactions.
- **Multi-Model Support**: Supports multiple data models, including document, key-value, graph, and column-family.

## Insert Query Examples

### Azure Cosmos DB (SQL API)

To insert a document into a Cosmos DB container using the SQL API:

```sql
CREATE c
{
  "id": "1",
  "name": "John Doe",
  "department": "Accounting",
  "amount": 1000,
  "date": "2023-10-01"
}
```

To insert a document into a Cosmos DB container using the SQL API, you need to use the SDK. Here is an example using the Azure Cosmos DB SDK for JavaScript:

```javascript
const { CosmosClient } = require("@azure/cosmos");

const endpoint = "<your-cosmos-db-endpoint>";
const key = "<your-cosmos-db-key>";
const databaseId = "<your-database-id>";
const containerId = "<your-container-id>";

const client = new CosmosClient({ endpoint, key });

async function createItem() {
  const { database } = await client.databases.createIfNotExists({
    id: databaseId,
  });
  const { container } = await database.containers.createIfNotExists({
    id: containerId,
  });

  const item = {
    id: "1",
    name: "John Doe",
    department: "Accounting",
    amount: 1000,
    date: "2023-10-01",
  };

  const { resource: createdItem } = await container.items.create(item);
  console.log(`Created item with id: ${createdItem.id}`);
}

createItem().catch((err) => {
  console.error(err);
});
```

### Azure Table Storage

To insert an entity into an Azure Table Storage table using the Azure SDK for JavaScript:

```javascript
const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");

const account = "<account-name>";
const accountKey = "<account-key>";
const tableName = "<table-name>";

const credential = new AzureNamedKeyCredential(account, accountKey);
const client = new TableClient(
  `https://${account}.table.core.windows.net`,
  tableName,
  credential
);

const entity = {
  partitionKey: "Accounting",
  rowKey: "1",
  name: "John Doe",
  amount: 1000,
  date: "2023-10-01",
};

await client.createEntity(entity);
```

## Summary

- **Azure Cosmos DB**: Choose for advanced features, complex queries, and global distribution.
- **Azure Table Storage**: Choose for cost-effective, simple key-value storage needs.
