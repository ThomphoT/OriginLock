import { AnchorProvider, Program, web3 } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import idl from '../target/idl/origin_lock.json';

const PROGRAM_ID = new PublicKey(process.env.REACT_APP_PROGRAM_ID!);

function getProgram(provider: AnchorProvider) {
    return new Program(idl as any, PROGRAM_ID, provider);
}

export async function registerIdea(
    provider: AnchorProvider,
    contentHash: string,
    title: string
): Promise<string> {
    const program = getProgram(provider);
    const [ideaPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('idea'), provider.wallet.publicKey.toBuffer(), Buffer.from(contentHash)],
        PROGRAM_ID
    );
    const tx = await program.methods
        .registerIdea(contentHash, title)
        .accounts({
            ideaRecord: ideaPda,
            owner: provider.wallet.publicKey,
            systemProgram: web3.SystemProgram.programId
        })
        .rpc();
    return tx; // send this txSignature to backend
}

export async function getIdeaRecord(
    connection: web3.Connection,
    ownerPubkey: string,
    contentHash: string
): Promise<{ owner: string; title: string; timestamp: number } | null> {
    const program = new Program(idl as any, PROGRAM_ID, { connection } as any);
    const [ideaPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('idea'), new PublicKey(ownerPubkey).toBuffer(), Buffer.from(contentHash)],
        PROGRAM_ID
    );
    try {
        const record = await program.account.ideaRecord.fetch(ideaPda);
        return { owner: record.owner.toString(), title: record.title, timestamp: record.timestamp.toNumber() };
    } catch { return null; }
}