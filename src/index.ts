import { Connection, Keypair } from "@solana/web3.js";
import { Either } from "effect";
import { compressToken, wrapSOL } from "./commands";
import bs58 from "bs58";
import { NoEnvError } from "./error";
import { NATIVE_MINT } from "@solana/spl-token";

const env = {
	RPC_ENDPOINT: process.env.RPC_ENDPOINT,
	WALLET_PRIVATE_KEY: process.env.WALLET_PRIVATE_KEY,
};

async function main(): Promise<Either.Either<unknown, NoEnvError>> {
	if (!env.RPC_ENDPOINT) {
		return Either.left(new NoEnvError("Please add RPC_ENDPOINT"));
	}

	if (!env.WALLET_PRIVATE_KEY) {
		return Either.left(new NoEnvError("Please add WALLET_PRIVATE_KEY"));
	}

	const keypair = Keypair.fromSecretKey(bs58.decode(env.WALLET_PRIVATE_KEY));
	console.log("keypair:", keypair.publicKey.toBase58());

	const connection = new Connection(env.RPC_ENDPOINT);

	// // await wrapSOL(connection, keypair, 1);
	const txSignature = await compressToken(connection, keypair, NATIVE_MINT, 0.2);
	console.log("txSignature:", txSignature)

	return Either.right("OK");
}

main().then(console.log);
