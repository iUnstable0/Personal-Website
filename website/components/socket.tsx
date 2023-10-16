// Packages

import { useEffect } from "react";

import { io } from "socket.io-client";

export default function Component({
	channel,
	onUpdate,
	onConnect,
	onDisconnect,
}: {
	channel: string;
	onUpdate?: () => void;
	onConnect?: () => void;
	onDisconnect?: () => void;
}) {
	useEffect((): any => {
		const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET || "", {
			path: "/",
			rememberUpgrade: true,
			auth: {
				channel,
			},
		});

		socket.on("connect", () => onConnect && onConnect());

		socket.on("disconnect", () => onDisconnect && onDisconnect());

		socket.on("update", (message) => onUpdate && onUpdate(message));

		// onUpdate && onUpdate();

		return () => socket.disconnect();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
}
