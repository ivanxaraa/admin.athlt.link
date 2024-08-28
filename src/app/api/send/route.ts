import TemplateNewClub from "@/components/templates/new-club";
import { NextRequest } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const templates = {
  TemplateNewClub: TemplateNewClub(),
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const { data, error } = await resend.emails.send({
      from: "ATHLT <agent@athlt.link>",
      ...body,
      // @ts-ignore
      react: templates[body.react],
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
