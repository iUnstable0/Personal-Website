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
					avatarDecoration
					banner
					theme
					activity {
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
	};

	public static mutation = {};
}
