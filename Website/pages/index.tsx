import { useEffect, useState } from "react";

import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";

import Nav from "components/nav";

import Home from "components/pages/home";
import About from "components/pages/about";

export async function getServerSideProps(context: any) {
	let videoMap = {
		"ajriwont.mp4": {
			title: "I Won't",
			artist: "AJR",
		},
		"ajrimready.mp4": {
			title: "I'm Ready",
			artist: "AJR",
		},
		"ajrsoberup.mp4": {
			title: "Sober Up (feat. Rivers Cuomo)",
			artist: "AJR",
		},
		"ajr100baddays.mp4": {
			title: "100 Bad Days",
			artist: "AJR",
		},
		"ajrwaylesssad.mp4": {
			title: "Way Less Sad",
			artist: "AJR",
		},
		"ajrokoverture.mp4": {
			title: "OK Overture",
			artist: "AJR",
		},
		"andygrammerdontgiveuponme.mp4": {
			title: "Don't Give Up On Me",
			artist: "Andy Grammer",
		},
		"americanauthorsbestdayofmylife.mp4": {
			title: "Best Day of My Life",
			artist: "American Authors",
		},
		"ansonseabraemeraldeyes.mp4": {
			title: "Emerald Eyes",
			artist: "Anson Seabra",
		},
		"ansonseabrapeterpanwasright.mp4": {
			title: "Peter Pan Was Right",
			artist: "Anson Seabra",
		},
		"bastillequarterpastmidnight.mp4": {
			title: "Quarter Past Midnight",
			artist: "Bastille",
		},
		"bastillegivemethefuture.mp4": {
			title: "Give Me The Future",
			artist: "Bastille",
		},
		"bastillepompeii.mp4": {
			title: "Pompeii",
			artist: "Bastille",
		},
		"bleachersrollercoaster.mp4": {
			title: "Rollercoaster",
			artist: "Bleachers",
		},
		"bleachers45.mp4": {
			title: "45",
			artist: "Bleachers",
		},
		"annenmaykantereitxparcelscantgetyououtofmyhead.mp4": {
			title: "Can't Get You Out Of My Head (AnnenMayKantereit x Parcels)",
			artist: "AnnenMayKantereit",
		},
		"annenmaykantereitxgiantrookstomsdiner.mp4": {
			title: "Tom's Diner (AnnenMayKantereit x Giant Rooks)",
			artist: "AnnenMayKantereit",
		},
		"littlehurtalaska.mp4": {
			title: "Alaska",
			artist: "Little Hurt",
		},
		"magicreddress.mp4": {
			title: "Red Dress",
			artist: "MAGIC!",
		},
		"noahkahanfalseconfidence.mp4": {
			title: "False Confidence",
			artist: "Noah Kahan",
		},
		"ofmonstersandmendirtypaws.mp4": {
			title: "Dirty Paws",
			artist: "Of Monsters and Men",
		},
		"augustanaboston.mp4": {
			title: "Boston",
			artist: "Augustana",
		},
		"augustanasayyouwantme.mp4": {
			title: "Say You Want Me",
			artist: "Augustana",
		},
		"bannersperfectlybroken.mp4": {
			title: "Perfectly Broken",
			artist: "BANNERS",
		},
		"deanlewishowdoisaygoodbye.mp4": {
			title: "How Do I Say Goodbye",
			artist: "Dean Lewis",
		},
		"fitzandthetantrumshandclap.mp4": {
			title: "HandClap",
			artist: "Fitz and the Tantrums",
		},
		"fun.somenights.mp4": {
			title: "Some Nights",
			artist: "Fun.",
		},
		"giantrookswatershed.mp4": {
			title: "Watershed",
			artist: "Giant Rooks",
		},
		"haydclosure.mp4": {
			title: "Closure",
			artist: "Hayd",
		},
		"haydwhatdidido.mp4": {
			title: "What Did I Do?",
			artist: "Hayd",
		},
		"jamesarthursayyouwontletgo.mp4": {
			title: "Say You Won't Let Go",
			artist: "James Arthur",
		},
		"jamesarthurimpossible.mp4": {
			title: "Impossible",
			artist: "James Arthur",
		},
		"jamesarthuremptyspace.mp4": {
			title: "Empty Space",
			artist: "James Arthur",
		},
		"harrystylesgolden.mp4": {
			title: "Golden",
			artist: "Harry Styles",
		},
		"linkinparkintheend.mp4": {
			title: "In The End",
			artist: "Linkin Park",
		},
		"jamiemillerheresyourperfect.mp4": {
			title: "Here's Your Perfect",
			artist: "Jamie Miller",
		},
		"jasonmrazhaveitall.mp4": {
			title: "Have It All",
			artist: "Jason Mraz",
		},
		"keanesovereignlightcafe.mp4": {
			title: "Sovereign Light Cafe",
			artist: "Keane",
		},
		"lauvlovesomebody.mp4": {
			title: "Love Somebody",
			artist: "Lauv",
		},
		"lewiscapaldiholdmewhileyouwait.mp4": {
			title: "Hold Me While You Wait",
			artist: "Lewis Capaldi",
		},
		"twentyonepilotstearinmyheart.mp4": {
			title: "Tear In My Heart",
			artist: "twenty one pilots",
		},
		"troyesivanluckystrike.mp4": {
			title: "Lucky Strike",
			artist: "Troye Sivan",
		},
		"onedirectiondiana.mp4": {
			title: "Diana",
			artist: "One Direction",
		},
		"onedirectionnightchanges.mp4": {
			title: "Night Changes",
			artist: "One Direction",
		},
		"onedirectionendoftheday.mp4": {
			title: "End Of The Day",
			artist: "One Direction",
		},
		"onedirectiongirlalmighty.mp4": {
			title: "Girl Almighty",
			artist: "One Direction",
		},
		"onedirectionhistory.mp4": {
			title: "History",
			artist: "One Direction",
		},
		"onedirectionstoryofmylife.mp4": {
			title: "Story Of My Life",
			artist: "One Direction",
		},
		"onedirectioninfinity.mp4": {
			title: "Infinity",
			artist: "One Direction",
		},
		"panicatthediscodontletthelightgoout.mp4": {
			title: "Don't Let The Light Go Out",
			artist: "Panic! At The Disco",
		},
		"panicatthediscodeathofabachelor.mp4": {
			title: "Death Of A Bachelor",
			artist: "Panic! At The Disco",
		},
		"sheppardgeronimo.mp4": {
			title: "Geronimo",
			artist: "Sheppard",
		},
		"simpleplanjetlagft.marie-mai.mp4": {
			title: "Jet Lag ft. Marie-Mai",
			artist: "Simple Plan",
		},
		"ragnbonemanhuman.mp4": {
			title: "Human",
			artist: "Rag'n'Bone Man",
		},
		"phillipphillipsgonegonegone.mp4": {
			title: "Gone, Gone, Gone",
			artist: "Phillip Phillips",
		},
		"snowpatrollifeonearth.mp4": {
			title: "Life On Earth",
			artist: "Snow Patrol",
		},
		"starsetmydemons.mp4": {
			title: "My Demons",
			artist: "Starset",
		},
		"stephaniepoetriiloveyou3000.mp4": {
			title: "I Love You 3000",
			artist: "Stephanie Poetri",
		},
		"thefrayhowtosavealife.mp4": {
			title: "How To Save A Life",
			artist: "The Fray",
		},
		"tomwalkerjustyouandi.mp4": {
			title: "Just You And I",
			artist: "Tom Walker",
		},
		"tomwalkerleavealighton.mp4": {
			title: "Leave A Light On",
			artist: "Tom Walker",
		},
	};

	let videos: any = [];

	for (const [key, value] of Object.entries(videoMap)) {
		videos.push({
			src: `https://objects.iunstable0.com/videos/42f6080c-3878-48b2-84ab-58e1f319d402/${key}`,
			title: value.title,
			artist: value.artist,
		});
	}

	// Shuffle video array

	for (let i = videos.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[videos[i], videos[j]] = [videos[j], videos[i]];
	}

	return {
		props: {
			firstTimeVisit: !context.req.headers.referer ? true : context.req.headers.referer.includes("iunstable0.com") ? false : true,
			videos: videos,
			userInfo: null,
		},
	};

	// const response = await fetch("http://127.0.0.1:2013/userinfo", {
	// 	method: "GET",
	// });

	// if (!response.ok) {
	// 	return {
	// 		props: {
	// 			firstTimeVisit: !context.req.headers.referer ? true : context.req.headers.referer.includes("iunstable0.com") ? false : true,
	// 			videos: videos,
	// 			userInfo: null,
	// 		},
	// 	};
	// }

	// const userInfo = await response.json();

	// return {
	// 	props: {
	// 		firstTimeVisit: !context.req.headers.referer ? true : context.req.headers.referer.includes("iunstable0.com") ? false : true,
	// 		videos: videos,
	// 		userInfo: userInfo,
	// 	},
	// };
}

