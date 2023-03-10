import "styles/globals.scss";
import type { AppProps } from "next/app";

import { useState, useEffect, useRef } from "react";

import { useRouter } from "next/router";

import NextProgress from "next-progress";
import { createTheme, NextUIProvider } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";

// @ts-ignore
import * as Unicons from "@iconscout/react-unicons";

import { Gradient } from "public/Gradient.js";
import { FaPlay } from "react-icons/fa";
import { GiPauseButton } from "react-icons/gi";
import { BsFillSkipEndFill, BsFillSkipStartFill } from "react-icons/bs";

const theme = createTheme({
	type: "dark",
});

import styles from "styles/Index.module.scss";
import mediaControlStyles from "styles/MediaControl.module.scss";

export default function App({ Component, pageProps }: AppProps) {
	const router = useRouter();

	const [welcomeBlurVisible, setWelcomeBlurVisible] = useState<any>(pageProps.firstTimeVisit),
		[videoVisible, setVideoVisible] = useState<any>(false),
		[videoPage, setVideoPage] = useState<any>(0),
		[videoPlaying, setVideoPlaying] = useState<any>(false),
		[controlsVisible, setControlsVisible] = useState<any>(true);

	const videoRef = useRef<any>(null);

	const videos = pageProps.videos;

	useEffect(() => {
		const gradient = new Gradient();

		// Call `initGradient` with the selector to your canvas
		// @ts-ignore
		gradient.initGradient("#gradient-canvas");
	}, []);

	// Create nextVideo function

	function prevVideo() {
		setVideoVisible(false);

		setTimeout(() => {
			console.log("Prev vid lol");
			setVideoVisible(true);

			const interval = setInterval(async () => {
				if (videoRef.current) {
					clearInterval(interval);

					let targetPage = videoPage - 1;

					if (targetPage < 0) {
						targetPage = 0;
					}

					setVideoPage(targetPage);

					videoRef.current.src = videos[targetPage].src;
					console.log(videos[targetPage].title);
					videoRef.current.currentTime = 0;

					await videoRef.current.load();
					await videoRef.current.play();

					videoRef.current.currentTime = 0;
				}
			}, 1);
		}, 550);
	}

	function nextVideo() {
		setVideoVisible(false);

		setTimeout(() => {
			console.log("Next vid lol");
			setVideoVisible(true);

			const interval = setInterval(async () => {
				if (videoRef.current && videos.length) {
					clearInterval(interval);

					let targetPage = videoPage + 1;

					if (targetPage > videos.length - 1) {
						targetPage = 0;
					}

					setVideoPage(targetPage);

					videoRef.current.src = videos[targetPage].src;
					console.log(videos[targetPage].title);
					videoRef.current.currentTime = 0;

					await videoRef.current.load();
					await videoRef.current.play();

					videoRef.current.currentTime = 0;
				}
			}, 1);
		}, 550);
	}

	return (
		<NextUIProvider disableBaseline={true} theme={theme}>
			<NextProgress delay={250} options={{ showSpinner: false }} height="4px" color="#29D" />

			<AnimatePresence>
				{welcomeBlurVisible && (
					<motion.div
						key={`blur_${router.pathname}`}
						initial="pageInitial"
						animate="pageAnimate"
						exit="pageExit"
						variants={{
							pageInitial: {
								opacity: 0,
							},
							pageAnimate: {
								opacity: 1,
							},
							pageExit: {
								opacity: 0,
							},
						}}
						transition={{
							duration: 0.15,
						}}
						className={styles.welcomeBlur}
						onClick={() => {
							setWelcomeBlurVisible(false);

							// setTimeout(() => {
							setVideoVisible(true);

							const interval = setInterval(async () => {
								if (videoRef.current) {
									// videoRef.current.fastSeek(0);

									clearInterval(interval);

									// videoRef.current.fastSeek(0);
									videoRef.current.currentTime = 0;

									await videoRef.current.load();
									await videoRef.current.play();

									videoRef.current.currentTime = 0;
								}
							}, 1);
							// }, 1000);
						}}
					>
						<h1 className={styles.welcomeTitle}>Welcome!</h1>
						<h2 className={styles.welcomeDescription}>This website is still under development. Expect bugs!</h2>
						<h2 className={styles.welcomeHint}>Click anywhere to enter.</h2>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Video player */}

			<canvas id="gradient-canvas" className={styles.gradientBackground} data-transition-in />

			<AnimatePresence>
				{videoVisible && (
					<motion.div
						key={`video_${router.pathname}`}
						className={styles.video}
						initial="pageInitial"
						animate="pageAnimate"
						exit="pageExit"
						variants={{
							pageInitial: {
								opacity: 0,
							},
							pageAnimate: {
								opacity: 1,
							},
							pageExit: {
								opacity: 0,
							},
						}}
						transition={{
							duration: 0.5,
						}}
					>
						<div className={styles.videoBlur} />

						<video
							className={styles.video}
							autoPlay={true}
							muted={false}
							// preload="auto"
							// Set time
							// playsInline
							// controls={true}
							// loop
							onPlay={() => {
								setVideoPlaying(true);
							}}
							onPause={() => {
								setVideoPlaying(false);
							}}
							onEnded={nextVideo}
							ref={videoRef}
						>
							<source src={videos[videoPage].src} type="video/mp4" />
						</video>
					</motion.div>
				)}
			</AnimatePresence>

			<div
				style={
					{
						// position: "absolute",
						// top: 0,
						// left: 0,
						// width: "100%",
						// height: "100vh",
						// display: "flex",
						// flexDirection: "column",
						// justifyContent: "space-between",
						// alignItems: "center",
					}
				}
			>
				<Component {...pageProps} />

				<AnimatePresence>
					{controlsVisible && (
						<motion.div
							key={`controls_${router.pathname}`}
							className={mediaControlStyles.container}
							initial="pageInitial"
							animate="pageAnimate"
							exit="pageExit"
							variants={{
								pageInitial: {
									// opacity: 0,
									y: 90,
								},
								pageAnimate: {
									// opacity: 1,
									y: 0,
								},
								pageExit: {
									// opacity: 0,
									// Calculate y position and minus by 40px
									y: 90,
								},
							}}
							transition={{
								duration: 0.25,
							}}
						>
							<div className={mediaControlStyles.middle}>
								<div className={mediaControlStyles.title}>
									{videos[videoPage].title} - {videos[videoPage].artist}
								</div>
								<div className={mediaControlStyles.playback}>
									<BsFillSkipStartFill
										className={`${mediaControlStyles.prev} ${videoPage <= 0 ? mediaControlStyles.playbackDisabled : ""}`}
										onClick={() => {
											// if (videoRef.current) {
											// 	videoRef.current.pause();
											// }

											prevVideo();
										}}
									/>

									{videoPlaying ? (
										<GiPauseButton
											className={mediaControlStyles.pause}
											onClick={() => {
												videoRef.current.pause();
											}}
										/>
									) : (
										<FaPlay
											className={mediaControlStyles.play}
											onClick={() => {
												videoRef.current.play();
											}}
										/>
									)}

									<BsFillSkipEndFill
										className={`${mediaControlStyles.skip} ${
											videoPage >= (videos.length ? videos.length : 0) - 1 ? mediaControlStyles.playbackDisabled : ""
										}`}
										onClick={() => {
											// if (videoRef.current) {
											// 	videoRef.current.currentTime = videoRef.current.duration;
											// }
											nextVideo();
										}}
									/>
								</div>
							</div>

							<Unicons.UilArrowDown
								className={mediaControlStyles.hideControls}
								onClick={() => {
									setControlsVisible(false);
								}}
							/>
						</motion.div>
					)}

					{!controlsVisible && (
						<motion.div
							key={`fakeControls_${router.pathname}`}
							className={mediaControlStyles.container}
							style={{
								background: "transparent",
							}}
							initial="pageInitial"
							animate="pageAnimate"
							exit="pageExit"
							variants={{
								pageInitial: {
									// opacity: 0,
									y: 90,
								},
								pageAnimate: {
									// opacity: 1,
									y: 0,
								},
								pageExit: {
									// opacity: 0,
									// Calculate y position and minus by 40px
									y: 90,
								},
							}}
							transition={{
								duration: 0.25,
							}}
						>
							<Unicons.UilArrowUp
								className={mediaControlStyles.showControls}
								onClick={() => {
									setControlsVisible(true);
								}}
							/>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</NextUIProvider>
	);
}
