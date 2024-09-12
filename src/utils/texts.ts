import { generic } from "./generic";

export const getTextInvitation = {
  paid: (club: any, team: any, code: string) => {
    return `Hey, you’ve been invited to join ${club.name} ${
      team.name
    } on ATHLT, the best platform for live recruiting.

Use this link to download the app and create your free profile:
https://athlt.link/download

Access your Dashboard - TeamLink and enter the code:
*${code}*

Connect to your team costs only $${generic.number.toDecimal(
      club.fee
    )} for the full season.

For more information about ATHLT:
www.athlt.link`;
  },
  free: (club: any, team: any, code: string) => {
    return `Hey, you’ve been invited to join ${club.name} ${team.name} on ATHLT, the best platform for live recruiting.

Use this link to download the app and create your free profile:
https://athlt.link/download

Access your Dashboard - TeamLink and enter the code:
*${code}*

Connect to your team it’s free for the full season.

For more information about ATHLT:
www.athlt.link`;
  },
  freeVerification: (club: any, team: any, code: string) => {
    return `Hey, you’ve been invited to join ${club.name} ${
      team.name
    } on ATHLT, the best platform for live recruiting.

Use this link to download the app and create your free profile:
https://athlt.link/download

Access your Dashboard - TeamLink and enter the code:
*${code}*

Connect to your team costs only $${generic.number.toDecimal(
      club.fee
    )} for the full season.
As a special offer you can verify your ID for free.

For more information about ATHLT:
www.athlt.link`;
  },
};
