export default class lib_gqlSchema {
	public static query = {
		getData: `
        query ($videoFormat: String!) {
					getData (videoFormat: $videoFormat) {
						webring {
							url
						}
						videos {
							title
							path
						}
					}
        }
    `,
	};

	public static mutation = {};
}
