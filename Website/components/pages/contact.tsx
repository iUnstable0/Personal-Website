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
          Hmu on Discord (top right corner) or email me big@gang.email
          <br />
          <br />
          If you{"'"}re my friend and want an @gang.email address (self-hosted
          by me)
          <br />
          just ask me for it. I{"'"}m more than happy to give it to you.
        </p>
      </div>
    </>
  );
}
