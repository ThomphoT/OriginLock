use anchor_lang::prelude::*;
use crate::state::IdeaRecord;
use crate::errors::OriginLockError;

#[derive(Accounts)]
#[instruction(content_hash: String)]
pub struct RegisterIdea<'info> {
    #[account(
        init,
        payer = owner,
        space = IdeaRecord::LEN,
        seeds = [b"idea", owner.key().as_ref(), content_hash.as_bytes()],
        bump
    )]
    pub idea_record: Account<'info, IdeaRecord>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<RegisterIdea>, content_hash: String, title: String) -> Result<()> {
    require!(content_hash.len() == 64, OriginLockError::InvalidHash);
    require!(title.len() > 0 && title.len() <= 200, OriginLockError::InvalidTitle);
    let record = &mut ctx.accounts.idea_record;
    record.owner = ctx.accounts.owner.key();
    record.content_hash = content_hash;
    record.title = title;
    record.timestamp = Clock::get()?.unix_timestamp;
    record.bump = ctx.bumps.idea_record;
    Ok(())
}