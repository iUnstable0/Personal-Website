import type { Metadata } from "next";

import { JetBrains_Mono, Ubuntu, Quicksand } from "next/font/google";

import clsx from "clsx";

import { Explorer } from "@/components/Explorer";
import { Clock } from "@/components/Clock";
import { WelcomeBlur } from "@/components/WelcomeBlur";

import styles from "./page.module.css";

import "./globals.css";

const jetbrains_mono = JetBrains_Mono({
	subsets: ["latin"],
	display: "swap",
});

const ubuntu = Ubuntu({
	weight: ["300", "400", "500", "700"],
});

const quicksand = Quicksand();

export const metadata: Metadata = {
	title: "iUnstable0",
	description: "My personal website",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={clsx(jetbrains_mono.className)}>
				<WelcomeBlur />

				<div className={styles.left_panel}>
					<Explorer />
				</div>
				<div className={styles.right_panel}>{children}</div>
				<div className={styles.top_bar}>
					<div className={styles.left_container}></div>

					<div className={styles.center_container}></div>

					<div className={styles.right_container}>
						<div className={styles.item}>
							<Clock />
						</div>
					</div>
				</div>
			</body>
		</html>
	);
}
