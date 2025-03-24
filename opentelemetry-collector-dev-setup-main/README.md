# OpenTelemetry Collector Demo

This repository contains very simple open telemetry setup.

Just run the following command in your command line to run all services provided here:

```shell
docker-compose up -d
```

That will expose the following backends:

- Jaeger at http://0.0.0.0:16686
- Zipkin at http://0.0.0.0:9411
- Prometheus at http://0.0.0.0:9090

Notes:

- It may take some time for the application metrics to appear on the Prometheus
  dashboard;

To clean up any docker container from the demo run `docker-compose down`.
