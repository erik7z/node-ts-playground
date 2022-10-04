
### Create ILM Policy
> Sources:
>- [ILM (index lifecycle management)](https://www.elastic.co/guide/en/elasticsearch/reference/7.4/getting-started-index-lifecycle-management.html)
>- [Policies Rollover (using policies rollover)](https://www.elastic.co/guide/en/elasticsearch/reference/7.4/using-policies-rollover.html)
```shell
curl -X GET "localhost:9201/_ilm/policy/transactions_flow_policy?pretty"

curl -X PUT "localhost:9202/_ilm/policy/transactions_flow_policy?pretty" -H 'Content-Type: application/json' -d'
{
  "policy": {
    "phases": {
      "hot": {
        "actions": {
          "rollover": {
            "max_age": "1d"
          }
        }
      },
      "delete": {
        "min_age": "180d",
        "actions": {
          "delete": {}
        }
      }
    }
  }
}
'
```

### Create new index which will use ILM Policy:
> Sources:
> - [Rollover Failing](https://discuss.elastic.co/t/rollover-failing/153676)
> - [Date in index name doesn’t change on rollover on the next day](https://discuss.elastic.co/t/date-in-index-name-doesnt-change-on-rollover-on-the-next-day/226701/13)
> - [date math](https://www.elastic.co/guide/en/elasticsearch/reference/7.4/date-math-index-names.html)

```shell
curl -X PUT "localhost:9202/%3Ctransactions-flow-v1-%7Bnow%2Fd%7Byyyy-MM-dd%7D%7D-000001%3E?pretty" -H 'Content-Type: application/json' -d'
{
  "aliases": {
    "transactions-flow-v1-write": {
      "is_write_index": true
    }
  },
  "settings": {
    "index": {
      "lifecycle": {
        "name": "transactions_flow_policy",
        "rollover_alias": "transactions-flow-v1-write"
      }
    }
  }
}
'
```

### Update index template:
> Sources:
>- [Lifecycle Management with Templates](https://medium.com/@freiit/elasticsearch-index-lifecycle-management-ilm-from-ground-up-cf5e8d80d31d)
```shell
curl -XPUT 'http://localhost:9202/_template/transactions-flow-template-v1?pretty' -H 'Content-Type: application/json' -d '
{
    "index_patterns": [
      "transactions-flow-v1*"
    ],
    "aliases": {
      "transactions-flow": {}
    },
    "settings": {
      "index": {
        "default_pipeline": "add_date_and_save_to_daily_v1",
        "codec": "best_compression",
        "refresh_interval": "1s",
        "lifecycle": {
          "name": "transactions_flow_policy",
          "rollover_alias": "transactions-flow-v1-write"
        }
      },
      "sort": {
        "field": [
          "@timestamp"
        ],
        "order": [
          "desc"
        ]
      }
    },
    "mappings": {
      "properties": {
        "@timestamp": {
          "type": "date_nanos"
        },
        "stan": {
          "type": "keyword"
        },
        "card_id": {
          "type": "keyword"
        },
        "cata": {
          "type": "text",
          "fields": {
            "keyword": {
              "type": "keyword",
              "ignore_above": 256
            }
          }
        },
        "rrf": {
          "type": "keyword"
        },
        "sirius_agr_id": {
          "type": "keyword"
        },
        "transaction_type": {
          "type": "keyword"
        }
      }
    }
}
'

```


### Update ingest pipelines to write into new index:
> Sources
> - [Ingest node](https://www.elastic.co/guide/en/elasticsearch/reference/7.4/ingest.html)

```shell
curl -XPUT 'http://localhost:9202/_ingest/pipeline/reroute_to_write_alias?pretty' -H 'Content-Type: application/json' -d '
{
    "description": "changes destination (re-route all records to <transactions-flow-v1-write> alias/index",
    "processors": [
        {
              "set": {
                "field": "_index",
                "value": "<transactions-flow-v1-write>"
              }
        }
    ]
}
'

curl -XPUT 'http://localhost:9202/_ingest/pipeline/add_date_and_save_to_daily_v1?pretty' -H 'Content-Type: application/json' -d '
{
    "description": "adds date and saves to daily index",
    "processors": [
      {
        "pipeline": {
          "name": "set_timestamp"
        }
      },
      {
        "pipeline": {
          "name": "reroute_to_write_alias"
        }
      }
    ]
}
'

```


### Add test records to old and new alias and search for them and other old records:
```shell
curl -XPOST 'localhost:9201/transactions-flow/_doc' -H 'Content-Type: application/json' -d '
{
    "stan": "1111111111",
    "transaction_type": "TEST_TYPE",
    "rrf": "TEST_RRF",
    "cata": "TEST_CATA",
    "sirius_agr_id": "TEST_AGR_ID",
    "card_id": "TEST_CARD_ID"
}
'

curl -XPOST 'localhost:9201/transactions-flow-v1-write/_doc' -H 'Content-Type: application/json' -d '
{
    "stan": "2222222222",
    "transaction_type": "TEST_TYPE",
    "rrf": "TEST_RRF",
    "cata": "TEST_CATA",
    "sirius_agr_id": "TEST_AGR_ID",
    "card_id": "TEST_CARD_ID"
}
'

curl -XGET 'localhost:9202/transactions-flow/_search?pretty' -H 'Content-Type: application/json' -d ' { "query": { "term": { "stan": "1111111111" } } } '
curl -XGET 'localhost:9202/transactions-flow/_search?pretty' -H 'Content-Type: application/json' -d ' { "query": { "term": { "stan": "2222222222" } } } '
curl -XGET 'localhost:9202/transactions-flow/_search?pretty' -H 'Content-Type: application/json' -d ' { "query": { "term": { "stan": "017863845963" } } } '

```

- Check status:
```shell
# write index details
curl -X GET "localhost:9201/transactions-flow-v1-write?pretty"

# records in write index
curl -X GET "http://localhost:9202/transactions-flow-v1-write/_search?pretty=true&q=*:*&size=0"

# ILM status
curl -XGET 'http://localhost:9201/transactions-flow-v1-write/_ilm/explain?pretty'
```


### Other issues:
- [ilm-not-deleting-indices](https://stackoverflow.com/questions/59859306/elasticsearch-ilm-not-deleting-indices)
- 
