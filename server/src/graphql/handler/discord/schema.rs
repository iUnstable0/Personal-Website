use async_graphql::SimpleObject;
use serde::{Deserialize, Serialize};

#[derive(SimpleObject, Debug, PartialEq, Serialize, Deserialize)]
pub struct Color {
    original: String,
    processed: String,
}

#[derive(SimpleObject, Debug, PartialEq, Serialize, Deserialize)]
pub struct ThemeColor {
    primary: Color,
    secondary: Color,
}

#[derive(SimpleObject, Debug, PartialEq, Serialize, Deserialize)]
pub struct Badge {
    id: String,
    description: String,
}

#[derive(SimpleObject, Debug, PartialEq, Serialize, Deserialize)]
pub struct DiscordUser {
    pub id: u64,

    pub username: String,
    pub global_name: String,

    pub avatar_url: String,
}

#[derive(SimpleObject, Debug, PartialEq, Serialize, Deserialize)]
pub struct DiscordUserExtended {
    pub bio: String,
    pub pronouns: String,

    pub avatar_decoration_url: String,
    pub banner_url: String,

    pub theme: ThemeColor,

    pub badges: Vec<Badge>,
}
