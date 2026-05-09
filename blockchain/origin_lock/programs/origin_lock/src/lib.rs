use anchor_lang::prelude::*;

declare_id!("D1iXnVYxEBs38Q4VJvzLCK7rZBYEGvmwEniTbMx8Afae");

#[program]
pub mod origin_lock {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
