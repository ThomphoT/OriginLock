use anchor_lang::prelude::*;

declare_id!("ORILOCk111111111111111111111111111111111111");

#[program]
pub mod originlock {
    use super::*;

    pub fn register_idea(
        ctx: Context<RegisterIdea>,
        content_hash: String,
        title: String,
    ) -> Result<()> {
        let idea = &mut ctx.accounts.idea;
        idea.owner = ctx.accounts.authority.key();
        idea.content_hash = content_hash.clone();
        idea.title = title;
        idea.timestamp = Clock::get()?.unix_timestamp;
        idea.exists = true;

        emit!(IdeaRegistered {
            hash: content_hash,
            owner: ctx.accounts.authority.key(),
            timestamp: idea.timestamp,
        });

        Ok(())
    }

    pub fn verify_ownership(ctx: Context<VerifyOwnership>) -> Result<ProofOfOwnership> {
        let idea = &ctx.accounts.idea;
        require!(idea.exists, OriginLockError::HashNotFound);
        Ok(ProofOfOwnership {
            owner: idea.owner,
            timestamp: idea.timestamp,
            title: idea.title.clone(),
        })
    }
}

#[derive(Accounts)]
#[instruction(content_hash: String)]
pub struct RegisterIdea<'info> {
    #[account(
        init,
        payer = authority,
        space = IdeaRecord::LEN,
        seeds = [b"idea", content_hash.as_bytes()],
        bump,
    )]
    pub idea: Account<'info, IdeaRecord>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct VerifyOwnership<'info> {
    pub idea: Account<'info, IdeaRecord>,
}

#[account]
pub struct IdeaRecord {
    pub owner: Pubkey,
    pub content_hash: String,
    pub title: String,
    pub timestamp: i64,
    pub exists: bool,
}

impl IdeaRecord {
    pub const LEN: usize = 8 + 32 + 4 + 64 + 4 + 200 + 8 + 1;
}

#[event]
pub struct IdeaRegistered {
    #[index]
    pub hash: String,
    #[index]
    pub owner: Pubkey,
    pub timestamp: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct ProofOfOwnership {
    pub owner: Pubkey,
    pub timestamp: i64,
    pub title: String,
}

#[error_code]
pub enum OriginLockError {
    #[msg("Hash already registered")]
    HashAlreadyRegistered,
    #[msg("Hash not found")]
    HashNotFound,
}
