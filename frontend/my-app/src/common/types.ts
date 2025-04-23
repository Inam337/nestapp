export type DeploysCardListProps = {
	id?: string;
	name?: string;
	environment?: Environment[];
	repository?: string;
	envId?: string | null;
};
export type Application = {
	id: string;
	name: string;
	environment: Environment[];
	repository: string;
};

type Release = {
	author: string;
	branch: string;
	commit: string;
	duration: number;
	message: string;
	timestamp: number;
};

export type Environment = {
	id: string;
	name: string;
	release: Release;
	role: string;
};
