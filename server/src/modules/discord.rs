use reqwest;

use crate::config::CONFIG;
use crate::graphql::handler::discord::schema::{DiscordUser, DiscordUserExtended};
use crate::modules::cache;

pub struct DiscordInfo {
    pub info: DiscordUser,
    pub changed: bool,
}
pub struct DiscordInfoExtended {
    pub info: DiscordUserExtended,
    pub changed: bool,
}

pub async fn get_info(use_cache: bool) -> Result<DiscordInfo, anyhow::Error> {
    let cache_key = format!("discordInfo_{}.json", CONFIG.discord_user_id);
    let mut changed = !cache::exists(cache_key.as_str());

    // Will run when frontend requests already cached info
    if use_cache && !changed {
        let info: DiscordUser = cache::read_json(cache_key.as_str())?;

        return Ok(DiscordInfo { info, changed });
    }

    // Will run either by cron update cache trigger event
    // or when frontend requests info that hasn't been cached

    let url = format!(
        "http://127.0.0.1:{}/discord-info/{}/{}",
        CONFIG.helper_port, CONFIG.discord_guild_id, CONFIG.discord_user_id
    );

    let response = reqwest::get(url).await?;
    let new_info: DiscordUser = response.json().await?;

    // If there is an update, will push websocket event
    // to frontend to fetch latest data
    if !changed {
        let old_info: DiscordUser = cache::read_json(cache_key.as_str())?;

        if old_info != new_info {
            changed = true;
        }
    }

    // Save new info to cache
    if changed {
        cache::write_json(cache_key.as_str(), &new_info)?;
    }

    Ok(DiscordInfo {
        info: new_info,
        changed,
    })
}

// pub fn get_info_extended(cache: bool) -> Result<DiscordInfoExtended, anyhow::Error> {
//     let cache_key = format!("discordInfoExtended_{}.json", CONFIG.discord_user_id);
//
//     let mut changed = !data::exists(cache_key.as_str());
//
//     if cache && !changed {
//         let info: DiscordUserExtended = data::read_json(cache_key.as_str())?;
//
//         return Ok(DiscordInfoExtended { info, changed });
//     }
// }
