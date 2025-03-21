FROM otel/opentelemetry-collector-contrib:latest AS collector


FROM alpine:3.14 AS debug
RUN apk add --no-cache coreutils
COPY --from=collector /otelcol-contrib /otelcol-contrib

# Running locally
# ENV AWS_ACCESS_KEY_ID=""
# ENV AWS_SECRET_ACCESS_KEY=""
# ENV AWS_SESSION_TOKEN=""
# ENV AWS_REGION=us-east-1

COPY otelcol-config.yaml /etc/otelcol-config.yaml
ENV OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE=cumulative

EXPOSE 4317
EXPOSE 4318
EXPOSE 8889

CMD ["/otelcol-contrib",  "--config", "/etc/otelcol-config.yaml"]