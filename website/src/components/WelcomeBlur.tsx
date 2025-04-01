"use client";

import { useState } from "react";

import { usePathname } from "next/navigation";

import { motion, AnimatePresence } from "framer-motion";

import styles from "./welcomeBlur.module.css";

export function WelcomeBlur() {
	const [welcomeBlurVisible, setWelcomeBlurVisible] = useState(true);

	const pathname = usePathname();

	return (
		<AnimatePresence>
			{welcomeBlurVisible && (
				<motion.div
					key={`blur_${pathname}`}
					className={styles.welcomeBlur}
					initial={{
						opacity: 0,
					}}
					animate={{
						opacity: 1,
					}}
					exit={{
						opacity: 0,
					}}
					transition={{
						duration: 0.15,
					}}
					onClick={() => {
						setWelcomeBlurVisible(false);

						// setVideoVisible(true);

						// void initVideo(0);
					}}
				>
					<h1 className={styles.welcomeTitle}>Welcome!</h1>
					<h2 className={styles.welcomeDescription}>
						This website is still under development. Expect bugs!
					</h2>
					{/*<h2 className={styles.welcomeDescription}>*/}
					{/*	Note that this website doesnt work on Firefox (it sucks)*/}
					{/*	<br />*/}
					{/*	Theres also an issue with blurring on Chrome and other*/}
					{/*	chromium-based browsers.*/}
					{/*</h2>*/}
					{/*<h2 className={styles.welcomeDescription}>*/}
					{/*	The only browser that works perfectly is Safari (and other*/}
					{/*	browsers if you{"'"}re on iOS).*/}
					{/*</h2>*/}
					<h2 className={styles.welcomeHint}>Click anywhere to enter.</h2>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
