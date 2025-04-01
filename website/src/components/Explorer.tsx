"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";

import { usePathname } from "next/navigation";

import Link from "next/link";

import clsx from "clsx";
import useSound from "use-sound";

import { FileCodeIcon, FileDirectoryIcon } from "@primer/octicons-react";

import { motion } from "framer-motion";

import { TreeItem } from "@/types/explorer";

import styles from "./explorer.module.css";

import ScrambledText from "@/components/ScrambledText";

const tree: TreeItem[] = [
	{
		name: "index.tsx",
		type: "file",
		path: "/",
	},
	{
		name: "about.tsx",
		type: "file",
		path: "/about",
	},
	{
		name: "contact.tsx",
		type: "file",
		path: "/contact",
	},
	{
		name: "blog",
		type: "directory",
		path: "/blog",
		children: [
			{
				name: "index.tsx",
				type: "file",
				path: "/blog",
			},
			{
				name: "2027",
				type: "directory",
				path: "/blog/2027",
				children: [],
			},
			{
				name: "2026",
				type: "directory",
				path: "/blog/2026",
				children: [],
			},
			{
				name: "2025",
				type: "directory",
				path: "/blog/2025",
				children: [],
			},
			{
				name: "2024",
				type: "directory",
				path: "/blog/2024",
				children: [],
			},
			{
				name: "2023",
				type: "directory",
				path: "/blog/2023",
				children: [],
			},
			{
				name: "2022",
				type: "directory",
				path: "/blog/2022",
				children: [],
			},
			{
				name: "2021",
				type: "directory",
				path: "/blog/2021",
				children: [],
			},
			{
				name: "2020",
				type: "directory",
				path: "/blog/2020",
				children: [],
			},
		],
	},
];

const iconMapping = {
	file: FileCodeIcon,
	directory: FileDirectoryIcon,
};

function buildLookup(tree: TreeItem[]): Record<string, TreeItem> {
	const lookup: Record<string, TreeItem> = {};

	function traverse(nodes: TreeItem[]) {
		nodes.forEach((node: TreeItem) => {
			if (node.type === "directory") {
				lookup[node.path] = node;

				if (node.children && node.children.length > 0) {
					traverse(node.children);
				}
			}
		});
	}

	traverse(tree);

	return lookup;
}

function Item({
	obj,
	IconComponent,
	activeItem,
	errorItem,
	pathname,
	playHover,
	playClick,
	pwd,
	changePwd,
	setActiveErrorItem,
	delay,
}: {
	obj: TreeItem;
	IconComponent: React.ComponentType;
	activeItem: string;
	errorItem: string;
	pathname: string;
	playHover: () => void;
	playClick: () => void;
	pwd: string;
	changePwd: (path: string) => void;
	setActiveErrorItem: (item: string) => void;
	delay: number;
}) {
	// alert(pwd === "/" ? `stinky${pathname}` : obj.path);
	return (
		<Link
			className={clsx(
				styles.item,
				activeItem === obj.name && styles.active,
				errorItem === obj.name && styles.error,
				pathname === obj.path && obj.name !== ".." && styles.selected,
			)}
			href={pwd === "/" && obj.name === ".." ? pathname : obj.path}
			onMouseEnter={() => {
				playHover();
			}}
			onClick={() => {
				playClick();

				changePwd(obj.path);

				setActiveErrorItem(obj.name);

				setTimeout(() => {
					setActiveErrorItem("");
				}, delay);
			}}
		>
			<IconComponent />
			<p>{obj.name}</p>
		</Link>
	);
}

function MotionListItem({
	children,
	pwd,
	index,
	playFolder,
}: {
	children: React.ReactNode;
	pwd: string;
	index: number;
	playFolder: () => void;
}) {
	const [loaded, setLoaded] = useState(false);

	const timeoutRef = useRef<NodeJS.Timeout>(null);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [pwd]);

	return (
		<motion.li
			style={{
				pointerEvents: loaded ? "all" : "none",
			}}
			// Consensus: 2nd is better uwu.
			// PayPal me 20 bucks to choose your own animation,
			// and I'll keep it in prod for a week

			// initial={{ opacity: 0, scale: 0.97, x: "-5%" }}
			initial={{ opacity: 0, scale: 0.97 }}
			// initial={{ opacity: 0, scale: 1 }}
			animate={{ opacity: 1, scale: 1, x: 0 }}
			transition={{ delay: index * 0.1, duration: 0.25 }}
			onAnimationStart={() => {
				timeoutRef.current = setTimeout(
					() => {
						playFolder();
						setLoaded(true);
					},
					(index * 0.1 + 0.25 / 3) * 1000,
				);
			}}
		>
			{children}
		</motion.li>
	);
}

export function Explorer() {
	const [activeItem, setActiveItem] = useState<string>("");
	const [errorItem, setErrorItem] = useState<string>("");
	const [pwd, setPwd] = useState<string>("/");

	const [playHover] = useSound("/stdin.wav");
	const [playClick] = useSound("/click.wav");
	const [playError] = useSound("/error.wav");
	const [playFolder] = useSound("/hover.wav");

	const pathname = usePathname();

	const lookup = useMemo(() => buildLookup(tree), [tree]);

	const currentNode: TreeItem[] =
		pwd === "/" ? tree : lookup[pwd]?.children || [];

	let parentPath = pwd.replace(/\/[^/]+$/, "");
	parentPath = parentPath === "" ? "/" : parentPath;

	return (
		<div className={styles.explorer}>
			{/*<div className={styles.pwd}>{pwd}</div>*/}

			<div className={styles.pwd}>
				{pwd === "/" ? (
					<span className={styles.glow}>/</span>
				) : (
					pwd.split("/").map((directory, index) => (
						<React.Fragment key={index}>
							{index > 0 && <span className={styles.glow}>/</span>}
							{directory}
						</React.Fragment>
					))
				)}
			</div>

			{/* ... inside your component’s return ... */}
			{/*<div className={styles.pwd}>*/}
			{/*	<ScrambledText text={pwd} />*/}
			{/*</div>*/}

			<ul className={styles.files}>
				<Item
					obj={{
						name: "..",
						type: "directory",
						path: parentPath,
						children: [],
					}}
					IconComponent={FileDirectoryIcon}
					activeItem={activeItem}
					errorItem={errorItem}
					pathname={pathname}
					playHover={playHover}
					playClick={pwd === "/" ? playError : playClick}
					pwd={pwd}
					changePwd={(path: string) => {
						// if (pwd !== "/") {
						setPwd(path);
						// }
					}}
					setActiveErrorItem={pwd === "/" ? setErrorItem : setActiveItem}
					delay={250}
				/>

				{currentNode.map((obj: TreeItem, index) => {
					const IconComponent = iconMapping[obj.type];
					const objectId = `${obj.name}:${obj.path}`;

					return (
						<MotionListItem
							key={objectId}
							pwd={pwd}
							index={index}
							playFolder={playFolder}
						>
							<Item
								obj={obj}
								IconComponent={IconComponent}
								activeItem={activeItem}
								errorItem={errorItem}
								pathname={pathname}
								playHover={playHover}
								playClick={playClick}
								pwd={pwd}
								changePwd={(path: string) => {
									if (obj.type === "directory") {
										setPwd(path);
									}
								}}
								setActiveErrorItem={setActiveItem}
								delay={100}
							/>
						</MotionListItem>
					);
				})}
			</ul>
		</div>
	);
}
