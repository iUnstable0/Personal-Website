import { useEffect, useState } from "react";

import { DateTime } from "luxon";

import Image from "next/image";
import Typewriter from "typewriter-effect";

import styles from "styles/Index.module.scss";

export default function Component({ setPage }: { setPage: (page: string) => void }) {
	const times = {
		english: {
			prefix: "Good ",
			suffixes: ["morning", "afternoon", "evening"],
		},
		french: {
			prefix: "Bon",
			suffixes: ["jour", "jour", "soir"],
		},
		spanish: {
			prefix: "Buen",
			suffixes: ["os dias", "as tardes", "as noches"],
		},
		german: {
			prefix: "Guten ",
			suffixes: ["morgen", "nachmittag", "abend"],
		},
		italian: {
			prefix: "Buon",
			suffixes: ["giorno", " pomeriggio", "asera"],
		},
		portuguese: {
			prefix: "Bo",
			suffixes: ["m dia", "a tarde", "a noite"],
		},
		russian: {
			prefix: "Доб",
			suffixes: ["рое утро", "рый день", "рый вечер"],
		},
		chinese: {
			prefix: "",
			suffixes: ["早上好", "下午好", "晚上好"],
		},
		japanese: {
			prefix: "",
			suffixes: ["おはよう", "こんにちは", "こんばんは"],
		},
		korean: {
			prefix: "",
			suffixes: ["굿모닝", "안녕", "안녕"],
		},
		thai: {
			prefix: "สวัสดีตอน",
			suffixes: ["เช้า", "บ่าย", "เย็น"],
		},
	};

	const getGreetingTime = (language: string) => {
		const hour = DateTime.local().hour;
		const target = times[language as keyof typeof times];

		if (hour >= 3 && hour < 12) return `${target.prefix}${target.suffixes[0]}`;
		else if (hour >= 12 && hour < 17) return `${target.prefix}${target.suffixes[1]}`;
		else if (hour >= 17 && hour < 24) return `${target.prefix}${target.suffixes[2]}`;
		else return `${target.prefix}${target.suffixes[0]}`;
	};

	const [greetings, setGreetings] = useState(
		[
			// "Howdy",
			// "Hello",
			// "Hi",
			// "Hey",
			// "What's up",
			// "Sup",
			// "Yo",
			// "Wssp",
			// "G'day",
			// "Greetings",
			// "Hiya",
			// "Hey there",
			// "Heyyy",
			// "Hello there",
			// "Hi there",
			// `Bonjour`,
			// "Ciao",
			// "Salut",
			// "Hola",
			// "Ello",
			// "Aloha",
			// "Halo",
			// "Good day",
			// "Howdy doody",
			// "Whazzup",
			// "こんにちは",
			// "여보",
			// "Haló",
			// "Olá",
			// "Hej",
			// "你好",
			...Object.keys(times).map((key) => getGreetingTime(key)),
		].map((greeting) => `${greeting}!`)
	);

	const getAge = () => {
		const birthday = DateTime.local(2007, 4, 8);
		const now = DateTime.local();

		const duration = now.diff(birthday, ["years", "months", "days", "hours", "minutes", "seconds", "milliseconds"]).toObject();

		return `I'm ${duration.years} years, ${duration.months} months, ${duration.days} days, ${duration.hours} hours, ${duration.minutes} minutes, and ${duration.seconds} seconds old`;
	};

	const [age, setAge] = useState("");

	useEffect(() => {
		setInterval(() => {
			setAge(getAge());
		}, 1);

		let shuffledGreetings = [...greetings];

		for (let i = shuffledGreetings.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffledGreetings[i], shuffledGreetings[j]] = [shuffledGreetings[j], shuffledGreetings[i]];
		}

		setGreetings(shuffledGreetings);
	}, []);

	return (
		<>
			<div className={styles.container}>
				<h1 className={styles.title}>
					<Typewriter
						options={{
							strings: greetings,
							autoStart: true,
							loop: true,
						}}
					/>
				</h1>
				<Image src="/wave.gif" alt="wave" width={64} height={64} className={styles.wave} priority={true} />

				<p className={styles.description}>
					{age}
					<br />
					Currently living on the Earth
				</p>
			</div>
		</>
	);
}
