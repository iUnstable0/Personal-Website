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
						discordInfo {
							id
							username
							globalName
							avatar
							avatarDecoration
							discriminator
							banner
							theme
							customActivity {
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
						}
					}
        }
    `,
	};

	public static mutation = {};
}
