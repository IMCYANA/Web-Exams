
import { Logger } from '@nestjs/common';

// Mock class to reproduce the logic from TopupService
class SlipVerifier {
    private readonly logger = new Logger('SlipVerifier');

    normalizeAccount(acc: string): string {
        return acc ? acc.replace(/[^0-9]/g, '') : '';
    }

    isAccountMatch(maskedAcc: string | undefined, shopAcc: string): boolean {
        if (!maskedAcc) return false;

        const cleanShop = this.normalizeAccount(shopAcc);
        const cleanMasked = maskedAcc.replace(/[^0-9xX]/g, '');

        console.log(`Comparing Masked: ${cleanMasked} vs Shop: ${cleanShop}`);

        // Length must match
        if (cleanMasked.length !== cleanShop.length) {
            console.log(`Length mismatch: ${cleanMasked.length} != ${cleanShop.length}`);
            return false;
        }

        // Compare digit by digit, 'x' is wildcard
        for (let i = 0; i < cleanMasked.length; i++) {
            const m = cleanMasked[i].toLowerCase();
            const s = cleanShop[i];
            if (m !== 'x' && m !== s) {
                console.log(`Mismatch at index ${i}: ${m} != ${s}`);
                return false;
            }
        }

        return true;
    }

    verify(shopAccounts: string[], receiverProxy: string) {
        console.log(`\n--- Starting Verification ---`);
        console.log(`Target Receiver (Proxy/PromptPay): ${receiverProxy || 'UNDEFINED'}`);
        
        const isValid = shopAccounts.some(shopAcc => {
            const cleanShopAcc = this.normalizeAccount(shopAcc);
            console.log(`\nChecking Shop Account: ${shopAcc} (Clean: ${cleanShopAcc})`);
            
            const match = this.isAccountMatch(receiverProxy, cleanShopAcc);
            
            if (match) {
                console.log(`>>> MATCH FOUND! This account matches the slip receiver.`);
            } else {
                console.log(`   Result: NOT MATCH`);
            }
            
            return match;
        });
        
        console.log(`\n--- Final Result: ${isValid} ---`);
        return isValid;
    }
}

// Data from user's debug log
const shopAccounts = ["9807741567", "3170674668", "0930748167"];
const receiverProxy = "09xxxx8167";

const verifier = new SlipVerifier();
const result = verifier.verify(shopAccounts, receiverProxy);

console.log('Final Result Valid:', result);
