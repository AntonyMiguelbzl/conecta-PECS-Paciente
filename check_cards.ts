import { INITIAL_CARDS } from "./src/constants";

const keys = new Set();
const duplicates = new Set();

for (const card of INITIAL_CARDS) {
  if (keys.has(card.id)) {
    duplicates.add(card.id);
  }
  keys.add(card.id);
}

if (duplicates.size > 0) {
  console.log("❌ CARTÕES DUPLICADOS ENCONTRADOS:", [...duplicates]);
} else {
  console.log("✅ Tudo limpo! Nenhum ID de cartão duplicado encontrado nas constantes.");
}