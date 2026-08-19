MVP **simples, barato e preparado para crescer**, sem colocar a chave do Google Maps no HTML.
A solução pode ser:

                    ┌──────────────────────┐

                    │      HTML + JS       │

                    │                      │

                    │ Digita CEP           │

                    │       │              │

                    └───────┼──────────────┘

                            │

                            ▼

                    ┌──────────────────────┐

                    │   API Node.js        │

                    │   na VPS Hostinger   │

                    │                      │

                    │ GET /api/lojas?cep=  │

                    └──────────┬───────────┘

                               │

                 ┌─────────────┴─────────────┐

                 │                           │

                 ▼                           ▼

        ┌────────────────┐          ┌─────────────────┐

        │ API de CEP     │          │ Banco de lojas  │

        │                │          │                 │

        │ CEP → lat/lng  │          │ lat/lng já      │

        └───────┬────────┘          │ geolocalizados  │

                │                   └────────┬────────┘

                │                            │

                └────────────┬───────────────┘

                             ▼

                    candidatos próximos

                             │

                             ▼

                    Google Routes API

                             │

                             ▼

                    distância / tempo

                             │

                             ▼

                       JSON resposta

                             │

                             ▼

                    HTML + JavaScript

A **Geocoding API** é adequada para transformar endereço em latitude/longitude e também fornece o `Place ID`.
Para calcular a distância/tempo de deslocamento, eu usaria a **Routes API**, especificamente `Compute Route Matrix`, em vez da antiga Distance Matrix API. A API atual permite calcular distância e tempo entre múltiplas origens e destinos.

1. Stack do MVP
---------------

Eu usaria:

| Componente | Tecnologia |
| --- | --- |
| Front-end | HTML5 + CSS + JavaScript |
| Backend | Node.js |
| Framework HTTP | Express |
| Banco | SQLite |
| ORM/query | melhor manter simples inicialmente |
| Geolocalização | Google Geocoding API |
| Distância/tempo | Google Routes API |
| Navegação | Google Maps URL |
| Servidor | VPS Hostinger |
| Process manager | PM2 |
| Web server | Nginx |
| HTTPS | Let's Encrypt |
| Logs | PM2 + aplicação |

**SQLite é suficiente para esse MVP.** Temos inicialmente 21 estabelecimentos. Não existe motivo para colocar PostgreSQL/MySQL logo de início.

* * *

2. O ponto mais importante: geolocalização dos estabelecimentos
===============================================================

Eu criaria uma rotina administrativa:

fonte.json

     │

     ▼

importação

     │

     ▼

endereço completo

     │

     ▼

Google Geocoding API

     │

     ├── latitude

     ├── longitude

     ├── place_id

     └── endereço normalizado

     │

     ▼

banco

Então o registro armazenado ficaria mais ou menos assim:

{

  "codigo": 163,

  "apelido": "Buritis",

  "endereco": {

    "logradouro": "R. Henrique Badaró Portugal",

    "numero": "410",

    "bairro": "Buritis",

    "cidade": "Belo Horizonte",

    "uf": "MG",

    "cep": "30575-232"

  },

  "geolocalizacao": {

    "latitude": -19.965123,

    "longitude": -44.012345,

    "place_id": "ChIJ..."

  },

  "logo": {

    "url": "/logos/163.png"

  },

  "ativo": true

}

Depois disso, **não precisamos geocodificar novamente a cada consulta**.

* * *

3. E quando entrar uma nova loja?
=================================

Esse ponto que você mencionou é importante.
Eu faria a importação com este comportamento:

Novo estabelecimento

       │

       ▼

Existe latitude/longitude?

       │

    ┌──┴───┐

   SIM     NÃO

    │       │

    │       ▼

    │   Geocodificar

    │       │

    │       ▼

    │   validar resultado

    │       │

    └───┬───┘

        ▼

      salvar

Ou seja, o arquivo fonte pode continuar tendo apenas:

{

  "codigo": 500,

  "apelido": "Nova Unidade",

  "endereco": {

    "logradouro": "Rua Exemplo",

    "numero": "100",

    "bairro": "Centro",

    "cidade": "Belo Horizonte",

    "uf": "MG",

    "cep": "30100-000"

  }

}

A rotina de importação transforma isso em:

{

  "codigo": 500,

  "apelido": "Nova Unidade",

  "endereco": {},

  "geolocalizacao": {

    "latitude": -19.9,

    "longitude": -43.9,

    "place_id": "..."

  }

}

E aí a API de consulta trabalha **somente com registros geolocalizados**.

* * *

4. Consulta do usuário
======================

