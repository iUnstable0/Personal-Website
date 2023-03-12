import { useState, useEffect, useRef } from "react";

// Additional Packages

import { useRouter } from "next/router";

import { Gradient } from "public/Gradient.js";

// Additional Components

import NextProgress from "next-progress";

import { createTheme, NextUIProvider, Popover } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";

import { FaPlay } from "react-icons/fa";
import { GiPauseButton } from "react-icons/gi";
import { BsFillSkipEndFill, BsFillSkipStartFill } from "react-icons/bs";
import { MdQueueMusic } from "react-icons/md";
import { TbView360, TbView360Off } from "react-icons/tb";
import { SiApplemusic } from "react-icons/si";
import { IoClose } from "react-icons/io5";

// @ts-ignore
import * as Unicons from "@iconscout/react-unicons";

import ScaleLoader from "react-spinners/ScaleLoader";
import BarLoader from "react-spinners/BarLoader";

// Types

import type { AppProps } from "next/app";

// Styles

import "styles/globals.scss";

import styles from "styles/Index.module.scss";
import mediaControlStyles from "styles/MediaControl.module.scss";

const theme = createTheme({
	type: "dark",
});

export default function App({ Component, pageProps }: AppProps) {
	const router = useRouter();

	const [welcomeBlurVisible, setWelcomeBlurVisible] = useState<any>(pageProps.firstTimeVisit),
		[videoVisible, setVideoVisible] = useState<any>(false),
		[videoPage, setVideoPage] = useState<any>(0),
		[videoPlaying, setVideoPlaying] = useState<any>(false),
		[controlsVisible, setControlsVisible] = useState<any>(null),
		[contentVisible, setContentVisible] = useState<any>(null),
		[noVideo, setNoVideo] = useState<any>(null),
		[videos, setVideos] = useState<any>(pageProps.videos),
		[videoLoading, setVideoLoading] = useState<any>(false),
		[actualVideoLoading, setActualVideoLoading] = useState<any>(false),
		[videoQueueVisible, setVideoQueueVisible] = useState<any>(false);

	const videoRef = useRef<any>(null),
		sourceRef = useRef<any>(null);

	useEffect(() => {
		setContentVisible(localStorage.getItem("contentVisible") === "false" ? false : true);
		setControlsVisible(localStorage.getItem("controlsVisible") === "false" ? false : true);
		setNoVideo(localStorage.getItem("noVideo") === "true" ? true : false);

		const gradient = new Gradient();

		// Call `initGradient` with the selector to your canvas
		// @ts-ignore
		gradient.initGradient("#gradient-canvas");
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			if (contentVisible !== null && controlsVisible !== null && noVideo !== null) {
				clearInterval(interval);

				localStorage.setItem("contentVisible", contentVisible);
				localStorage.setItem("controlsVisible", controlsVisible);
				localStorage.setItem("noVideo", noVideo);
			}
		}, 1);
	}, [contentVisible, controlsVisible, noVideo]);

	useEffect(() => {
		if (videoLoading) {
			setTimeout(() => {
				const interval = setInterval(() => {
					if (videoRef.current) {
						clearInterval(interval);

						// setActualVideoLoading(true);
						setActualVideoLoading(videoRef.current.readyState < 3);
					}
				}, 1);
			}, 1000);
		} else {
			setActualVideoLoading(false);
		}
	}, [videoLoading]);

	// Create nextVideo function

	const changeVideo = async (targetPage: number) => {
		setVideoVisible(false);

		setTimeout(() => {
			console.log("Prev vid lol");
			setVideoVisible(true);

			const interval = setInterval(async () => {
				if (videoRef.current && videos && videos.length) {
					clearInterval(interval);

					setVideoPage(targetPage);

					videoRef.current.src = videos[targetPage].path;
					videoRef.current.type = `video/${videos[targetPage].path.split(".").pop()}`;

					if (videoRef.current && videoRef.current.currentTime !== undefined) videoRef.current.currentTime = 0;

					await videoRef.current.load();
					await videoRef.current.play();

					if (videoRef.current && videoRef.current.currentTime !== undefined) videoRef.current.currentTime = 0;
				}
			}, 1);
		}, 550);
	};

	const prevVideo = () => {
		let targetPage = videoPage - 1;

		if (targetPage < 0) {
			targetPage = 0;
		}

		changeVideo(targetPage);
	};

	const nextVideo = () => {
		let targetPage = videoPage + 1;

		if (targetPage > videos.length - 1) {
			targetPage = 0;
		}

		changeVideo(targetPage);
	};

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
									videoRef.current.src = videos[0].path;
									videoRef.current.type = `video/${videos[0].path.split(".").pop()}`;
									if (videoRef.current && videoRef.current.currentTime !== undefined) videoRef.current.currentTime = 0;

									await videoRef.current.load();
									await videoRef.current.play();

									if (videoRef.current && videoRef.current.currentTime !== undefined) videoRef.current.currentTime = 0;
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
				{!noVideo && videoVisible && (
					<motion.div
						key={`video_${router.pathname}`}
						className={styles.videoContainer}
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
						{/* <div
				className={styles.videoContainer}
				style={{
					opacity: videoVisible ? 1 : 0,
					transition: "all 0.5s",
				}}
			> */}

						{/* <div>HELFEJNMKOIWDUHIBJKNDBFJ DHWNIHBHLDYGVUKDLWBHDYGHFEVKWYDGEIFGBEVFOIGVFIEGFVIEFGVVG</div> */}

						<AnimatePresence>
							{contentVisible && (
								<motion.div
									key={`contentblur_${router.pathname}`}
									className={styles.videoBlur}
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
								/>
							)}

							{actualVideoLoading && (
								<motion.div
									key={`loadingvid_${router.pathname}`}
									// className={styles.videoBlur}
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
										duration: 0.25,
									}}
								>
									<BarLoader
										// <ScaleLoader
										color="#e2e2e2"
										loading={actualVideoLoading}
										style={{
											// position: "absolute",
											// top: "50%",
											// left: "50%",
											// transform: "translate(-50%, -50%)",
											// Apply blur
											filter: contentVisible ? "blur(10px)" : "none",
											transition: "all 0.25s",
											// zIndex: -4,
										}}
									/>
								</motion.div>
							)}
						</AnimatePresence>

						<video
							className={styles.video}
							autoPlay={true}
							muted={false}
							preload="auto"
							// Set time
							playsInline
							// controls={true}
							// loop
							onPlay={() => {
								setVideoPlaying(true);
							}}
							onPause={() => {
								setVideoPlaying(false);
							}}
							onEnded={nextVideo}
							// Set on video loading/buffering
							onCanPlay={() => {
								setVideoLoading(false);
							}}
							onCanPlayThrough={() => {
								setVideoLoading(false);
							}}
							onWaiting={() => {
								setVideoLoading(true);
							}}
							ref={videoRef}
						>
							<source src={videos[videoPage].path} type={`video/${videos[videoPage].path.split(".").pop()}`} ref={sourceRef} />
						</video>
						{/* </div> */}
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
				<Component {...pageProps} contentVisible={contentVisible} />

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
							{/* {contentVisible ? (
								<Unicons.UilEyeSlash className={mediaControlStyles.toggleContent} onClick={() => setContentVisible(false)} />
							) : (
								<Unicons.UilEye className={mediaControlStyles.toggleContent} onClick={() => setContentVisible(true)} />
							)} */}

							<div className={mediaControlStyles.middle}>
								<div className={mediaControlStyles.title}>{noVideo ? "No music playing" : `${videos[videoPage].title}`}</div>

								<div className={mediaControlStyles.playback}>
									<BsFillSkipStartFill
										className={`${mediaControlStyles.prev} ${noVideo ? mediaControlStyles.playbackDisabled : ""} ${
											videoPage <= 0 ? mediaControlStyles.playbackDisabled : ""
										}`}
										onClick={() => {
											// if (videoRef.current) {
											// 	videoRef.current.pause();
											// }

											prevVideo();
										}}
									/>

									{videoPlaying ? (
										<GiPauseButton
											className={`${mediaControlStyles.pause} ${noVideo ? mediaControlStyles.playbackDisabled : ""}`}
											onClick={() => {
												videoRef.current.pause();
											}}
										/>
									) : (
										<FaPlay
											className={`${mediaControlStyles.play} ${noVideo ? mediaControlStyles.playbackDisabled : ""}`}
											onClick={() => {
												videoRef.current.play();
											}}
										/>
									)}

									<BsFillSkipEndFill
										className={`${mediaControlStyles.skip} ${noVideo ? mediaControlStyles.playbackDisabled : ""} ${
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

							{/* <Unicons.UilArrowDown className={mediaControlStyles.hideControls} onClick={() => setControlsVisible(false)} /> */}
						</motion.div>
					)}

					{/* {!controlsVisible && ( */}
					{/* )} */}
				</AnimatePresence>

				<div
					className={mediaControlStyles.container}
					style={{
						// zIndex: -1,
						pointerEvents: "none",
						width: "100%",
						justifyContent: "space-between",
						height: "50px",
						padding: "0 6px",
					}}
				>
					{/* <div
						style={{
							pointerEvents: "all",
						}}
					> */}
					{/* <AnimatePresence> */}
					<div
						style={{
							pointerEvents: "all",
						}}
					>
						{noVideo ? (
							<SiApplemusic
								className={mediaControlStyles.toggleVideo}
								onClick={() => setNoVideo(false)}
								style={{
									// 	pointerEvents: "all",
									marginRight: "5px",
								}}
							/>
						) : (
							<IoClose
								className={mediaControlStyles.toggleVideo}
								onClick={() => {
									setVideoPage(0);
									setNoVideo(true);
									setContentVisible(true);

									// Shuffle videos array

									for (let i = videos.length - 1; i > 0; i--) {
										const j = Math.floor(Math.random() * (i + 1));
										[videos[i], videos[j]] = [videos[j], videos[i]];
									}
								}}
								style={{
									// 	pointerEvents: "all",
									marginRight: "5px",
									padding: "8px",
								}}
							/>
						)}

						{/* <AnimatePresence> */}
						{!noVideo && (
							<motion.div
								key={`hidevidcontrol_${router.pathname}`}
								style={{
									all: "unset",
								}}
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
									duration: 0.25,
								}}
							>
								{contentVisible ? (
									// <Unicons.UilEyeSlash
									<TbView360Off
										className={mediaControlStyles.toggleContent}
										onClick={() => setContentVisible(false)}
										// style={{
										// 	pointerEvents: "all",
										// }}
									/>
								) : (
									// <Unicons.UilEye
									<TbView360
										className={mediaControlStyles.toggleContent}
										onClick={() => setContentVisible(true)}
										// style={{
										// 	pointerEvents: "all",
										// }}
									/>
								)}
							</motion.div>
						)}
						{/* </AnimatePresence> */}
					</div>

					<div
						style={{
							pointerEvents: "all",
						}}
					>
						{/* <MdQueueMusic
							className={mediaControlStyles.toggleQueue}
							onClick={() => setContentVisible(true)}
							style={{
								// pointerEvents: "all",
								marginRight: "5px",
							}}
						/> */}

						{!noVideo && (
							<motion.div
								key={`hidevidcontrol_${router.pathname}`}
								style={{
									all: "unset",
								}}
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
									duration: 0.25,
								}}
							>
								<Popover placement="top-right">
									<Popover.Trigger>
										<button
											style={{
												all: "unset",
											}}
										>
											<MdQueueMusic
												className={mediaControlStyles.toggleQueue}
												//onClick={() => setContentVisible(true)}
												style={{
													// pointerEvents: "all",
													marginRight: "5px",
												}}
											/>
										</button>
									</Popover.Trigger>
									<Popover.Content
										css={{
											backgroundColor: "transparent",
										}}
									>
										<div className={mediaControlStyles.queue}>
											<h1 className={mediaControlStyles.queueTitle}>Playlist</h1>

											<div className={mediaControlStyles.queueContent}>
												{videos &&
													videos.length &&
													videos.map((video: any, index: any) => (
														<div
															key={index}
															className={`${mediaControlStyles.queueItem} ${
																videoPage === index ? mediaControlStyles.queueItemActive : ""
															}`}
															onClick={() => {
																// setVideoPage(index);
																changeVideo(index);
																// setContentVisible(true);
															}}
														>
															<div className={mediaControlStyles.queueItemTitle}>{video.title}</div>
															{/* <div className={mediaControlStyles.queueItemArtist}>{video.artist}</div> */}

															<AnimatePresence>
																{videoPage === index && (
																	<motion.img
																		key={`playinggggg_${index}`}
																		src="/playing.gif"
																		className={mediaControlStyles.queuePause}
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
																			duration: 0.25,
																		}}
																	/>
																)}
															</AnimatePresence>
															{/* {videoPage === index && <GiPauseButton className={mediaControlStyles.queuePause} />} */}

															{/* {videoPage !== index && <FaPlay className={mediaControlStyles.queuePlay} />} */}
														</div>
													))}
											</div>
										</div>
									</Popover.Content>
								</Popover>
							</motion.div>
						)}

						{controlsVisible ? (
							<Unicons.UilArrowDown
								className={mediaControlStyles.toggleControls}
								onClick={() => setControlsVisible(false)}
								// style={{
								// 	pointerEvents: "all",
								// }}
							/>
						) : (
							<Unicons.UilArrowUp
								className={mediaControlStyles.toggleControls}
								onClick={() => setControlsVisible(true)}
								// style={{
								// 	pointerEvents: "all",
								// }}
							/>
						)}
					</div>
					{/* </AnimatePresence> */}
					{/* </div> */}
				</div>
			</div>
		</NextUIProvider>
	);
}
