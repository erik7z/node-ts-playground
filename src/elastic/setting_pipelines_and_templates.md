
- check that timestamp pipeline exists:
```
GET _ingest/pipeline/set_timestamp
```


- if not exists create new:
    - creating timestamp pipeline:
```
PUT _ingest/pipeline/set_timestamp
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
```



- check template existence
```
HEAD _template/transactions-flow-template
```

- creating index template:
```
PUT /_index_template/transactions-flow-template
{
  "index_patterns": [ "transactions-flow*" ],
  "default_pipeline": "set_timestamp",
  "data_stream": { },
  "priority": 500,
  "template": {
    "mappings": {
      "properties": {
        "@timestamp": {
          "type": "date_nanos"
        },
        "stan": {
          "type": "keyword"
        },
        "cata": {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
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
    "settings": {
      "sort.field": [ "@timestamp"],
      "sort.order": [ "desc"]
    }
  }
}
```

- adding default pipeline to transactions-flow index

```
PUT /transactions-flow/_settings
{
  "settings": {
    "default_pipeline": "set_timestamp"
  }
}

```


- creating data stream: (not sure if exist in version 7.2)
```
PUT /_data_stream/transactions-flow

```



- reindexing old data to new index using pipeline:
```
POST _reindex
{
  "source": {
    "index": "transactions"
  },
  "dest": {
    "index": "transactions-flow",
    "pipeline": "set_timestamp",
    "op_type": "create"
  }
}

```





################## NOT COMMENTED:


GET _ingest/pipeline/set_timestamp


PUT _ingest/pipeline/set_timestamp
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

#PUT _ingest/pipeline/set_date
#{
#  "description": "adds the date when a document is indexed",
#  "processors": [
#    {
#      "date": {
#        "field": "@timestamp",
#        "target_field" : "@date",
#        "formats" : ["yyyy-MM-dd'T'HH:mm:ss.SSSXXX"],
#        "output_format" : "yyyy_MM_dd"
#      }
#    }
#  ]
#}
#DELETE _ingest/pipeline/set_date


PUT _ingest/pipeline/save_to_daily
{
"description": "saves item to daily index",
"processors": [
{
"date_index_name": {
"field": "@timestamp",
"index_name_prefix": "transactions-flow-",
"date_rounding": "d",
"date_formats": [
"yyyy-MM-dd'T'HH:mm:ss.SSSXX",
"yyyy-MM-dd'T'HH:mm:ss.SSSSSS'Z'",
"yyyy-MM-dd'T'HH:mm:ss.SSSSSSSSS'Z'"
]
}
}
]
}

DELETE _ingest/pipeline/save_to_daily


PUT _ingest/pipeline/add_date_and_save_to_daily
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
"name": "save_to_daily"
}
}
]
}


DELETE _ingest/pipeline/add_date_and_save_to_daily

#GET _ilm/policy/transactions_flow_policy
#
#PUT _ilm/policy/transactions_flow_policy
#{
#  "policy": {
#    "phases": {
#      "hot": {
#        "actions": {
#          "rollover": {
#            "max_age": "30s"
#          },
#          "set_priority": {
#            "priority": 100
#          }
#        }
#      }
#    }
#  }
#}

#GET transactions-flow-*/_ilm/explain

#DELETE _ilm/policy/transactions_flow_policy


GET _template/transactions-flow-template

PUT _template/transactions-flow-template
{
"index_patterns": [
"transactions-flow*"
],
"settings": {
"index": {
"default_pipeline": "add_date_and_save_to_daily",
"codec": "best_compression",
"refresh_interval": "30s"
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
"transactions-flow": {}
}
}

DELETE _template/transactions-flow-template


GET /transactions-flow/_settings

POST _reindex
{
"source": {
"index": "transactions"
},
"dest": {
"index": "transactions-flow",
"op_type": "create"
}
}

GET /transactions-flow/_mapping


DELETE /transactions-flow*


PUT transactions-flow
{
"aliases": {
"transactions-flow": {
"is_write_index": true
}
}
}


POST transactions-flow/_doc
{
"stan": "999999999",
"transaction_type": "FX",
"rrf": "027795182134",
"cata": "PUMB ONLINE            0442907290     UA",
"sirius_agr_id": "212",
"card_id": "015844443598"
}


GET /transactions-flow/_search
{
"from": 0,
"size": 20,
"query": {
"term": {
"stan": "018072551268"
}
}
}

POST transactions-flow/_rollover


GET /transactions-flow/_ilm/explain


