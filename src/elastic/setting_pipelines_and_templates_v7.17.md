
# VERSION 7.17

- check that timestamp pipeline exists:
```elasticsearch
GET _ingest/pipeline/set_timestamp
```


- if not exists create new:
    - creating timestamp pipeline:
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
```

- check template existence
```elasticsearch
HEAD _template/transactions-flow-template
```

- creating index template:
```elasticsearch
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
```elasticsearch
PUT /transactions-flow/_settings
{
    "settings": {
        "default_pipeline": "set_timestamp"
    }
}
```


- creating data stream: (not sure if exist in version 7.2)
```elasticsearch
PUT /_data_stream/transactions-flow
```

- reindexing old data to new index using pipeline:
```elasticsearch
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

