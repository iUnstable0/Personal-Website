import styles from "styles/Index.module.scss";

export default function Component({
	setPage,
}: {
	setPage: (page: string) => void;
}) {
	return (
		<>
			<div className={styles.container}>
				<h1 className={styles.title}>About</h1>

				<p className={styles.description}>
					I{"'"}m a self-taught full-stack developer
					<br />
					<br />I{"'"}ve been programming since I was 10 years old, and my first
					language was Roblox Lua.
					<br />
					<br />
					Languages I currently know: JavaScript, TypeScript, Python, Lua, Rust
					<br />
					Languages I{"'"}m learning (and planning to learn): Rust, Go, C++,
					Swift
					<br />
					<br />
					This website is fully open source and you can find the source code on
					my GitHub (top right)
					{/*<br />*/}
					{/*<br />*/}
					{/*VPS provider: Contabo (abt $11.99 a month + $2.99 for 250gb of S3*/}
					{/*object storage)*/}
					{/*<br />*/}
					{/*Server specs: 6 vCPU, 32GB RAM, 200GB NVMe SSD, 32TB bandwidth*/}
					{/*<br />*/}
					{/*unlimited incoming, speed 600mbps up/down*/}
				</p>
			</div>
		</>
	);
}
