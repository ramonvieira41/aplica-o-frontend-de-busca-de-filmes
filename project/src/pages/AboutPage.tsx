import { Clapperboard, Compass, Heart, Tag, Settings, Sparkles, Search } from 'lucide-react';

export function AboutPage() {
  const features = [
    {
      icon: Compass,
      title: 'Catálogo diversificado',
      description: 'Explore centenas de filmes de diferentes gêneros e descubra novos títulos para assistir.',
    },
    {
      icon: Heart,
      title: 'Favoritos personalizados',
      description: 'Salve seus filmes preferidos e acesse-os facilmente quando quiser.',
    },
    {
      icon: Tag,
      title: 'Filtro por gêneros',
      description: 'Encontre exatamente o tipo de filme que você está procurando, com 18 categorias disponíveis.',
    },
    {
      icon: Search,
      title: 'Pesquisa em tempo real',
      description: 'Encontre rapidamente filmes pelo nome e consulte seus detalhes diretamente no catálogo.',
    },
    {
      icon: Sparkles,
      title: 'Tema claro e escuro',
      description: 'Escolha entre os temas claro e escuro para adaptar a experiência às suas preferências.',
    },
    {
      icon: Settings,
      title: 'Conta pessoal',
      description: 'Crie sua conta para acessar sua área pessoal e utilizar os recursos disponíveis na plataforma.',
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 animate-fade-in">
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-500">
          <Clapperboard size={32} />
        </div>
        <h1 className="text-3xl font-bold font-display tracking-tight text-base-900 dark:text-base-100 sm:text-4xl">
          Sobre o Cinephile
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-base-600 dark:text-base-300">
          O Cinephile é uma plataforma de streaming de filmes,  criada para tornar a descoberta
          de filmes mais simples e agradável. Explore títulos populares, encontre filmes por gênero,
          consulte detalhes e mantenha sua própria lista de favoritos.
        </p>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold font-display text-base-900 dark:text-base-100 flex justify-center">
          Como o catálogo funciona
        </h2>
        <p className="mt-3 text-base leading-relaxed text-base-600 dark:text-base-300">
          O catálogo do Cinephile é alimentado pelo The Movie Database (TMDB), permitindo explorar uma grande variedade de filmes e informações sobre cada título.

          Cada filme possui uma página de detalhes com informações como sinopse, elenco, direção, duração e avaliação. Você também pode pesquisar por título, explorar diferentes gêneros e salvar os filmes que mais gostar nos seus favoritos.

          Os favoritos são armazenados localmente no seu navegador.
        </p>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold font-display text-base-900 dark:text-base-100">
          Recursos disponíveis
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex gap-4 rounded-xl border border-base-200 bg-base-100 p-5 transition-colors dark:border-base-800 dark:bg-base-900"
            >
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-primary-500/10 text-primary-500">
                <feature.icon size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-base-900 dark:text-base-100">{feature.title}</h3>
                <p className="mt-1 text-sm text-base-500 dark:text-base-400">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
