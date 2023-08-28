import Image from "next/image";
import Head from "next/head";

import { useState } from "react";
import { useRouter } from "next/router";

import clsx from "clsx";

// @ts-ignore
import { UilAngleLeft, UilAngleRight } from "@iconscout/react-unicons";

import navStyles from "components/styles/Nav.module.scss";

export default function NavBar({
	page,
	setPage,
	webring,
}: {
	page: string;
	setPage: (page: string) => void;
	webring: Array<any>;
}) {
	const router = useRouter();

	const [selectedPage, setSelectedPage] = useState<string>(router.pathname);

	const [cornerLeftHover, setCornerLeftHover] = useState<boolean>(false),
		[cornerRightHover, setCornerRightHover] = useState<boolean>(false);

	const pageName = page
		? page.substring(0, 1).toUpperCase() + page.substring(1)
		: "Home";

	const title = `${pageName} - iUnstable0`;

	return (
		<>
			<Head>
				<title>{title}</title>
				<meta name="description" content="Welcome to my website!" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div className={navStyles.container}>
				<div
					className={clsx(
						navStyles.corner,
						navStyles.corner_left,
						cornerLeftHover ? navStyles.corner_left_hover : "",
					)}
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
				<nav className={navStyles.navBar}>
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
				</nav>
				<div
					className={clsx(
						navStyles.corner,
						navStyles.corner_right,
						cornerRightHover ? navStyles.corner_right_hover : "",
					)}
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
							href="https://discord.com/users/938705972350840882"
							className={navStyles.cornerSocialLink}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Image
								src="/discord-mark-white.svg"
								alt="Discord"
								width={28}
								height={28}
								className={navStyles.cornerImg}
								priority={true}
							/>
						</a>
					</div>
				</div>
			</div>
		</>
	);
}
