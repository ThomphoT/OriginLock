#[error_code]
pub enum OriginLockError {
    #[msg("Content hash must be exactly 64 hex characters")]
    InvalidHash,
    #[msg("Title must be 1-200 characters")]
    InvalidTitle,
}