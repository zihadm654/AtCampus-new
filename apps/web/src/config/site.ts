// import type { SidebarNavItem, SiteConfig } from "@/types";

const site_url = process.env.NEXT_PUBLIC_SERVER_URL as string;

export const siteConfig = {
	name: "AtCampus",
	description: "An alumni organization management system for students.",
	url: site_url,
	ogImage: `${site_url}/_static/og.jpg`,
	links: {
		twitter: "https://twitter.com/atcampus",
		github: "https://github.com/zihadm654/atcampus",
	},
	mailSupport: "support@atcampus.com",
};

// export const footerLinks: SidebarNavItem[] = [
//   {
//     title: "Company",
//     items: [
//       { title: "About", href: "#" },
//       { title: "Enterprise", href: "#" },
//       { title: "Terms", href: "/terms" },
//       { title: "Privacy", href: "/privacy" },
//     ],
//   },
//   {
//     title: "Product",
//     items: [
//       { title: "Security", href: "#" },
//       { title: "Customization", href: "#" },
//       { title: "Customers", href: "#" },
//       { title: "Changelog", href: "#" },
//     ],
//   },
//   {
//     title: "Docs",
//     items: [
//       { title: "Introduction", href: "#" },
//       { title: "Installation", href: "#" },
//       { title: "Components", href: "#" },
//       { title: "Code Blocks", href: "#" },
//     ],
//   },
// ];
