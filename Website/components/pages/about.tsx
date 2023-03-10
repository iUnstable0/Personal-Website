import { useEffect, useState } from "react";

import Head from "next/head";
import Image from "next/image";

import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Tooltip, css } from "@nextui-org/react";
// @ts-ignore
import * as Unicons from "@iconscout/react-unicons";
import toast from "react-hot-toast";

import styles from "styles/Index.module.scss";

import aboutStyles from "components/pages/styles/About.module.scss";

// import banner from "../public/banner.gif";

export default function Component({ setPage, userInfo }: { setPage: (page: string) => void; userInfo: any }) {
	const [copyButtonClicked, setCopyButtonClicked] = useState(false);

	return (
		<>
			<div className={styles.container}>
				{/* <h1 className={styles.title}>About me</h1> */}

				{/* <p className={styles.description}>
					I{"'"}m passionate about coding and have been doing it for
					over 4 years now. I{"'"}m well-versed in a variety of
					programming languages such as Python, Lua, JavaScript, Bash,
					and Rust. In addition, I can speak multiple real-world
					languages, such as Chinese (Mandarin and Yunan), English,
					and Thai. I{"'"}m currently learning French, too! My
					favorite type of coding projects tend to be ones that
					automate things, admin/control panels, and tools/suites. I
					{"'"}m not a big fan of coding games, however, as I{"'"}m
					not the strongest at modeling and animations (except for UI
					animations).
				</p> */}
				<div className={aboutStyles.container}>
					<style global jsx>{`
						.left {
							background-color: var(--light-blue-2);
							position: relative;
							border-radius: 15px;
							margin-right: 5rem;
							box-sizing: border-box;
							display: flex;
							flex-direction: column;

							width: 350px;
							min-width: 350px;
							max-width: 350px;
							height: 650px;

							background: linear-gradient(
									to bottom,
									${userInfo.theme_colors.primary.processed} 0%,
									${userInfo.theme_colors.primary.processed} 30%,
									${userInfo.theme_colors.secondary.processed} 100%
								),
								linear-gradient(to bottom, ${userInfo.theme_colors.primary.original} 0%, ${userInfo.theme_colors.secondary.original} 100%);
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
								${userInfo.theme_colors.primary.original} 0%,
								${userInfo.theme_colors.secondary.original} 100%
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

						.pfpImg {
							width: 97px;
							object-fit: cover;
							border-radius: 100%;
							margin-left: 1rem;
							margin-top: 2rem;
							border: 6px solid transparent;
						}

						.bannerImg {
							width: 100%;
							height: 30%;

							border-radius: 10px 10px 0 0;
							z-index: 2;

							object-fit: cover;

							mask-image: url("/border.svg");

							mask-position: -1986px -1923px;
							mask-size: 4100px 4100px;

							mask-repeat: no-repeat;
						}

						.badges {
							display: flex;
							flex-direction: row;
							justify-content: center;
							align-items: center;
							gap: 4px;

							margin: 1rem auto;
							margin-right: 5%;
							border-radius: 9px;
							background: ${userInfo.theme === "light" ? "#ffffff99" : "#00000099"};

							width: 120px;
							height: 48px;

							z-index: 2;
						}

						.body {
							border-radius: 9px;
							background: ${userInfo.theme === "light" ? "#ffffff95" : "#13131395"};
							width: 90%;
							margin: 0 auto 18px auto;
							flex-grow: 1;
							align-self: center;
						}

						.username {
							color: ${userInfo.theme === "light" ? "#1b1b1b" : "#ffffff"};
							font-weight: 600;
							font-size: 22px;
							margin: 0.7rem 0.7rem;
							font-family: "Source Sans Pro", sans-serif !important;
							display: flex;
							flex-direction: row;
							justify-content: left;
							align-items: center;
						}

						.discriminator {
							color: ${userInfo.theme === "light" ? "#4c4e5f" : "#c0c0c4"};
							font-weight: 600;
							font-size: 22px;
							font-family: "Work Sans", sans-serif !important;
						}

						.copyButton {
							opacity: 0;
							margin-left: 0.2rem;
							transition: all 0.2s ease-in-out;
							color: ${userInfo.theme === "light" ? "#4c4e5f" : "#c0c0c4"};
							width: 1.25rem;
						}

						.copyButton:hover {
							scale: 1.2;
						}

						.copyButton:active {
							scale: 1;
						}

						.username:hover .copyButton {
							opacity: 1;
						}

						.seperator {
							width: 92%;
							height: 0.5px;
							background: ${userInfo.seperatorColor};
							margin: 0.7rem auto;
						}

						.bodyTextContent {
							color: ${userInfo.theme === "light" ? "var(--text-color-dark)" : "#e2e2e2"};
							font-weight: 400;
							font-size: 15px;
							display: inline-block;

							// margin: 4.8px 11.2px;

							margin-left: 11.2px;
							// margin-bottom: 0;
							// margin-bottom: 2px;

							font-family: "PT Sans", sans-serif !important;

							line-height: 20px;
							letter-spacing: 0;

							word-wrap: break-word;
						}

						.bodyTextTitle {
							color: ${userInfo.theme === "light" ? "#000000" : "#e2e2e2"};
							font-weight: 500;
							font-size: 14px;
							margin: 16px 11.2px 0;
							font-family: "Secular One", sans-serif !important;
						}

						.dateText {
							color: ${userInfo.theme === "light" ? "var(--text-color-dark)" : "#e2e2e2"};

							font-weight: 400;
							font-size: 16px;
							font-family: "Metrophobic", sans-serif !important;

							line-height: 18px;
							letter-spacing: 0;

							word-wrap: break-word;
						}
					`}</style>
					<div className="left">
						{/* <div> */}
						{/* <img
							src="../public/banner.gif"
							alt="Banner"
							className={aboutStyles.bannerImg}
						/> */}
						{userInfo.banner ? (
							<img src={userInfo.banner} alt="Profile Banner" className={`${aboutStyles.banner} bannerImg`} />
						) : (
							// <Image
							// 	src={banner}
							// 	alt="Profile Banner"
							// 	className={aboutStyles.bannerImg}
							// 	loading="eager"
							// />
							<div
								className={`${aboutStyles.banner} bannerImg`}
								style={{
									backgroundColor: userInfo.theme_colors.primary.original,
								}}
							></div>
						)}
						{/* // <Image
						// 	src={banner}
						// 	alt="Profile Banner"
						// 	className={aboutStyles.bannerImg}
						// 	loading="eager"
						// /> */}
						{/* </div> */}
						<div className={aboutStyles.pfp}>
							{/* <Image
								className={aboutStyles.pfpImgBorder}
								src="/border.svg"
								alt="Picture of the author"
								width={160}
								height={160}
								loading="eager"
							/> */}

							{/* {userInfo.avatar_decoration ? (
								<div
									// src="/border.svg"
									// alt="Picture of the author"
									className={aboutStyles.pfpImgDecoBorder}
								/>
							) : (
								<div
									// src="/border.svg"
									// alt="Picture of the author"
									className={aboutStyles.pfpImgBorder}
								/>
							)} */}

							{/* <div
								// src="/border.svg"
								// alt="Picture of the author"
								className={aboutStyles.pfpImgBorder}
							/> */}

							<img
								// src="/profile.webp"
								src={userInfo.avatar}
								alt="Picture of the author"
								className="pfpImg"
							/>
							{/* <img
								src="/christmas.gif"
								alt="Picture of the author"
								className={aboutStyles.pfpImgMask}
							/> */}
						</div>
						<div className="badges">
							<Tooltip
								content={"HypeSquad Balance"}
								shadow={true}
								color="invert"
								rounded={true}
								css={{
									borderRadius: "7px",
									bg: "#1b1b1b",
									"& .nextui-tooltip-arrow": {
										//overwrite arrow bg color
										bg: "#1b1b1b",
									},
								}}
							>
								<Image
									src="/hypesquad_balance.svg"
									alt="Hypesquad"
									className={aboutStyles.badge}
									width={25}
									height={25}
									// loading="eager"
									priority={true}
								/>
							</Tooltip>
							<Tooltip
								content={"Active Developer"}
								shadow={true}
								color="invert"
								rounded={true}
								css={{
									borderRadius: "7px",
									bg: "#1b1b1b",
									"& .nextui-tooltip-arrow": {
										//overwrite arrow bg color
										bg: "#1b1b1b",
									},
								}}
							>
								<Image
									src="/active_developer.svg"
									alt="Active Developer"
									className={aboutStyles.badge}
									width={25}
									height={25}
									// loading="eager"
									priority={true}
								/>
							</Tooltip>
							<Tooltip
								content={"Subscriber since Dec 8, 2022"}
								shadow={true}
								color="invert"
								rounded={true}
								css={{
									borderRadius: "7px",
									bg: "#1b1b1b",
									"& .nextui-tooltip-arrow": {
										//overwrite arrow bg color
										bg: "#1b1b1b",
									},
								}}
							>
								<Image
									src="/nitro.svg"
									alt="Nitro"
									className={aboutStyles.badge}
									width={25}
									height={25}
									// loading="eager"
									priority={true}
								/>
							</Tooltip>
							<Tooltip
								content={"Server boosting since Dec 26, 2022"}
								shadow={true}
								color="invert"
								rounded={true}
								css={{
									borderRadius: "7px",
									bg: "#1b1b1b",
									"& .nextui-tooltip-arrow": {
										//overwrite arrow bg color
										bg: "#1b1b1b",
									},
								}}
							>
								<Image
									src="/boost.svg"
									alt="Boost"
									className={aboutStyles.badge}
									width={25}
									height={25}
									// loading="eager"
									priority={true}
								/>
							</Tooltip>
						</div>
						<div className={aboutStyles.bodyContainer}>
							<div className="body">
								<div className="username">
									{userInfo.username}
									<span className="discriminator">#{userInfo.discriminator}</span>
									{/* <button className={aboutStyles.copyButton}>
										Copy
									</button> */}
									<Unicons.UilCopy
										className="copyButton"
										onClick={() => {
											navigator.clipboard.writeText(userInfo.id);

											toast.success("Copied User ID to Clipboard!");

											setCopyButtonClicked(true);

											setTimeout(() => {
												setCopyButtonClicked(false);
											}, 200);
										}}
									/>
								</div>

								{userInfo.customActivity && (
									<div className={aboutStyles.customActivity}>
										{userInfo.customActivity.emoji && (
											<Tooltip
												content={`:${userInfo.customActivity.emoji.name}:`}
												shadow={true}
												color="invert"
												rounded={true}
												css={{
													borderRadius: "7px",
													bg: "#1b1b1b",
													"& .nextui-tooltip-arrow": {
														//overwrite arrow bg color
														bg: "#1b1b1b",
													},
												}}
											>
												<img
													src={`https://cdn.discordapp.com/emojis/${userInfo.customActivity.emoji.id}.${
														userInfo.customActivity.emoji.animated ? "gif" : "png"
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
											</Tooltip>
										)}
										<span
											style={{
												color: userInfo.theme === "light" ? "var(--text-color-dark)" : "#e2e2e2",
												fontWeight: 400,
												fontSize: "15px",

												// margin-left: 11.2px;
												// margin-bottom: 2px;

												fontFamily: "PT Sans, sans-serif !important",

												lineHeight: "20px",
												letterSpacing: 0,

												wordWrap: "break-word",
											}}
										>
											{userInfo.customActivity.state}
										</span>
									</div>
								)}

								<div className="seperator" />
								<div className={aboutStyles.bodyText}>
									<div className="bodyTextTitle">ABOUT ME</div>
									<div>
										{/* <p
											className={
												aboutStyles.bodyTextContent
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
										{console.log(userInfo.bio.split("\n"))}
										{userInfo.bio.split("\n").map((item: string, key: string) => {
											// console.log(item);
											if (item === "")
												return (
													<>
														{/* <div key={key} className="bodyTextContent" />
														<div key={key} className="bodyTextContent" /> */}
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
													</>
												);

											const line = item.replace(/\<(.*?)\:(.*?)\>/g, (match: any, p1: any, p2: any) => {
												// console.log(p2);
												return `_IMG_$img:${p2}_IMG_`;
											});

											console.log(line);

											const poop = line.split("_IMG_");

											console.log(poop);

											// console.log(line);
											// console.log(poop);

											// console.log(poop[0] !== "" && poop[0]);
											// console.log(poop.length);

											return (
												<div key={key} className="bodyTextContent">
													{poop[0] !== "" && poop[0]}
													{poop.length > 1 &&
														poop.map((poopitem: string, poopkey: number) => {
															if (poopkey === 0) return "";

															// if (poopitem === "") {
															// console.log("EMPTY");

															// 	return "";
															// }

															if (!poopitem.startsWith("$img:")) {
																// return <span key={poopkey}>{poopitem}</span>;
																return poopitem;
															}

															// console.log(poopitem);
															// console.log(poop);
															// console.log(line);

															const splittedEmo = poopitem.replace("$img:", "").split(":");

															return (
																<span key={poopkey}>
																	<Tooltip
																		content={`:${splittedEmo[0]}:`}
																		shadow={true}
																		color="invert"
																		rounded={true}
																		css={{
																			borderRadius: "7px",
																			bg: "#1b1b1b",
																			"& .nextui-tooltip-arrow": {
																				//overwrite arrow bg color
																				bg: "#1b1b1b",
																			},
																		}}
																	>
																		<Image
																			src={`https://cdn.discordapp.com/emojis/${splittedEmo[1]}.png?size=96`}
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
														})}
												</div>
											);
										})}
										{/* </p> */}
									</div>
									<div className="bodyTextTitle">MEMBER SINCE</div>
									<div>
										{/* <p
											className={
												aboutStyles.bodyTextContent
											}
										> */}
										<div className={aboutStyles.date}>
											<Tooltip
												content={"Discord"}
												shadow={true}
												color="invert"
												rounded={true}
												css={{
													borderRadius: "7px",
													bg: "#1b1b1b",
													"& .nextui-tooltip-arrow": {
														//overwrite arrow bg color
														bg: "#1b1b1b",
													},
												}}
											>
												<Image
													src={`/discord-mark-${userInfo.theme === "light" ? "black" : "white"}.svg`}
													alt="Discord"
													width={18}
													height={18}
													loading="eager"
												/>
											</Tooltip>
											<span className="dateText">Feb 03, 2022</span>
											{/* Bullet point */}
											<span
												style={{
													color: userInfo.theme === "light" ? "#4c4e5f" : "#b9bbca",
												}}
											>
												•
											</span>
											<Tooltip
												content={"Planet Earth"}
												shadow={true}
												color="invert"
												rounded={true}
												css={{
													borderRadius: "7px",
													bg: "#1b1b1b",
													"& .nextui-tooltip-arrow": {
														//overwrite arrow bg color
														bg: "#1b1b1b",
													},
												}}
											>
												<Image
													src="/world.svg"
													alt="Planet Earth"
													width={18}
													height={18}
													loading="eager"
													style={{
														// Invert
														filter: userInfo.theme === "light" ? "invert(0)" : "invert(1)",
													}}
												/>
											</Tooltip>
											<span className="dateText">Apr 08, 2007</span>
										</div>
										{/* </p> */}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className={aboutStyles.right}>
						<p className={aboutStyles.description}>
							Consectetur dolore velit consectetur irure cillum. In in veniam consectetur ad. Consectetur in qui consectetur sunt minim magna
							exercitation deserunt tempor aliquip. Amet enim velit elit fugiat eu aliqua minim eiusmod ex amet duis ipsum ut. Laboris ut do
							reprehenderit consequat sunt quis voluptate nisi. Eu non minim aute nulla ad eiusmod anim sunt esse nostrud duis commodo ut
							occaecat. Officia sit mollit laborum. Exercitation cupidatat exercitation voluptate amet culpa qui consectetur esse enim.
						</p>
					</div>
				</div>
			</div>
		</>
	);
}

// @ts-ignore
export async function getServerSideProps(context) {
	const response = await fetch("http://127.0.0.1:2013/userinfo", {
		method: "GET",
	});

	if (!response.ok) {
		return {
			props: {
				prevPage: context.req.headers.referer || null,
				userInfo: null,
			},
		};
	}

	const userInfo = await response.json();

	return {
		props: {
			prevPage: context.req.headers.referer || null,
			userInfo: userInfo,
		},
	};
}
