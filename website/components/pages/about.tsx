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
          I{"'"}m a self-taught passionate full-stack developer living in Phuket, Thailand.
          <br />
          <br />
          I have been programming since I was 10 years old and my first language was Roblox Lua.

        {/* <p className={styles.description}>
          This is a website I made to show my favorite songs
          <br />
          and skills in full-stack development.
          <br />
          <br />
          Framework used: Next.js (frontend), Apollo GraphQL, and Fastify
          (backend)
          <br />
          I use TypeScript for both frontend and backend
          <br />
          IDE used: WebStorm
          <br />
          Git repository hosted on GitHub
          <br />
          <br />
          This website is hosted using my own server
          <br />
          (Debian 11 Bullseye) behind Caddy server
          <br />
          and Cloudflare for caching and security
          <br />
          <br />
          Domain bought off Namecheap
          <br />
          Automatic deployment with CI/CD (Jenkins)
          <br />
          Everything is self-hosted
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
