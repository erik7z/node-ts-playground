
# VERSION 7.4

- check that timestamp pipeline exists:
```elasticsearch
GET _ingest/pipeline/set_timestamp
```

- create set_timestamp pipeline:
```elasticsearch
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
# DELETE _ingest/pipeline/set_timestamp
```

- create save_to_daily pipeline:
```elasticsearch
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

# DELETE _ingest/pipeline/save_to_daily
```

- create add_date_and_save_to_daily pipeline:
```elasticsearch
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

# DELETE _ingest/pipeline/add_date_and_save_to_daily
```

- check and create transactions-flow-template
```elasticsearch
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

#DELETE _template/transactions-flow-template
```

- reindex old data:
```elasticsearch
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

#DELETE /transactions-flow*
```

## Other useful commands:

```elasticsearch
# settings
GET /transactions-flow/_settings

# mapping
GET /transactions-flow/_mapping

# create alias
PUT transactions-flow
{
    "aliases": {
        "transactions-flow": {
            "is_write_index": true
        }
    }
}

# add document to index
POST transactions-flow/_doc
{
    "stan": "999999999",
    "transaction_type": "FX",
    "rrf": "027795182134",
    "cata": "PUMB ONLINE            0442907290     UA",
    "sirius_agr_id": "212",
    "card_id": "015844443598"
}

# search in index
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
```

- setup index rollover policies:
```elasticsearch
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


# rollover index
#POST transactions-flow/_rollover

#DELETE _ilm/policy/transactions_flow_policy
```

