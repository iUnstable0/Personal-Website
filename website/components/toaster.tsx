// Components

import { Toaster } from "react-hot-toast";

export default function Component() {
	return (
		<Toaster
			position="top-right"
			toastOptions={{
				style: {
					background: "#002f5c",
					color: "#e5e5e5",
					fontFamily: "Ubuntu",
				},
				success: {
					duration: 5000,
				},
				error: {
					duration: 7000,
				},
			}}
		/>
	);
}
