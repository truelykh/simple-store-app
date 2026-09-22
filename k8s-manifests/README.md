# simple-store-gitops

This directory is intended to become a separate GitHub GitOps repository.

Jenkins updates image tags in this repository.

Argo CD watches this repository and synchronizes Kubernetes.

Application Jenkins pipelines must not run `kubectl apply`.
