// Packages

import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import lib_gql from "@iunstable0/website-libs/build/gql";

import lib_axios from "@iunstable0/server-libs/build/axios";

import lib_gqlSchema from "modules/gqlSchema";

// Components

import { motion, AnimatePresence } from "framer-motion";

import Nav from "components/nav";

import Home from "components/pages/home";
import About from "components/pages/about";
import Contact from "components/pages/contact";

// Styles

import styles from "styles/Index.module.scss";

// Types

// import type { InferGetServerSidePropsType, GetServerSideProps } from "next";

export const getServerSideProps = async (context: any) => {
	// console.log(
	// 	lib_gql.combineQueries(
	// 		lib_gqlSchema.query.getData,
	// 		lib_gqlSchema.query.discordInfo,
	// 	),
	// );

	return lib_axios
		.request({
			method: "POST",
			baseURL: process.env.NEXT_PUBLIC_GQL,
			headers: {
				"Content-Type": "application/json",
			},
			data: {
				query: lib_gql.combineQueries(
					lib_gqlSchema.query.getData,
					lib_gqlSchema.query.discordInfo,
					lib_gqlSchema.query.extraDiscordInfo,
					lib_gqlSchema.query.discordActivity,
				),
				variables: {
					videoFormat:
						// // If firefox then webm or else mp4
						context.req.headers["user-agent"].toLowerCase().includes("firefox")
							? "webm"
							: "mp4",
				},
			},
		})
		.then((response: any) => {
			const data = {
				...response.data.data.getData,
				discordInfo: response.data.data.discordInfo,
				extraDiscordInfo: response.data.data.extraDiscordInfo,
				discordActivity: response.data.data.discordActivity,
			};

			// console.log(data);

			const videos = data.videos;

			for (let i = videos.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[videos[i], videos[j]] = [videos[j], videos[i]];
			}

			return {
				props: {
					firstTimeVisit: true,
					videos,
					userInfo: null,
					webring: data.webring,
					discordInfo: data.discordInfo,
					extraDiscordInfo: data.extraDiscordInfo,
					discordActivity: data.discordActivity,
				},
			};
		})
		.catch((error: any) => {
			// console.log(error.response.data);
			console.log(lib_axios.parseError(error));

			return;
		});
};

export default function Page({
	// firstTimeVisit,
	// userInfo,
	contentVisible, // From _app.tsx
	webring,
	discordInfo,
	extraDiscordInfo,
	discordActivity,
}: {
	// firstTimeVisit: boolean;
	// userInfo: any;
	contentVisible: boolean;
	webring: Array<any>;
	discordInfo: any;
	extraDiscordInfo: any;
	discordActivity: any;
}) {
	const router = useRouter();

	const [page, setPage] = useState<any>(router.query.p || null);

	const durationTime = 0.1;
	const delayTime = 0.15;

	useEffect(() => {
		if (router.query.p) {
			const newQuery = { ...router.query };

			delete newQuery.p;
			void router.replace({ pathname: router.pathname, query: newQuery });
			localStorage.setItem("page", router.query.p?.toString() || "home");

			return;
		}

		setPage(localStorage.getItem("page") || "home");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<motion.div
			key={"masteros"}
			className={styles.pageContainer}
			style={{
				backgroundColor: contentVisible ? "#0000007c" : "transparent",
				backdropFilter: contentVisible ? "blur(10px)" : "none",
				WebkitBackdropFilter: contentVisible ? "blur(10px)" : "none",
			}}
			initial={{
				opacity: 0,
			}}
			animate={{
				opacity: 1,
			}}
			// exit={{
			// 	opacity: 0,
			// }}
			transition={{
				duration: 0.15,
			}}
		>
			<Nav
				page={page}
				setPage={(page: string) => {
					setPage(page);

					localStorage.setItem("page", page);
				}}
				webring={webring}
				discordUserInfo={discordInfo}
				extraDiscordUserInfo={extraDiscordInfo}
				discordUserActivity={discordActivity}
				contentVisible={contentVisible}
			/>

			<AnimatePresence>
				{contentVisible && page === "home" && (
					<motion.div
						key={"WOWGAYSEx"}
						initial={{
							opacity: 0,
							display: "none",
						}}
						animate={{
							opacity: 1,
							display: "block",
							transition: {
								delay: delayTime,
							},
						}}
						exit={{
							opacity: 0,
						}}
						transition={{
							duration: durationTime,
						}}
					>
						<Home setPage={setPage} />
					</motion.div>
				)}

				{contentVisible && page === "about" && (
					<motion.div
						key={"OMGGAYSEX"}
						initial={{
							opacity: 0,
							display: "none",
						}}
						animate={{
							opacity: 1,
							display: "block",
							transition: {
								delay: delayTime,
							},
						}}
						exit={{
							opacity: 0,
						}}
						transition={{
							duration: durationTime,
						}}
					>
						<About setPage={setPage} />
					</motion.div>
				)}

				{contentVisible && page === "contact" && (
					<motion.div
						key={page}
						initial={{
							opacity: 0,
							display: "none",
						}}
						animate={{
							opacity: 1,
							display: "block",
							transition: {
								delay: delayTime,
							},
						}}
						exit={{
							opacity: 0,
						}}
						transition={{
							duration: durationTime,
						}}
					>
						<Contact setPage={setPage} />
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
}
