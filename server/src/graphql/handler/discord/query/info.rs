use async_graphql::{Context, Object};

use crate::errors::ServiceError;
use crate::modules::discord;

use super::super::schema::DiscordUser;

use crate::graphql::query::Query;

#[Object]
impl Query {
    pub async fn info(&self, _ctx: &Context<'_>) -> Result<DiscordUser, ServiceError> {
        // Ok(discord::get_info(true).await?.info)

        match discord::get_info(true).await {
            Ok(data) => Ok(data.info),
            Err(e) => {
                error!("{}", e);

                Err(ServiceError::InternalServerError)
            }
        }
    }
}
