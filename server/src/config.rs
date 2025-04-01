use once_cell::sync::Lazy;
use serde::Deserialize;
use std::{process, result::Result, str::FromStr};

#[derive(Debug, Clone, Deserialize)]
pub struct Config {
    pub environment: Environment,
    pub port: u16,
    // String because it's a reference to another project on Doppler
    pub helper_port: String,

    pub redis_host: String,
    pub redis_port: u16,
    pub redis_username: String,
    pub redis_password: String,

    pub discord_token: String,
    pub discord_guild_id: u64,
    pub discord_user_id: u64,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Environment {
    #[serde(alias = "dev")]
    Development,
    #[serde(alias = "stg")]
    Staging,
    #[serde(alias = "prod")]
    Production,
}

pub fn load() -> Config {
    match envy::from_env::<Config>() {
        Ok(config) => config,
        Err(error) => {
            eprintln!("Configuration error: {error}");
            process::exit(1);
        }
    }
}

pub static CONFIG: Lazy<Config> = Lazy::new(|| {
    // dotenvy::dotenv().ok();
    load()
});

impl FromStr for Environment {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.to_lowercase().as_str() {
            "dev" | "development" => Ok(Self::Development),
            "stg" | "staging" => Ok(Self::Staging),
            "prod" | "production" => Ok(Self::Production),
            other => Err(format!("Unknown environment: {other}")),
        }
    }
}
