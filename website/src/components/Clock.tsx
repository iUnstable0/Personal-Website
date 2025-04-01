"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";

import { motion, LayoutGroup } from "framer-motion";

import { DateTime } from "luxon";

import styles from "./clock.module.css";
import ScrambledText from "@/components/ScrambledText";

function beautify(number: number) {
	if (number.toString().length === 1) {
		return `0${number}`;
	}

	return number;
}

function getOrdinal(number: number) {
	const suffixes = ["th", "st", "nd", "rd"];
	const value = number % 100;
	return (
		number + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0])
	);
}

const timezone = "Asia/Bangkok";
const country = "Thailand";
const countryCode = "TH";

export function Clock() {
	const [time, setTime] = useState(DateTime.now().setZone(timezone));

	// const visitorTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	function getTimeInfo(number: number) {
		switch (number) {
			case 0:
				return `${time.weekdayShort} ${time.monthShort} ${getOrdinal(time.day)}`;
			case 1:
				const diffInMinutes = DateTime.now().offset - time.offset;

				const hours = Math.floor(Math.abs(diffInMinutes) / 60);
				const minutes = Math.abs(diffInMinutes) % 60;

				const sign = diffInMinutes <= 0 ? "+" : "-";

				return `${sign}${hours}h ${minutes}m`;
		}
	}

	const [info, setInfo] = useState(getTimeInfo(0));

	useEffect(() => {
		const interval = setInterval(() => {
			setTime(DateTime.now().setZone(timezone));
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		let counter = 1;

		const interval = setInterval(() => {
			if (counter == 2) {
				counter = 0;
			}

			setInfo(getTimeInfo(counter));

			counter += 1;
		}, 5000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className={styles.clock}>
			<Image
				src={`/flags/${countryCode}.svg`}
				alt={country}
				width={20}
				height={20}
				className={styles.flag}
			/>
			<span className={styles.sep}> |</span>
			<div
				className={styles.info}
				style={{
					color:
						info &&
						(info.startsWith("+")
							? "#a3be8c"
							: info.startsWith("-")
								? "#bf616a"
								: ""),
					fontWeight: 600,
				}}
			>
				<ScrambledText text={info || ""} />
			</div>
			{beautify(time.hour)}:{beautify(time.minute)}:{beautify(time.second)}
		</div>
	);
}
