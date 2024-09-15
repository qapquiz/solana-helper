import {
	NATIVE_MINT,
	createAssociatedTokenAccountInstruction,
	createSyncNativeInstruction,
	getAssociatedTokenAddress,
} from "@solana/spl-token";
import {
	type Connection,
	type Keypair,
	LAMPORTS_PER_SOL,
	type PublicKey,
	SystemProgram,
	Transaction,
	sendAndConfirmTransaction,
} from "@solana/web3.js";

export async function wrapSOL(
	connection: Connection,
	wallet: Keypair,
	amount: number,
): Promise<PublicKey> {
	const ata = await getAssociatedTokenAddress(NATIVE_MINT, wallet.publicKey);

	const wrapTransaction = new Transaction().add(
		createAssociatedTokenAccountInstruction(
			wallet.publicKey,
			ata,
			wallet.publicKey,
			NATIVE_MINT,
		),
		SystemProgram.transfer({
			fromPubkey: wallet.publicKey,
			toPubkey: ata,
			lamports: amount * LAMPORTS_PER_SOL,
		}),
		createSyncNativeInstruction(ata),
	);
	await sendAndConfirmTransaction(connection, wrapTransaction, [wallet]);

	console.log(`wrapSOL ${amount * LAMPORTS_PER_SOL} success!`);
	return ata;
}
