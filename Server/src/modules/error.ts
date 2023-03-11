export default class lib_error {
	public static generateReferenceCode(): string {
		// Return current unix timestamp in milliseconds
		return Date.now().toString();
		// return (
		// 	Math.random().toString(36).substring(2, 15) +
		// 	Math.random().toString(36).substring(2, 15)
		// );
	}
}
