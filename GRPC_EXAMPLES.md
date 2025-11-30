# Exemplos de API gRPC - Music Manager

Este documento contém exemplos de como testar as APIs gRPC implementadas no projeto.

## 🚀 Guia Rápido de Instalação

### Opção Mais Fácil (Recomendado para Iniciantes)

**1. BloomRPC - Interface Gráfica:**
- Baixe: https://github.com/bloomrpc/bloomrpc/releases/latest
- Instale o `.exe`
- Pronto para usar! (Veja instruções detalhadas abaixo)

**2. Postman (Se você já usa):**
- Baixe: https://www.postman.com/downloads/
- Versão 9.7+ tem suporte nativo a gRPC

### Para Linha de Comando (Usuários Avançados)

**grpcurl - Download Direto:**
1. Acesse: https://github.com/fullstorydev/grpcurl/releases/latest
2. Baixe `grpcurl_x.x.x_windows_x86_64.zip`
3. Extraia o `grpcurl.exe`
4. Copie para `C:\Windows\System32` ou adicione ao PATH

**Ou via Package Manager:**
```powershell
# Chocolatey
choco install grpcurl

# Scoop
scoop install grpcurl

# Winget
winget install grpcurl
```

---

## Servidor gRPC

O servidor gRPC está rodando na porta **5000** (`localhost:5000`).

Os arquivos `.proto` estão localizados na pasta `proto/` na raiz do projeto:
- `proto/user.proto` - Definições do serviço de usuários
- `proto/music.proto` - Definições do serviço de músicas
- `proto/playlist.proto` - Definições do serviço de playlists

## Como Testar

### Opção 1: Usando grpcurl (Recomendado)

`grpcurl` é uma ferramenta de linha de comando para interagir com servidores gRPC.

#### Instalação do grpcurl no Windows

**Método 1: Download Direto (Recomendado e Mais Fácil)**

1. Acesse: https://github.com/fullstorydev/grpcurl/releases/latest
2. Baixe o arquivo `grpcurl_x.x.x_windows_x86_64.zip`
3. Extraia o arquivo `grpcurl.exe` para uma pasta de sua escolha
4. Adicione a pasta ao PATH do sistema ou copie o `grpcurl.exe` para `C:\Windows\System32`

**Método 2: Usando Chocolatey**
```powershell
# Instale o Chocolatey primeiro (se não tiver): https://chocolatey.org/install
choco install grpcurl
```

**Método 3: Usando Scoop**
```powershell
# Instale o Scoop primeiro (se não tiver): https://scoop.sh
scoop install grpcurl
```

**Método 4: Usando Winget (Windows Package Manager)**
```powershell
winget install grpcurl
```

**Verificar instalação:**
```powershell
grpcurl --version
```

#### Verificar serviços disponíveis

```bash
grpcurl -plaintext -import-path ./proto -proto user.proto localhost:5000 list
grpcurl -plaintext -import-path ./proto -proto music.proto localhost:5000 list
grpcurl -plaintext -import-path ./proto -proto playlist.proto localhost:5000 list
```

---

## Exemplos de Requisições

### User Service

#### 1. Listar todos os usuários
```bash
grpcurl -plaintext -import-path ./proto -proto user.proto -d '{}' localhost:5000 user.UserService/FindAll
```

#### 2. Buscar usuário por ID
```bash
grpcurl -plaintext -import-path ./proto -proto user.proto -d '{"id": 1}' localhost:5000 user.UserService/FindOne
```

#### 3. Criar novo usuário
```bash
grpcurl -plaintext -import-path ./proto -proto user.proto -d '{"name": "João Silva", "age": 28}' localhost:5000 user.UserService/Create
```

#### 4. Atualizar usuário
```bash
grpcurl -plaintext -import-path ./proto -proto user.proto -d '{"id": 1, "name": "João Silva Atualizado", "age": 29}' localhost:5000 user.UserService/Update
```

#### 5. Deletar usuário
```bash
grpcurl -plaintext -import-path ./proto -proto user.proto -d '{"id": 1}' localhost:5000 user.UserService/Delete
```

#### 6. Buscar playlists de um usuário
```bash
grpcurl -plaintext -import-path ./proto -proto user.proto -d '{"id": 1}' localhost:5000 user.UserService/FindPlaylists
```

#### 7. Adicionar playlist a um usuário
```bash
grpcurl -plaintext -import-path ./proto -proto user.proto -d '{"userId": 1, "playlistId": 1}' localhost:5000 user.UserService/AddPlaylist
```

