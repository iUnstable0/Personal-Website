// Components

import { Toaster } from "react-hot-toast";

export default function Component() {
	return (
		<Toaster
			position="top-right"
			toastOptions={{
				style: {
					background: "#0000006B",
					backdropFilter: "blur(10px)",
					color: "#e5e5e5",
					fontFamily: "Ubuntu",
					fontWeight: "500",
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
