[ИСПОЛЬЗОВАНИЕ ELASTICSEARCH](https://losst.ru/ispolzovanie-elasticsearch#1_%D0%9F%D1%80%D0%BE%D1%81%D0%BC%D0%BE%D1%82%D1%80_%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D0%B8_Elasticsearch)


> health check
curl -XGET http://localhost:9200


```
Общий синтаксис использования глобальных команд такой:

curl 'localhost:9200/_команда/имя?параметр1&параметр2'

_команда - обычно начинается с подчеркивания и указывает основное действие, которое надо сделать;
имя - параметр команды, указывает, над чем нужно выполнить действие, или уточняет, что надо делать;
параметр1 - дополнительные параметры, которые влияют на отображение, форматирование, точность вывода и так далее;
```


>  СПИСОК ИНДЕКСОВ ELASTICSEARCH
```sh
curl 'localhost:9200/_cat/indices?v&pretty'

```


> запись данных
```sh
curl -XPUT 'http://localhost:9200/app/data?pretty' -H 'Content-Type: application/json'  -d  '
{
"name":"Ivan",
"age" :"18",
"degree" : "90",
}'
```

> ИНФОРМАЦИЯ ОБ ИНДЕКСЕ
``` sh
curl 'localhost:9200/_mapping?pretty' # глобально

curl 'localhost:9200/app/_mapping?pretty' # только для индекса app

curl 'localhost:9200/app/data/_mapping?pretty' # для типа data индекса app
```

> ИНФОРМАЦИЯ О ПОЛЕ И МУЛЬТИПОЛЯ

```json
"age" : {
   "type" : "text",
       "fields" : {
          "keyword" : {
             "type" : "keyword",
            "ignore_above" : 256
         }
    }
}
```
- type - указывает тип поля
- fields задаёт подполя или мультиполя.
- keyword - содержит неизмененный вариант текста.

> УДАЛЕНИЕ ИНДЕКСА

```sh
curl -XDELETE 'http://localhost:9200/app?pretty'
```

> РУЧНОЕ СОЗДАНИЕ ИНДЕКСА
Программа создала для цифр текстовые поля, к ним применяется анализ текста и индексация, а это потребляет дополнительные ресурсы и память. Поэтому лучше создавать индекс вручную.

```sh
curl -XPUT 'http://localhost:9200/app?pretty ' -H 'Content-Type: application/json' -d '
{
  "mappings" : {
    "data" : {
      "properties" : {
        "age" : {
          "type" : "integer"
        },
        "degree" : {
          "type" : "integer"
        },
        "name" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
            "type" : "keyword",
            "ignore_above" : 256
            }
          }
        }
      }
    }
  }
}'
```

> МАССОВАЯ ИНДЕКСАЦИЯ ДАННЫХ

- bulk
```sh
curl -H 'Content-Type: application/x-ndjson' -XPOST 'localhost:9200/shakespeare/doc/_bulk?pretty' --data-binary @shakespeare_6.0.json
```

> ПОИСК ПО ИНДЕКСУ

```sh (default 10 results)
curl -XGET 'http://localhost:9200/shakespeare/doc/_search?pretty'

```

- Самый простой пример поиска - передать поисковый запрос в параметре q. При этом поиск Elasticsearch будет выполняться во всех полях индекса

```sh
curl -XGET 'http://localhost:9200/shakespeare/doc/_search?q=EDGAR&pretty '

```
>> В Elasticsearch существует несколько типов поиска

- term - точное совпадение искомой строки со строкой в индексе или термом;
- match - все слова должны входить в строку, в любом порядке;
- match_phrase - вся фраза должна входить в строку;
- query_string - все слова входят в строку в любом порядке, можно искать - по нескольким полям, используя регулярные выражения;

```sh
curl -XGET 'http://localhost:9200/shakespeare/doc/_search?pretty ' -H 'Content-Type: application/json' -d '
{
  "query" : {
    "term" : {
      "speaker.keyword" : "EDGAR"
    }
  }
}'
```

> ОПЕРАТОРЫ AND И OR ДЛЯ ПОИСКА




### OTHER COMMANDS:

- watch reindex progress
```shell
curl -XGET 'localhost:9203/_tasks?actions=*reindex&detailed&timeout=10s&pretty' -H 'Content-Type: application/json'

```

```shell
curl -X POST "localhost:9203/transactions-flow/_close?pretty"
curl -X POST "localhost:9203/transactions-flow/_open?pretty"

curl -XPUT localhost:9203/transactions-flow/_settings -H 'Content-Type: application/json' -d '
        {
          "settings": {
            "index.blocks.write": "true"
          }
        }
        '
        
curl -XPOST localhost:9203/transactions-flow/_clone/transactions-flow-banana -H 'Content-Type: application/json' -d '
        {
          "settings": {
            "index.blocks.write": null
          }
        }
        '

curl -XDELETE 'http://localhost:9203/transactions-flow?pretty'

curl -XDELETE 'http://localhost:9203/_template/transactions-flow-template-v1?pretty' -H 'Content-Type: application/json'

curl -X DELETE "localhost:9203/transactions-flow/_alias/transactions-flow?pretty"

curl -XGET 'localhost:9203/_tasks?actions=*reindex&detailed&timeout=10s&pretty' -H 'Content-Type: application/json'

curl -X POST "localhost:9203/_tasks/[АЙДИ ОПЕРАЦИИ]/_cancel?pretty"


curl -XPUT 'localhost:9203/transactions-flow*/_settings?pretty' -H 'Content-Type: application/json'  -d '{ "index" : { "refresh_interval" : "1s" } }'

curl -XGET 'localhost:9203/transactions-flow*/_settings?pretty' -H 'Content-Type: application/json' 

```
