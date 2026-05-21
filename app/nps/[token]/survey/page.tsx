import { SurveyExperience } from "./SurveyExperience";

type SurveyPageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function SurveyPage({ params }: SurveyPageProps) {
  const { token } = await params;

  return <SurveyExperience token={token} />;
}

