import { NodeSDK } from '@opentelemetry/sdk-node';
import {
  SimpleSpanProcessor,
  ConsoleSpanExporter,
} from '@opentelemetry/sdk-trace-node';
import { UndiciInstrumentation } from '@opentelemetry/instrumentation-undici';

const sdk = new NodeSDK({
  spanProcessors: [new SimpleSpanProcessor(new ConsoleSpanExporter())],
  instrumentations: [new UndiciInstrumentation()],
});
sdk.start();

import { request } from 'undici';

request('http://localhost:8080/rolldice').then((response) => {
  response.body.json().then((json: any) => console.log(json));
});