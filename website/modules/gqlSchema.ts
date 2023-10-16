export default class lib_gqlSchema {
	public static query = {
		getData: `
			query ($videoFormat: String!) {
				getData (videoFormat: $videoFormat) {
					videos {
						title
						path
					}
					webring {
						url
					}
				}
			}
    `,
		discordInfo: `
			query {
				discordInfo {
					id
					username
					globalName
					avatar
				}
			}
    `,
		extraDiscordInfo: `
			query {
				extraDiscordInfo {
					avatarDecoration
					banner
					theme
					seperatorColor
					themeColors {
						primary {
							original
							processed
						}
						secondary {
							original
							processed
						}
					}
					bio
					pronouns
					badges {
						id
						description
					}
				}
			}
		`,
		discordActivity: `
			query {
				discordActivity {
					customStatus {
						state
						emoji {
							animated
							name
							id
							createdTimestamp
							url
							identifier
						}
					}
					activities {
						name
						details
						state
						applicationId
						timestamps {
							start
							end
						}
						assets {
							largeImage
							largeText
							smallImage
							smallText
						}
						createdTimestamp
					}
				}
			}
		`,
	};

	public static mutation = {};
}
