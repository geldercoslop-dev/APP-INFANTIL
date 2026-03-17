# Kids Mission App

Aplicação web infantil para rotina de missões, recompensas e acompanhamento parental.

## Stack

- React 19 + TypeScript
- Vite 7
- Zustand (persistência local)
- PWA com `vite-plugin-pwa`
- Vitest + ESLint

## Requisitos

- Node.js **>= 20.19.0**
- npm

## Scripts

```bash
npm install
npm run dev
npm run lint
npm run test
npm run build
```

## Estrutura principal

- `src/pages`: telas da aplicação
- `src/components`: componentes reutilizáveis
- `src/store/useGameStore.ts`: estado global e regras de negócio
- `src/systems`: sistemas auxiliares (áudio, confete, missões)
- `src/types`: tipos centralizados

## Segurança parental

- A rota `/parent` é protegida por PIN.
- Sessão do painel dos pais expira automaticamente.
- Existe bloqueio temporário após múltiplas tentativas inválidas de PIN.

## CI

Workflow em `.github/workflows/ci.yml` com:

1. `npm ci`
2. `npm run lint`
3. `npm run test`
4. `npm run build`
