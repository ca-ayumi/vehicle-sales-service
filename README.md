# vehicle-sales-service

> Serviço responsável por **listagem e compra de veículos**, além de receber o **webhook de pagamento**.  
Mantém **banco de dados isolado** e se comunica **via HTTP** com o serviço principal (`dealership-core`).

---

## Visão Geral da Arquitetura
![Visão da Arquitetura.drawio.png](docs%2FVis%C3%A3o%20da%20Arquitetura.drawio.png)

## Fluxo Arquitetural
![Fluxo Arquitetural Completo.jpg](docs%2FFluxo%20Arquitetural%20Completo.jpg)

## Requisitos

- NodeJS >= 18
- npm
- Docker + docker-compose (opcional)
- PostgreSQL (via Docker ou local)

---

## Instalação

```bash
npm install
```

---

## Como executar

### Local

1) Configure `.env`

```bash
cp .env.example .env
```

Exemplo (`.env`):

```
DATABASE_URL=postgresql://sales:salespwd@localhost:5433/salesdb
CORE_BASE_URL=http://localhost:3002
```

2) Suba o banco

```
docker compose up -d db_sales
```

3) Execute migrations do Prisma:

```
npx prisma migrate dev
```

4) Inicie a aplicação

```
npm run start:dev
```

A API roda em:

```
http://localhost:3000
```

---


## ✅ Variáveis de ambiente

| Nome | Obrigatório | Exemplo                                           | Descrição |
|------|-------------|---------------------------------------------------|-----------|
| `DATABASE_URL` | ✅ | postgresql://sales:salespwd@db_sales:5432/salesdb | URL do banco |
| `CORE_BASE_URL` | ✅ | http://localhost:3002                             | Serviço principal |

---

##  Testes

Rodar testes unitários + integração:

```bash
npm run test
```

Com cobertura:

```bash
npm run test:cov  
```

Config exige ≥ **80%**:

```
branches: 80
functions: 80
lines: 80
statements: 80
```

---

## Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/vehicles/for-sale` | Lista veículos disponíveis |
| GET | `/vehicles/sold` | Lista veículos vendidos |
| POST | `/sales` | Cria venda |
| POST | `/payments/webhook` | Recebe confirmação/cancelamento de pagamento |

---

## Exemplos de cURL

### Listar veículos à venda
```bash
curl -X GET 'http://localhost:3000/vehicles/for-sale'
```

### Listar veículos vendidos
```bash
curl -X GET 'http://localhost:3000/vehicles/sold'
```

### Criar venda
```bash
curl -X POST 'http://localhost:3000/sales' \
  -H 'Content-Type: application/json' \
  -d '{"vehicleId":"<VEHICLE_ID>","buyerCpf":"12345678909"}'
```

Resposta:
```json
{
  "saleId": "...",
  "paymentCode": "PAY-...",
  "status": "PENDING"
}
```

### Webhook pagamento
✅ Confirmado
```bash
curl -X POST 'http://localhost:3000/payments/webhook' \
  -H 'Content-Type: application/json' \
  -d '{"paymentCode":"PAY-<SALE_ID>","status":"CONFIRMED"}'
```

❌ Cancelado
```bash
curl -X POST 'http://localhost:3000/payments/webhook' \
  -H 'Content-Type: application/json' \
  -d '{"paymentCode":"PAY-<SALE_ID>","status":"CANCELED"}'
```