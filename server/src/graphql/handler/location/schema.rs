use async_graphql::InputObject;
use serde::Deserialize;

#[derive(InputObject, Deserialize)]
pub struct PublicUpdateLocation {
    pub password: String,

    pub location: String,
    pub region: String,
    pub timezone: String,
}
