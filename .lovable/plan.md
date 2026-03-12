

## Rede Social Profissional — "ProConnect"

Uma rede social profissional com foco em portfólios, interface moderna e acessível para todos.

### 🔐 Autenticação
- **Login/Cadastro** com email + senha e Google
- Tela de login bonita e intuitiva
- Recuperação de senha

### 👤 Perfil Profissional
- Foto de perfil, nome, título profissional, bio
- Seção de experiências e formação
- **Portfólio de trabalhos**: galeria visual para exibir projetos com imagem, título, descrição e link
- Habilidades/competências com tags

### 🏠 Feed / Página Inicial
- Feed de publicações dos profissionais conectados
- Criar posts com texto e imagens
- Curtir e comentar publicações
- Buscar profissionais por nome ou habilidade

### 🔍 Diferenciais vs LinkedIn
- **Portfólio visual em destaque** no perfil (LinkedIn esconde trabalhos)
- **Modo Sênior** para acessibilidade
- Interface mais limpa e menos poluída
- Perfis focados em mostrar trabalho, não só currículo

### 👴 Modo Sênior (ativado por toggle)
- Navegação simplificada: apenas as funções essenciais na tela (Início, Perfil, Buscar)
- Menos menus e opções visíveis
- Ícones maiores e textos mais legíveis
- Toggle acessível no cabeçalho para ativar/desativar

### 📱 Layout
- **Responsivo** (mobile-first, funciona bem no celular)
- Sidebar de navegação no desktop, bottom nav no mobile
- Design moderno com cores profissionais (azul/branco)

### 🗄️ Backend (Supabase via Lovable Cloud)
- Tabelas: profiles, posts, portfolio_items, connections
- Autenticação com email + Google
- Storage para fotos de perfil e imagens do portfólio
- RLS para privacidade dos dados