Eu faria a API:

GET /api/estabelecimentos?cep=30575-500

Resposta:

{

  "consulta": {

    "cep": "30575-500",

    "latitude": -19.963,

    "longitude": -44.010

  },

  "resultados": [

    {

      "codigo": 163,

      "apelido": "Buritis",

      "logo": "/logos/163.png",

      "endereco": "R. Henrique Badaró Portugal, 410 - Buritis, Belo Horizonte - MG",

      "cep": "30575-232",

      "latitude": -19.965123,

      "longitude": -44.012345,

      "distancia_km": 1.2,

      "tempo_minutos": 5,

      "maps_url": "https://www.google.com/maps/dir/?api=1&destination=..."

    }

  ]

}

* * *

5. Eu faria uma otimização importante
=====================================

Não chamaria o Google Routes para todas as lojas.
Imagine que no futuro você tenha:
**500 estabelecimentos.**
O usuário consulta um CEP.
Não queremos:

CEP

 ↓

Google Routes

 ↓

500 destinos

Em vez disso:

CEP

 ↓

latitude / longitude

 ↓

consulta geoespacial no banco

 ↓

10 lojas fisicamente mais próximas

 ↓

Google Routes

 ↓

5 melhores resultados

Isso reduz muito o número de chamadas externas.
No MVP, com apenas 21 lojas, podemos até fazer algo mais simples:

CEP

 ↓

latitude/longitude

 ↓

calcular distância em linha reta

 ↓

pegar 5 mais próximas

 ↓

Routes API

 ↓

ordenar por tempo/distância real

Depois podemos evoluir para PostGIS se o número de lojas crescer bastante.

* * *

6. Google Maps no front-end
===========================

Eu **não colocaria a API key do Google no HTML** para as operações de backend.
O Node.js fica responsável pelas chamadas protegidas.
Para o botão:

> 📍 Como chegar

podemos simplesmente gerar uma **Google Maps URL**.
A própria documentação do Google informa que Maps URLs podem abrir o Google Maps para pesquisa, rotas e navegação e **não exigem API key**. Também podemos utilizar `place_id` para tornar o destino mais preciso.
Por exemplo:

https://www.google.com/maps/dir/?api=1&destination_place_id=PLACE_ID&destination=Buritis

Isso é ótimo para o MVP.

* * *

7. Estrutura do projeto
=======================

Eu estruturaria assim:

cep-estabelecimentos/

│

├── src/

│   ├── server.js

│   │

│   ├── config/

│   │   └── config.js

│   │

│   ├── routes/

│   │   └── estabelecimentos.routes.js

│   │

│   ├── controllers/

│   │   └── estabelecimentos.controller.js

│   │

│   ├── services/

│   │   ├── cep.service.js

│   │   ├── geocoding.service.js

│   │   ├── routes.service.js

│   │   └── proximidade.service.js

│   │

│   ├── repositories/

│   │   └── estabelecimento.repository.js

│   │

│   └── database/

│       ├── database.js

│       └── schema.sql

│

├── scripts/

│   ├── importar-estabelecimentos.js

│   └── geocodificar-estabelecimentos.js

│

├── data/

│   ├── estabelecimentos.json

│   └── estabelecimentos.db

│

├── public/

│   ├── index.html

│   ├── css/

│   │   └── style.css

│   ├── js/

│   │   └── app.js

│   └── logos/

│       ├── 115.png

│       ├── 143.png

│       └── ...

│

├── .env

├── .env.example

├── package.json

├── ecosystem.config.js

└── README.md

* * *

8. APIs
=======

Eu deixaria o contrato pequeno.

### Health check

GET /api/health

Resposta:

{

  "status": "UP",

  "service": "cep-estabelecimentos",

  "version": "1.0.0"

}

### Consulta

GET /api/estabelecimentos?cep=30575500

### Administração/importação

No MVP podemos deixar uma CLI:

npm run importar

que executa:

JSON fonte

   ↓

validar

   ↓

inserir/atualizar

   ↓

identificar novos endereços

   ↓

geocodificar

   ↓

persistir latitude/longitude

Isso é melhor do que criar uma tela administrativa logo de início.

* * *

9. Banco SQLite
===============

Tabela principal:

CREATE TABLE estabelecimentos (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    codigo INTEGER NOT NULL UNIQUE,

    apelido TEXT NOT NULL,

  

    logradouro TEXT NOT NULL,

    numero TEXT,

    bairro TEXT,

    cidade TEXT NOT NULL,

    uf TEXT NOT NULL,

    cep TEXT,

  

    endereco_completo TEXT,

  

    latitude REAL,

    longitude REAL,

    google_place_id TEXT,

  

    logo_url TEXT,

  

    ativo INTEGER NOT NULL DEFAULT 1,

  

    geocodificado_em TEXT,

    atualizado_em TEXT

);

