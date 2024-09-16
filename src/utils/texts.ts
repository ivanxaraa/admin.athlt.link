import { generic } from "./generic";

// https://chatgpt.com/c/66e6f377-2e54-8013-a2d0-02bccb5a3db3
export const getTextInvitation = {
  paid: (club: any, team: any, code: string) => {
    return `Hey, you’ve been invited to join ${club.name} ${
      team.name
    } on ATHLT, the all in one profile page for athletes.

Team code: *${code}*

Connect to your team costs only $${generic.number.toDecimal(
      club.fee
    )} for the full season.

Use this link to download the app.
www.athlt.link`;
  },
  free: (club: any, team: any, code: string) => {
    return `Hey, you’ve been invited to join ${club.name} ${team.name} on ATHLT, the all in one profile page for athletes.

Team code: *${code}*

Connect to your team it's free for the full season.

Use this link to download the app.
www.athlt.link`;
  },
  freeVerification: (club: any, team: any, code: string) => {
    return `Hey, you’ve been invited to join ${club.name} ${
      team.name
    } on ATHLT, the all in one profile page for athletes.

Team code: *${code}*

Connect to your team costs only $${generic.number.toDecimal(
      club.fee
    )} for the full season.
As a special offer you can verify your ID for free.

Use this link to download the app.
www.athlt.link`;
  },
};
