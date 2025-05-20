Installer les dépendances : 
npm install -g pnpm
pnpm install
Installer docker
pnpm install @nestjs/core @nestjs/common @nestjs/platform-express reflect-metadata rxjs
pnpm install mikro-orm @mikro-orm/core @mikro-orm/postgresql
pnpm install jsonwebtoken bcrypt argon2 dotenv
pnpm install jest @nestjs/testing ts-jest
pnpm install --save-dev eslint prettier
pnpm install --save-dev eslint-plugin-prettier eslint-config-prettier

Fichier docker-compose.yml : 
ex : version: '3.1'

services:
  db:
    image: postgres:latest
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: your-database-name
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
volumes:
  postgres_data:




Fichier tsconfig.json : 
ex : {
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist"
  },
  "include": [
    "src/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}


Fichier .env : 

# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your-username
DB_PASSWORD=your-password
DB_NAME=your-database-name

# JWT Configuration
JWT_SECRET=your-secret-key
JWT_EXPIRATION_TIME=3600s

# Other environment variables as needed

Lancer avec docker : 

docker-compose -f docker-compose.yml up -d

Compiler le code typescript : 

pnpm run dev


Pour Tester utiliser Postman sur Vscode ou bien : 

pnpm run test