Eu colocaria também um índice:

CREATE INDEX idx_estabelecimentos_ativo

ON estabelecimentos(ativo);

* * *

10. Front-end
=============

A primeira versão pode ser extremamente simples:

┌──────────────────────────────────────────────┐

│                                              │

│        Encontre o estabelecimento            │

│             mais próximo de você             │

│                                              │

│       ┌──────────────────────┐               │

│       │ Digite seu CEP       │ 🔍            │

│       └──────────────────────┘               │

│                                              │

├──────────────────────────────────────────────┤

│                                              │

│  📍 Estabelecimentos próximos                │

│                                              │

│  ┌────────────────────────────────────────┐  │

│  │ [LOGO]  Buritis                        │  │

│  │         R. Henrique Badaró Portugal    │  │

│  │         410 - Buritis                   │  │

│  │                                        │  │

│  │         🚗 1,2 km · 5 min              │  │

│  │                                        │  │

│  │         [ COMO CHEGAR ]                │  │

│  └────────────────────────────────────────┘  │

│                                              │

│  ┌────────────────────────────────────────┐  │

│  │ [LOGO]  Buritis II                    │  │

│  │         Rua Moisés Kalil, 320          │  │

│  │         🚗 2,1 km · 7 min              │  │

│  │                                        │  │

│  │         [ COMO CHEGAR ]                │  │

│  └────────────────────────────────────────┘  │

│                                              │

└──────────────────────────────────────────────┘

E posteriormente podemos colocar um mapa:

┌──────────────────────────────────────────────┐

│                                              │

│                  MAPA                        │

│                                              │

│          📍 Você                             │

│                    📍 Buritis                │

│                            📍 Buritis II     │

│                                              │

├──────────────────────────────────────────────┤

│ Resultados                                   │

│                                              │

│ [logo] Buritis             1,2 km · 5 min    │

│ [logo] Buritis II          2,1 km · 7 min    │

└──────────────────────────────────────────────┘

Eu deixaria o **mapa como segunda etapa do MVP**, porque a funcionalidade principal é encontrar a unidade mais próxima.

* * *

11. Segurança
=============

A arquitetura também evita um problema importante.
A chave:

GOOGLE_MAPS_API_KEY=xxxxx

fica somente no:

.env

na VPS.
O HTML jamais recebe essa chave.
Além disso:

Browser

   │

   │ HTTPS

   ▼

Nginx

   │

   ▼

Node.js

   │

   ├── SQLite

   │

   └── Google APIs

O Node chama a Geocoding/Routes API usando a chave no servidor. O Google documenta o uso das APIs de geocodificação também no servidor com Node.js.

* * *

12. Deploy na Hostinger
=======================

A publicação seria algo próximo de:

Hostinger VPS

│

├── Ubuntu

│

├── Nginx :443

│      │

│      └── /api → Node :3000

│

├── Node.js

│

├── PM2

│

├── SQLite

│

└── aplicação

O domínio poderia ser:

https://localizador.seudominio.com.br

E a API:

https://localizador.seudominio.com.br/api/estabelecimentos?cep=30575500

Ou, se o HTML estiver hospedado em outro lugar:

https://api.seudominio.com.br/api/estabelecimentos?cep=30575500

Nesse segundo caso configuramos CORS adequadamente.

* * *

Minha proposta para o MVP
-------------------------

Eu dividiria em **4 entregas**:

### Fase 1 — Dados

*   transformar os 21 registros da imagem em JSON;
*   validar os endereços;
*   geocodificar todos;
*   obter latitude/longitude;
*   obter `place_id`;
*   identificar endereços que precisam de validação manual;
*   adicionar estrutura de logo.

### Fase 2 — Backend Node.js

*   Express;
*   SQLite;
*   `/api/health`;
*   `/api/estabelecimentos?cep=`;
*   consulta de CEP;
*   cálculo de proximidade;
*   integração com Routes API;
*   resposta JSON padronizada.

### Fase 3 — Front-end

*   HTML;
*   CSS responsivo;
*   campo CEP;
*   máscara/validação;
*   loading;
*   resultados;
*   logo;
*   distância;
*   tempo;
*   botão **Como chegar**.

### Fase 4 — VPS

*   Node;
*   PM2;
*   Nginx;
*   HTTPS;
*   `.env`;
*   CORS;
*   logs;
*   backup do SQLite;
*   deploy.