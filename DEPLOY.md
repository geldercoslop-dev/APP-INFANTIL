# Kids Mission App

## 🚀 Deploy Público

### Build de Produção
```bash
npm run build:prod
```

### Preview Local
```bash
npm run preview:prod
```

---

## 🌐 Plataformas de Deploy

### Vercel
1. Conectar repositório no Vercel
2. Configurar build command: `npm run build:prod`
3. Output directory: `dist`
4. Deploy automático ativado

### Netlify
1. Conectar repositório no Netlify
2. Build command: `npm run build:prod`
3. Publish directory: `dist`
4. Deploy automático ativado

### Cloudflare Pages
1. Conectar repositório no Cloudflare Pages
2. Build command: `npm run build:prod`
3. Build output directory: `dist`
4. Deploy automático ativado

---

## 📱 PWA Features

### Instalação
- **Android**: Adicionar à tela inicial via Chrome
- **iOS**: Adicionar à tela inicial via Safari
- **Desktop**: Instalar via navegador Chrome

### Service Worker
- Cache automático de assets
- Atualização automática de versão
- Funcionamento offline parcial

---

## 📊 Estrutura do Build

```
dist/
├── index.html              # Página principal
├── manifest.webmanifest     # PWA manifest
├── sw.js                  # Service worker
├── registerSW.js          # Registro do SW
├── assets/                # Assets estáticos
│   ├── index-*.js        # Bundle principal
│   ├── vendor-*.js       # Dependencies
│   ├── router-*.js       # React Router
│   ├── *.css             # Styles
│   └── icons/            # Ícones PWA
└── workbox-*.js          # Workbox PWA
```

---

## 🔧 Configurações Técnicas

### Vite Config
- **Base path**: Relativo (`./`)
- **Minificação**: Terser
- **Code splitting**: Manual chunks
- **Source maps**: Desativado em produção

### PWA Manifest
- **Nome**: Kids Mission v1.0.0
- **Display**: Standalone
- **Orientação**: Portrait
- **Tema**: #667eea

### Service Worker
- **Estratégia**: CacheFirst para fontes
- **Atualização**: AutoUpdate
- **Precache**: Todos os assets estáticos
