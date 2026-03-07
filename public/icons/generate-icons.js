// Script para gerar ícones temporários
// TODO: Substituir por ícones reais

const fs = require('fs');
const path = require('path');

// Criar ícones placeholder (vazios por enquanto)
const icons = [
  'icon-192.png',
  'icon-512.png', 
  'icon-192-maskable.png',
  'icon-512-maskable.png'
];

icons.forEach(icon => {
  const iconPath = path.join(__dirname, icon);
  // Criar arquivo vazio como placeholder
  fs.writeFileSync(iconPath, '');
  console.log(`Created placeholder: ${icon}`);
});

console.log('Ícones placeholder criados. TODO: Adicionar imagens PNG reais.');
