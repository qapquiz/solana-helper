import { compress } from "@lightprotocol/compressed-token";
import { createRpc, type Rpc } from "@lightprotocol/stateless.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { type Connection, LAMPORTS_PER_SOL, PublicKey, type Signer, type TransactionSignature } from "@solana/web3.js";

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
);

function findAssociatedTokenAddress(
	walletAddress: PublicKey,
	tokenMintAddress: PublicKey
): PublicKey {
	const [ata] = PublicKey.findProgramAddressSync(
		[
			walletAddress.toBuffer(),
			TOKEN_PROGRAM_ID.toBuffer(),
			tokenMintAddress.toBuffer(),
		],
		SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
	);

	return ata;
}

export async function compressToken(connection: Connection, wallet: Signer, mint: PublicKey, amount: number): Promise<TransactionSignature> {
	const sourceAta = findAssociatedTokenAddress(wallet.publicKey, mint);

	const rpc: Rpc = createRpc(connection.rpcEndpoint, connection.rpcEndpoint);
	return await compress(rpc, wallet, mint, amount * LAMPORTS_PER_SOL, wallet, sourceAta, wallet.publicKey);
}
