import axios from 'axios';
import { NextApiResponse } from 'next';

import { ApiError } from '@chaindesk/lib/api-error';
import {
  createAuthApiHandler,
  respond,
} from '@chaindesk/lib/createa-api-handler';
import { AppNextApiRequest } from '@chaindesk/lib/types';
import { ServiceProviderType } from '@chaindesk/prisma';
import prisma from '@chaindesk/prisma/client';

const handler = createAuthApiHandler();

export const getServiceProviders = async (
  req: AppNextApiRequest,
  res: NextApiResponse
) => {
  try {
    const type = req.query.type as ServiceProviderType;
    const agentId = req.query.agentId as ServiceProviderType;

    const providers = await prisma.serviceProvider.findMany({
      where: {
        organizationId: req?.session?.organization?.id as string,
        ...(type ? { type } : {}),
        ...(agentId ? { agents: { some: { id: agentId } } } : {}),
      },
      select: {
        name: true,
        id: true,
      },
    });

    return providers;
  } catch (e) {
    if (e instanceof ApiError) {
      throw new Error(e.message);
    }
    throw e;
  }
};

handler.get(respond(getServiceProviders));

export default handler;
