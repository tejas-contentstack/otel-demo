# Node.js Kubernetes App with OpenTelemetry Auto-Instrumentation

This project is a simple Node.js application running in a Kubernetes cluster with OpenTelemetry auto-instrumentation enabled. It captures **traces, metrics** automatically.

---

## 🚀 **Setup & Run Locally**

### **1️⃣ Clone the Repository**
```bash
git clone <repo-url>
cd k8s-nodejs-app
```

### **2️⃣ Install Dependencies**
```bash
npm install
```

### **3️⃣ Run the App Locally**
```bash
OTEL_TRACES_EXPORTER=otlp \
OTEL_METRICS_EXPORTER=otlp \
OTEL_LOGS_EXPORTER=otlp \
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318 \
OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf \
OTEL_NODE_RESOURCE_DETECTORS=env,host,os \
OTEL_SERVICE_NAME=nodejs-app \
NODE_OPTIONS="--require @opentelemetry/auto-instrumentations-node/register" \
node server.js
```

Your app will be running on `http://localhost:3000`

---

## 🐳 **Build and Run with Docker**

### **1️⃣ Build the Docker Image**
```bash
docker build -t nodejs-app .
```

### **2️⃣ Run the Container**
```bash
docker run -p 3000:3000 nodejs-app
```

Now, visit `http://localhost:3000` to see the app running.

---

## 🏗 **Deploying to Kubernetes (Minikube)**

### **1️⃣ Start Minikube**
If Minikube is not running, start it:
```bash
minikube start
```

### **2️⃣ Load Your Local Docker Image into Minikube**
Since Minikube runs its own Docker daemon, it **does not automatically detect images** on your local machine. Load the image manually:
```bash
minikube image load nodejs-app
```

### **3️⃣ Deploy the App to Kubernetes**
Apply your Kubernetes configuration:
```bash
kubectl apply -f k8s-deployment.yaml
```

### **4️⃣ Verify the Pod Logs**
Check the logs to ensure your app is running inside the container:
```bash
kubectl logs -l app=nodejs-app
```

### **5️⃣ Access the App**
Since the service is exposed as `ClusterIP` (internal only), you need to use **port forwarding**:
```bash
kubectl port-forward service/nodejs-service 8080:80
```
Now, open [http://localhost:8080](http://localhost:8080/) in your browser.

---

## 📊 **OpenTelemetry Auto-Instrumentation**
This project uses **OpenTelemetry auto-instrumentation** to capture metrics, and traces without modifying source code.

### **Environment Variables (Defined in k8s-deployment.yaml)**
```yaml
- name: OTEL_TRACES_EXPORTER
  value: "otlp"
- name: OTEL_METRICS_EXPORTER
  value: "otlp"
- name: OTEL_LOGS_EXPORTER
  value: "otlp"
- name: OTEL_EXPORTER_OTLP_ENDPOINT
  value: "https://your-otel-collector-endpoint"
- name: OTEL_EXPORTER_OTLP_PROTOCOL
  value: "http/json"
- name: OTEL_NODE_RESOURCE_DETECTORS
  value: "env,host,os"
- name: OTEL_SERVICE_NAME
  value: "nodejs-app"
- name: NODE_OPTIONS
  value: "--require @opentelemetry/auto-instrumentations-node/register"
```

### **Verify OpenTelemetry Data in Logs**
```bash
kubectl logs -l app=nodejs-app
```

---

## ❌ **Shut Down Kubernetes (When Done)**

To stop Minikube and free up resources:
```bash
minikube stop
```

To completely delete the cluster (if needed):
```bash
minikube delete
```