#### 8. Remover playlist de um usuário
```bash
grpcurl -plaintext -import-path ./proto -proto user.proto -d '{"userId": 1, "playlistId": 1}' localhost:5000 user.UserService/RemovePlaylist
```

---

### Music Service

#### 1. Listar todas as músicas
```bash
grpcurl -plaintext -import-path ./proto -proto music.proto -d '{}' localhost:5000 music.MusicService/FindAll
```

#### 2. Buscar música por ID
```bash
grpcurl -plaintext -import-path ./proto -proto music.proto -d '{"id": 1}' localhost:5000 music.MusicService/FindOne
```

#### 3. Criar nova música
```bash
grpcurl -plaintext -import-path ./proto -proto music.proto -d '{"name": "Bohemian Rhapsody", "artist": "Queen"}' localhost:5000 music.MusicService/Create
```

#### 4. Atualizar música
```bash
grpcurl -plaintext -import-path ./proto -proto music.proto -d '{"id": 1, "name": "Bohemian Rhapsody (Remastered)", "artist": "Queen"}' localhost:5000 music.MusicService/Update
```

#### 5. Deletar música
```bash
grpcurl -plaintext -import-path ./proto -proto music.proto -d '{"id": 1}' localhost:5000 music.MusicService/Delete
```

---

### Playlist Service

#### 1. Listar todas as playlists
```bash
grpcurl -plaintext -import-path ./proto -proto playlist.proto -d '{}' localhost:5000 playlist.PlaylistService/FindAll
```

#### 2. Buscar playlist por ID
```bash
grpcurl -plaintext -import-path ./proto -proto playlist.proto -d '{"id": 1}' localhost:5000 playlist.PlaylistService/FindOne
```

#### 3. Criar nova playlist
```bash
grpcurl -plaintext -import-path ./proto -proto playlist.proto -d '{"name": "Minhas Favoritas"}' localhost:5000 playlist.PlaylistService/Create
```

#### 4. Atualizar playlist
```bash
grpcurl -plaintext -import-path ./proto -proto playlist.proto -d '{"id": 1, "name": "Top Hits 2024"}' localhost:5000 playlist.PlaylistService/Update
```

#### 5. Deletar playlist
```bash
grpcurl -plaintext -import-path ./proto -proto playlist.proto -d '{"id": 1}' localhost:5000 playlist.PlaylistService/Delete
```

#### 6. Buscar músicas de uma playlist
```bash
grpcurl -plaintext -import-path ./proto -proto playlist.proto -d '{"id": 1}' localhost:5000 playlist.PlaylistService/FindMusics
```

#### 7. Buscar usuários de uma playlist
```bash
grpcurl -plaintext -import-path ./proto -proto playlist.proto -d '{"id": 1}' localhost:5000 playlist.PlaylistService/FindUsers
```

#### 8. Adicionar música a uma playlist
```bash
grpcurl -plaintext -import-path ./proto -proto playlist.proto -d '{"playlistId": 1, "musicId": 1}' localhost:5000 playlist.PlaylistService/AddMusic
```

#### 9. Remover música de uma playlist
```bash
grpcurl -plaintext -import-path ./proto -proto playlist.proto -d '{"playlistId": 1, "musicId": 1}' localhost:5000 playlist.PlaylistService/RemoveMusic
```

---

### Opção 2: Usando BloomRPC (Interface Gráfica - MAIS FÁCIL!)

**BloomRPC é a forma mais fácil de testar gRPC** - interface gráfica similar ao Postman.

#### Instalação:

1. **Baixe:** https://github.com/bloomrpc/bloomrpc/releases/latest
2. Baixe o arquivo `.exe` para Windows
3. Instale normalmente

#### Como usar:

1. Abra o BloomRPC
2. Clique em **"Import Paths"** e adicione a pasta `proto/` do seu projeto
3. Clique em **"Import Protos"** e selecione os arquivos:
   - `proto/user.proto`
   - `proto/music.proto`
   - `proto/playlist.proto`
4. Configure o endereço: `localhost:5000`
5. Selecione o método desejado no menu lateral
6. Preencha o JSON com os dados
7. Clique em **"Play"** para executar

**Exemplo no BloomRPC:**
- Servidor: `localhost:5000`
- Método: `user.UserService/Create`
- JSON:
```json
{
  "name": "João Silva",
  "age": 28
}
```

