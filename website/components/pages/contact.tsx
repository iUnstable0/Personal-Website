import styles from "styles/Index.module.scss";

export default function Component({
	setPage,
}: {
	setPage: (page: string) => void;
}) {
	return (
		<>
			<div className={styles.container}>
				<h1 className={styles.title}>Contact me</h1>

				<p className={styles.description}>
					Hmu on Discord (top right corner) or email me admin@gang.email
				</p>
			</div>
		</>
	);
}
