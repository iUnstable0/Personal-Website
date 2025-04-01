"use client";
import React, { useEffect, useRef } from "react";

class TextScramble {
	el: HTMLElement;
	chars: string;
	queue: any[];
	frame: number;
	frameRequest: number;
	resolve: () => void;

	constructor(el: HTMLElement) {
		this.el = el;
		this.chars = "!<>-_\\/[]{}—=+*^?#________";
		this.update = this.update.bind(this);
	}

	setText(newText: string) {
		const oldText = this.el.innerText;
		const length = Math.max(oldText.length, newText.length);
		// Create a promise to allow external handling if needed
		const promise = new Promise<void>((resolve) => (this.resolve = resolve));
		this.queue = [];
		for (let i = 0; i < length; i++) {
			const from = oldText[i] || "";
			const to = newText[i] || "";
			const start = Math.floor(Math.random() * 40);
			const end = start + Math.floor(Math.random() * 40);
			this.queue.push({ from, to, start, end });
		}
		cancelAnimationFrame(this.frameRequest);
		this.frame = 0;
		this.update();
		return promise;
	}

	update() {
		let output = "";
		let complete = 0;
		for (let i = 0, n = this.queue.length; i < n; i++) {
			let { from, to, start, end, char } = this.queue[i];
			if (this.frame >= end) {
				complete++;
				output += to;
			} else if (this.frame >= start) {
				if (!char || Math.random() < 0.28) {
					char = this.randomChar();
					this.queue[i].char = char;
				}
				output += `<span class="dud">${char}</span>`;
			} else {
				output += from;
			}
		}
		this.el.innerHTML = output;
		if (complete === this.queue.length) {
			this.resolve();
		} else {
			this.frameRequest = requestAnimationFrame(this.update);
			this.frame++;
		}
	}

	randomChar() {
		return this.chars[Math.floor(Math.random() * this.chars.length)];
	}
}

interface ScrambledTextProps {
	text: string;
}

export default function ScrambledText({ text }: ScrambledTextProps) {
	const elRef = useRef<HTMLSpanElement>(null);
	const scrambleRef = useRef<TextScramble | null>(null);

	// On mount, create the TextScramble instance
	useEffect(() => {
		if (elRef.current) {
			scrambleRef.current = new TextScramble(elRef.current);
			scrambleRef.current.setText(text);
		}
	}, []); // run once

	// Whenever text changes, update the scramble
	useEffect(() => {
		if (scrambleRef.current) {
			scrambleRef.current.setText(text);
		}
	}, [text]);

	return <span ref={elRef} />;
}
