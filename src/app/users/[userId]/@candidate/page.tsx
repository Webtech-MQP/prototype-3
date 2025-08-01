import { Button } from '@/components/ui/button';
import { AwardsSection } from '@/features/profiles/awards/awards-section';
import { JamGrid } from '@/features/profiles/jam-grid';
import { auth } from '@/server/auth';
import { api } from '@/trpc/server';
import { GithubIcon, LinkedinIcon, PencilIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type Params = {
    userId: string;
};

type Props = {
    params: Promise<Params>;
};

export default async function Page({ params }: Props) {
    const userId = decodeURIComponent((await params).userId);

    const session = await auth();

    console.log(userId);

    const candidate = await api.candidates.getOne(userId.startsWith('@') ? { githubUsername: userId.slice(1) } : { id: userId });

    if (!candidate) {
        return <div>User not found</div>;
    }

    const projects = await api.candidates.getProjects({
        userId: candidate.userId,
    });

    const userAwards = await api.awards.getVisibleUserAwards({
        userId: candidate.userId,
    });

    return (
        <div>
            <div>
                <div className="relative h-40 w-full">
                    {/* Banner Image */}
                    <Image
                        src="https://placehold.co/100.png"
                        alt="Profile banner"
                        fill
                    />
                </div>
                <div className="relative space-y-8 p-15">
                    <div className="z-30">
                        {/* Profile Picture */}
                        {session?.user.id === candidate.userId && (
                            <Button
                                variant="outline"
                                size="icon"
                                className="absolute top-4 right-4"
                                asChild
                            >
                                <Link href={`/users/${candidate.userId}/edit`}>
                                    <PencilIcon className="h-6 w-6" />
                                </Link>
                            </Button>
                        )}
                        <Image
                            src={candidate.imageURL ?? 'https://placehold.co/100.png'}
                            className="relative z-20 -mt-30 box-content rounded-xl border-6 border-(--color-background)"
                            alt="Profile picture"
                            height={100}
                            width={100}
                        />
                        <div className="flex items-start gap-4">
                            <div className="flex-1">
                                <h1 className="mt-2 font-bold">{candidate.displayName}</h1>
                                <p>{candidate.bio}</p>
                                <div className="flex gap-2">
                                    {candidate.linkedinURL && (
                                        <Link
                                            target="_blank"
                                            href={candidate.linkedinURL}
                                            className="hover:text-primary mt-4 flex items-center gap-2 hover:underline"
                                        >
                                            <LinkedinIcon className="h-6 w-6" />{' '}
                                        </Link>
                                    )}
                                    {candidate.user.githubUsername && (
                                        <Link
                                            target="_blank"
                                            href={`https://github.com/${candidate.user.githubUsername}`}
                                            className="hover:text-primary mt-4 flex items-center gap-2 hover:underline"
                                        >
                                            <GithubIcon className="h-6 w-6" />{' '}
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {/* Awards Section */}
                            <div className="shrink-0">
                                <AwardsSection
                                    awards={userAwards}
                                    title="Achievements"
                                    size="sm"
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2>Jams</h2>
                        <div className="grid">
                            <JamGrid jams={projects} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
