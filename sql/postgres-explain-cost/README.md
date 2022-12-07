# [Understanding the Postgres EXPLAIN cost](https://scalegrid.io/blog/postgres-explain-cost/)


Example output of explain: 
```
QUERY PLAN                                                   |
-------------------------------------------------------------+
Aggregate  (cost=19.50..19.51 rows=1 width=8)                |
->  Seq Scan on users  (cost=0.00..17.00 rows=1000 width=0)|
```

**cost** - startup const 
**..** - total coast
**rows** - number of output rows
**width** - avgrow size (bytes)
> all above units are just expectations

### What unit are the costs in?

The costs are in an **arbitrary unit**. 
A common misunderstanding is that they are in milliseconds or some other unit of time, but that’s not the case.

The cost units are anchored (by default) to:
- single sequential page read: **seq_page_cost** (defaults to 1.0 unit)
- Each row processed read: **cpu_tuple_cost** (0.01 unit)
- **cpu_operator_cost** (0.0025 unit)
- sequential page read: **random_page_cost** (4.0 unit)

There are many more constants like this, all of which are configurable.

### Startup Costs

The first numbers you see after cost= are known as the **“startup cost”**. 
This is an estimate of how long it will take to fetch the first row. 
As such, the startup cost of an operation includes the cost of its children.


For a sequential scan, the startup cost will generally be close to zero, as it can start fetching rows straight away. 
For a sort operation, it will be higher because a large proportion of the work needs to be done before rows can start being returned.


```postgresql
-- To look at an example, let’s create a simple test table with 1000 usernames:

CREATE TABLE users (
	                   id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	                   username text NOT NULL);
INSERT INTO users (username)
SELECT 'person' || n
FROM generate_series(1, 1000) AS n;
ANALYZE users;


-- Let’s take a look at a simple query plan, with a couple of operations:
EXPLAIN SELECT * FROM users ORDER BY username;

```
which gives us result:
```
QUERY PLAN                                                    |
--------------------------------------------------------------+
Sort  (cost=66.83..69.33 rows=1000 width=17)                  |
  Sort Key: username                                          |
  ->  Seq Scan on users  (cost=0.00..17.00 rows=1000 width=17)|

```
In the above query plan, as expected, the estimated statement execution cost for the Seq Scan is 0.00, and for the Sort is 66.83.


### Total costs
The second cost statistic, after the startup cost and the two dots, is known as the **“total cost”**.
This is an estimate of how long it will take to return **all the rows**.

- Let’s look at that example query plan again:
```                                                   |
--------------------------------------------------------------+
Sort  (cost=66.83..69.33 rows=1000 width=17)                  |
  Sort Key: username                                          |
  ->  Seq Scan on users  (cost=0.00..17.00 rows=1000 width=17)
```
We can see that the total cost of the Seq Scan operation is 17.00.
For the Sort operation is 69.33, which is not much more than its startup cost (as expected).

> Total costs usually include the cost of the operations preceding them. 
> For example, the total cost of the Sort operation above includes that of the Seq Scan.

An important exception is LIMIT clauses, which the planner uses to estimate whether it can abort early.

```postgresql
-- For example:
EXPLAIN SELECT * FROM users LIMIT 1;
```
```
QUERY PLAN                                                    |
--------------------------------------------------------------+
Limit  (cost=0.00..0.02 rows=1 width=17)                      |
  ->  Seq Scan on users  (cost=0.00..17.00 rows=1000 width=17)|
```
As you can see, the total cost reported on the Seq Scan node is still 17.00, but the full cost of the Limit operation is reported to be 0.02. 
This is because the planner expects that it will only have to process 1 row out of 1000, so the cost, in this case, is estimated to be 1000th of the total.



### How the costs are calculated

In order to calculate these costs, the Postgres query planner uses both constants and metadata about the contents of the database. 
The metadata is often referred to as “statistics”.

Statistics are gathered via **ANALYZE** and stored in pg_statistic. They are also refreshed automatically as part of autovacuum.

These statistics include a number of very useful things, like roughly the number of rows each table has, and what the most common values in each column are.

```postgresql
-- Let’s look at a simple example, using the same query data as before:

EXPLAIN SELECT count(*) FROM users;
```
```
QUERY PLAN                                                   |
-------------------------------------------------------------+
Aggregate  (cost=19.50..19.51 rows=1 width=8)                |
->  Seq Scan on users  (cost=0.00..17.00 rows=1000 width=0)|
```
In our case, the planner’s statistics suggested the data for the table was stored within 7 pages (or blocks), and that 1000 rows would be returned.

The cost parameters seq_page_cost, cpu_tuple_cost, and cpu_operator_cost were left at their defaults of 1, 0.01, and 0.0025 respectively.

As such, the **Seq Scan** total cost was calculated as:
```
Total cost of Seq Scan
= (estimated sequential page reads * seq_page_cost) + (estimated rows returned * cpu_tuple_cost)
= (7 * 1) + (1000 * 0.01)
= 7 + 10.00
= 17.00
```