---

### Opção 3: Criando um Cliente gRPC em TypeScript

Se você quiser criar um cliente programático, aqui está um exemplo:

#### Instale dependências adicionais:
```bash
npm install --save-dev @types/google-protobuf
```

#### Exemplo de cliente:

```typescript
import { ClientGrpc, Client, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function testGrpcClient() {
  const client = ClientProxyFactory.create({
    transport: Transport.GRPC,
    options: {
      package: 'user',
      protoPath: join(__dirname, './proto/user.proto'),
      url: 'localhost:5000',
    },
  });

  const userService = client.getService<any>('UserService');
  
  // Listar todos os usuários
  const users = await userService.FindAll({}).toPromise();
  console.log('Usuários:', users);
  
  // Criar novo usuário
  const newUser = await userService.Create({
    name: 'Maria Santos',
    age: 25,
  }).toPromise();
  console.log('Usuário criado:', newUser);
}
```

---

### Opção 4: Usando Postman (Também Fácil!)

Postman também suporta gRPC nas versões mais recentes (v9.7+):

#### Como usar:

1. **Baixe o Postman:** https://www.postman.com/downloads/
2. Abra o Postman
3. Clique em **"New"** → **"gRPC"**
4. Configure:
   - **Server URL:** `localhost:5000`
   - Clique em **"Import .proto file"**
   - Selecione os arquivos da pasta `proto/`
5. Selecione o método desejado (ex: `user.UserService/Create`)
6. Preencha o **Message** com JSON
7. Clique em **"Invoke"**

**Vantagem:** Se você já usa Postman, não precisa instalar nada novo!

---

## Estrutura dos Arquivos Proto

### user.proto
Define 8 métodos para gerenciar usuários:
- `FindAll` - Lista todos os usuários
- `FindOne` - Busca usuário por ID
- `FindPlaylists` - Lista playlists de um usuário
- `Create` - Cria novo usuário
- `Update` - Atualiza usuário existente
- `Delete` - Remove usuário
- `AddPlaylist` - Adiciona playlist a um usuário
- `RemovePlaylist` - Remove playlist de um usuário

### music.proto
Define 5 métodos para gerenciar músicas:
- `FindAll` - Lista todas as músicas
- `FindOne` - Busca música por ID
- `Create` - Cria nova música
- `Update` - Atualiza música existente
- `Delete` - Remove música

### playlist.proto
Define 9 métodos para gerenciar playlists:
- `FindAll` - Lista todas as playlists
- `FindOne` - Busca playlist por ID
- `FindMusics` - Lista músicas de uma playlist
- `FindUsers` - Lista usuários de uma playlist
- `Create` - Cria nova playlist
- `Update` - Atualiza playlist existente
- `Delete` - Remove playlist
- `AddMusic` - Adiciona música a uma playlist
- `RemoveMusic` - Remove música de uma playlist

---

## Comparação com REST e GraphQL

### REST API
- Porta: 3000
- Endpoint: `http://localhost:3000/user`, `http://localhost:3000/music`, etc.
- Formato: JSON via HTTP

### GraphQL
- Porta: 3000
- Endpoint: `http://localhost:3000/graphql`
- Formato: GraphQL queries e mutations

### gRPC
- Porta: 5000
- Endpoint: `localhost:5000`
- Formato: Protocol Buffers (binário)
- Vantagens: Mais rápido, fortemente tipado, suporta streaming

---

## Iniciar o Servidor

```bash
npm run start:dev
```

O servidor iniciará em:
- HTTP/REST/GraphQL: `http://localhost:3000`
- gRPC: `localhost:5000`

---

## Troubleshooting

### Erro: "Cannot find module"
Certifique-se de que os arquivos `.proto` estão na pasta correta (`proto/` na raiz do projeto).

### Erro: "Failed to connect"
Verifique se o servidor está rodando e se a porta 5000 não está sendo usada por outro processo.

### Erro ao usar grpcurl
Certifique-se de usar a flag `-plaintext` para conexões sem TLS e especificar corretamente o caminho dos arquivos proto.

---

## Recursos Adicionais

- [Documentação oficial do gRPC](https://grpc.io/)
- [NestJS Microservices](https://docs.nestjs.com/microservices/grpc)
- [grpcurl GitHub](https://github.com/fullstorydev/grpcurl)
- [BloomRPC](https://github.com/bloomrpc/bloomrpc)
