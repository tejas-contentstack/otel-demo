// import { NodeSDK } from '@opentelemetry/sdk-node';
// import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
// import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
// import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
// import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';

// import {
//   PeriodicExportingMetricReader,
//   ConsoleMetricExporter,
// } from '@opentelemetry/sdk-metrics';

// // const metricExporter = new OTLPMetricExporter();
// const metricExporter = new OTLPMetricExporter({
//   url: 'http://otel-collector:4317', // Collector is inside Docker network
// });

// const sdk = new NodeSDK({
  
//   traceExporter: new ZipkinExporter(),
//   metricReader: new PeriodicExportingMetricReader({
//     // exporter: new ConsoleMetricExporter(),
//     exporter: metricExporter,
//   }),
//   serviceName: 'nodejs-express-app',
  
//   // logsExporter: new ConsoleSpanExporter(),
//   instrumentations: [getNodeAutoInstrumentations()],
// });

// sdk.start();



import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc'; // ✅ Use gRPC instead of HTTP
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc'; // ✅ Use OTLP Trace Exporter
import { PeriodicExportingMetricReader, ConsoleMetricExporter, MeterProvider } from '@opentelemetry/sdk-metrics';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
import { Resource } from '@opentelemetry/resources/build/src/Resource';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

// Define a resource with service name

// ✅ Use OTLP gRPC Metric Exporter
// const metricExporter = new OTLPMetricExporter({
//   url: 'http://localhost:4317', // gRPC endpoint
// });

// ✅ Use OTLP gRPC Trace Exporter (for better compatibility with OTEL Collector)
const traceExporter = new OTLPTraceExporter({
  url: 'http://localhost:4317', // gRPC endpoint
});

let meterProvider;
let meter;
let requestDurationGauge;

const metricExporter = new OTLPMetricExporter({ url: `localhost:4317/v1/metrics` });
    const metricReader = new PeriodicExportingMetricReader({ exporter: metricExporter });
    meterProvider = new MeterProvider({ readers: [metricReader] });
    meter = meterProvider.getMeter('HTTP_METER_NAME');
    requestDurationGauge = meter.createObservableGauge('REQ_DURATION_METRIC', {
      description: 'Duration of HTTP requests',
    });

// Create the SDK instance
const sdk = new NodeSDK({
//   resource: {
//   [SemanticResourceAttributes.SERVICE_NAME]: 'nodejs-express-app',
// },
  traceExporter, 
  metricReader: new PeriodicExportingMetricReader({
    exporter: metricExporter,
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

// ✅ Start SDK
sdk.start()

// ✅ Graceful shutdown on process exit
process.on('SIGTERM', async () => {
  await sdk.shutdown();
  console.log('🛑 OpenTelemetry SDK shut down successfully');
  process.exit(0);
});
