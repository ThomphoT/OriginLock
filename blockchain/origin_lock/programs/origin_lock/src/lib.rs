use anchor_lang::prelude::*;
use anchor_lang::solana_program::hash::hash;

declare_id!("D1iXnVYxEBs38Q4VJvzLCK7rZBYEGvmwEniTbMx8Afae");

const MAX_HASH_LEN: usize = 64;
const MAX_TITLE_LEN: usize = 200;

#[program]
pub mod origin_lock {
    use super::*;

    pub fn register_idea(ctx: Context<RegisterIdea>, content_hash: String, title: String) -> Result<()> {
        require!(is_valid_hash(&content_hash), OriginLockError::InvalidHash);
        require!(!title.trim().is_empty() && title.len() <= MAX_TITLE_LEN, OriginLockError::InvalidTitle);

        let record = &mut ctx.accounts.idea_record;
        record.owner = ctx.accounts.owner.key();
        record.content_hash = content_hash.clone();
        record.title = title.clone();
        record.timestamp = Clock::get()?.unix_timestamp;
        record.bump = ctx.bumps.idea_record;

        emit!(IdeaRegistered {
            owner: record.owner,
            content_hash,
            title,
            timestamp: record.timestamp,
        });

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(content_hash: String)]
pub struct RegisterIdea<'info> {
    #[account(
        init,
        payer = owner,
        space = IdeaRecord::LEN,
        seeds = [b"idea", owner.key().as_ref(), hash(content_hash.as_bytes()).as_ref()],
        bump
    )]
    pub idea_record: Account<'info, IdeaRecord>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct IdeaRecord {
    pub owner: Pubkey,
    pub content_hash: String,
    pub title: String,
    pub timestamp: i64,
    pub bump: u8,
}

impl IdeaRecord {
    pub const LEN: usize = 8 + 32 + (4 + MAX_HASH_LEN) + (4 + MAX_TITLE_LEN) + 8 + 1;
}

#[event]
pub struct IdeaRegistered {
    pub owner: Pubkey,
    pub content_hash: String,
    pub title: String,
    pub timestamp: i64,
}

#[error_code]
pub enum OriginLockError {
    #[msg("Content hash must be exactly 64 hex characters")]
    InvalidHash,

    #[msg("Title must be 1-200 characters")]
    InvalidTitle,
}

fn is_valid_hash(value: &str) -> bool {
    value.len() == MAX_HASH_LEN && value.chars().all(|ch| ch.is_ascii_hexdigit())
}
