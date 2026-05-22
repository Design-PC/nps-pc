import { SurveyExperience } from "@/app/nps/[token]/survey/SurveyExperience";
import { demoToken } from "@/lib/campaign";

export default function SurveyBackupPage() {
  return (
    <SurveyExperience
      completionPath="/complete"
      landingPath="/"
      showImmediately
      token={demoToken}
    />
  );
}
