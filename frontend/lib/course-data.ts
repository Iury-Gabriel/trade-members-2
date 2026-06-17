export type Lesson = {
  slug: string
  title: string
  duration: string
  description: string
  type: "video" | "install"
  videoUrl?: string
}

export const courseLessons: Lesson[] = [
  {
    slug: "boas-vindas",
    title: "Boas vindas - comece aqui",
    duration: "05:00",
    description: "Bem-vindo ao WallStreet Revolution! Assista este vídeo primeiro para entender como funciona a plataforma e os próximos passos.",
    type: "video",
    videoUrl: "https://iframe.mediadelivery.net/embed/679746/3cfaaec8-7ff9-40ed-a6ce-5371a265bb31",
  },
  {
    slug: "primeiro-passo-indicador",
    title: "1º Passo para liberar a Inteligência Artificial WallStreet Revolution",
    duration: "08:00",
    description: "Cadastre-se na corretora e insira seu ID para ativar o indicador WallStreet Revolution.",
    type: "install",
    videoUrl: "https://iframe.mediadelivery.net/embed/679746/234f45bd-9e16-4b2d-857d-a9dbfe0a451e",
  },
  {
    slug: "segundo-passo-indicador",
    title: "2º Passo para liberar a Inteligência Artificial WallStreet Revolution",
    duration: "06:00",
    description: "Faça o download e instale o indicador WallStreet Revolution no MetaTrader. É necessário realizar o primeiro depósito para ativação.",
    type: "video",
    videoUrl: "https://iframe.mediadelivery.net/embed/679746/cc6c8dfe-7aef-4bf1-94e4-85ed15d66e1b",
  },
]

export function getLesson(slug: string) {
  return courseLessons.find((l) => l.slug === slug)
}
