import React, { useState } from 'react';
import { Filter, Film, BookOpen, X, Sparkles, Calendar, ChevronRight } from 'lucide-react';
import { FavoriteComments } from './FavoriteComments';

export interface MovieItem {
  id: string;
  title: string;
  year: number;
  phase: string;
  summary: string;
  posterUrl: string;
}

export const MOVIES_DATA: MovieItem[] = [
  // 🔴 FASE 1
  {
    id: 'iron-man',
    title: 'Iron Man',
    year: 2008,
    phase: 'Fase 1',
    summary: 'El multimillonario magnate de armas Tony Stark es secuestrado por un grupo terrorista en Afganistán. Para escapar, construye una armadura rudimentaria de hierro. Tras regresar a casa, perfecciona el traje y decide usar su tecnología para proteger al mundo, enfrentándose a su socio Obadiah Stane (Iron Monger).',
    posterUrl: 'https://image.tmdb.org/t/p/w500/gSDoME541NMgSEXydXgG6BFc47U.jpg'
  },
  {
    id: 'incredible-hulk',
    title: 'El Increíble Hulk',
    year: 2008,
    phase: 'Fase 1',
    summary: 'El científico Bruce Banner vive escondido intentando encontrar una cura para la radiación gamma que lo transforma en Hulk. Perseguido por el general Ross, debe liberar al monstruo verde para detener a Emil Blonsky (Abominación), un soldado mutado en Harlem.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/AqkdLeys77nWmC9kzVGVHDVAZx7.jpg'
  },
  {
    id: 'iron-man-2',
    title: 'Iron Man 2',
    year: 2010,
    phase: 'Fase 1',
    summary: 'Con su identidad revelada, Tony Stark se enfrenta a la presión del gobierno para entregar su tecnología mientras sufre un envenenamiento por el reactor Arc. Junto a James Rhodes (War Machine) y la espía Natasha Romanoff (Black Widow), derrota a Iván Vanko (Whiplash).',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BYzk1ZjNiNzctOWI5Mi00NzI4LWE5YzAtNTAyMGJlNTk0Y2FlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'
  },
  {
    id: 'thor',
    title: 'Thor',
    year: 2011,
    phase: 'Fase 1',
    summary: 'El arrogante dios del trueno es despojado de sus poderes y exiliado a la Tierra por su padre Odín. Mientras aprende sobre la humildad junto a la científica Jane Foster, su hermano Loki intenta usurpar el trono de Asgard. Thor se sacrifica para proteger a los humanos y recupera su dignidad y su martillo Mjolnir.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/prSfAi1xGrhLQNxVSUFh61xQ4Qy.jpg'
  },
  {
    id: 'cap-first-avenger',
    title: 'Capitán América: El primer vengador',
    year: 2011,
    phase: 'Fase 1',
    summary: 'Durante la Segunda Guerra Mundial, el escuálido Steve Rogers es transformado en el "Súper Soldado" Capitán América. Junto a Bucky Barnes y Peggy Carter, combate a la división nazi HYDRA y a Red Skull. Para evitar una explosión masiva, estrella su nave en el Ártico y queda congelado durante 70 años.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/kHbLKbMIL1w9WhofQlM03FQrQHI.jpg'
  },
  {
    id: 'the-avengers',
    title: 'Los Vengadores',
    year: 2012,
    phase: 'Fase 1',
    summary: 'Loki roba el Teseracto e invade la Tierra con un ejército Chitauri. Nick Furia activa la "Iniciativa Vengadores", uniendo a Iron Man, Capitán América, Thor, Hulk, Black Widow y Hawkeye en la épica Batalla de Nueva York para salvar el planeta.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/oZHqIjWOu8zKFtBfv4s9iEHoZjU.jpg'
  },

  // 🟡 FASE 2
  {
    id: 'iron-man-3',
    title: 'Iron Man 3',
    year: 2013,
    phase: 'Fase 2',
    summary: 'Con trastorno de estrés postraumático tras Nueva York, Tony Stark se enfrenta al terrorista "El Mandarín". Al descubrir que se trata de una cobertura dirigida por Aldrich Killian con el virus Extremis, Tony debe defender a sus seres queridos confiando más en su ingenio que en su tecnología.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/qhPtAc1TKbMPqNvcdXSOn9Bn7hZ.jpg'
  },
  {
    id: 'thor-dark-world',
    title: 'Thor: Un mundo oscuro',
    year: 2013,
    phase: 'Fase 2',
    summary: 'Malekith, líder de los Elfos Oscuros, busca apoderarse del Aether (Gema de la Realidad), el cual ha infectado el cuerpo de Jane Foster. Thor debe aliarse con su encarcelado hermano Loki para extraer la sustancia de Jane y evitar la oscuridad en los Nueve Reinos.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/54s3EKPVP4uIvKX4hj5X23ZbNYB.jpg'
  },
  {
    id: 'cap-winter-soldier',
    title: 'Capitán América: El Soldado del Invierno',
    year: 2014,
    phase: 'Fase 2',
    summary: 'Steve Rogers descubre que S.H.I.E.L.D. ha sido infiltrada internamente por HYDRA. Junto a Black Widow y Falcon, enfrenta al asesino más letal de la organización: el "Soldado del Invierno", quien resulta ser su antiguo amigo Bucky Barnes con el cerebro lavado.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/9Axfv2wjUnsIRJkDaLSnj0ZuMYT.jpg'
  },
  {
    id: 'gotg',
    title: 'Guardianes de la Galaxia',
    year: 2014,
    phase: 'Fase 2',
    summary: 'Peter Quill ("Star-Lord") roba un orbe místico que contiene la Gema del Poder. Perseguido por Ronan el Acusador, se ve obligado a formar equipo con un grupo de criminales inadaptados (Gamora, Drax, Rocket y Groot) para evitar la destrucción del cosmos.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/ib5N537EfE8wwqt8dWNAVtcRnbF.jpg'
  },
  {
    id: 'avengers-age-of-ultron',
    title: 'Avengers: Era de Ultrón',
    year: 2015,
    phase: 'Fase 2',
    summary: 'Tony Stark y Bruce Banner crean accidentalmente una inteligencia artificial llamada "Ultrón" usando el cetro de Loki. Ultrón determina que la única forma de salvar la Tierra es extinguiendo a la humanidad. Los Vengadores, junto a Visión, Wanda y Pietro Maximoff, luchan para detenerlo en Sokovia.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/yK5tnKo5dSRs6d544cxjEcyys2o.jpg'
  },
  {
    id: 'ant-man',
    title: 'Ant-Man',
    year: 2015,
    phase: 'Fase 2',
    summary: 'El exconvicto Scott Lang es reclutado por el científico Hank Pym para utilizar el traje encogedor "Ant-Man". Con la ayuda de Hope van Dyne, Scott debe ejecutar un robo de alta tecnología para evitar que la armadura Chaqueta Amarilla sea vendida como arma militar a HYDRA.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8YxOIPrabqkQCOKKbuxaz9IcqhO.jpg'
  },

  // 🔵 FASE 3
  {
    id: 'civil-war',
    title: 'Capitán América: Civil War',
    year: 2016,
    phase: 'Fase 3',
    summary: 'Los Acuerdos de Sokovia exigen la supervisión gubernamental de los superhéroes, dividiendo al equipo entre el bando de Iron Man (a favor) y el Capitán América (en contra). La disputa se vuelve personal por la custodia de Bucky Barnes, desatando un enfrentamiento masivo entre héroes.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/rAGiXaUfPzY7CDEyNKUofk3Kw2e.jpg'
  },
  {
    id: 'doctor-strange',
    title: 'Doctor Strange',
    year: 2016,
    phase: 'Fase 3',
    summary: 'El neurocirujano Stephen Strange sufre un trágico accidente de coche que le destruye las manos. Viaja a Kamar-Taj buscando curarse y aprende las artes místicas con la Ancestral, dominando el Ojo de Agamotto (Gema del Tiempo) para proteger la Tierra de amenazas interdimensionales.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/3kv5aHDd9NUoYYc5ql9VWTz8dyb.jpg'
  },
  {
    id: 'gotg-vol2',
    title: 'Guardianes de la Galaxia Vol. 2',
    year: 2017,
    phase: 'Fase 3',
    summary: 'Los Guardianes viajan por el cosmos mientras Peter Quill conoce a su verdadero padre, Ego "El Planeta Viviente". Aunque al principio parece una reunión soñada, el equipo descubre que Ego planea asimilar miles de mundos y deben unirse para destruirlo.',
    posterUrl: 'https://m.media-amazon.com/images/I/81qHcSMVWJL._AC_SL1500_.jpg'
  },
  {
    id: 'spiderman-homecoming',
    title: 'Spider-Man: Homecoming',
    year: 2017,
    phase: 'Fase 3',
    summary: 'Bajo la supervisión lejana de Tony Stark, Peter Parker intenta equilibrar la secundaria con su labor como superhéroe. Para demostrar su valía, detiene sin la ayuda de la tecnología de Stark una red de tráfico de armas alienígenas liderada por Adrian Toomes ("El Buitre").',
    posterUrl: 'https://m.media-amazon.com/images/I/81mB3qk03BL.jpg'
  },
  {
    id: 'thor-ragnarok',
    title: 'Thor: Ragnarok',
    year: 2017,
    phase: 'Fase 3',
    summary: 'Hela, la destructiva hermana de Thor, destruye su martillo Mjolnir y toma Asgard. Atrapado en el planeta gladiador Sakaar, Thor hace equipo con Hulk, Loki y Valkyria para regresar y provocar el Ragnarok, destruyendo Asgard para salvar a su pueblo.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8hnNdUFlUkjPWxKDyiE4Kn8h7Q5.jpg'
  },
  {
    id: 'black-panther',
    title: 'Black Panther',
    year: 2018,
    phase: 'Fase 3',
    summary: "T'Challa regresa a la aislada y avanzada nación de Wakanda para ser coronado rey. Sin embargo, su liderazgo es desafiado por Erik Killmonger, un primo exiliado que busca tomar el trono para usar la tecnología de vibranium y desatar una revolución global.",
    posterUrl: 'https://image.tmdb.org/t/p/w500/fj7sX7w0MfIxWylcizp5ArPIMFs.jpg'
  },
  {
    id: 'avengers-infinity-war',
    title: 'Avengers: Infinity War',
    year: 2018,
    phase: 'Fase 3',
    summary: 'Thanos inicia la recolección de las seis Gemas del Infinito para erradicar a la mitad de la vida del universo. Los Vengadores y los Guardianes de la Galaxia intentan frenarlo en Titán y Wakanda, pero Thanos logra reunir las gemas y ejecuta el fatídico chasquido.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMjMxNjY2MDU1OV5BMl5BanBnXkFtZTgwNzY1MTUwNTM@._V1_FMjpg_UX1000_.jpg'
  },
  {
    id: 'antman-wasp',
    title: 'Ant-Man y la Avispa',
    year: 2018,
    phase: 'Fase 3',
    summary: 'Mientras Scott Lang cumple arresto domiciliario, se une a Hank Pym y Hope van Dyne (la Avispa) en una misión para rescatar a Janet van Dyne del Reino Cuántico, mientras esquivan a la inestable villana conocida como "Ghost".',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BYjcyYTk0N2YtMzc4ZC00Y2E0LWFkNDgtNjE1MzZmMGE1YjY1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg'
  },
  {
    id: 'captain-marvel',
    title: 'Capitana Marvel',
    year: 2019,
    phase: 'Fase 3',
    summary: 'En los años 90, la guerrera Kree "Vers" cae a la Tierra y descubre que en realidad es la piloto humana Carol Danvers. Junto a Nick Furia, descubre su pasado y libera su inmenso poder cósmico derivado del Teseracto para proteger a los refugiados Skrull.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/bWtwxZW2lRsa9rr7xLgeqqBMofQ.jpg'
  },
  {
    id: 'avengers-endgame',
    title: 'Avengers: Endgame',
    year: 2019,
    phase: 'Fase 3',
    summary: 'Cinco años después de la catástrofe de Thanos, los Vengadores supervivientes ejecutan un "Atraco al Tiempo" a través del Reino Cuántico para recolectar las Gemas en el pasado. Tras restaurar a los caídos, libran la batalla definitiva donde Tony Stark se sacrifica para destruir a Thanos.',
    posterUrl: 'https://m.media-amazon.com/images/I/71Y-Vyh722L._AC_SL1209_.jpg'
  },
  {
    id: 'spiderman-far-from-home',
    title: 'Spider-Man: Far From Home',
    year: 2019,
    phase: 'Fase 3',
    summary: 'De luto por Tony Stark, Peter Parker viaja a Europa con su escuela. Nick Furia lo recluta para luchar junto a Quentin Beck ("Mysterio"), pero Peter pronto descubre que Mysterio usa tecnología de ilusiones holográficas para fingir sus heroísmos.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/i0nzOT8reCr4lLa7LaKqfxfVnIx.jpg'
  },

  // 🟣 FASE 4
  {
    id: 'black-widow',
    title: 'Black Widow',
    year: 2021,
    phase: 'Fase 4',
    summary: 'Natasha Romanoff enfrenta los traumas de su pasado tras Civil War. Reencontrándose con su "familia" rusa (Yelena Belova, Red Guardian y Melina Vostokoff), combate al temible Taskmaster y destruye la Habitación Roja.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BNTA3YmRkMTMtYTIyOS00OGM0LWIyMWUtZjVhYmM4NWU4Mzk1XkEyXkFqcGc@._V1_.jpg'
  },
  {
    id: 'shang-chi',
    title: 'Shang-Chi y la leyenda de los Diez Anillos',
    year: 2021,
    phase: 'Fase 4',
    summary: 'Shang-Chi debe confrontar a su inmortal padre Wenwu, líder de la organización de los Diez Anillos. Con el fin de proteger la mística dimensión de Ta Lo de una amenaza destructiva, Shang-Chi asume el poder de los legendarios anillos.',
    posterUrl: 'https://www.themoviedb.org/t/p/w500/pS1XUGjC6ASC1kvDCP3OJnwjk1t.jpg'
  },
  {
    id: 'eternals',
    title: 'Eternals',
    year: 2021,
    phase: 'Fase 4',
    summary: 'Los Eternos, seres inmortales enviados por los Celestiales a proteger a los humanos durante milenios, se reúnen tras el chasquido para evitar el nacimiento de un Celestial que destruirá la Tierra desde su núcleo.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BZTBiZjI2M2UtZTNiNy00NmU4LWJiMjYtZjk4MDIzMzhlMjFlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'
  },
  {
    id: 'spiderman-no-way-home',
    title: 'Spider-Man: No Way Home',
    year: 2021,
    phase: 'Fase 4',
    summary: 'Con su identidad expuesta, Peter Parker pide ayuda al Doctor Strange para borrar los recuerdos del mundo. El hechizo sale mal y fractura el espacio-tiempo, atrayendo a villanos y héroes Spider-Man de universos alternativos (Tobey Maguire y Andrew Garfield).',
    posterUrl: 'https://cdn.marvel.com/content/1x/spider-mannowayhome_lob_crd_03.jpg'
  },
  {
    id: 'doctor-strange-multiverse',
    title: 'Doctor Strange in the Multiverse of Madness',
    year: 2022,
    phase: 'Fase 4',
    summary: 'Strange protege a América Chavez, una joven que viaja por dimensiones, de Wanda Maximoff (la Bruja Escarlata). Corrompida por el Darkhold, Wanda destruye realidades para reunirse con sus hijos alternativos.',
    posterUrl: 'https://m.media-amazon.com/images/S/pv-target-images/2b4caf479f912d95e014580f67865efb8616c036b4535ad09f2993f4b81e7481.jpg'
  },
  {
    id: 'thor-love-thunder',
    title: 'Thor: Love and Thunder',
    year: 2022,
    phase: 'Fase 4',
    summary: 'Thor se enfrenta a Gorr, el "Carnicero de Dioses", quien busca extingir a todas las deidades. Thor cuenta con la ayuda de Valkyria y de Jane Foster, quien porta el martillo Mjolnir convertida en la Poderosa Thor.',
    posterUrl: 'https://images.thedirect.com/media/photos/thordolbycinemaposter.jpg'
  },
  {
    id: 'black-panther-wakanda',
    title: 'Black Panther: Wakanda Forever',
    year: 2022,
    phase: 'Fase 4',
    summary: "Tras la muerte del rey T'Challa, Wakanda lucha por proteger su vibranium de las potencias mundiales y entra en conflicto con Namor, rey de Talokan. Shuri debe asumir el manto de Black Panther para salvar a su nación.",
    posterUrl: 'https://www.themoviedb.org/t/p/w500/1mlPMcx7gtTSHBCcbMFsKYkmuNW.jpg'
  },

  // 🟢 FASE 5
  {
    id: 'antman-quantumania',
    title: 'Ant-Man y la Avispa: Quantumania',
    year: 2023,
    phase: 'Fase 5',
    summary: 'Scott Lang y su familia son arrastrados al Reino Cuántico, donde descubren una civilización entera amenazada por Kang el Conquistador, un temible tirano viajero del tiempo al que deben detener antes de que escape.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/qnqGbB22YJ7dSs4o6M7exTpNxPz.jpg'
  },
  {
    id: 'gotg-vol3',
    title: 'Guardianes de la Galaxia Vol. 3',
    year: 2023,
    phase: 'Fase 5',
    summary: 'Para salvar la vida de Rocket, los Guardianes emprenden una arriesgada misión contra el Alto Evolucionador, el despiadado científico que creó a Rocket mediante experimentos tortuosos.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg'
  },
  {
    id: 'the-marvels',
    title: 'The Marvels',
    year: 2023,
    phase: 'Fase 5',
    summary: 'Los poderes de Capitana Marvel, Monica Rambeau y Kamala Khan sufren un entrelazamiento cuántico que las hace intercambiar lugares al usarlos. Juntas deben detener a la líder Kree Dar-Benn.',
    posterUrl: 'https://m.media-amazon.com/images/I/812jc7w+emL.jpg'
  },
  {
    id: 'deadpool-wolverine',
    title: 'Deadpool & Wolverine',
    year: 2024,
    phase: 'Fase 5',
    summary: 'Reclutado por la TVA para salvar su universo de ser erradicado, Deadpool recluta a una variante traumatizada de Wolverine para librar una loca aventura a través del multiverso y el Vacío.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/gCeeg4NWqnplFlOBiPTyVyxERwz.jpg'
  },
  {
    id: 'captain-america-brave-new-world',
    title: 'Capitán América: Un nuevo mundo',
    year: 2025,
    phase: 'Fase 5',
    summary: 'Sam Wilson, asentado como el nuevo Capitán América, investiga un complot internacional tras un ataque al presidente Thaddeus Ross, destapando una conspiración vinculada a la aparición de Red Hulk.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/mZUTBHzb0DXgrISwM28OjqGlFYa.jpg'
  },
  {
    id: 'thunderbolts',
    title: 'Thunderbolts*',
    year: 2025,
    phase: 'Fase 5',
    summary: 'Un grupo de antihéroes (Yelena Belova, Bucky Barnes, U.S. Agent y otros) son enviados a una misión trampa. Al descubrir la traición, deciden unirse como equipo para desenmascarar las manipulaciones de la CIA.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BYWE2NmNmYTItZGY0ZC00MmY2LTk1NDAtMGUyMGEzMjcxNWM0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'
  },

  // 🔴 FASE 6
  {
    id: 'fantastic-four',
    title: 'The Fantastic Four: First Steps',
    year: 2025,
    phase: 'Fase 6',
    summary: 'En un universo retrofuturista de los años 60, Reed Richards, Sue Storm, Johnny Storm y Ben Grimm se enfrentan a la llegada de Silver Surfer y la devoración de su mundo a manos de Galactus.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/pZPJsaFKWheTOerVhLnpP8TPp4B.jpg'
  },
  {
    id: 'spiderman-4',
    title: 'Spider-Man: Brand New Day',
    year: 2026,
    phase: 'Fase 6',
    summary: 'En cines',
    posterUrl: 'https://cdn.marvel.com/content/2x/smbnd_online_1400x2100_ninjas_02_0.jpg'
  },
  {
    id: 'avengers-doomsday',
    title: 'Avengers: Doomsday',
    year: 2026,
    phase: 'Fase 6',
    summary: 'Próximamente',
    posterUrl: 'https://image.tmdb.org/t/p/w500/eO6OdA4RDRWeCVlDMcsoxWYFySD.jpg'
  },
  {
    id: 'avengers-secret-wars',
    title: 'Avengers: Secret Wars',
    year: 2027,
    phase: 'Fase 6',
    summary: 'Próximamente',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BYTQyZTQ5MWQtN2M4NC00YWQwLTg3ZTctM2JiZDE4NDBkZDJkXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'
  }
];

