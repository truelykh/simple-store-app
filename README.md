# Simple Store — DevOps Demo

A deliberately simple learning application:

- 5 independent Spring Boot microservices
- React + Vite frontend
- Nginx reverse proxy
- Docker
- Jenkins CI
- Nexus Maven + Docker repositories
- GitHub webhook for Push and Pull Request events
- GitOps repository
- Argo CD
- Kubernetes

The application has no database, broker, cache, authentication, or service mesh.

## Request flow

```text
Browser
  |
  v
Nginx
  |----> React frontend
  |
  +----> /api/users          -> user-service
  +----> /api/products       -> product-service
  +----> /api/orders         -> order-service
  +----> /api/payments       -> payment-service
  +----> /api/notifications  -> notification-service
```

## CI/CD

```text
Developer
   |
   v
GitHub
   | Push / Pull Request
   v
Webhook
   |
   v
Jenkins
   |
   +--> Maven test/package
   +--> Nexus Maven
   +--> Docker build
   +--> Trivy
   +--> Nexus Docker
   |
   v
GitOps repository
   |
   v
Argo CD
   |
   v
Kubernetes
```

## Versioning

Maven artifacts are immutable by CI build:

```text
Build #1 -> 1.0
Build #2 -> 1.1
Build #3 -> 1.2
Build #4 -> 1.3
```

Docker images use Jenkins build numbers:

```text
Build #1 -> :1
Build #2 -> :2
Build #3 -> :3
Build #4 -> :4
```

The Maven version and Docker tag are intentionally independent.

## Jenkins credentials

Create these Jenkins credentials:

```text
github-pat
nexus-credentials
```

Never put secrets in source code.

## Nexus

Expected internal endpoints:

```text
Maven:  http://nexus-svc.nexus.svc.cluster.local:8081
Docker: nexus-svc.nexus.svc.cluster.local:8082
```

## GitHub webhook

Enable:

- Push events
- Pull request events

Do not use SCM polling.

PR validation should test/build/scan but must not deploy.

A push to `main` publishes artifacts/images and updates the GitOps repository.

## Local backend test

```bash
cd user-service && mvn test
cd ../product-service && mvn test
cd ../order-service && mvn test
cd ../payment-service && mvn test
cd ../notification-service && mvn test
```

## Frontend

```bash
cd frontend
npm install
npm run build
```

The `simple-store-gitops` directory is intentionally included as a separate-repository starter. Move/push it to its own GitHub repository.
