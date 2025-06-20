
import { generateAddress, WalletGenerationError } from './generate';

export default async function main() {
try {
  const wallet = generateAddress();
  console.log("✅ New Wallet:", wallet);
} catch (error) {
  if (error instanceof WalletGenerationError) {
    console.error("⚠️ Wallet generation failed:", error.message);
  } else {
    console.error("❌ Unknown error:", error);
  }
}
}
