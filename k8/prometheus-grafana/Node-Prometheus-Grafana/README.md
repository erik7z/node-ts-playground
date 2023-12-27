# Node-Prometheus-Grafana

## App start
```sh
# install dependencies
npm install

# run the app
npm start

# start grafana/prometheus
docker-compose up -d
```

## Configuration
- Check that app and prometheus are configured to use the same port for metrics (config/prometheus.yml)
- Check that app Node Exporter metrics available at http://localhost:8080/metrics
- Check the [Prometheus UI](http://localhost:9090) 
- Check the [Grafana UI](http://localhost:9000)
- Add Prometheus as a data source in Grafana, set up prometheus url to http://prometheus:9090 (docker name)
- Import the dashboard from https://grafana.com/grafana/dashboards/12230-node-js-dashboard/
- Import the dashboard from https://grafana.com/grafana/dashboards/11159-nodejs-application-dashboard/
