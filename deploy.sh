#!/bin/bash
set -e

cd /trade-members-2

echo "========================================="
echo "  Deploy Padinho Invest - Mini Blue-Green"
echo "========================================="
echo ""

# 1. Git pull - check if there are changes
echo "[1/5] Verificando atualizações..."
git fetch origin main

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" = "$REMOTE" ]; then
  echo "Nenhuma atualização encontrada. Deploy não necessário."
  exit 0
fi

echo "Novas mudanças detectadas! Atualizando..."
git pull origin main
echo "OK - Código atualizado."
echo ""

# 2. Build new images (containers still running)
echo "[2/5] Buildando novas imagens (sistema ainda online)..."
docker compose build --no-cache backend frontend
echo "OK - Imagens prontas."
echo ""

# 3. Swap backend (frontend still serves)
echo "[3/5] Atualizando backend (frontend continua online)..."
docker compose up -d --no-deps backend
echo "Aguardando backend subir..."
sleep 3

for i in $(seq 1 10); do
  if curl -sf http://localhost:3334/health > /dev/null 2>&1; then
    echo "OK - Backend online."
    break
  fi
  if [ "$i" -eq 10 ]; then
    echo "AVISO: Backend demorou pra responder, mas container está rodando."
  fi
  sleep 2
done
echo ""

# 4. Run seed (create admin if not exists)
echo "[4/5] Executando seed (admin)..."
docker compose exec -T backend sh -c "npx prisma db seed" 2>/dev/null || echo "Seed já executado ou sem alterações."
echo ""

# 5. Swap frontend (backend already up)
echo "[5/5] Atualizando frontend (backend já está online)..."
docker compose up -d --no-deps frontend
echo "Aguardando frontend subir..."
sleep 5

for i in $(seq 1 10); do
  if curl -sf http://localhost:3001 > /dev/null 2>&1; then
    echo "OK - Frontend online."
    break
  fi
  if [ "$i" -eq 10 ]; then
    echo "AVISO: Frontend demorou pra responder, mas container está rodando."
  fi
  sleep 2
done

echo ""
echo "========================================="
echo "  Deploy concluído com sucesso!"
echo "========================================="
echo ""
docker compose ps
