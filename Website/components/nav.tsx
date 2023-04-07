import Image from "next/image";
import Head from "next/head";

import { useState } from "react";
import { useRouter } from "next/router";

import navStyles from "components/styles/Nav.module.scss";

export default function NavBar({
	page,
	setPage,
}: {
	page: string;
	setPage: (page: string) => void;
}) {
	const router = useRouter();

	const [selectedPage, setSelectedPage] = useState<string>(router.pathname);

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
				<div className={navStyles.corner}>
					<a
						title="My Github"
						href="https://github.com/iUnstable0"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Image
							src="/github-mark-white.svg"
							alt="GitHub"
							width={32}
							height={32}
							className={navStyles.cornerImg}
							priority={true}
						/>
					</a>
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
				<div className={navStyles.corner}>
					<a
						title="My Discord"
						href="https://discord.com/users/938705972350840882"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Image
							src="/discord-mark-white.svg"
							alt="Discord"
							width={32}
							height={32}
							className={navStyles.cornerImg}
							priority={true}
						/>
					</a>
				</div>
			</div>
		</>
	);
}
