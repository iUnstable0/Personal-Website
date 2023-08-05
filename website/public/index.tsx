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

export async function getServerSideProps(context: any) {
  return lib_axios
    .request({
      method: "POST",
      url: "/gql",
      baseURL: process.env.NEXT_PUBLIC_GQL,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        query: lib_gqlSchema.query.getVideos,
      },
    })
    .then((response: any) => {
      const data = response.data.data.getVideos;

      for (let i = data.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [data[i], data[j]] = [data[j], data[i]];
      }

      return {
        props: {
          firstTimeVisit: !context.req.headers.referer
            ? true
            : !context.req.headers.referer.includes("iunstable0.com"),
          videos: data,
          userInfo: null,
        },
      };
    })
    .catch((error: any) => {
      console.log(error);
    });
}

export default function Page({
  firstTimeVisit,
  userInfo,
  contentVisible,
}: {
  firstTimeVisit: boolean;
  userInfo: any;
  contentVisible: boolean;
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
                <About setPage={setPage} />
              </motion.div>
            )}

            {page === "contact" && (
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
                <Contact setPage={setPage} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
