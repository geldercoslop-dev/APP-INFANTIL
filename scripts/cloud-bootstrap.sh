#!/usr/bin/env bash
set -euo pipefail

REQUIRED_NODE_MAJOR=20
REQUIRED_NODE_MINOR=19

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js não encontrado. Instale Node >= 20.19.0."
  exit 1
fi

CURRENT_NODE="$(node -p "process.versions.node")"

node -e "
const [maj, min] = process.versions.node.split('.').map(Number);
if (maj < ${REQUIRED_NODE_MAJOR} || (maj === ${REQUIRED_NODE_MAJOR} && min < ${REQUIRED_NODE_MINOR})) {
  console.error('Versão atual do Node (' + process.versions.node + ') é incompatível. Requer >= 20.19.0.');
  process.exit(1);
}
"

echo "Node OK: ${CURRENT_NODE}"
echo "Instalando dependências com cache local..."
npm ci --cache .npm-cache --prefer-offline --no-audit
echo "Ambiente cloud preparado com sucesso."
