import Image from "next/image";
import Head from "next/head";

import { useState } from "react";
import { useRouter } from "next/router";

import clsx from "clsx";
import copy from "copy-to-clipboard";
import toast from "react-hot-toast";

import { AnimatePresence, motion } from "framer-motion";

import { Popover, Tooltip } from "@mantine/core";

// import { Tooltip } from "@nextui-org/react";

// @ts-ignore
import { UilAngleLeft, UilAngleRight, UilCopy } from "@iconscout/react-unicons";

import navStyles from "components/styles/Nav.module.scss";

export default function NavBar({
	page,
	setPage,
	webring,
	discordInfo,
	contentVisible,
}: {
	page: string;
	setPage: (page: string) => void;
	webring: Array<any>;
	discordInfo: any;
	contentVisible: boolean;
}) {
	const router = useRouter();

	// const [selectedPage, setSelectedPage] = useState<string>(router.pathname);

	const [cornerLeftHover, setCornerLeftHover] = useState<boolean>(false),
		[cornerRightHover, setCornerRightHover] = useState<boolean>(false);

	const [copyButtonClicked, setCopyButtonClicked] = useState(false);

	const pageName = page
		? page.substring(0, 1).toUpperCase() + page.substring(1)
		: "Home";

	const title = `${pageName} - iUnstable0`;

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
									${discordInfo.themeColors.primary.processed} 0%,
									${discordInfo.themeColors.primary.processed} 30%,
									${discordInfo.themeColors.secondary.processed} 100%
								),
								linear-gradient(
									to bottom,
									${discordInfo.themeColors.primary.original} 0%,
									${discordInfo.themeColors.secondary.original} 100%
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
								${discordInfo.themeColors.primary.original} 0%,
								${discordInfo.themeColors.secondary.original} 100%
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

							gap: 4px;

							margin: 1rem auto;
							margin-right: 5%;

							border-radius: 9px;
							background: ${discordInfo.theme === "light"
								? "#ffffff95"
								: "#00000060"};

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
							background: ${discordInfo.theme === "light"
								? "#ffffff95"
								: // : "#13131395"};
								  "#00000060"};
							width: 90%;
							margin: 0 auto 18px auto;
							flex-grow: 1;
							align-self: center;
							padding-bottom: 16px;
						}

						.globalName {
							color: ${discordInfo.theme === "light" ? "#343434" : "#ffffff"};
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
							color: ${discordInfo.theme === "light" ? "#050505" : "#ffffff"};

							margin: -4px 12px 8px 12px;

							font-family: "gg sans", sans-serif !important;
							font-weight: 500;
							font-size: 14.7px;

							display: flex;
							flex-direction: row;
							justify-content: left;
							align-items: center;
						}

						.discriminator {
							color: ${discordInfo.theme === "light" ? "#4c4e5f" : "#c0c0c4"};
							font-weight: 600;
							font-size: 22px;
							font-family: "Work Sans", sans-serif !important;
						}

						.copyButton {
							opacity: 0;
							margin-left: 6px;
							transition: all 0.2s ease-in-out;
							color: ${discordInfo.theme === "light" ? "#4c4e5f" : "#c0c0c4"};
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
							background: ${discordInfo.seperatorColor};
							margin: 0.7rem auto;
						}

						.bodyTextContent {
							color: ${discordInfo.theme === "light"
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
							color: ${discordInfo.theme === "light" ? "#313131" : "#e2e2e2"};
							margin: 10px 0 0 11.2px;

							font-family: "gg sans", sans-serif !important;
							font-weight: 700;
							font-size: 13px;
						}

						.dateText {
							font-family: "gg sans", sans-serif !important;
							font-weight: 400;
							font-size: 15.5px;

							color: ${discordInfo.theme === "light" ? "#242424" : "#e2e2e2"};
							line-height: 18px;
							letter-spacing: 0;

							word-wrap: break-word;
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

								router.push(
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

								router.push(
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
												{discordInfo.banner ? (
													<img
														src={discordInfo.banner}
														alt="Profile Banner"
														className={clsx(
															navStyles.banner,
															navStyles.bannerImg,
														)}
														// className={`${navStyles.banner} ${navStyles.bannerImg}`}
													/>
												) : (
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
																discordInfo.themeColors.primary.original,
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
													<Tooltip
														label={"HypeSquad Balance"}
														arrowPosition={"center"}
														arrowSize={6}
														withArrow={true}
													>
														<Image
															src="/hypesquad_balance.svg"
															alt="Hypesquad"
															className={navStyles.badge}
															width={25}
															height={25}
															// loading="eager"
															priority={true}
														/>
													</Tooltip>
													<Tooltip
														label={"Active Developer"}
														arrowPosition={"center"}
														arrowSize={6}
														withArrow={true}
													>
														<Image
															src="/active_developer.svg"
															alt="Active Developer"
															className={navStyles.badge}
															width={25}
															height={25}
															// loading="eager"
															priority={true}
														/>
													</Tooltip>
													<Tooltip
														label={"Subscriber since Dec 8, 2022"}
														arrowPosition={"center"}
														arrowSize={6}
														withArrow={true}
													>
														<Image
															src="/nitro.svg"
															alt="Nitro"
															className={navStyles.badge}
															width={25}
															height={25}
															// loading="eager"
															priority={true}
														/>
													</Tooltip>
													<Tooltip
														label={"Server boosting since Dec 26, 2022"}
														arrowPosition={"center"}
														arrowSize={6}
														withArrow={true}
													>
														<Image
															src="/boost.svg"
															alt="Boost"
															className={navStyles.badge}
															width={25}
															height={25}
															// loading="eager"
															priority={true}
														/>
													</Tooltip>
													<Tooltip
														label={"Originally known as iunstable0#0001"}
														arrowPosition={"center"}
														arrowSize={6}
														withArrow={true}
													>
														<Image
															src="/legacy.png"
															alt="Legacy Name"
															className={navStyles.badge}
															width={25}
															height={25}
															// loading="eager"
															priority={true}
														/>
													</Tooltip>
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

														{discordInfo.customActivity && (
															<div className={navStyles.customActivity}>
																{discordInfo.customActivity.emoji && (
																	<Tooltip
																		label={`:${discordInfo.customActivity.emoji.name}:`}
																		arrowPosition={"center"}
																		arrowSize={6}
																		withArrow={true}
																	>
																		{discordInfo.customActivity.emoji.id ? (
																			<img
																				src={`https://cdn.discordapp.com/emojis/${
																					discordInfo.customActivity.emoji.id
																				}.${
																					discordInfo.customActivity.emoji
																						.animated
																						? "gif"
																						: "png"
																				}?size=96`}
																				alt="Emoji"
																				style={{
																					// marginBottom: "-19px",
																					float: "left",
																					width: "20px",
																					height: "20px",
																					objectFit: "contain",
																					marginTop: "3px",
																					marginRight: "5px",
																				}}
																			/>
																		) : (
																			<div
																				style={{
																					// marginBottom: "-19px",
																					float: "left",
																					width: "20px",
																					height: "20px",
																					objectFit: "contain",
																					marginTop: "0px",
																					marginRight: "5px",
																				}}
																			>
																				{discordInfo.customActivity.emoji.name}
																			</div>
																		)}
																	</Tooltip>
																)}
																<span
																	style={{
																		color:
																			discordInfo.theme === "light"
																				? "var(--text-color-dark)"
																				: "#e2e2e2",

																		// margin-left: 11.2px;
																		// margin-bottom: 2px;

																		fontFamily:
																			"gg sans, sans-serif !important",
																		fontWeight: 400,
																		fontSize: "13px",

																		lineHeight: "20px",
																		letterSpacing: 0,

																		wordWrap: "break-word",
																	}}
																>
																	{discordInfo.customActivity.state}
																</span>
															</div>
														)}

														<div className="seperator" />
														<div className={navStyles.bodyText}>
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
																{console.log(discordInfo.bio.split("\n"))}
																{discordInfo.bio
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

																		console.log(line);

																		const poop = line.split("_IMG_");

																		console.log(poop);

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
																								!poopitem.startsWith("$img:")
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
																								splittedEmo.length > 2
																									? true
																									: false;

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
																										<Image
																											src={`https://cdn.discordapp.com/emojis/${emoID}.${
																												animated ? "gif" : "png"
																											}?size=96`}
																											alt="Emoji"
																											width={20}
																											height={20}
																											style={{
																												marginBottom: "-5px",
																											}}
																											// loading="eager"
																											priority={true}
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
															<div className="bodyTextTitle">MEMBER SINCE</div>
															<div>
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
																				discordInfo.theme === "light"
																					? "black"
																					: "white"
																			}.svg`}
																			alt="Discord"
																			width={18}
																			height={18}
																			loading="eager"
																		/>
																	</Tooltip>
																	<span className={"dateText"}>
																		Feb 03, 2022
																	</span>
																	{/* Bullet point */}
																	<span
																		style={{
																			color:
																				discordInfo.theme === "light"
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
																					discordInfo.theme === "light"
																						? "invert(0)"
																						: "invert(1)",
																			}}
																		/>
																	</Tooltip>
																	<span className={"dateText"}>
																		Apr 08, 2007
																	</span>
																</div>
																{/* </p> */}
															</div>
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