export default function Page({ firstTimeVisit, userInfo, contentVisible }: { firstTimeVisit: boolean; userInfo: any; contentVisible: boolean }) {
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
	}, []);

	return (
		<AnimatePresence>
			{contentVisible && (
				<motion.div
					key={"content"}
					initial="pageInitial"
					animate="pageAnimate"
					exit="pageExit"
					variants={{
						pageInitial: {
							opacity: 0,
							// display: "none",
						},
						pageAnimate: {
							opacity: 1,
							// display: "block",
							// transition: {
							// 	delay: delayTime,
							// },
						},
						pageExit: {
							opacity: 0,
						},
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
					/>

					<AnimatePresence>
						{page === "home" && (
							<motion.div
								key={page}
								initial="pageInitial"
								animate="pageAnimate"
								exit="pageExit"
								variants={{
									pageInitial: {
										opacity: 0,
										display: "none",
									},
									pageAnimate: {
										opacity: 1,
										display: "block",
										transition: {
											delay: delayTime,
										},
									},
									pageExit: {
										opacity: 0,
									},
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
								initial="pageInitial"
								animate="pageAnimate"
								exit="pageExit"
								variants={{
									pageInitial: {
										opacity: 0,
										display: "none",
									},
									pageAnimate: {
										opacity: 1,
										display: "block",
										transition: {
											delay: delayTime,
										},
									},
									pageExit: {
										opacity: 0,
									},
								}}
								transition={{
									duration: durationTime,
								}}
							>
								{/* <About setPage={setPage} userInfo={userInfo} /> */}
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
