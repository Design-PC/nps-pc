export type QuestionType = "rating" | "text" | "identity";

export type SurveyQuestion = {
  id: string;
  type: QuestionType;
  label: string;
  required: boolean;
  category: string;
  helper?: string;
  scale?: "nps_0_10" | "satisfaction_1_5";
};

export type SurveyStep = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  questions: SurveyQuestion[];
};

export const identityQuestions: SurveyQuestion[] = [
  {
    id: "identity_name",
    type: "identity",
    label: "Nome",
    required: true,
    category: "Identificação",
  },
  {
    id: "identity_email",
    type: "identity",
    label: "E-mail corporativo",
    required: true,
    category: "Identificação",
  },
  {
    id: "identity_company",
    type: "identity",
    label: "Empresa",
    required: true,
    category: "Identificação",
  },
  {
    id: "identity_area",
    type: "identity",
    label: "Área",
    required: true,
    category: "Identificação",
  },
  {
    id: "identity_role",
    type: "identity",
    label: "Cargo",
    required: true,
    category: "Identificação",
  },
];

export const surveySteps: SurveyStep[] = [
  {
    id: "identificacao",
    title: "Identificação",
    eyebrow: "Etapa 1",
    description: "",
    questions: identityQuestions,
  },
  {
    id: "recomendacao",
    title: "Recomendação",
    eyebrow: "Etapa 2",
    description: "Escala: 0 = nada provável e 10 = muito provável.",
    questions: [
      {
        id: "nps_recommendation",
        type: "rating",
        label: "Qual a probabilidade de você recomendar a Prime Control para outras empresas?",
        required: true,
        category: "NPS",
        scale: "nps_0_10",
      },
      {
        id: "nps_reason",
        type: "text",
        label: "O que a Prime Control faz bem hoje que te levou a dar essa nota?",
        required: true,
        category: "NPS",
      },
    ],
  },
  {
    id: "avaliacao-parceria",
    title: "Avaliação da parceria",
    eyebrow: "Etapa 3",
    description: "Escala: 1 = nada satisfeito e 5 = muito satisfeito.",
    questions: [
      {
        id: "innovation_relevance",
        type: "rating",
        label: "Você percebe que a Prime Control entrega soluções inovadoras e relevantes para o seu negócio?",
        required: true,
        category: "Inovação e relevância",
        scale: "satisfaction_1_5",
      },
      {
        id: "innovation_expectation",
        type: "text",
        label: "O que você esperaria de uma empresa inovadora que ainda não percebe na atuação da Prime Control?",
        required: true,
        category: "Inovação e relevância",
      },
      {
        id: "contracted_services",
        type: "rating",
        label: "Como você avalia os serviços prestados pela Prime Control em relação ao que foi contratado?",
        required: true,
        category: "Execução contratada",
        scale: "satisfaction_1_5",
      },
      {
        id: "business_knowledge",
        type: "rating",
        label: "Como você avalia o nosso conhecimento do seu negócio?",
        required: true,
        category: "Conhecimento e parceria",
        scale: "satisfaction_1_5",
      },
      {
        id: "delivery_quality",
        type: "rating",
        label: "Como você avalia a qualidade das nossas entregas?",
        required: true,
        category: "Entregas",
        scale: "satisfaction_1_5",
      },
      {
        id: "delivery_communication",
        type: "rating",
        label: "Você se sente bem informado sobre o andamento e os resultados das entregas?",
        required: true,
        category: "Comunicação",
        scale: "satisfaction_1_5",
      },
      {
        id: "problem_solving_engagement",
        type: "rating",
        label: "Como você avalia o nosso engajamento na solução de problemas?",
        required: true,
        category: "Conhecimento e parceria",
        scale: "satisfaction_1_5",
      },
      {
        id: "deadline_delivery",
        type: "rating",
        label: "Como você avalia as entregas da Prime Control dentro dos prazos acordados?",
        required: true,
        category: "Entregas",
        scale: "satisfaction_1_5",
      },
      {
        id: "result_presentations",
        type: "rating",
        label: "As nossas apresentações de resultados são claras, objetivas e relevantes para o seu negócio?",
        required: true,
        category: "Comunicação",
        scale: "satisfaction_1_5",
      },
      {
        id: "perceived_value",
        type: "rating",
        label: "As soluções da Prime Control têm gerado valor percebido para o seu negócio?",
        required: true,
        category: "Valor percebido",
        scale: "satisfaction_1_5",
      },
      {
        id: "service_quality",
        type: "rating",
        label: "Como você avalia a qualidade do atendimento recebido pela nossa equipe?",
        required: true,
        category: "Atendimento",
        scale: "satisfaction_1_5",
      },
      {
        id: "response_time",
        type: "rating",
        label: "Como você avalia o tempo de resposta da nossa equipe?",
        required: true,
        category: "Atendimento",
        scale: "satisfaction_1_5",
      },
      {
        id: "partnership_improvements",
        type: "text",
        label: "Quais entregas, melhorias ou iniciativas da Prime Control fariam sentido para ampliar nossa parceria e gerar ainda mais valor para o seu negócio?",
        required: true,
        category: "Valor percebido",
      },
    ],
  },
];

export const totalQuestionCount = surveySteps.reduce(
  (count, step) => count + step.questions.length,
  0,
);

export function getStepByIndex(index: number) {
  return surveySteps[Math.min(Math.max(index, 0), surveySteps.length - 1)];
}
