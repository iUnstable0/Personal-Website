use async_graphql::{Context, Object};

use super::super::schema::PublicUpdateLocation;

use crate::errors::ServiceError;
use crate::modules::cache;

use crate::graphql::mutation::Mutation;

#[Object]
impl Mutation {
    pub async fn update(
        &self,
        ctx: &Context<'_>,
        input: PublicUpdateLocation,
    ) -> Result<String, anyhow::Error> {
        Err(ServiceError::InternalServerError.into())
    }
}
