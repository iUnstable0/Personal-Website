export default class lib_gqlSchema {
  public static query = {
    getVideos: `
        query {
            getVideos {
                title
                path
            }
        }
    `,
  };

  public static mutation = {};
}
