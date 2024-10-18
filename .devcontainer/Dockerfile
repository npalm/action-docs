ARG VARIANT="20-bullseye"
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:1-${VARIANT}

# hadolint ignore=DL3008
RUN apt-get update && apt-get install bash-completion gnupg2 --no-install-recommends -y && rm -rf /var/lib/apt/lists/*

USER node
