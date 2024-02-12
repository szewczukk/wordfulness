type Props = {
	params: {
		lessonId: number;
	};
};

export default async function ProfilePage({ params: { lessonId } }: Props) {
	return <h1>Profile {lessonId}</h1>;
}
