# [UNDERSTANDING LATERAL JOINS IN POSTGRESQL](https://www.cybertec-postgresql.com/en/understanding-lateral-joins-in-postgresql/?gclid=CjwKCAiAp7GcBhA0EiwA9U0mtphaGvH1U2DbioTt495t878zi9UiyOqBWtxkQn8NVFogN6cTclh1ohoCdKIQAvD_BwE)

+ [FIDDLE](https://dbfiddle.uk/btGcOH30)


### Inspecting FROM more closely
Before we dive into LATERAL, it makes sense to sit back and think about SELECT and FROM clauses in SQL on a more philosophical level.

```postgresql
-- Here is an example:
SELECT whatever FROM tab;

```
Basically, we could see this statement as a loop. 
Writing this SQL statement in pseudo code would look somewhat like the following snippet:
```
for x in tab
loop
     “do whatever”
end loop
```
For each entry in the table, we do what the SELECT clause says.
Usually data is simply returned as it is. A SELECT statement can be seen as a loop.

But what if we need a “nested” loop? This is exactly what LATERAL is good for.


### LATERAL joins: Creating sample data

Imagine we have a line of products, and we’ve also got customer wishlists. 
The goal now is to find the best 3 products for each wishlist.

following SQL snippet creates some sample data:
```postgresql
CREATE TABLE t_product AS
    SELECT   id AS product_id,
             id * 10 * random() AS price,
             'product ' || id AS product
    FROM generate_series(1, 1000) AS id;


CREATE TABLE event  AS 
  SELECT id AS user_id,
         id * 10 * random() as event_id,
         random() as time,
         md5(random()::text) as data
         FROM generate_series(1,10) as id;
 
CREATE TABLE t_wishlist
(
    wishlist_id        int,
    username           text,
    desired_price      numeric
);
 
INSERT INTO t_wishlist VALUES
    (1, 'hans', '450'),
    (2, 'joe', '60'),
    (3, 'jane', '1500')
;
```
The product table is populated with 1000 products. 
The price is random, and we used a pretty creative name to name the products:

```postgresql
SELECT * FROM t_product LIMIT 10;
-- product_id | price              | product
-- ------------+--------------------+------------
--           1 | 6.756567642432323  | product 1
--           2 | 5.284467408540081  | product 2
--           3 | 28.284196164210904 | product 3
--           4 | 13.543868035690423 | product 4
--           5 | 30.576923884383156 | product 5
--           6 | 26.572431211361902 | product 6
--           7 | 64.84599396020204  | product 7
--           8 | 21.550701384168747 | product 8
--           9 | 28.995584553969174 | product 9
--          10 | 17.31335004787411  | product 10
-- (10 rows)


-- Next, we have a list of wishes.
SELECT * FROM t_wishlist;

-- wishlist_id | username | desired_price
-- -------------+----------+---------------
--            1 | hans     | 450
--            2 | joe      | 60
--            3 | jane     | 1500
-- (3 rows)

```

As you can see, the wishlist belongs to a user and there is a desired price for those three products we want to suggest.


### Running LATERAL joins
Suppose we wanted to find the top three products for every wish, in pseudo-code:
```
for x in wishlist
loop
      for y in products order by price desc
      loop
           found++
           if found <= 3
           then
               return row
           else
               jump to next wish
           end
      end loop
end loop
```
The important thing is that we need two loops.
First, we need to iterate through the list of wishes and then we take a look at the sorted list of products, 
pick 3 and move on to the next wishlist.

Let’s see how this can be done using a LATERAL-join:
```postgresql
SELECT        *
FROM      t_wishlist AS w,
    LATERAL  (SELECT      *
        FROM       t_product AS p
        WHERE       p.price < w.desired_price
        ORDER BY p.price DESC
        LIMIT 3
       ) AS x
ORDER BY wishlist_id, price DESC;
```
The first thing you see in the FROM clause is the t_wishlist table.
For each entry in the wishlist, we pick three products.
To figure out which products we need, we can make use of w.desired_price.

In other words: It is like a “join with parameters”.
The FROM-clause is the “outer loop” in our pseudo code and the LATERAL can be seen as the “inner loop”.

result:
```postgresql
-- wishlist_id | username | desired_price | product_id | price              | product
-- -------------+----------+---------------+------------+--------------------+-------------
--            1 | hans     | 450           | 708        | 447.0511375753179  | product 708
--            1 | hans     | 450           | 126        | 443.6560873146138  | product 126
--            1 | hans     | 450           | 655        | 438.0566432022443  | product 655
--            2 | joe      | 60            | 40         | 59.32252841190291  | product 40
--            2 | joe      | 60            | 19         | 59.2142714048882   | product 19
--            2 | joe      | 60            | 87         | 58.78014573804254  | product 87
--            3 | jane     | 1500          | 687        | 1495.8794483743645 | product 687
--            3 | jane     | 1500          | 297        | 1494.4586352980593 | product 297
--            3 | jane     | 1500          | 520        | 1490.7849437550085 | product 520
-- (9 rows)
```


PostgreSQL is doing a pretty good job optimizing LATERAL joins. In our case, the execution plan is going to look pretty straightforward:

```postgresql
explain SELECT    *
FROM    t_wishlist AS w,
        LATERAL (SELECT *
               FROM t_product AS p
               WHERE p.price < w.desired_price
               ORDER BY p.price DESC
               LIMIT 3
               ) AS x
ORDER BY wishlist_id, price DESC;

-- QUERY PLAN
-- ---------------------------------------------------------------------------------------
--  Sort (cost=23428.53..23434.90 rows=2550 width=91)
--    Sort Key: w.wishlist_id, p.price DESC
--    -> Nested Loop (cost=27.30..23284.24 rows=2550 width=91)
--       -> Seq Scan on t_wishlist w (cost=0.00..18.50 rows=850 width=68)
--       -> Limit (cost=27.30..27.31 rows=3 width=23)
--             -> Sort (cost=27.30..28.14 rows=333 width=23)
--                   Sort Key: p.price DESC
--                   -> Seq Scan on t_product p (cost=0.00..23.00 rows=333 width=23)
--                         Filter: (price < (w.desired_price)::double precision)
-- (9 rows)


```
LATERAL joins are extremely useful, and can be utilized in many cases to speed up operations, or to simply make code a lot easier to understand.
