import { toast } from "react-hot-toast";

export default class lib_toaster {
	public static multiToast(action: any, toasts: any) {
		for (let i = 0; i < toasts.length - 1; i++) {
			// @ts-ignore
			toast[action](toasts[i]);
		}

		return toasts[toasts.length - 1];
	}
}
