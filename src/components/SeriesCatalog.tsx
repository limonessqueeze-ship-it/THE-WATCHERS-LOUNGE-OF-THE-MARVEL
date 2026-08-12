import React, { useState } from 'react';
import { Filter, Star, Tv, BookOpen, X, ChevronRight } from 'lucide-react';
import { FavoriteComments } from './FavoriteComments';
import { ItemComments } from './ItemComments';

export interface SeriesItem {
  id: string;
  title: string;
  year: number | string;
  network: string;
  phase: string;
  rating: number;
  seasons: string;
  saga: string;
  summary: string;
  posterUrl: string;
}

export const SERIES_DATA: SeriesItem[] = [
  // 🟡 FASE 2
  {
    id: 'agents-of-shield',
    title: "Marvel's Agents of S.H.I.E.L.D.",
    year: '2013–2020',
    network: 'ABC / Disney+',
    phase: 'Fase 2',
    rating: 8.7,
    seasons: '7 Temp (136 Ep)',
    saga: 'Saga del Infinito',
    summary: 'El agente Phil Coulson rearma un equipo de élite para investigar eventos sobrehumanos y proteger al mundo de HYDRA, los Inhumanos y amenazas interdimensionales tras los eventos de Los Vengadores.',
    posterUrl: 'https://static.tvmaze.com/uploads/images/original_untouched/486/1215694.jpg'
  },
  {
    id: 'agent-carter',
    title: 'Agent Carter',
    year: '2015–2016',
    network: 'ABC / Disney+',
    phase: 'Fase 2',
    rating: 8.3,
    seasons: '2 Temp (18 Ep)',
    saga: 'Saga del Infinito',
    summary: 'Tras la desaparición del Capitán América en la Segunda Guerra Mundial, Peggy Carter equilibra su trabajo administrativo en la SSR realizando misiones secretas para limpiar el nombre de Howard Stark.',
    posterUrl: 'https://static.tvmaze.com/uploads/images/original_untouched/143/357815.jpg'
  },

  // 🟣 FASE 4: Inicio de las Series de Marvel Studios
  {
    id: 'wandavision',
    title: 'WandaVision',
    year: 2021,
    network: 'Disney+',
    phase: 'Fase 4',
    rating: 9.4,
    seasons: '1 Temp (9 Ep)',
    saga: 'Saga del Multiverso',
    summary: 'Sumida en un duelo devastador tras la muerte de Visión en Infinity War, Wanda Maximoff crea de forma inconsciente una realidad idílica en el pueblo de Westview al estilo de comedias de televisión clásicas. Sin embargo, su ilusión amenaza con quebrarse cuando S.W.O.R.D. y la bruja Agatha Harkness intentan intervenir.',
    posterUrl: 'https://static.tvmaze.com/uploads/images/original_untouched/295/738028.jpg'
  },
  {
    id: 'falcon-winter-soldier',
    title: 'Falcon y el Soldado del Invierno',
    year: 2021,
    network: 'Disney+',
    phase: 'Fase 4',
    rating: 8.8,
    seasons: '1 Temp (6 Ep)',
    saga: 'Saga del Multiverso',
    summary: 'Sam Wilson vacila en asumir el manto del Capitán América y entrega el escudo al gobierno, que nombra a John Walker como nuevo héroe. Sam debe hacer equipo con Bucky Barnes para detener a los Flag Smashers, un grupo terrorista radicalizado tras el regreso de la población del chasquido.',
    posterUrl: 'https://static.tvmaze.com/uploads/images/original_untouched/295/739854.jpg'
  },
  {
    id: 'loki-s1',
    title: 'Loki - Temporada 1',
    year: 2021,
    network: 'Disney+',
    phase: 'Fase 4',
    rating: 9.6,
    seasons: 'Temp 1 (6 Ep)',
    saga: 'Saga del Multiverso',
    summary: 'Tras escapar con el Teseracto en Endgame, la variante de Loki de 2012 es capturado por la Autoridad de Variación Temporal (TVA). Obligado a cooperar junto al agente Mobius y su propia variante femenina Sylvie, Loki descubre el secreto detrás del control del tiempo y desencadena la apertura del multiverso.',
    posterUrl: 'https://static.tvmaze.com/uploads/images/original_untouched/478/1195717.jpg'
  },
  {
    id: 'what-if-s1',
    title: 'What If...? - Temporada 1',
    year: 2021,
    network: 'Disney+',
    phase: 'Fase 4',
    rating: 8.9,
    seasons: 'Temp 1 (9 Ep)',
    saga: 'Saga del Multiverso',
    summary: "Guiados por El Vigilante (Utu), la serie explora líneas temporales alternativas donde eventos clave del UCM sucedieron de forma radicalmente distinta (ej. Peggy Carter tomando el suero del Súper Soldado o T'Challa convirtiéndose en Star-Lord).",
    posterUrl: 'https://fr.web.img4.acsta.net/pictures/21/08/13/11/02/5369318.jpg'
  },
  {
    id: 'hawkeye',
    title: 'Hawkeye',
    year: 2021,
    network: 'Disney+',
    phase: 'Fase 4',
    rating: 8.9,
    seasons: '1 Temp (6 Ep)',
    saga: 'Saga del Multiverso',
    summary: 'En época navideña en Nueva York, Clint Barton se ve salpicado por los fantasmas de su época como "Ronin". Se une a Kate Bishop, una joven y hábil arquera que lo admira, para desmantelar una conspiración criminal dirigida por Kingpin.',
    posterUrl: 'https://static.tvmaze.com/uploads/images/original_untouched/383/959105.jpg'
  },
  {
    id: 'moon-knight',
    title: 'Caballero Luna (Moon Knight)',
    year: 2022,
    network: 'Disney+',
    phase: 'Fase 4',
    rating: 9.1,
    seasons: '1 Temp (6 Ep)',
    saga: 'Saga del Multiverso',
    summary: 'Steven Grant, un empleado de un museo con trastorno de identidad disociativo, descubre que comparte cuerpo con Marc Spector, un mercenario avatar del dios egipcio Khonshu. Juntos deben aprender a cooperar para detener un complot místico que busca liberar a la deidad Ammit.',
    posterUrl: 'https://static.tvmaze.com/uploads/images/original_untouched/407/1019370.jpg'
  },
  {
    id: 'ms-marvel',
    title: 'Ms. Marvel',
    year: 2022,
    network: 'Disney+',
    phase: 'Fase 4',
    rating: 8.1,
    seasons: '1 Temp (6 Ep)',
    saga: 'Saga del Multiverso',
    summary: 'Kamala Khan, una adolescente paquistaní-estadounidense fanática de los Vengadores y de Capitana Marvel, descubre unos brazaletes familiares antiguos que le otorgan la capacidad de manipular la luz dura y la energía cósmica.',
    posterUrl: 'https://static.tvmaze.com/uploads/images/original_untouched/405/1013952.jpg'
  },
  {
    id: 'she-hulk',
    title: 'She-Hulk: Defensora de Héroes',
    year: 2022,
    network: 'Disney+',
    phase: 'Fase 4',
    rating: 7.8,
    seasons: '1 Temp (9 Ep)',
    saga: 'Saga del Multiverso',
    summary: 'Jennifer Walters, abogada y prima de Bruce Banner, obtiene poderes similares tras un accidente sanguíneo. Jen intenta mantener su trabajo legal dirigiendo la nueva división de leyes sobrehumanas mientras lidia con ser una celebridad verde de dos metros.',
    posterUrl: 'https://static.tvmaze.com/uploads/images/original_untouched/486/1215646.jpg'
  },

  // 🟢 FASE 5: Expansión, Espionaje y Magia
  {
    id: 'secret-invasion',
    title: 'Invasión Secreta',
    year: 2023,
    network: 'Disney+',
    phase: 'Fase 5',
    rating: 7.5,
    seasons: '1 Temp (6 Ep)',
    saga: 'Saga del Multiverso',
    summary: 'Un Nick Furia envejecido regresa a la Tierra al descubrir una conspiración en la que una facción rebelde de Skrulls que cambian de forma ha infiltrado las esferas más altas del gobierno y el poder mundial para apoderarse del planeta.',
    posterUrl: 'https://static.tvmaze.com/uploads/images/original_untouched/465/1163819.jpg'
  },
  {
    id: 'loki-s2',
    title: 'Loki - Temporada 2',
    year: 2023,
    network: 'Disney+',
    phase: 'Fase 5',
    rating: 9.7,
    seasons: 'Temp 2 (6 Ep)',
    saga: 'Saga del Multiverso',
    summary: 'Loki intenta evitar el colapso inminente de la TVA y de todas las líneas temporales. Junto a Mobius y O.B., realiza un recorrido a través del tiempo y el espacio que culmina con Loki tomando el control sagrado de las líneas temporales como el Dios de las Historias.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/6VcSRtdYz5B3xVb8zofFt2TCJLV.jpg'
  },
  {
    id: 'echo',
    title: 'Echo',
    year: 2024,
    network: 'Disney+',
    phase: 'Fase 5',
    rating: 8.0,
    seasons: '1 Temp (5 Ep)',
    saga: 'Saga del Multiverso',
    summary: 'Maya Lopez es perseguida por el imperio criminal de Kingpin tras los eventos de Hawkeye. Al regresar a su hogar ancestral en Oklahoma, conecta con sus raíces nativas americanas mientras se prepara para enfrentar de nuevo a Kingpin.',
    posterUrl: 'https://static.tvmaze.com/uploads/images/original_untouched/499/1247624.jpg'
  },
  {
    id: 'agatha-all-along',
    title: 'Agatha All Along',
    year: 2024,
    network: 'Disney+',
    phase: 'Fase 5',
    rating: 8.8,
    seasons: '1 Temp (9 Ep)',
    saga: 'Saga del Multiverso',
    summary: 'Tras quedar despojada de sus poderes mágicos al final de WandaVision, Agatha Harkness recupera la cordura gracias a un misterioso adolescente. Juntos forman un aquelarre improvisado de brujas para recorrer el peligroso "Senda de las Brujas" y recuperar su magia.',
    posterUrl: 'https://static.tvmaze.com/uploads/images/original_untouched/536/1340567.jpg'
  },
  {
    id: 'friendly-neighborhood-spiderman',
    title: 'Tu Amigable Vecino Spider-Man',
    year: 2025,
    network: 'Disney+',
    phase: 'Fase 5',
    rating: 8.8,
    seasons: '1 Temp (10 Ep)',
    saga: 'Saga del Multiverso',
    summary: 'Serie animada que explora los primeros días de Peter Parker convirtiéndose en Spider-Man en un universo alternativo donde Norman Osborn se convierte en su mentor.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/vjoFEkkALmQffoMelxos82uO49w.jpg'
  },
  {
    id: 'daredevil-born-again',
    title: 'Daredevil: Born Again',
    year: 2025,
    network: 'Disney+',
    phase: 'Fase 5',
    rating: 9.5,
    seasons: '1 Temp (18 Ep)',
    saga: 'Saga del Multiverso',
    summary: 'Matt Murdock y Wilson Fisk (Kingpin) intentan dejar atrás sus identidades secretas para servir a Nueva York desde la ley y la política, respectivamente. Sin embargo, sus pasados chocan inevitablemente desencadenando un conflicto sangriento en la ciudad.',
    posterUrl: 'https://static.tvmaze.com/uploads/images/original_untouched/616/1540605.jpg'
  },

  // 🔴 FASE 6: El Camino a las Guerras Secretas
  {
    id: 'ironheart',
    title: 'Ironheart',
    year: 2025,
    network: 'Disney+',
    phase: 'Fase 6',
    rating: 8.4,
    seasons: '1 Temp (6 Ep)',
    saga: 'Saga del Multiverso',
    summary: 'Riri Williams, una joven e ingeniosa inventora del MIT presentada en Wakanda Forever, regresa a Chicago para perfeccionar sus armaduras de alta tecnología, chocando con el peligroso uso de la magia por parte de Parker Robbins (The Hood).',
    posterUrl: 'https://static.tvmaze.com/uploads/images/original_untouched/571/1428213.jpg'
  },
  {
    id: 'eyes-of-wakanda',
    title: 'Eyes of Wakanda',
    year: 2025,
    network: 'Disney+',
    phase: 'Fase 6',
    rating: 8.6,
    seasons: '1 Temp (4 Ep)',
    saga: 'Saga del Multiverso',
    summary: 'Serie animada que sigue a los guerreros de Wakanda a lo largo de la historia en misiones globales para recuperar artefactos peligrosos de vibranium antes de que caigan en manos enemigas.',
    posterUrl: 'https://images.thedirect.com/media/photos/bp1_GAaGJiC.jpg'
  },
  {
    id: 'marvel-zombies',
    title: 'Marvel Zombies',
    year: 2025,
    network: 'Disney+',
    phase: 'Fase 6',
    rating: 9.3,
    seasons: '1 Temp (4 Ep)',
    saga: 'Saga del Multiverso',
    summary: 'Miniserie animada para adultos ambientada en el universo alternativo donde un virus alienígena transforma a los héroes principales de Marvel en muertos vivientes.',
    posterUrl: 'https://images.thedirect.com/media/photos/mz1_720.jpg'
  },
  {
    id: 'wonder-man',
    title: 'Wonder Man',
    year: 2026,
    network: 'Disney+',
    phase: 'Fase 6',
    rating: 8.5,
    seasons: '1 Temp (10 Ep)',
    saga: 'Saga del Multiverso',
    summary: 'Simon Williams, un actor e inmortal de Hollywood con superpoderes, navega la industria del entretenimiento en Los Ángeles junto a Trevor Slattery mientras explora la naturaleza de la fama sobrehumana.',
    posterUrl: 'https://cdn.marvel.com/content/2x/call_back_e16_1sheetbusshelter_rd2_v1b_rs_mech4.jpg'
  },
  {
    id: 'vision-quest',
    title: 'VisionQuest',
    year: 2026,
    network: 'Disney+',
    phase: 'Fase 6',
    rating: 9.0,
    seasons: '1 Temp (8 Ep)',
    saga: 'Saga del Multiverso',
    summary: 'Próximamente',
    posterUrl: 'https://static0.colliderimages.com/wordpress/wp-content/uploads/sharedimages/2025/10/vision-quest-2026-marvel-tv-show-logo-poster.jpg?q=70&fit=contain&w=480&dpr=1'
  }
];

