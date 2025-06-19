export const VALID_DOMAINS = () => {
	const domains = ["gmail.com", "yahoo.com", "outlook.com"];

	if (process.env.NODE_ENV === "development") {
		domains.push("example.com");
	}

	return domains;
};
export function normalizeName(name: string) {
	return name
		.trim()
		.replace(/\s+/g, " ")
		.replace(/[^a-zA-Z\s'-]/g, "")
		.replace(/\b\w/g, (char) => char.toUpperCase());
}
