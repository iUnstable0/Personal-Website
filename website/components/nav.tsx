// Packages

import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { DateTime } from "luxon";

// import { useStopwatch } from "react-timer-hook";

import * as emoji from "node-emoji";

import clsx from "clsx";
import copy from "copy-to-clipboard";
import toast from "react-hot-toast";

import lib_axios from "@iunstable0/server-libs/build/axios";

import lib_toaster from "@iunstable0/website-libs/build/toaster";

import lib_gqlSchema from "@/modules/gqlSchema";

// Components

import Image from "next/image";
import Head from "next/head";

import { AnimatePresence, motion } from "framer-motion";

import { Popover, Tooltip } from "@mantine/core";

import Socket from "@/components/socket";

// import { Tooltip } from "@nextui-org/react";

// @ts-ignore
import { UilAngleLeft, UilAngleRight, UilCopy } from "@iconscout/react-unicons";

// Styles

import navStyles from "@/components/styles/Nav.module.scss";

export default function NavBar({
	page,
	setPage,
	webring,
	discordUserInfo,
	extraDiscordUserInfo,
	discordUserActivity,
	contentVisible,
}: {
	page: string;
	setPage: (page: string) => void;
	webring: Array<any>;
	discordUserInfo: any;
	extraDiscordUserInfo: any;
	discordUserActivity: any;
	contentVisible: boolean;
}) {
	const router = useRouter();

	// const curDate = new Date();
	// const timeStp = new Date(
	// 	discordUserInfo.activity.activities[discordActivity.activities.length - 1].timestamps.start,
	// );

	// const diff = curDate.getTime() - timeStp.getTime();

	// curDate.setSeconds(curDate.getSeconds() + diff / 1000);

	// const {
	// 	totalSeconds,
	// 	seconds,
	// 	minutes,
	// 	hours,
	// 	days,
	// 	isRunning,
	// 	start,
	// 	pause,
	// 	reset,
	// } = useStopwatch({
	// 	autoStart: true,
	// 	offsetTimestamp: curDate,
	// });

	// const [selectedPage, setSelectedPage] = useState<string>(router.pathname);

	const [time, setTime] = useState<any>("00:00");

	const [cornerLeftHover, setCornerLeftHover] = useState<boolean>(false),
		[cornerRightHover, setCornerRightHover] = useState<boolean>(false);

	const [copyButtonClicked, setCopyButtonClicked] = useState(false);

	const [discordInfo, setDiscordInfo] = useState<any>(discordUserInfo),
		[extraDiscordInfo, setExtraDiscordInfo] =
			useState<any>(extraDiscordUserInfo),
		[discordActivity, setDiscordActivity] = useState<any>(discordUserActivity);

	const [activityDetailsVisible, setActivityDetailsVisible] = useState<boolean>(
			checkActivityVisible("details"),
		),
		[activityStateVisible, setActivityStateVisible] = useState<boolean>(
			checkActivityVisible("state"),
		),
		[activityCreatedTimestampVisible, setActivityCreatedTimestampVisible] =
			useState<boolean>(checkActivityVisible("createdTimestamp"));

	const pageName = page
		? page.substring(0, 1).toUpperCase() + page.substring(1)
		: "Home";

	const title = `${pageName} - iUnstable0`;

	Socket({
		channel: `discord_activity`,
		onUpdate: async () => {
			// console.log("DISCORD ACTIVITY UPDATE");

			lib_axios
				.request({
					method: "POST",
					// url: "/gql",
					baseURL: process.env.NEXT_PUBLIC_GQL,
					data: {
						query: lib_gqlSchema.query.discordActivity,
					},
				})
				.then(async (response) => {
					const data = response.data.data.discordActivity;

					// toast.dismiss("discordInfo");

					setDiscordActivity(data);
					// setDiscordInfo(data);
				})
				.catch((error) => {
					const errors = lib_axios.parseError(error);

					toast.error(lib_toaster.multiToast("error", errors));
				});
		},
		// onConnect: async () => {
		// 	console.log("DISCORD ACTIVITY CONNECT");
		// },
	});

	Socket({
		channel: `discord_info`,
		onUpdate: async () => {
			//console.log("DISCORD INFO UPDATE");

			lib_axios
				.request({
					method: "POST",
					// url: "/gql",
					baseURL: process.env.NEXT_PUBLIC_GQL,
					data: {
						query: lib_gqlSchema.query.discordInfo,
					},
				})
				.then(async (response) => {
					const data = response.data.data.discordInfo;

					// toast.dismiss("discordInfo");

					setDiscordInfo(data);
					// setDiscordInfo(data);
				})
				.catch((error) => {
					const errors = lib_axios.parseError(error);

					toast.error(lib_toaster.multiToast("error", errors));
				});
		},
	});

	Socket({
		channel: `discord_extra_info`,
		onUpdate: async () => {
			//console.log("DISCORD EXTRA INFO UPDATE");

			lib_axios
				.request({
					method: "POST",
					// url: "/gql",
					baseURL: process.env.NEXT_PUBLIC_GQL,
					data: {
						query: lib_gqlSchema.query.extraDiscordInfo,
					},
				})
				.then(async (response) => {
					const data = response.data.data.extraDiscordInfo;

					// toast.dismiss("discordInfo");

					setExtraDiscordInfo(data);
					// setDiscordInfo(data);
				})
				.catch((error) => {
					const errors = lib_axios.parseError(error);

					toast.error(lib_toaster.multiToast("error", errors));
				});
		},
	});

	function checkActivityVisible(name: string) {
		return (
			discordActivity.activities[discordActivity.activities.length - 1] &&
			discordActivity.activities[discordActivity.activities.length - 1][name] &&
			discordActivity.activities[discordActivity.activities.length - 1][
				name
			].replace(/\s/g, "") !== ""
		);
	}

	const updateTime = (interval: any = null) => {
		if (
			!discordActivity.activities ||
			discordActivity.activities.length < 1 ||
			!discordActivity.activities[discordActivity.activities.length - 1]
				.createdTimestamp
		) {
			if (interval !== null) clearInterval(interval);

			return;
		}

		const curDate = DateTime.now();
		const timeStp = DateTime.fromMillis(
			// 	Convert string to number
			Number(
				discordActivity.activities[discordActivity.activities.length - 1]
					.createdTimestamp,
			),
		);

		const diff = curDate
			.diff(timeStp, ["hours", "minutes", "seconds", "milliseconds"])
			.toObject() as any;

		setTime(
			`${
				diff.hours > 0 ? diff.hours.toString().padStart(2, "0") + ":" : ""
			}${diff.minutes.toString().padStart(2, "0")}:${diff.seconds
				.toString()
				.padStart(2, "0")}`,
		);
	};

	useEffect(() => {
		setActivityDetailsVisible(checkActivityVisible("details"));
		setActivityStateVisible(checkActivityVisible("state"));
		setActivityCreatedTimestampVisible(
			checkActivityVisible("createdTimestamp"),
		);

		updateTime();

		const interval = setInterval(() => {
			updateTime(interval);
		}, 500);

		return () => clearInterval(interval);
	}, [discordActivity]);

	return (
		<>
			<Head>
				<title>{title}</title>
				<meta name="description" content="Welcome to my website!" />
				{/*<link rel="icon" href="/favicon.ico" />*/}
			</Head>

			<div className={navStyles.container}>
				{discordInfo.id && (
					<style global jsx>{`
						.left {
							background-color: var(--light-blue-2);
							position: relative;
							border-radius: 15px;
							//margin-right: 5rem;
							box-sizing: border-box;
							display: flex;
							flex-direction: column;

							width: 350px;
							min-width: 350px;
							max-width: 350px;
							//height: 650px;
							height: auto;

							transform-origin: top right;

							background: linear-gradient(
									to bottom,
									${extraDiscordInfo.themeColors.primary.processed} 0%,
									${extraDiscordInfo.themeColors.primary.processed} 30%,
									${extraDiscordInfo.themeColors.secondary.processed} 100%
								),
								linear-gradient(
									to bottom,
									${extraDiscordInfo.themeColors.primary.original} 0%,
									${extraDiscordInfo.themeColors.secondary.original} 100%
								);
							z-index: 0;
							border: double 5px transparent;
							background-origin: border-box;
							background-clip: content-box, border-box;
						}

						.left:before {
							content: "";
							z-index: -1;
							position: absolute;
							top: 0;
							right: 0;
							bottom: 0;
							left: 0;
							background: linear-gradient(
								to bottom,
								${extraDiscordInfo.themeColors.primary.original} 0%,
								${extraDiscordInfo.themeColors.secondary.original} 100%
							);
							transform: translate3d(0px, 0px, 0) scale(0.95);
							filter: blur(65px);
							opacity: var(0.35);
							transition: opacity 0.3s;
							border-radius: inherit;
						}

						.left::after {
							content: "";
							z-index: -1;
							position: absolute;
							top: 0;
							right: 0;
							bottom: 0;
							left: 0;
							background: inherit;
							border-radius: 10px;
						}

						//.bannerImg {
						//	width: 100%;
						//	height: 30%;
						//
						//	border-radius: 10px 10px 0 0;
						//	z-index: 2;
						//
						//	object-fit: cover;
						//
						//	mask-image: url("/border.svg");
						//
						//	mask-position: -1986px -1923px;
						//	mask-size: 4100px 4100px;
						//
						//	mask-repeat: no-repeat;
						//}

						.badges {
							display: flex;
							flex-direction: row;
							justify-content: center;
							align-items: center;

							//gap: 4px;

							//margin: 0.5rem auto;
							margin: 16px auto 16px auto;
							margin-right: 5%;

							border-radius: 9px;
							background: ${extraDiscordInfo.theme === "light"
								? "#ffffff95"
								: "rgba(0,0,0,0.50)"};

							padding-left: 5px;
							padding-right: 5px;

							width: auto;
							//width: 150px;
							height: auto;

							padding-top: 2.5px;
							padding-bottom: 2.5px;

							z-index: 2;
						}

						.body {
							border-radius: 9px;
							background: ${extraDiscordInfo.theme === "light"
								? "#ffffff95"
								: "rgba(0,0,0,0.50)"};
							width: 90%;
							margin: 0 auto 18px auto;
							flex-grow: 1;
							align-self: center;
							padding-bottom: 16px;
						}

						.globalName {
							color: ${extraDiscordInfo.theme === "light"
								? "#343434"
								: "#ffffff"};
							margin: 8px 12px 0 12px;

							font-family: "gg sans", sans-serif !important;
							font-weight: 700;
							font-size: 22px;
							//width between text
							//letter-spacing: -0.1px;

							display: flex;
							flex-direction: row;
							justify-content: left;
							align-items: center;
						}

						.username {
							color: ${extraDiscordInfo.theme === "light"
								? "#050505"
								: "#ffffff"};

							margin: -4px 12px 8px 12px;

							font-family: "gg sans", sans-serif !important;
							font-weight: 500;
							font-size: 14.7px;

							//display: flex;
							//flex-direction: row;
							//justify-content: left;
							//align-items: center;
						}

						.pronouns {
							color: ${extraDiscordInfo.theme === "light"
								? "#050505"
								: "#ffffff"};

							margin: -10px 12px 8px 12px;

							font-family: "gg sans", sans-serif !important;
							font-weight: 400;
							font-size: 14.7px;

							//display: flex;
							//flex-direction: row;
							//justify-content: left;
							//align-items: center;
						}

						.discriminator {
							color: ${extraDiscordInfo.theme === "light"
								? "#4c4e5f"
								: "#c0c0c4"};
							font-weight: 600;
							font-size: 22px;
							font-family: "Work Sans", sans-serif !important;
						}

						.copyButton {
							opacity: 0;
							margin-left: 6px;
							transition: all 0.2s ease-in-out;
							color: ${extraDiscordInfo.theme === "light"
								? "#4c4e5f"
								: "#c0c0c4"};
							width: 1.25rem;
						}

						.copyButton:hover {
							scale: 1.2;
						}

						.copyButton:active {
							scale: 1;
						}

						.globalName:hover .copyButton {
							opacity: 1;
						}

						.seperator {
							width: 92%;
							height: 0.5px;
							background: ${extraDiscordInfo.seperatorColor};
							margin: 0.7rem auto;
						}

						.bodyTextContent {
							color: ${extraDiscordInfo.theme === "light"
								? "var(--text-color-dark)"
								: "#e2e2e2"};
							font-weight: 400;
							font-size: 15px;
							// commenting this out cuz it breaks the <br/> newline
							//display: inline-block;

							// margin: 4.8px 11.2px;

							margin-left: 11.2px;
							// margin-bottom: 0;
							// margin-bottom: 2px;

							font-family: "gg sans", sans-serif !important;

							line-height: 20px;
							letter-spacing: 0;

							word-wrap: break-word;
						}

						.bodyTextTitle {
							color: ${extraDiscordInfo.theme === "light"
								? "#060607"
								: "#e2e2e2"};
							margin: 10px 0 0 11.2px;

							font-family: "gg sans", sans-serif !important;
							font-weight: 700;
							font-size: 13px;
						}

						.dateText {
							font-family: "gg sans", sans-serif !important;
							font-weight: 400;
							font-size: 15.5px;

							color: ${extraDiscordInfo.theme === "light"
								? "#242424"
								: "#e2e2e2"};
							line-height: 18px;
							letter-spacing: 0;

							word-wrap: break-word;
						}

						.activityLabel {
							font-family: "gg sans", sans-serif !important;
							font-size: 14px;

							overflow: hidden;
							white-space: nowrap;
							text-overflow: ellipsis;

							max-width: 90%;

							color: ${extraDiscordInfo.theme === "light"
								? "#313338"
								: "#ffffff"};
						}

						.activityName {
							font-weight: 700;

							margin-top: ${discordActivity.activities[
								discordActivity.activities.length - 1
							]?.assets
								? activityDetailsVisible || activityStateVisible
									? "-8px"
									: "0px"
								: "0px"};

							//margin-bottom: 4px;
						}

						.activityDetails {
							font-weight: 500;

							margin-top: -4px;
						}

						.activityState {
							font-weight: 500;

							margin-top: -4px;
						}

						.activityTimestamp {
							font-weight: 500;

							margin-top: -4px;
						}
					`}</style>
				)}

				<div
					className={clsx(
						navStyles.corner,
						navStyles.corner_left,
						cornerLeftHover ? navStyles.corner_left_hover : "",
					)}
					style={{
						backdropFilter: contentVisible ? "none" : "blur(10px)",
						WebkitBackdropFilter: contentVisible ? "none" : "blur(10px)",
					}}
				>
					<div
						className={navStyles.corner_container}
						onMouseEnter={() => setCornerLeftHover(true)}
						onMouseLeave={() => setCornerLeftHover(false)}
					>
						<a
							className={navStyles.webring_anchor}
							onClick={() => {
								const currentUrl = window.location.href.toLowerCase();

								let currentUrlIndex = 0;

								for (let i = 0; i < webring.length; i++)
									if (currentUrl == webring[i].url.toLowerCase()) {
										currentUrlIndex = i;
										break;
									}

								void router.push(
									webring[
										currentUrlIndex - 1 === -1
											? webring.length - 1
											: currentUrlIndex - 1
									].url,
								);
							}}
						>
							<UilAngleLeft />
						</a>
						{/* <a
							href="https://webring.hackclub.com/"
							className={navStyles.webring_logo}
						></a> */}
						<Image
							src="/icon-progress-rounded.svg"
							alt="HackClub Logo"
							width={30}
							height={48}
							className={navStyles.webring_logo}
						/>
						<a
							className={navStyles.webring_anchor}
							onClick={() => {
								const currentUrl = window.location.href.toLowerCase();

								let currentUrlIndex = -1;

								for (let i = 0; i < webring.length; i++)
									if (currentUrl == webring[i].url.toLowerCase()) {
										currentUrlIndex = i;
										break;
									}

								void router.push(
									webring[
										currentUrlIndex + 1 === webring.length
											? 0
											: currentUrlIndex + 1
									].url,
								);
							}}
						>
							<UilAngleRight />
						</a>
					</div>
				</div>
				<div
					className={navStyles.navBar}
					style={{
						// background: contentVisible ? "transparent" : "#0000007c",
						opacity: contentVisible ? 1 : 0,
					}}
				>
					<ul>
						<li className={page === "home" ? navStyles.active : ""}>
							<button onClick={() => setPage("home")}>Home</button>
						</li>
						<li className={page === "about" ? navStyles.active : ""}>
							<button onClick={() => setPage("about")}>About</button>
						</li>
						<li className={page === "contact" ? navStyles.active : ""}>
							<button onClick={() => setPage("contact")}>Contact</button>
						</li>{" "}
						<li className={page === "scrapbook" ? navStyles.active : ""}>
							<button onClick={() => setPage("scrapbook")}>Scrapbook</button>
						</li>
					</ul>
				</div>
				<div
					className={clsx(
						navStyles.corner,
						navStyles.corner_right,
						cornerRightHover ? navStyles.corner_right_hover : "",
					)}
					style={{
						backdropFilter: contentVisible ? "none" : "blur(10px)",
						WebkitBackdropFilter: contentVisible ? "none" : "blur(10px)",
					}}
				>
					<div
						className={navStyles.corner_container}
						onMouseEnter={() => setCornerRightHover(true)}
						onMouseLeave={() => setCornerRightHover(false)}
					>
						<a
							title="My Github"
							href="https://github.com/iUnstable0"
							className={navStyles.cornerSocialLink}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Image
								src="/github-mark-white.svg"
								alt="GitHub"
								width={28}
								height={28}
								className={navStyles.cornerImg}
								priority={true}
							/>
						</a>
						<a
							title="My Discord"
							// href="https://discord.com/users/938705972350840882"
							className={navStyles.cornerSocialLink}
							// target="_blank"
							rel="noopener noreferrer"
						>
							<Popover position="bottom-end">
								<Popover.Target>
									<Image
										src="/discord-mark-white.svg"
										alt="Discord"
										width={28}
										height={28}
										className={navStyles.cornerImg}
										priority={true}
									/>
								</Popover.Target>
								<AnimatePresence>
									<Popover.Dropdown
										style={{
											backgroundColor: "transparent",
											border: "none",
											marginTop: "16px",
											// backdropFilter: "blur(10px)",
											// WebkitBackdropFilter: "blur(10px)",
											padding: "0",
											// borderRadius: "15px",
										}}
									>
										{discordInfo.id ? (
											<motion.div
												className="left"
												initial={{
													transform: "scale(0.97)",
												}}
												animate={{
													transform: "scale(1)",
												}}
												exit={{
													transform: "scale(0.97)",
												}}
												transition={{
													type: "spring",
													damping: 9,
													stiffness: 150,
													// mass: 0.5,
												}}
											>
												{/* <div> */}
												{/* <img
							src="../public/banner.gif"
							alt="Banner"
							className={navStyles.bannerImg}
						/> */}
												{extraDiscordInfo.banner ? (
													<img
														src={extraDiscordInfo.banner}
														alt="Profile Banner"
														className={clsx(
															navStyles.banner,
															navStyles.bannerImg,
														)}
													/>
												) : (
													// <img
													// 	src={discordInfo.banner}
													// 	alt="Profile Banner"
													// 	className={clsx(
													// 		navStyles.banner,
													// 		navStyles.bannerImg,
													// 	)}
													// 	// className={`${navStyles.banner} ${navStyles.bannerImg}`}
													// />
													// <Image
													// 	src={banner}
													// 	alt="Profile Banner"
													// 	className={navStyles.bannerImg}
													// 	loading="eager"
													// />
													<div
														className={clsx(
															navStyles.banner,
															navStyles.bannerImg,
														)}
														style={{
															backgroundColor:
																extraDiscordInfo.themeColors.primary.original,
														}}
													></div>
												)}
												{/* // <Image
						// 	src={banner}
						// 	alt="Profile Banner"
						// 	className={navStyles.bannerImg}
						// 	loading="eager"
						// /> */}
												{/* </div> */}
												<div className={navStyles.pfp}>
													{/* <Image
								className={navStyles.pfpImgBorder}
								src="/border.svg"
								alt="Picture of the author"
								width={160}
								height={160}
								loading="eager"
							/> */}

													{/* {discordInfo.avatar_decoration ? (
								<div
									// src="/border.svg"
									// alt="Picture of the author"
									className={navStyles.pfpImgDecoBorder}
								/>
							) : (
								<div
									// src="/border.svg"
									// alt="Picture of the author"
									className={navStyles.pfpImgBorder}
								/>
							)} */}

													{/* <div
								// src="/border.svg"
								// alt="Picture of the author"
								className={navStyles.pfpImgBorder}
							/> */}

													<img
														// src="/profile.webp"
														src={discordInfo.avatar}
														alt="Picture of the author"
														className={navStyles.pfpImg}
													/>
													{/*DO NOT DELETE THIS*/}
													{/*<img*/}
													{/*	src="/christmas.gif"*/}
													{/*	alt="Picture of the author"*/}
													{/*	className={navStyles.pfpImgMask}*/}
													{/*/>*/}
												</div>

												<div className="badges">
													{extraDiscordInfo.badges.map(
														(badge: any, key: number) => (
															<Tooltip
																key={key}
																label={badge.description}
																arrowPosition={"center"}
																arrowSize={6}
																withArrow={true}
															>
																<Image
																	src={`/badges/${badge.id}.${
																		badge.id === "legacy_username"
																			? "png"
																			: "svg"
																	}`}
																	alt={badge.id}
																	className={navStyles.badge}
																	width={25}
																	height={25}
																	loading="eager"
																	priority={true}
																/>
															</Tooltip>
														),
													)}
												</div>
												<div className={navStyles.bodyContainer}>
													<div className="body">
														<div className="globalName">
															{discordInfo.globalName}
															{/*<span className="discriminator">*/}
															{/*	#{discordInfo.discriminator}*/}
															{/*</span>*/}
															{/* <button className={navStyles.copyButton}>
										Copy
									</button> */}
															<UilCopy
																className="copyButton"
																onClick={() => {
																	copy(discordInfo.id);

																	toast.success(
																		"Copied User ID to Clipboard!",
																		{
																			id: "copyButton",
																		},
																	);

																	setCopyButtonClicked(true);

																	setTimeout(() => {
																		setCopyButtonClicked(false);
																	}, 200);
																}}
															/>
														</div>
														<div className="username">
															{discordInfo.username}
														</div>
														<div className="pronouns">
															{extraDiscordInfo.pronouns}
														</div>

														{discordActivity &&
															discordActivity.customStatus && (
																<div className={navStyles.customStatus}>
																	{discordActivity.customStatus.emoji && (
																		<Tooltip
																			label={`:${
																				emoji.has(
																					discordActivity.customStatus.emoji
																						.name,
																				)
																					? emoji.which(
																							discordActivity.customStatus.emoji
																								.name,
																						)
																					: discordActivity.customStatus.emoji
																							.name
																			}:`}
																			arrowPosition={"center"}
																			arrowSize={6}
																			withArrow={true}
																		>
																			{discordActivity.customStatus.emoji.id ? (
																				<img
																					src={`https://cdn.discordapp.com/emojis/${
																						discordActivity.customStatus.emoji
																							.id
																					}.${
																						discordActivity.customStatus.emoji
																							.animated
																							? "gif"
																							: "png"
																					}?size=96`}
																					alt="Emoji"
																					style={{
																						// marginBottom: "-19px",
																						float: "left",
																						width: discordActivity.customStatus
																							.state
																							? "20px"
																							: "50px",
																						height: discordActivity.customStatus
																							.state
																							? "20px"
																							: "50px",
																						objectFit: "contain",
																						marginTop: discordActivity
																							.customStatus.state
																							? "0"
																							: "0px",
																						// marginBottom: discordActivity
																						// 	.customStatus.state
																						// 	? "-1px"
																						// 	: "0px",
																						marginRight: "5px",
																					}}
																				/>
																			) : (
																				// unicode emoji
																				<div
																					style={{
																						// marginBottom: "-19px",
																						float: "left",
																						width: discordActivity.customStatus
																							.state
																							? "20px"
																							: "50px",
																						height: discordActivity.customStatus
																							.state
																							? "20px"
																							: "50px",
																						fontSize: discordActivity
																							.customStatus.state
																							? "20px"
																							: "50px",
																						// objectFit: "contain",
																						marginTop: discordActivity
																							.customStatus.state
																							? "-5px"
																							: "-14px",
																						marginRight: "5px",
																					}}
																				>
																					{
																						discordActivity.customStatus.emoji
																							.name
																					}
																				</div>
																			)}
																		</Tooltip>
																	)}

																	{discordActivity.customStatus.state ? (
																		<div
																			style={{
																				color:
																					extraDiscordInfo.theme === "light"
																						? "var(--text-color-dark)"
																						: "#e2e2e2",

																				fontFamily:
																					"gg sans, sans-serif !important",
																				fontWeight: 400,
																				fontSize: "13px",

																				marginLeft: discordActivity.customStatus
																					.emoji
																					? "22px"
																					: "0px",

																				// lineHeight: "20px",
																				// letterSpacing: 0,

																				// marginTop: "-4px",

																				// marginBottom: "1px",

																				maxWidth: "100%",

																				wordWrap: "break-word",
																			}}
																		>
																			{discordActivity.customStatus.state}
																		</div>
																	) : (
																		<>
																			<br />
																			<br />
																		</>
																	)}
																</div>
															)}

														<div className="seperator" />

														<div className={navStyles.bodyText}>
															{extraDiscordInfo.bio && (
																<>
																	<div className="bodyTextTitle">ABOUT ME</div>
																	<div>
																		{/* <p
											className={
												navStyles.bodyTextContent
											}
										> */}
																		{/* tjzcgt8696@privaterelay.appleid.com
											<br />
											0-curl.annoyed@icloud.com
											<br />
											mail@biggybig.xyz
											<br />
											<br />
											matrix: @iunstable0:matrix.org
											<br />
											session:
											05e54486ba05faa5a31d197cb2818fffb4d7797080c43a8d186822166f8a8b5152 */}
																		{/*{console.log(discordInfo.bio.split("\n"))}*/}
																		{extraDiscordInfo.bio
																			.split("\n")
																			.map((item: string, key: string) => {
																				// console.log(item);
																				if (item === "")
																					return (
																						<div
																							key={key}
																							style={{
																								marginTop: "0px",
																								marginBottom: "0px",
																								fontSize: "8px",
																							}}
																						>
																							<br />
																						</div>
																					);

																				const line = item.replace(
																					/\<(.*?)\:(.*?)\>/g,
																					(match: any, p1: any, p2: any) => {
																						// console.log(p2);
																						return `_IMG_$img:${
																							p1 === "" ? "" : `${p1}:`
																						}${p2}_IMG_`;
																					},
																				);

																				// console.log(line);

																				const poop = line.split("_IMG_");

																				// console.log(poop);

																				// console.log(line);
																				// console.log(poop);

																				// console.log(poop[0] !== "" && poop[0]);
																				// console.log(poop.length);

																				return (
																					<div
																						key={key}
																						className="bodyTextContent"
																					>
																						{poop[0] !== "" && poop[0]}
																						{poop.length > 1 &&
																							poop.map(
																								(
																									poopitem: string,
																									poopkey: number,
																								) => {
																									if (poopkey === 0) return "";

																									// if (poopitem === "") {
																									// console.log("EMPTY");

																									// 	return "";
																									// }

																									if (
																										!poopitem.startsWith(
																											"$img:",
																										)
																									) {
																										// return <span key={poopkey}>{poopitem}</span>;
																										return poopitem;
																									}

																									// console.log(poopitem);
																									// console.log(poop);
																									// console.log(line);

																									const splittedEmo = poopitem
																										.replace("$img:", "")
																										.split(":");

																									const animated =
																										splittedEmo.length > 2;

																									const emoName = animated
																										? splittedEmo[1]
																										: splittedEmo[0];

																									const emoID = animated
																										? splittedEmo[2]
																										: splittedEmo[1];

																									return (
																										<span key={poopkey}>
																											<Tooltip
																												label={`:${emoName}:`}
																												arrowPosition={"center"}
																												arrowSize={6}
																												withArrow={true}
																											>
																												<img
																													src={`https://cdn.discordapp.com/emojis/${emoID}.${
																														animated
																															? "gif"
																															: "png"
																													}?size=96`}
																													alt="Emoji"
																													// width={20}
																													// height={20}
																													style={{
																														marginBottom:
																															"-5px",
																														width: "20px",
																													}}
																													// loading="eager"
																													// priority={true}
																												/>
																											</Tooltip>
																											{/* {poop[poopkey + 1]} */}
																										</span>
																									);
																								},
																							)}
																						<br />
																					</div>
																				);
																			})}
																		{/* </p> */}
																	</div>
																</>
															)}

															<div className="bodyTextTitle">MEMBER SINCE</div>
															{/*<div>*/}
															{/* <p
											className={
												navStyles.bodyTextContent
											}
										> */}
															<div className={navStyles.date}>
																<Tooltip
																	label={"Discord"}
																	arrowPosition={"center"}
																	arrowSize={6}
																	withArrow={true}
																>
																	<Image
																		src={`/discord-mark-${
																			extraDiscordInfo.theme === "light"
																				? "black"
																				: "white"
																		}.svg`}
																		alt="Discord"
																		width={18}
																		height={18}
																		loading="eager"
																	/>
																</Tooltip>
																<span className={"dateText"}>Feb 03, 2022</span>
																{/* Bullet point */}
																<span
																	style={{
																		color:
																			extraDiscordInfo.theme === "light"
																				? "#4c4e5f"
																				: "#b9bbca",
																	}}
																>
																	•
																</span>
																<Tooltip
																	label={"Planet Earth"}
																	arrowPosition={"center"}
																	arrowSize={6}
																	withArrow={true}
																>
																	<Image
																		src="/world.svg"
																		alt="Planet Earth"
																		width={18}
																		height={18}
																		loading="eager"
																		style={{
																			// Invert
																			filter:
																				extraDiscordInfo.theme === "light"
																					? "invert(0)"
																					: "invert(1)",
																		}}
																	/>
																</Tooltip>
																<span className={"dateText"}>Apr 08, 2007</span>
															</div>
															{/* </p> */}
															{/*</div>*/}
															{/*{discordActivity.activities.map(*/}
															{/*	(activity: any, key: number) => (*/}
															{/*		<div key={key}>*/}
															{discordActivity.activities.length > 0 && (
																<div>
																	<div className="bodyTextTitle">
																		PLAYING A GAME
																	</div>
																	<div className={navStyles.activityBox}>
																		<div
																			className={navStyles.activityAsset}
																			style={{
																				maxHeight: discordActivity.activities[
																					discordActivity.activities.length - 1
																				].assets
																					? "60px"
																					: "35px",
																				maxWidth: discordActivity.activities[
																					discordActivity.activities.length - 1
																				].assets
																					? "60px"
																					: "35px",
																			}}
																		>
																			{discordActivity.activities[
																				discordActivity.activities.length - 1
																			].assets && (
																				<Tooltip
																					label={
																						discordActivity.activities[
																							discordActivity.activities
																								.length - 1
																						].assets.largeText
																					}
																					arrowPosition={"center"}
																					arrowSize={6}
																					withArrow={true}
																					disabled={
																						!discordActivity.activities[
																							discordActivity.activities
																								.length - 1
																						].assets.largeText ||
																						discordActivity.activities[
																							discordActivity.activities
																								.length - 1
																						].assets.largeText.replace(
																							/\s/g,
																							"",
																						) === ""
																					}
																				>
																					<img
																						src={
																							discordActivity.activities[
																								discordActivity.activities
																									.length - 1
																							].assets.largeImage.startsWith(
																								"mp:external",
																							)
																								? `https://media.discordapp.net/external/${discordActivity.activities[
																										discordActivity.activities
																											.length - 1
																									].assets.largeImage.substring(
																										12,
																									)}`
																								: `https://cdn.discordapp.com/app-assets/${
																										discordActivity.activities[
																											discordActivity.activities
																												.length - 1
																										].applicationId
																									}/${
																										discordActivity.activities[
																											discordActivity.activities
																												.length - 1
																										].assets.largeImage
																									}.png`
																						}
																						alt={
																							discordActivity.activities[
																								discordActivity.activities
																									.length - 1
																							].assets.largeText
																						}
																						className={clsx(
																							navStyles.activityLargeImage,
																							{
																								[navStyles.activityLargeImageMask]:
																									discordActivity.activities[
																										discordActivity.activities
																											.length - 1
																									].assets.smallText,
																							},
																						)}
																					/>
																				</Tooltip>
																			)}

																			{!discordActivity.activities[
																				discordActivity.activities.length - 1
																			].assets && (
																				<img
																					src="/unknown.svg"
																					alt="Unknown"
																					className={clsx(
																						navStyles.activityLargeImage,
																						navStyles.activityUnknown,
																					)}
																				/>
																			)}

																			{discordActivity.activities[
																				discordActivity.activities.length - 1
																			].assets &&
																				discordActivity.activities[
																					discordActivity.activities.length - 1
																				].assets.smallText && (
																					<Tooltip
																						label={
																							discordActivity.activities[
																								discordActivity.activities
																									.length - 1
																							].assets.smallText
																						}
																						arrowPosition={"center"}
																						arrowSize={6}
																						withArrow={true}
																						disabled={
																							!discordActivity.activities[
																								discordActivity.activities
																									.length - 1
																							].assets.smallText ||
																							discordActivity.activities[
																								discordActivity.activities
																									.length - 1
																							].assets.smallText.replace(
																								/\s/g,
																								"",
																							) === ""
																						}
																					>
																						<img
																							src={
																								discordActivity.activities[
																									discordActivity.activities
																										.length - 1
																								].assets.smallImage.startsWith(
																									"mp:external",
																								)
																									? `https://media.discordapp.net/external/${discordActivity.activities[
																											discordActivity.activities
																												.length - 1
																										].assets.smallImage.substring(
																											12,
																										)}`
																									: `https://cdn.discordapp.com/app-assets/${
																											discordActivity
																												.activities[
																												discordActivity
																													.activities.length - 1
																											].applicationId
																										}/${
																											discordActivity
																												.activities[
																												discordActivity
																													.activities.length - 1
																											].assets.smallImage
																										}.png`
																							}
																							alt={
																								discordActivity.activities[
																									discordActivity.activities
																										.length - 1
																								].assets.smallText
																							}
																							className={
																								navStyles.activitySmallImage
																							}
																						/>
																					</Tooltip>
																				)}
																		</div>

																		<div
																			className={navStyles.activityInfo}
																			style={{
																				padding: discordActivity.activities[
																					discordActivity.activities.length - 1
																				].assets
																					? "8px 0"
																					: "0 0",
																			}}
																		>
																			<div className="activityLabel activityName">
																				{
																					discordActivity.activities[
																						discordActivity.activities.length -
																							1
																					].name
																				}
																			</div>
																			{activityDetailsVisible && (
																				<div className="activityLabel activityDetails">
																					{
																						discordActivity.activities[
																							discordActivity.activities
																								.length - 1
																						].details
																					}
																				</div>
																			)}
																			{activityStateVisible && (
																				<div className="activityLabel activityState">
																					{
																						discordActivity.activities[
																							discordActivity.activities
																								.length - 1
																						].state
																					}
																				</div>
																			)}
																			{activityCreatedTimestampVisible && (
																				<div className="activityLabel activityTimestamp">
																					{time} elapsed
																				</div>
																			)}
																		</div>
																	</div>
																</div>
															)}

															{/*	),*/}
															{/*)}*/}
														</div>
													</div>
												</div>
											</motion.div>
										) : (
											<div>Error</div>
										)}
									</Popover.Dropdown>
								</AnimatePresence>
							</Popover>
							{/*<Image*/}
							{/*	src="/discord-mark-white.svg"*/}
							{/*	alt="Discord"*/}
							{/*	width={28}*/}
							{/*	height={28}*/}
							{/*	className={navStyles.cornerImg}*/}
							{/*	priority={true}*/}
							{/*/>*/}
						</a>
					</div>
				</div>
			</div>
		</>
	);
}
