import { adminRouter } from '@/server/api/routers/admin';
import { candidateRouter } from '@/server/api/routers/candidate';
import { projectRouter } from '@/server/api/routers/project';
import { projectSubmissionRouter } from '@/server/api/routers/projectSubmission';
import { recruiterRouter } from '@/server/api/routers/recruiter';
import { userRouter } from '@/server/api/routers/user';
import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc';
import { reportRouter } from './routers/reports';
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    users: userRouter,
    candidates: candidateRouter,
    recruiters: recruiterRouter,
    admins: adminRouter,
    projects: projectRouter,
    projectSubmission: projectSubmissionRouter,
    reports: reportRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
