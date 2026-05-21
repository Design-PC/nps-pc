export type QuestionType = "rating" | "text" | "identity";

export type SurveyQuestion = {
  id: string;
  type: QuestionType;
  label: string;
  required: boolean;
  category: string;
  helper?: string;
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
    description:
      "Confirmamos alguns dados para associar corretamente sua resposta à parceria com a Prime Control.",
    questions: identityQuestions,
  },
  {
    id: "relacionamento-satisfacao",
    title: "Relacionamento e Satisfação",
    eyebrow: "Etapa 2",
    description:
      "Começamos pela percepção geral sobre a parceria com a Prime Control.",
    questions: [
      {
        id: "nps_recommendation",
        type: "rating",
        label:
          "Qual a probabilidade de você recomendar a Prime Control para outras empresas?",
        required: true,
        category: "Relacionamento e Satisfação",
      },
      {
        id: "nps_reason",
        type: "text",
        label: "Qual foi o principal motivo para a nota atribuída?",
        required: false,
        category: "Relacionamento e Satisfação",
        helper: "Se preferir, responda em uma frase objetiva.",
      },
    ],
  },
  {
    id: "percepcao-valor",
    title: "Percepção de Valor",
    eyebrow: "Etapa 3",
    description:
      "Agora, avaliamos pontos específicos sobre valor percebido e aderência ao seu negócio.",
    questions: [
      {
        id: "value_business_attention",
        type: "rating",
        label:
          "Como você avalia a Prime Control em relação ao atendimento do seu negócio?",
        required: true,
        category: "Percepção de Valor",
      },
      {
        id: "value_solution_relevance",
        type: "rating",
        label:
          "Como você avalia a relevância das soluções entregues para os desafios da sua empresa?",
        required: true,
        category: "Percepção de Valor",
      },
      {
        id: "value_perceived",
        type: "rating",
        label:
          "As soluções da Prime Control têm gerado valor percebido para o seu negócio?",
        required: true,
        category: "Percepção de Valor",
      },
      {
        id: "value_results_commitment",
        type: "rating",
        label: "Como você avalia nosso comprometimento com resultados?",
        required: true,
        category: "Percepção de Valor",
      },
      {
        id: "value_problem_solving",
        type: "rating",
        label: "Como você avalia nosso engajamento na solução de problemas?",
        required: true,
        category: "Percepção de Valor",
      },
    ],
  },
  {
    id: "qualidade-operacional",
    title: "Qualidade Operacional",
    eyebrow: "Etapa 4",
    description:
      "Esta etapa captura sua avaliação sobre entregas, prazos, comunicação e atendimento.",
    questions: [
      {
        id: "ops_delivery_quality",
        type: "rating",
        label: "Como você avalia a qualidade das entregas realizadas?",
        required: true,
        category: "Qualidade Operacional",
      },
      {
        id: "ops_deadlines",
        type: "rating",
        label: "Como você avalia cumprimento dos prazos acordados?",
        required: true,
        category: "Qualidade Operacional",
      },
      {
        id: "ops_result_clarity",
        type: "rating",
        label:
          "Como você avalia a clareza e objetividade das apresentações de resultados?",
        required: true,
        category: "Qualidade Operacional",
      },
      {
        id: "ops_response_time",
        type: "rating",
        label: "Como você avalia o tempo de resposta da nossa equipe?",
        required: true,
        category: "Qualidade Operacional",
      },
      {
        id: "ops_service_quality",
        type: "rating",
        label: "Como você avalia qualidade do atendimento recebido?",
        required: true,
        category: "Qualidade Operacional",
      },
    ],
  },
  {
    id: "inovacao-futuro",
    title: "Inovação, Transformação e Futuro",
    eyebrow: "Etapa 5",
    description:
      "Última etapa: sua visão sobre futuro, inovação e oportunidades de evolução.",
    questions: [
      {
        id: "future_innovative_company",
        type: "rating",
        label:
          "Você percebe a Prime Control como uma empresa inovadora e alinhada às tendências do mercado?",
        required: true,
        category: "Inovação, Transformação e Futuro",
      },
      {
        id: "future_trend_anticipation",
        type: "rating",
        label:
          "Como você avalia a capacidade da Prime Control antecipar tendências e propor soluções para os desafios do seu negócio?",
        required: true,
        category: "Inovação, Transformação e Futuro",
      },
      {
        id: "future_innovation_areas",
        type: "text",
        label:
          "Em quais áreas você acredita que a Prime Control poderia investir mais inovação para fortalecer ainda mais nossa parceria?",
        required: false,
        category: "Inovação, Transformação e Futuro",
        helper: "Comentários curtos já ajudam a direcionar ações.",
      },
      {
        id: "future_strategic_partner_expectation",
        type: "text",
        label:
          "O que você espera de uma empresa parceira estratégica que ainda não percebe na atuação da Prime Control?",
        required: false,
        category: "Inovação, Transformação e Futuro",
        helper: "Se preferir, responda em uma frase objetiva.",
      },
      {
        id: "future_partnership_improvements",
        type: "text",
        label:
          "Quais iniciativas, soluções ou melhorias podem ampliar nossa parceria e gerar ainda mais valor para o seu negócio?",
        required: false,
        category: "Inovação, Transformação e Futuro",
        helper: "Comentários curtos já ajudam a direcionar ações.",
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
