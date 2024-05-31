import styles from "@/styles/Index.module.scss";

export default function Component({
	setPage,
}: {
	setPage: (page: string) => void;
}) {
	return (
		<>
			<div className={styles.container}>
				<h1 className={styles.title}>Scrapbook</h1>

				<p className={styles.description}>Coming soon...</p>
			</div>
		</>
	);
}