interface MoviesCatalogProps {
  searchQuery: string;
}

export const MoviesCatalog: React.FC<MoviesCatalogProps> = ({ searchQuery }) => {
  const [selectedPhase, setSelectedPhase] = useState<string>('Todas');
  const [selectedMovie, setSelectedMovie] = useState<MovieItem | null>(null);

  const filteredMovies = MOVIES_DATA.filter(item => {
    const matchesPhase = selectedPhase === 'Todas' || item.phase === selectedPhase;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPhase && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Catalog Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#2d0a0a] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2d0a0a] border border-red-800 flex items-center justify-center text-red-500 shadow-md">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-cinzel text-xl sm:text-2xl font-black text-white uppercase tracking-wider flex items-center gap-3">
              <span>Cronología de Películas MCU</span>
              <span className="px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-700/60 text-red-400 text-xs font-mono font-bold">
                {MOVIES_DATA.length} Películas
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">Fases 1 a 6 • Saga del Infinito & Multiverso</p>
          </div>
        </div>

        {/* Phase Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar">
          <Filter className="w-4 h-4 text-slate-500 flex-shrink-0" />
          {['Todas', 'Fase 1', 'Fase 2', 'Fase 3', 'Fase 4', 'Fase 5', 'Fase 6'].map(phase => (
            <button
              key={phase}
              onClick={() => setSelectedPhase(phase)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedPhase === phase
                  ? 'bg-[#DC2626] text-white shadow-md shadow-red-900/50'
                  : 'bg-[#120708] border border-[#2d0a0a] text-slate-400 hover:text-white'
              }`}
            >
              {phase}
            </button>
          ))}
        </div>
      </div>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-[#0e0507] border border-[#DC2626]/50 p-6 sm:p-8 relative shadow-2xl space-y-6 animate-fade-in">
            <button
              onClick={() => setSelectedMovie(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#1e0709] border border-red-800 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-full sm:w-48 aspect-[2/3] rounded-2xl overflow-hidden bg-slate-950 border border-red-900/60 flex-shrink-0 shadow-xl">
                <img
                  src={selectedMovie.posterUrl}
                  alt={selectedMovie.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=600&auto=format&fit=crop';
                  }}
                />
              </div>

              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-red-950 border border-red-700/80 text-red-400 text-xs font-mono font-bold uppercase tracking-wider">
                    {selectedMovie.phase}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#D4AF37] text-slate-950 text-xs font-mono font-bold">
                    {selectedMovie.year}
                  </span>
                </div>

                <h2 className="font-cinzel text-2xl font-black text-white leading-tight">
                  {selectedMovie.title}
                </h2>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                    📜 RESUMEN OFICIAL MCU:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-[#070203] p-4 rounded-2xl border border-[#2d0a0a]">
                    {selectedMovie.summary}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Movies Grid (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMovies.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedMovie(item)}
            className="tva-card rounded-2xl overflow-hidden group hover:border-[#DC2626]/70 transition-all duration-300 flex flex-col justify-between cursor-pointer"
          >
            <div className="relative aspect-[2/3] overflow-hidden bg-slate-950">
              <img
                src={item.posterUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=600&auto=format&fit=crop';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0607] via-transparent to-black/30 opacity-80" />
              
              {/* Year Badge Top Right */}
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-[#D4AF37] text-slate-950 font-bold font-mono text-[11px] shadow-md">
                {item.year}
              </div>

              {/* Phase Badge Top Left */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/80 border border-red-900/60 text-[10px] font-mono font-bold text-slate-200 uppercase tracking-wider backdrop-blur-sm">
                {item.phase}
              </div>
            </div>

            {/* Content below poster */}
            <div className="p-4 bg-[#0d0607] space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-cinzel text-base font-bold text-white group-hover:text-red-400 transition-colors leading-snug line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="pt-2 border-t border-[#230809] flex items-center justify-between text-[11px] font-mono text-red-400 group-hover:text-amber-300 transition-colors">
                <span>Ver Resumen Completo</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Section to Comment on Favorite Movies */}
      <div className="pt-6">
        <FavoriteComments catalogType="movie" itemList={MOVIES_DATA.map(m => m.title)} />
      </div>

    </div>
  );
};
