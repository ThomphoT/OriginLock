use anchor_lang::prelude::*;
pub mod errors;
pub mod instructions;
pub mod state;
use instructions::register_idea;

declare_id!("YOUR_PROGRAM_ID_HERE"); // you'll fill this in step 4

#[program]
pub mod origin_lock {
    use super::*;
    pub fn register_idea(
        ctx: Context<register_idea::RegisterIdea>,
        content_hash: String,
        title: String,
    ) -> Result<()> {
        register_idea::handler(ctx, content_hash, title)
    }
}

#[event]
pub struct IdeaRegistered {
    pub owner: Pubkey,
    pub content_hash: String,
    pub timestamp: i64,
}