use anchor_lang::prelude::*;

#[account]
pub struct IdeaRecord {
    pub owner: Pubkey,
    pub content_hash: String,
    pub title: String,
    pub timestamp: i64,
    pub bump: u8,
}

impl IdeaRecord {
    pub const LEN: usize = 8 + 32 + (4 + 64) + (4 + 200) + 8 + 1;
}