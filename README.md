# Simple Store — DevOps Learning Project

A lightweight, clean DevOps learning and demonstration application showcasing a complete modern CI/CD, GitOps, and Kubernetes deployment architecture.

```text
Browser / Client
      ↓
┌───────────┐
│   Nginx   │ (Reverse Proxy Gateway)
└─────┬─────┘
      ├──────────────────────┬──────────────────────┬──────────────────────┬──────────────────────┐
      ↓                      ↓                      ↓                      ↓                      ↓
┌───────────┐          ┌───────────┐          ┌───────────┐          ┌───────────┐          ┌───────────────┐
│   React   │          │   User    │          │  Product  │          │   Order   │          │  Notification │
│ Frontend  │          │  Service  │          │  Service  │          │  Service  │          │    Service    │
└───────────┘          └───────────┘          └───────────┘          └───────────┘          └───────────────┘
```

---

## Architecture Overview

1. **Backend Microservices (5 Spring Boot Apps - Java 21, Spring Boot 3.5+, Maven)**:
   - `user-service`: `GET /api/users`
   - `product-service`: `GET /api/products`
   - `order-service`: `GET /api/orders`, `POST /api/orders`
   - `payment-service`: `GET /api/payments`, `POST /api/payments`
   - `notification-service`: `GET /api/notifications`, `POST /api/notifications`
   - All services include Actuator `/actuator/health` for Kubernetes probes.

2. **React Frontend (React 18 + Vite)**:
   - Interactive tab dashboard to view and test all microservice APIs.

3. **Nginx Proxy**:
   - Single entry point routing `/` to Frontend and `/api/*` to backend microservices.

---

## Directory Structure

```text
simple-store-app/
├── user-service/                # Spring Boot user microservice
│   ├── src/
│   ├── pom.xml
│   ├── Dockerfile
│   └── README.md
├── product-service/             # Spring Boot product microservice
├── order-service/               # Spring Boot order microservice
├── payment-service/             # Spring Boot payment microservice
├── notification-service/        # Spring Boot notification microservice
├── frontend/                    # ReactJS Vite application
│   ├── src/
│   ├── package.json
│   ├── Dockerfile
│   ├── nginx.conf
│   └── README.md
├── nginx/                       # Standalone Nginx reverse proxy
│   ├── nginx.conf
│   └── README.md
├── jenkins-cicd/                # Microservice Jenkinsfiles
│   ├── Jenkinsfile-user-service
│   ├── Jenkinsfile-product-service
│   ├── Jenkinsfile-order-service
│   ├── Jenkinsfile-payment-service
│   ├── Jenkinsfile-notification-service
│   └── Jenkinsfile-frontend
├── simple-store-gitops/         # GitOps Kubernetes manifests & Argo CD app
│   ├── namespace.yaml
│   ├── user-service/
│   ├── product-service/
│   ├── order-service/
│   ├── payment-service/
│   ├── notification-service/
│   ├── frontend/
│   ├── nginx/
│   └── argocd/
├── Jenkinsfile                  # Root orchestration Jenkinsfile
└── README.md
```

---

## End-to-End DevOps & GitOps Flow

```text
 Developer          GitHub Webhook           Jenkins Pipeline                  Nexus Repository
───────────         ──────────────          ──────────────────                ──────────────────
 git push     ───►  Push/PR Event  ───►  1. Checkout                      
                                         2. Unit Tests (mvn test)          
                                         3. Maven Package                 ───►  Publish JAR (1.x)
                                         4. Docker Build                  
                                         5. Trivy Security Scan           
                                         6. Docker Push                   ───►  Push Image (:BUILD_NUM)
                                         7. Update GitOps Manifest
                                                   │
                                                   ▼
 Kubernetes Cluster                          GitOps Repo                         Argo CD
────────────────────                        ─────────────                       ─────────
 App Pods (ClusterIP) ◄── Sync Deployment ◄──  git push   ◄── Git Commit ◄─────── Jenkins
 Nginx (NodePort)
```

---

## Key Configurations

### 1. Maven Versioning & Docker Image Tagging
- **Maven**: Version auto-increments per build (`1.${BUILD_NUMBER - 1}`):
  - Build #1 ➔ `1.0`
  - Build #2 ➔ `1.1`
  - Build #3 ➔ `1.2`
- **Docker**: Tagged with numeric `BUILD_NUMBER`:
  - `nexus-svc.nexus.svc.cluster.local:8082/truelykh/user-service:${BUILD_NUMBER}`

### 2. Jenkins Credentials
- `nexus-credentials`: Username & Password for Nexus Maven & Docker Registries.
- `github-pat`: GitHub Personal Access Token for SCM operations & pushing to `simple-store-gitops`.

### 3. GitHub Webhook Setup
- **Events**: `Push` and `Pull request` events.
- **Pull Request Pipeline**: Runs checkout, unit tests, build/package, Docker build, and Trivy scan. Does **NOT** push to Nexus or update GitOps.
- **Main Branch Pipeline**: Executes full pipeline, pushes artifacts to Nexus, and updates GitOps repository manifests.

### 4. Argo CD & Rollback Strategy
- Argo CD monitors `simple-store-gitops` with `automated sync`, `prune`, and `selfHeal`.
- **Rollback**: To roll back an application version, revert the commit in `simple-store-gitops` or change the image tag in `deployment.yaml`. Argo CD will automatically sync the desired version to Kubernetes.

---

## Local Verification Commands

```bash
# Test all microservices
cd user-service && mvn test
cd ../product-service && mvn test
cd ../order-service && mvn test
cd ../payment-service && mvn test
cd ../notification-service && mvn test

# Build React Frontend
cd ../frontend && npm install && npm run build
```
