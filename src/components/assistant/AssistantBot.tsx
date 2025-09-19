"use client";
import React, {
	ComponentProps,
	ElementType,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import ReactMarkdown from "react-markdown";
import TextArea from "@/components/form/input/TextArea";
import Button from "@/components/ui/button/Button";
import type { ExtraProps } from "react-markdown";

type Role = "user" | "assistant";

interface ChatMessage {
	id: string;
	role: Role;
	content: string;
}

interface ChatbotProps {
	endpoint?: string;
	welcomeMd?: string;
	placeholder?: string;
	className?: string;
}

type Components = {
	[Key in Extract<ElementType, string>]?: ElementType<
		ComponentProps<Key> & ExtraProps
	>;
};

const markdownComponents: Components = {
	a(p) {
		return (
			<a {...p} className="underline underline-offset-2 hover:opacity-80" />
		);
	},
	code({
		inline,
		children,
		...props
	}: React.PropsWithChildren<
		{ inline?: boolean } & React.HTMLAttributes<HTMLElement>
	>) {
		return inline ? (
			<code
				className="rounded bg-black/10 px-1 py-0.5 dark:bg-white/10"
				{...props}
			>
				{children}
			</code>
		) : (
			<pre className="overflow-auto rounded-lg p-3 text-xs">
				<code {...props}>{children}</code>
			</pre>
		);
	},
	ul(p) {
		return <ul {...p} className="list-disc pl-5" />;
	},
	ol(p) {
		return <ol {...p} className="list-decimal pl-5" />;
	},
	blockquote(p) {
		return (
			<blockquote
				{...p}
				className="border-l-4 border-gray-300 pl-3 italic dark:border-gray-600"
			/>
		);
	},
	h1(p) {
		return <h1 {...p} className="mb-1 mt-2 text-lg font-bold" />;
	},
	h2(p) {
		return <h2 {...p} className="mb-1 mt-2 text-base font-bold" />;
	},
	h3(p) {
		return <h3 {...p} className="mb-1 mt-2 text-sm font-bold" />;
	},
	table(p) {
		return (
			<div className="overflow-x-auto">
				<table {...p} className="w-full border-collapse text-left text-xs" />
			</div>
		);
	},
	th(p) {
		return <th {...p} className="border-b px-2 py-1 font-semibold" />;
	},
	td(p) {
		return <td {...p} className="border-b px-2 py-1" />;
	},
};

const AssistantBot: React.FC<ChatbotProps> = ({
	endpoint = "/api/chat",
	welcomeMd = "¡Hola! Soy tu asistente. ¿En qué te ayudo?",
	placeholder = "Escribe tu mensaje…",
	className = "",
}) => {
	const [messages, setMessages] = useState<ChatMessage[]>([
		{ id: crypto.randomUUID(), role: "assistant", content: welcomeMd },
	]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const listRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = listRef.current;
		if (!el) return;
		el.scrollTop = el.scrollHeight;
	}, [messages, loading]);

	const canSend = useMemo(
		() => input.trim().length > 0 && !loading,
		[input, loading]
	);

	async function callModel(prompt: string) {
		const res = await fetch(endpoint, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ message: prompt }),
		});
		if (!res.ok) {
			const text = await res.text().catch(() => "");
			throw new Error(text || `Error ${res.status}`);
		}
		const data = (await res.json()) as { reply: string };
		return data.reply;
	}

	async function handleSend() {
		const content = input.trim();
		if (!content || loading) return;

		setLoading(true);
		setInput("");

		const userMsg: ChatMessage = {
			id: crypto.randomUUID(),
			role: "user",
			content,
		};
		setMessages((prev) => [...prev, userMsg]);

		try {
			const reply = await callModel(content);
			const assistantMsg: ChatMessage = {
				id: crypto.randomUUID(),
				role: "assistant",
				content: reply ?? "_(Respuesta vacía)_",
			};
			setMessages((prev) => [...prev, assistantMsg]);
		} catch (err: unknown) {
			const assistantMsg: ChatMessage = {
				id: crypto.randomUUID(),
				role: "assistant",
				content:
					`**Ups…** hubo un error al consultar el modelo.\n\n` +
					`> Detalle: ${(err as Error)?.message ?? "desconocido"}`,
			};
			setMessages((prev) => [...prev, assistantMsg]);
		} finally {
			setLoading(false);
		}
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			if (canSend) void handleSend();
		}
	}

	return (
		<div
			className={[
				"flex h-full w-full flex-col rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900",
				className,
			].join(" ")}
		>
			<div className="flex items-center justify-between gap-2 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
				<div className="flex items-center gap-3">
					<div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600" />
					<div>
						<p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
							Chatbot
						</p>
						<p className="text-xs text-gray-500 dark:text-gray-400">
							Responde en Markdown
						</p>
					</div>
				</div>
			</div>

			<div
				ref={listRef}
				className="flex-1 overflow-y-auto px-3 py-4 sm:px-4"
				aria-live="polite"
			>
				<div className="mx-auto flex w-full flex-col gap-4">
					{messages.map((m) => (
						<MessageBubble key={m.id} role={m.role} content={m.content} />
					))}

					{loading && (
						<div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
							<span className="inline-flex h-2 w-2 animate-bounce rounded-full bg-gray-400" />
							<span className="inline-flex h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:120ms]" />
							<span className="inline-flex h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:240ms]" />
							<span className="sr-only">Escribiendo…</span>
						</div>
					)}
				</div>
			</div>

			<div className="border-t border-gray-200 p-3 dark:border-gray-800 sm:p-4">
				<div className="mx-auto flex w-full items-end gap-2">
					<div className="flex-1">
						<TextArea
							placeholder={placeholder}
							rows={3}
							value={input}
							onChange={setInput}
							disabled={loading}
							error={false}
							hint=""
						/>
					</div>
					<div className="flex">
						<Button
							onClick={handleSend}
							loading={loading}
							disabled={!canSend}
							variant="primary"
							size="md"
							aria-label="Enviar mensaje"
						>
							Enviar
						</Button>
					</div>
				</div>

				<ScriptBindEnter onKeyDown={handleKeyDown} />
			</div>
		</div>
	);
};

export default AssistantBot;

const MessageBubble: React.FC<{ role: Role; content: string }> = ({
	role,
	content,
}) => {
	const isUser = role === "user";
	return (
		<div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
			<div
				className={[
					"max-w-[90%] rounded-2xl px-4 py-3 text-sm sm:max-w-[80%] md:max-w-[70%]",
					isUser
						? "bg-brand-600 text-white shadow-theme-xs"
						: "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100",
				].join(" ")}
			>
				<ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
			</div>
		</div>
	);
};

const ScriptBindEnter: React.FC<{
	onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}> = ({ onKeyDown }) => {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const root = ref.current;
		if (!root) return;
		const textarea = root.previousElementSibling?.querySelector("textarea");
		if (!textarea) return;
		const handler = (e: Event) =>
			onKeyDown(e as unknown as React.KeyboardEvent<HTMLTextAreaElement>);
		textarea.addEventListener("keydown", handler);
		return () => textarea.removeEventListener("keydown", handler);
	}, [onKeyDown]);

	return <div ref={ref} aria-hidden="true" />;
};