interface SeriesCatalogProps {
  searchQuery: string;
}

export const SeriesCatalog: React.FC<SeriesCatalogProps> = ({ searchQuery }) => {
  const [selectedPhase, setSelectedPhase] = useState<string>('Todas');
  const [selectedSeries, setSelectedSeries] = useState<SeriesItem | null>(null);

  const filteredSeries = SERIES_DATA.filter(item => {
    const matchesPhase = selectedPhase === 'Todas' || item.phase === selectedPhase;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPhase && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Catalog Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#2d0a0a] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#2d0a0a] border border-red-800 flex items-center justify-center text-red-500">
            <Tv className="w-4 h-4" />
          </div>
          <h1 className="font-cinzel text-xl sm:text-2xl font-black text-white uppercase tracking-wider flex items-center gap-3">
            <span>Catálogo de Series MCU</span>
            <span className="px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-700/60 text-red-400 text-xs font-mono font-bold">
              {SERIES_DATA.length} registradas
            </span>
          </h1>
        </div>

        {/* Phase Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar">
          <Filter className="w-4 h-4 text-slate-500 flex-shrink-0" />
          {['Todas', 'Fase 2', 'Fase 4', 'Fase 5', 'Fase 6'].map(phase => (
            <button
              key={phase}
              onClick={() => setSelectedPhase(phase)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedPhase === phase
                  ? 'bg-[#DC2626] text-white shadow-md'
                  : 'bg-[#120708] border border-[#2d0a0a] text-slate-400 hover:text-white'
              }`}
            >
              {phase}
            </button>
          ))}
        </div>
      </div>

      {/* Series Details Modal */}
      {selectedSeries && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-[#0e0507] border border-[#DC2626]/50 p-5 sm:p-8 relative shadow-2xl space-y-6 animate-fade-in max-h-[90vh] overflow-y-auto my-auto">
            
            {/* Top Close Button (Highly visible on Mobile) */}
            <button
              onClick={() => setSelectedSeries(null)}
              className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-red-950/95 border border-red-600 text-red-200 hover:text-white hover:bg-red-800 transition-colors flex items-center gap-1.5 z-30 font-mono text-xs font-bold shadow-lg"
              title="Cerrar Ficha"
            >
              <X className="w-4 h-4 text-red-400" />
              <span>Cerrar</span>
            </button>

            <div className="flex flex-col sm:flex-row gap-6 items-start pt-2 sm:pt-0">
              <div className="w-full sm:w-48 aspect-[2/3] rounded-2xl overflow-hidden bg-slate-950 border border-red-900/60 flex-shrink-0 shadow-xl">
                <img
                  src={selectedSeries.posterUrl}
                  alt={selectedSeries.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600&auto=format&fit=crop';
                  }}
                />
              </div>

              <div className="space-y-4 flex-1 w-full">
                <div className="flex flex-wrap items-center gap-2 pr-16 sm:pr-0">
                  <span className="px-3 py-1 rounded-full bg-red-950 border border-red-700/80 text-red-400 text-xs font-mono font-bold uppercase tracking-wider">
                    {selectedSeries.phase}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#D4AF37] text-slate-950 text-xs font-mono font-bold">
                    {selectedSeries.year}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono font-bold">
                    {selectedSeries.network}
                  </span>
                </div>

                <h2 className="font-cinzel text-xl sm:text-2xl font-black text-white leading-tight">
                  {selectedSeries.title}
                </h2>

                <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
                  <span>📺 {selectedSeries.seasons}</span>
                  <span className="text-red-400 font-bold">• {selectedSeries.saga}</span>
                </div>

                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> RESUMEN OFICIAL MCU:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-[#070203] p-4 rounded-2xl border border-[#2d0a0a]">
                    {selectedSeries.summary}
                  </p>
                </div>

                {/* Series Comments Section */}
                <ItemComments itemTitle={selectedSeries.title} itemType="series" />

                {/* Bottom Close Action Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setSelectedSeries(null)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-950 to-red-900 hover:from-red-900 hover:to-red-800 border border-red-600 text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <X className="w-4 h-4 text-red-400" />
                    <span>✕ Cerrar Resumen</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Series Grid (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredSeries.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedSeries(item)}
            className="tva-card rounded-2xl overflow-hidden group hover:border-[#DC2626]/70 transition-all duration-300 flex flex-col justify-between cursor-pointer"
          >
            <div className="relative aspect-[2/3] overflow-hidden bg-slate-950">
              <img
                src={item.posterUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600&auto=format&fit=crop';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0607] via-transparent to-black/40 opacity-80" />
              
              {/* Phase Badge Top Left */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/80 border border-red-900/60 text-[10px] font-mono font-bold text-slate-200 uppercase tracking-wider backdrop-blur-sm">
                {item.phase}
              </div>

              {/* Rating Top Right */}
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-amber-500/90 text-black font-bold text-[11px] font-mono flex items-center gap-1 shadow-md">
                <Star className="w-3 h-3 fill-black text-black" />
                <span>{item.rating}</span>
              </div>
            </div>

            {/* Content info below */}
            <div className="p-4 space-y-2 bg-[#0d0607] flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-cinzel text-base font-bold text-white group-hover:text-red-400 transition-colors leading-snug line-clamp-1">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="text-[11px] font-mono text-slate-400 space-y-2 pt-2 border-t border-slate-900">
                <div className="flex items-center justify-between text-[10px]">
                  <span>{item.year} • {item.network}</span>
                  <span className="text-slate-300">📺 {item.seasons}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-red-400 group-hover:text-amber-300 transition-colors pt-1">
                  <span>Ver Resumen Completo</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Section to Comment on Favorite Series */}
      <div className="pt-6">
        <FavoriteComments catalogType="series" itemList={SERIES_DATA.map(s => s.title)} />
      </div>

    </div>
  );
};
