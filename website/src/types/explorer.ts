export interface TreeItem {
	name: string;
	type: "file" | "directory";
	path: string;
	children?: TreeItem[];
}