And for the **Aggregate** as:
```
Total cost of Aggregate
= (cost of Seq Scan) + (estimated rows processed * cpu_operator_cost) + (estimated rows returned * cpu_tuple_cost)
= (17.00) + (1000 * 0.0025) + (1 * 0.01)
= 17.00 + 2.50 + 0.01
= 19.51
```

### How the planner uses the costs

Since we know Postgres will pick the query plan with the lowest total cost, we can use that to try to understand the choices it has made. 
For example, if a query is not using an index that you expect it to, you can use settings like enable_seqscan to massively discourage certain query plan choices.


### Using EXPLAIN ANALYZE to get a query plan
When you write SQL statements in PostgreSQL, the **ANALYZE** command is key to optimizing queries, making them faster and more efficient.


In addition to displaying the query plan and PostgreSQL estimates, the **EXPLAIN ANALYZE** option performs the query 
(be careful with UPDATE and DELETE!), and shows the actual execution time and row count number for each step in the execution process. 
This is necessary for monitoring SQL performance.

You can use EXPLAIN ANALYZE to compare the estimated number of rows with the actual rows returned by each operation.

Let’s look at an example, using the same data again:
```postgresql
EXPLAIN ANALYZE SELECT * FROM users ORDER BY username;
```
```
QUERY PLAN                                                                                                 |
-----------------------------------------------------------------------------------------------------------+
Sort  (cost=66.83..69.33 rows=1000 width=17) (actual time=20.569..20.684 rows=1000 loops=1)                |
  Sort Key: username                                                                                       |
  Sort Method: quicksort  Memory: 102kB                                                                    |
  ->  Seq Scan on users  (cost=0.00..17.00 rows=1000 width=17) (actual time=0.048..0.596 rows=1000 loops=1)|
Planning Time: 0.171 ms                                                                                    |
Execution Time: 20.793 ms 
```
We can see that the total execution cost is still 69.33, with the majority of that being the Sort operation, and 17.00 coming from the Sequential Scan. 
Note that the query execution time is just under 21ms.


#### Sequential scan vs. Index Scan
Now, let’s add an index to try to avoid that costly sort of the entire table:

```postgresql
CREATE INDEX people_username_idx ON users (username);


EXPLAIN ANALYZE SELECT * FROM users ORDER BY username;
```
```
QUERY PLAN                                                                                                                       |
---------------------------------------------------------------------------------------------------------------------------------+
Index Scan using people_username_idx on users  (cost=0.28..28.27 rows=1000 width=17) (actual time=0.052..1.494 rows=1000 loops=1)|
Planning Time: 0.186 ms                                                                                                          |
Execution Time: 1.686 ms
```

As you can see, the query planner has now chosen an Index Scan, since the total cost of that plan is 28.27 (lower than 69.33). 
It looks that the index scan was more efficient than the sequential scan, as the query execution time is now just under 2ms.


### Helping the planner estimate more accurately
We can help the planner estimate more accurately in two ways:
1. Help it gather better statistics
2. Tune the constants it uses for the calculations

The statistics can be especially bad after a big change to the data in a table. 
As such, when loading a lot of data into a table, you can help Postgres out by running a manual **ANALYZE** on it.


## Conclusion
- the costs in query plans are Postgres’ estimates for how long an SQL query will take, in an arbitrary unit.
- It picks the plan with the lowest overall cost, based on some configurable constants and some statistics it has gathered.
- Helping it estimate these costs more accurately is very important to help it make good choices, and keep your queries performant.




## Type of scans:
- Sequential scan
- Index scan
- Index only scan
- Bitmap Heap scan

### Sequential scan
- quite slow scan
what is it:
- Most basic/common scan
- Postgres literally iterates through table, a row at a time and return the rows requested.

why its used:
- always possible
- when reading data from disk, reading data sequentially is often faster than reading data in a random order.

## Index scan
what is it:
- Postgres can make use of an index scan in order to read only the portion of the table that is relevant to the query.
azsawsz
why its used:
- Usually if only a small portion of the table is returned by the query, and index scan can be a preffered method.
- Usually when people talok of indexes, they are referring to B-tree indexes which makes it much faster to quickly locate specific
  rows using child nodes and range filters/equality filters.

# Index only scan
what is it:
- like index scans, except they get all their column information from the index

why its used:
- negating the need to go back to the table to fetch the row data, resulting in a performance increase.


# Bitmap index scan
what is it:
- combines indexes
- uses 1st index to locate rows that satisfies 1st filter, then the next to satisfy 2nd filter and so on

why its used:
-  great flexibility as it can use multiple indexes

# Bitmap Heap scan
what is it:
- combines indexes
- uses 1st index to locate rows that satisfies 1st filter, then the next to satisfy 2nd filter and so on

why its used:
-  great flexibility as it can use multiple indexes
