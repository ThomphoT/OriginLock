import { AnchorProvider, Program, web3 } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { createHash } from 'crypto';
import idl from '../target/idl/origin_lock.json';

const PROGRAM_ID = new PublicKey(process.env.REACT_APP_PROGRAM_ID ?? idl.address);

function getProgram(provider: AnchorProvider) {
    return new Program(idl as any, provider);
}

export async function registerIdea(
    provider: AnchorProvider,
    contentHash: string,
    title: string
): Promise<string> {
    const program = getProgram(provider);
    const hashSeed = createHash('sha256').update(contentHash).digest();
    const [ideaPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('idea'), provider.wallet.publicKey.toBuffer(), hashSeed],
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
    const program = new Program(idl as any, { connection } as any);
    const hashSeed = createHash('sha256').update(contentHash).digest();
    const [ideaPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('idea'), new PublicKey(ownerPubkey).toBuffer(), hashSeed],
        PROGRAM_ID
    );
    try {
        const record = await program.account.ideaRecord.fetch(ideaPda);
        return { owner: record.owner.toString(), title: record.title, timestamp: record.timestamp.toNumber() };
    } catch { return null; }
}
