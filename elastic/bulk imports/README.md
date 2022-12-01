
### Read settings
```sh
# getting settings
curl -XGET 'localhost:9203/_cluster/settings?pretty'

# include default setting
curl -XGET 'localhost:9203/_cluster/settings?include_defaults&pretty'

# export to file
curl -XGET 'localhost:9203/_cluster/settings?include_defaults&pretty' > out.json

# filter subpath
curl -XGET 'localhost:9203/_cluster/settings?include_defaults&filter_path=defaults.http&pretty'

# get some line 
curl -XGET 'localhost:9203/_cluster/settings?include_defaults&pretty' | grep max_content_length
```

### Update settings
```sh

curl -X PUT "localhost:9203/_cluster/settings?pretty" -H 'Content-Type: application/json' -d'
{
  "http" : {
    "max_content_length" : "100mb"
  }
}
'


```


### Bulk import:
```shell
# cut entries from 1 to 1000 and export to file
mkdir 19
jq -c '.[1:500000]' 19_.json > ./19/19-500_000.json
jq -c '.[500001:1000000]' 19_.json > ./19/19-1_000_000.json
jq -c '.[1000001:1500000]' 19_.json > ./19/19-1_500_000.json

mkdir 18
jq -c '.[1:500000]' 18_.json > ./18/18-500_000.json
jq -c '.[500001:1000000]' 18_.json > ./18/18-1_000_000.json
jq -c '.[1000001:1500000]' 18_.json > ./18/18-1_500_000.json

mkdir 17
jq -c '.[1:500000]' 17_.json > ./17/17-500_000.json
jq -c '.[500001:1000000]' 17_.json > ./17/17-1_000_000.json
jq -c '.[1000001:1500000]' 17_.json > ./17/18-1_500_000.json


# send each file to elastic:

cat 23+.json | \
 jq  -c '.[]  | {"index": {"_index": "transactions-flow"}}, .' | \
  curl -H 'Expect:' -H "Content-Type: application/json" --progress-bar --verbose -XPOST "127.0.0.1:9200/_bulk?filter_path=took,ingest_took,errors" --data-binary @-
```
