export default class lib_gqlSchema {
	public static query = {
		getVideos: `
        query ($format: String) {
            getVideos (format: $format) {
                title
                path
            }
        }
    `,
	};

	public static mutation = {};
}
