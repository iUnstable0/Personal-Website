use async_graphql::{Error as GraphQLError, ErrorExtensions};

use serde::Serialize;
use thiserror::Error;

#[derive(Debug, Clone, Error, Serialize)]
pub enum ServiceError {
    #[error("Internal Server Error")]
    InternalServerError,

    #[error("{0}")]
    BadRequest(String),

    #[error("Unauthorized")]
    Unauthorized,

    #[error("Forbidden")]
    Forbidden,
}

impl ErrorExtensions for ServiceError {
    fn extend(&self) -> GraphQLError {
        match self {
            ServiceError::InternalServerError => GraphQLError::new(self.to_string())
                .extend_with(|_, e| e.set("type", "INTERNAL_SERVER_ERROR")),
            ServiceError::BadRequest(s) => {
                GraphQLError::new(s.clone()).extend_with(|_, e| e.set("type", "BAD_REQUEST"))
            }
            ServiceError::Unauthorized => GraphQLError::new(self.to_string())
                .extend_with(|_, e| e.set("type", "UNAUTHORIZED")),
            ServiceError::Forbidden => {
                GraphQLError::new(self.to_string()).extend_with(|_, e| e.set("type", "FORBIDDEN"))
            }
        }
    }
}
