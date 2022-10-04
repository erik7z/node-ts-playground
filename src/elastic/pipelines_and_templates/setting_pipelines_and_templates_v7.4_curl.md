
# VERSION 7.4

1. delete template 'transactions-flow-template'
```sh
curl -XDELETE 'http://localhost:9203/_template/transactions-flow-template-v1?pretty' -H 'Content-Type: application/json'
```

2. delete pipeline 'add_date_and_save_to_daily'
```sh
curl -XDELETE 'http://localhost:9203/_ingest/pipeline/add_date_and_save_to_daily?pretty'
```


3. delete pipeline 'save_to_daily'
```sh
curl -XDELETE 'http://localhost:9203/_ingest/pipeline/save_to_daily?pretty'
```


4.0 create new pipeline 'set_timestamp':
```sh
curl -XPUT 'http://localhost:9203/_ingest/pipeline/set_timestamp?pretty' -H 'Content-Type: application/json' -d '
{
    "description": "adds the timestamp when a document is indexed",
    "processors": [
        {
              "set": {
                "field": "@timestamp",
                "value": "{{_ingest.timestamp}}"
              }
        }
    ]
}
'
```

4. create new pipeline 'save_to_daily_v1':
```sh
curl -XPUT 'http://localhost:9202/_ingest/pipeline/save_to_daily_v1?pretty' -H 'Content-Type: application/json' -d '
{
    "description": "saves item to daily index",
    "processors": [
        {
            "date_index_name": {
                "field": "@timestamp",
                "index_name_prefix": "transactions-flow-v1-",
                "date_rounding": "d",
                "date_formats": [
                    "strict_date_optional_time",
                    "date_optional_time",
                    "strict_date_time_no_millis",
                    "date_time_no_millis",
                    "yyyy-MM-dd'\''T'\''HH:mm:ss.SSSXX",
                    "yyyy-MM-dd'\''T'\''HH:mm:ss.SSSSSS'\''Z'\''",
                    "yyyy-MM-dd'\''T'\''HH:mm:ss.SSSSSSSSS'\''Z'\''"
                ]
            }
        }
    ]
}
'
```


5. create pipeline 'add_date_and_save_to_daily_v1':
```sh
curl -XPUT 'http://localhost:9202/_ingest/pipeline/add_date_and_save_to_daily_v1?pretty' -H 'Content-Type: application/json' -d '
{
    "description": "adds date and saves item to daily index",
    "processors": [
      {
        "pipeline": {
          "name": "set_timestamp"
        }
      },
      {
        "pipeline": {
          "name": "save_to_daily_v1"
        }
      }
    ]
}
'
```

6. checking "transactions-flow-v0", "transactions-flow-v1*" indexes existence
```sh
curl 'localhost:9203/_cat/indices/transactions*?pretty'
```

6.1 delete transactions-flow-v1* indexes if exists
```sh
curl -XDELETE 'http://localhost:9203/transactions-flow-v1*?pretty'
```


7. reindex data from 'transactions' to 'transactions-flow-v0':
```sh
curl -XPOST 'http://localhost:9203/_reindex?pretty' -H 'Content-Type: application/json' -d '
{
    "source": {
      "index": "transactions"
    },
    "dest": {
      "index": "transactions-flow-v0",
      "op_type": "index"
    }
}
'
```

8. reindex data from 'transactions-flow' to 'transactions-flow-v0':
```sh
curl -XPOST 'http://localhost:9203/_reindex?pretty' -H 'Content-Type: application/json' -d '
{
    "source": {
      "index": "transactions-flow"
    },
    "dest": {
      "index": "transactions-flow-v0",
      "op_type": "index"
    }
}
'
```

9. reindex data from 'transactions-flow-2*' to 'transactions-flow-v0':
```sh
curl -XPOST 'http://localhost:9203/_reindex?pretty' -H 'Content-Type: application/json' -d '
{
    "source": {
      "index": "transactions-flow-2*"
    },
    "dest": {
      "index": "transactions-flow-v0",
      "op_type": "index"
    }
}
'
```


10. delete index 'transactions-flow':
```sh
curl -XDELETE 'http://localhost:9203/transactions-flow?pretty'
```


11. create template 'transactions-flow-template-v1':
```sh
curl -XPUT 'http://localhost:9203/_template/transactions-flow-template-v1?pretty' -H 'Content-Type: application/json' -d '
{
    "index_patterns": [
      "transactions-flow-v1*"
    ],
    "settings": {
      "index": {
        "default_pipeline": "add_date_and_save_to_daily_v1",
        "codec": "best_compression",
        "refresh_interval": "1s"
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
    },
    "aliases": {
      "transactions-flow": {
        "is_write_index": true
      }
    }
}
'
```



```sh
# 1. атомарно удаляем старый индекс и кидаем алиас на временный:
curl -XPOST localhost:9203/_aliases -H 'Content-Type: application/json' -d '
{
  "actions": [
    {
      "remove_index": {
        "index": "transactions-flow"
      }
    },
    {
      "add": {
        "index": "transactions-flow-v0",
        "alias": "transactions-flow"
      }
    }
  ]
}
'

# 2. из временного переливаем в основной
curl -XPOST 'http://localhost:9203/_reindex?pretty' -H 'Content-Type: application/json' -d '
{
    "source": {
      "index": "transactions-flow-v0"
    },
    "dest": {
      "index": "transactions-flow-v1",
      "op_type": "index"
    }
}
'

# watch reindex progress
curl -XGET 'localhost:9203/_tasks?actions=*reindex&detailed&timeout=10s&pretty' -H 'Content-Type: application/json'


# 3. атомарно удаляем алиас со временного и кидаем на новый 
curl -XPOST localhost:9203/_aliases -H 'Content-Type: application/json' -d '
{
  "actions": [
    {
      "remove": {
        "index": "transactions-flow-v0",
        "alias": "transactions-flow"
      }
    },
    {
      "add": {
        "index": "transactions-flow-v1*",
        "alias": "transactions-flow",
        "is_write_index": true
      }
    }
  ]
}
'

# 4. если все до этого успешно то удаляем временный индекс
curl -XDELETE 'http://localhost:9203/transactions-flow-v0?pretty'


# 5. ставим интервал обновления как раньше
curl -XPUT 'localhost:9203/transactions-flow*/_settings?pretty' -H 'Content-Type: application/json'  -d '{ "index" : { "refresh_interval" : "1s" } }'
```
