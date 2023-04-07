// This file is duplicated in:
// Website/modules/axios.ts
// Server/src/modules/axios.ts

import axios from "axios";

export default class lib_axios {
	public static parseError(error: any) {
		const errorMessages = [];

		// console.log(error);

		if (error.response && error.response.data) {
			if (error.response.data.errors) {
				for (let i = 0; i < error.response.data.errors.length; i++) {
					errorMessages.push(error.response.data.errors[i].message);
				}
			} else if (error.response.data.error) {
				if (
					error.response.data.statusCode > 499 &&
					error.response.data.statusCode < 600 &&
					!error.response.data.message.startsWith("Internal server error. Ref:")
				) {
					errorMessages.push("Internal server error");
				} else {
					errorMessages.push(error.response.data.message);
				}
			}
		} else if (error.errors) {
			for (let i = 0; i < error.errors.length; i++) {
				errorMessages.push(error.errors[i].message);
			}
		} else if (error.message) {
			errorMessages.push(error.message);
		} else {
			errorMessages.push(error.toString());
		}

		return errorMessages;
	}

	public static request(options: {
		method: "POST" | "GET" | "PUT" | "DELETE";
		url: string;
		baseURL?: any;
		headers?: any;
		data?: any;
	}) {
		return new Promise(async (resolve, reject) => {
			const requestHeaders = options.headers || {};

			let response: any;

			try {
				// console.log({
				// 	method: options.method,
				// 	url: options.url,
				// 	...(options.baseURL ? { baseURL: options.baseURL } : {}),
				// 	headers: requestHeaders,
				// 	...(options.data ? { data: options.data } : {}),
				// });

				response = await axios.request({
					method: options.method,
					url: options.url,
					...(options.baseURL ? { baseURL: options.baseURL } : {}),
					headers: requestHeaders,
					...(options.data ? { data: options.data } : {}),
				});
			} catch (error: any) {
				reject(error);

				return;
			}

			if (response.data.errors || response.data.error) {
				reject(response.data);

				return;
			}

			if (response.data.data && response.data.data.emailValid) {
				if (response.data.data.emailValid?.error) {
					reject(response.data.data.emailValid.error);

					return;
				}
			}

			if (response.data.data && response.data.data.usernameValid) {
				if (response.data.data.usernameValid?.error) {
					reject(response.data.data.usernameValid.error);

					return;
				}
			}

			resolve(response);
		});
	}
}
