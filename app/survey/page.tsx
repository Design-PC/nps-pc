import { demoToken } from "@/lib/campaign";
import { SurveyExperience } from "@/app/nps/[token]/survey/SurveyExperience";

export default function PublicSurveyPage() {
  return (
    <SurveyExperience
      completionPath="/complete"
      landingPath="/"
      showImmediately
      token={demoToken}
    />
  );
}
