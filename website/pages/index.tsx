// Packages

import { useEffect, useState } from "react";

import { useRouter } from "next/router";

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
	return lib_axios
		.request({
			method: "POST",
			baseURL: process.env.NEXT_PUBLIC_GQL,
			headers: {
				"Content-Type": "application/json",
			},
			data: {
				query: lib_gqlSchema.query.getVideos,
				variables: {
					format:
						// // If firefox then webm or else mp4
						context.req.headers["user-agent"].toLowerCase().includes("firefox")
							? "webm"
							: "mp4",
				},
			},
		})
		.then((response: any) => {
			const data = response.data.data.getVideos;

			for (let i = data.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[data[i], data[j]] = [data[j], data[i]];
			}

			return lib_axios
				.request({
					method: "GET",
					url: "https://raw.githubusercontent.com/hackclub/webring/main/members.json",
				})
				.then((response: any) => {
					const data2 = response.data;

					// console.log(data2);

					return {
						props: {
							firstTimeVisit: !context.req.headers.referer
								? true
								: !context.req.headers.referer.includes("iunstable0.com"),
							videos: data,
							userInfo: null,
							webring: data2,
						},
					};
				})
				.catch((error: any) => {
					console.log(error);

					return null;
				});
		})
		.catch((error: any) => {
			console.log(lib_axios.parseError(error));

			return null;
		});
};

export default function Page({
	firstTimeVisit,
	userInfo,
	contentVisible, // From _app.tsx
	webring,
	F,
}: {
	firstTimeVisit: boolean;
	userInfo: any;
	contentVisible: boolean;
	webring: Array<any>;
}) {
	const router = useRouter();

	const [page, setPage] = useState<any>(router.query.p || null);

	const durationTime = 0.1;
	const delayTime = 0.15;

	useEffect(() => {
		if (router.query.p) {
			const newQuery = { ...router.query };

			delete newQuery.p;
			router.replace({ pathname: router.pathname, query: newQuery });
			localStorage.setItem("page", router.query.p?.toString() || "home");

			return;
		}

		setPage(localStorage.getItem("page") || "home");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<AnimatePresence>
			{contentVisible && (
				<motion.div
					key={"content"}
					initial={{
						opacity: 0,
						// display: "none",
					}}
					animate={{
						opacity: 1,
						// display: "block",
						// transition: {
						// 	delay: delayTime,
						// },
					}}
					exit={{
						opacity: 0,
					}}
					transition={{
						duration: durationTime,
					}}
				>
					<Nav
						page={page}
						setPage={(page: string) => {
							setPage(page);

							localStorage.setItem("page", page);
						}}
						webring={webring}
					/>

					<div className={styles.pageContainer}>
						<AnimatePresence>
							{page === "home" && (
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
									<Home setPage={setPage} />
								</motion.div>
							)}

							{page === "about" && (
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
									<About setPage={setPage} />
								</motion.div>
							)}

							{page === "contact" && (
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
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
