import React, { useState } from 'react';
import {
  FaTelegramPlane,
  FaCalendarAlt,
  FaBookOpen,
  FaLaptopCode,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import { SiLinktree } from 'react-icons/si';
import WindowCard from '../../layout/WindowCard';
import './index.css';
import ResourceLink from './ResourceLink';
import FolderLink from './FolderLink';

type Category = 'ALL' | 'CLUB' | 'ACADEMIC' | 'CAMPUS';
type MajorKey = 'CS' | 'BAIS' | 'BZA' | 'CEG' | 'ISEC';

interface ModItem {
  code: string;
  title: string;
  su: boolean;
  note: string;
}

interface MajorPlan {
  name: string;
  summary: string;
  url: string;
  s1: ModItem[];
  s2: ModItem[];
  tip: string;
}

const PORTALS = [
  {
    label: 't.me/nuscomputingclub (Official Telegram)',
    link: 'https://t.me/nuscomputingclub',
    cat: 'CLUB' as const,
    icon: FaTelegramPlane,
  },
  {
    label: 'linktr.ee/nuscomputingclub (Club Links)',
    link: 'https://linktr.ee/nuscomputingclub',
    cat: 'CLUB' as const,
    icon: SiLinktree,
  },
  {
    label: 'nusmods.com (Timetable & Course Planner)',
    link: 'https://nusmods.com',
    cat: 'ACADEMIC' as const,
    icon: FaCalendarAlt,
  },
  {
    label: 'comp.nus.edu.sg/programmes (SoC Curriculum)',
    link: 'https://www.comp.nus.edu.sg/programmes/ug/',
    cat: 'ACADEMIC' as const,
    icon: FaBookOpen,
  },
  {
    label: 'canvas.nus.edu.sg (NUS Canvas LMS)',
    link: 'https://canvas.nus.edu.sg',
    cat: 'ACADEMIC' as const,
    icon: FaLaptopCode,
  },
];

const FOLDERS = [
  {
    label: 'Photos',
    link: 'https://www.flickr.com/photos/137141057@N04/albums/',
    cat: 'CLUB' as const,
  },
  {
    label: 'Maps',
    link: 'https://www.comp.nus.edu.sg/maps/venues/',
    cat: 'CAMPUS' as const,
  },
  {
    label: 'Merch',
    link: 'https://nusfastpay.nus.edu.sg/ccmerch/menu',
    cat: 'CLUB' as const,
  },
  {
    label: 'Feedback',
    link: 'https://feedback.nuscomputing.com/',
    cat: 'CAMPUS' as const,
  },
];

const PLANS: Record<MajorKey, MajorPlan> = {
  CS: {
    name: 'Computer Science',
    summary:
      'Build strong programming, discrete math, and systems foundations in Year 1 to unlock focus areas in Year 2.',
    url: 'https://www.comp.nus.edu.sg/programmes/ug/cs/curr/',
    s1: [
      {
        code: 'CS1101S',
        title: 'Programming Methodology',
        su: true,
        note: 'Unlocks CS2030S & CS2040S',
      },
      {
        code: 'CS1231S',
        title: 'Discrete Structures',
        su: true,
        note: 'Core proof & logic prerequisite',
      },
      {
        code: 'MA1521',
        title: 'Calculus for Computing',
        su: true,
        note: 'Or MA2002 Calculus',
      },
      {
        code: 'IS1108',
        title: 'Digital Ethics and Data Privacy',
        su: true,
        note: 'Computing common curriculum',
      },
    ],
    s2: [
      {
        code: 'CS2030S',
        title: 'Programming Methodology II',
        su: false,
        note: 'OOP & functional Java (No S/U)',
      },
      {
        code: 'CS2040S',
        title: 'Data Structures and Algorithms',
        su: false,
        note: 'Core technical interview mod (No S/U)',
      },
      {
        code: 'MA1522',
        title: 'Linear Algebra for Computing',
        su: true,
        note: 'Essential for AI/ML tracks',
      },
      {
        code: 'ES2660',
        title: 'Communicating in the Information Age',
        su: true,
        note: 'Common curriculum communication',
      },
    ],
    tip: 'Clearing CS2030S & CS2040S in Y1S2 unlocks CS2100, CS2103T (SWE), and UROP (CP3209) in Year 2.',
  },
  BAIS: {
    name: 'Business Artificial Intelligence Systems',
    summary:
      'Combines Python/Java software engineering with business analytics, AI governance, and enterprise AI systems.',
    url: 'https://www.comp.nus.edu.sg/programmes/ug/is/curr/',
    s1: [
      {
        code: 'CS1010A',
        title: 'Programming Methodology (Python)',
        su: true,
        note: 'Unlocks CS2030 & CS2040',
      },
      {
        code: 'IS1108',
        title: 'Digital Ethics and Data Privacy',
        su: true,
        note: 'AI ethics & governance foundation',
      },
      {
        code: 'MA1521',
        title: 'Calculus for Computing',
        su: true,
        note: 'Math foundation for ML',
      },
      {
        code: 'CFG1002',
        title: 'Career Catalyst (2 Units)',
        su: true,
        note: 'CS/CU; unlocks CFG2002 trips',
      },
    ],
    s2: [
      {
        code: 'CS2030',
        title: 'Programming Methodology II (Java)',
        su: false,
        note: 'Core OOP software design (No S/U)',
      },
      {
        code: 'BT1101',
        title: 'Introduction to Business Analytics',
        su: true,
        note: 'Data modelling & statistics',
      },
      {
        code: 'IS2101',
        title: 'Business and Technical Communication',
        su: true,
        note: 'IS/BAIS communication core',
      },
      {
        code: 'CS1231S',
        title: 'Discrete Structures',
        su: true,
        note: 'Can be taken in Sem 1 or Sem 2',
      },
    ],
    tip: 'Finishing CS2030 in Y1S2 and CS2040 in Y2S1 sets you up for IS2103, IS3103, and Level-4000 GenAI electives.',
  },
  BZA: {
    name: 'Business Analytics',
    summary:
      'Focuses on statistical modelling, machine learning, operations research, and data-driven decision making.',
    url: 'https://www.comp.nus.edu.sg/programmes/ug/bza/curr/',
    s1: [
      {
        code: 'CS1010S',
        title: 'Programming Methodology (Python)',
        su: true,
        note: 'Core Python foundation',
      },
      {
        code: 'BT1101',
        title: 'Introduction to Business Analytics',
        su: true,
        note: 'R & analytics fundamentals',
      },
      {
        code: 'MA1521',
        title: 'Calculus for Computing',
        su: true,
        note: 'Required for probability/ML',
      },
      {
        code: 'IS1108',
        title: 'Digital Ethics and Data Privacy',
        su: true,
        note: 'Data governance core',
      },
    ],
    s2: [
      {
        code: 'CS2030',
        title: 'Programming Methodology II',
        su: false,
        note: 'Unlocks advanced engineering mods',
      },
      {
        code: 'CS2040',
        title: 'Data Structures and Algorithms',
        su: false,
        note: 'Core algorithms (No S/U)',
      },
      {
        code: 'BT2102',
        title: 'Data Management and Visualisation',
        su: false,
        note: 'SQL & data pipelines (No S/U)',
      },
      {
        code: 'MA1522',
        title: 'Linear Algebra for Computing',
        su: true,
        note: 'Matrix math for ML',
      },
    ],
    tip: 'Pair BT2102 with ST2334 (Probability) early to unlock BT3103 and machine learning electives in Year 2.',
  },
  CEG: {
    name: 'Computer Engineering',
    summary:
      'Bridges embedded hardware, digital logic, RTOS, robotics, and low-level software across SoC and CDE.',
    url: 'https://ceg.nus.edu.sg/curriculum/',
    s1: [
      {
        code: 'CS1010',
        title: 'Programming Methodology (C)',
        su: true,
        note: 'C programming & pointers',
      },
      {
        code: 'CG1111A',
        title: 'Engineering Principles and Practice I',
        su: true,
        note: 'Hands-on hardware & robot lab',
      },
      {
        code: 'MA1511',
        title: 'Engineering Calculus (2 Units)',
        su: true,
        note: 'Paired with MA1512 (2 Units)',
      },
      {
        code: 'CS1231',
        title: 'Discrete Structures',
        su: true,
        note: 'Logic & discrete math',
      },
    ],
    s2: [
      {
        code: 'CG2111A',
        title: 'Engineering Principles and Practice II',
        su: true,
        note: 'Bare-metal MCU & ROS project',
      },
      {
        code: 'CS2040C',
        title: 'Data Structures and Algorithms (C++)',
        su: false,
        note: 'C++ algorithms (No S/U)',
      },
      {
        code: 'EE2026',
        title: 'Digital Design',
        su: false,
        note: 'FPGA & Verilog project',
      },
      {
        code: 'MA1508E',
        title: 'Linear Algebra for Engineering',
        su: true,
        note: 'Engineering linear algebra',
      },
    ],
    tip: 'CG1111A & CG2111A form the backbone of your Year 2 CG2023/CG2027/CG2271 real-time OS hardware track.',
  },
  ISEC: {
    name: 'Information Security',
    summary:
      'Covers systems security, cryptography, network defence, binary exploitation, and secure architecture.',
    url: 'https://www.comp.nus.edu.sg/programmes/ug/isc/curr/',
    s1: [
      {
        code: 'CS1101S',
        title: 'Programming Methodology',
        su: true,
        note: 'Or CS1010',
      },
      {
        code: 'CS1231S',
        title: 'Discrete Structures',
        su: true,
        note: 'Crucial for cryptography',
      },
      {
        code: 'IS1108',
        title: 'Digital Ethics and Data Privacy',
        su: true,
        note: 'Privacy & governance',
      },
      {
        code: 'MA1521',
        title: 'Calculus for Computing',
        su: true,
        note: 'Math foundation',
      },
    ],
    s2: [
      {
        code: 'CS2030S',
        title: 'Programming Methodology II',
        su: false,
        note: 'Software construction (No S/U)',
      },
      {
        code: 'CS2040S',
        title: 'Data Structures and Algorithms',
        su: false,
        note: 'Core algorithms (No S/U)',
      },
      {
        code: 'CS2100',
        title: 'Computer Organisation',
        su: false,
        note: 'Assembly & memory layout (No S/U)',
      },
      {
        code: 'CS2107',
        title: 'Introduction to Information Security',
        su: false,
        note: 'Unlocks all Level-3000 security mods',
      },
    ],
    tip: 'Taking CS2100 & CS2107 early in Y1S2 / Y2S1 unlocks CS3235 (Computer Security) and CTF tracks.',
  },
};

function Resources() {
  const [category, setCategory] = useState<Category>('ALL');
  const [search, setSearch] = useState('');
  const [selectedMajor, setSelectedMajor] = useState<MajorKey>('CS');

  const q = search.trim().toLowerCase();

  const filteredPortals = PORTALS.filter((item) => {
    const matchesCat = category === 'ALL' || item.cat === category;
    const matchesSearch = !q || item.label.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const filteredFolders = FOLDERS.filter((item) => {
    const matchesCat = category === 'ALL' || item.cat === category;
    const matchesSearch = !q || item.label.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const activePlan = PLANS[selectedMajor];

  const categories: { label: string; value: Category }[] = [
    { label: 'All Resources', value: 'ALL' },
    { label: 'Club & Socials', value: 'CLUB' },
    { label: 'Academics & Tools', value: 'ACADEMIC' },
    { label: 'Campus & Venues', value: 'CAMPUS' },
  ];

  const renderModList = (mods: ModItem[]) =>
    mods.map((mod) => (
      <a
        key={mod.code}
        href={`https://nusmods.com/courses/${mod.code}`}
        target='_blank'
        rel='noopener noreferrer'
        className='planner-mod-row'
      >
        <div>
          <div className='flex items-center gap-2'>
            <span className='font-bold text-sm text-primary'>{mod.code}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                mod.su
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {mod.su ? 'S/U Eligible' : 'No S/U'}
            </span>
          </div>
          <p className='text-xs font-semibold text-slate-800 mt-0.5'>
            {mod.title}
          </p>
          <p className='text-[11px] text-slate-500'>{mod.note}</p>
        </div>
        <FaExternalLinkAlt className='text-xs text-slate-400 shrink-0' />
      </a>
    ));

  return (
    <div className='resources'>
      <h1>Resources &amp; Study Planner</h1>
      <p className='resources-subtitle'>
        Quick links to Computing Club channels, campus maps, merchandise, and
        interactive Year 1 study roadmaps for every SoC degree.
      </p>

      <div className='resources-toolbar'>
        <div className='resources-search'>
          <input
            type='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Filter links (e.g. Telegram, Merch, Maps, NUSMods)...'
            aria-label='Filter resources'
          />
          {search && (
            <button
              type='button'
              onClick={() => setSearch('')}
              className='text-xs font-semibold text-slate-400 hover:text-slate-600'
            >
              Clear
            </button>
          )}
        </div>
        <div className='resources-pills'>
          {categories.map((cat) => (
            <button
              key={cat.value}
              type='button'
              aria-pressed={category === cat.value}
              onClick={() => setCategory(cat.value)}
              className={`resources-pill ${
                category === cat.value
                  ? 'resources-pill-active'
                  : 'resources-pill-inactive'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className='resources-content'>
        <div className='resource-window-container'>
          {filteredPortals.length > 0 ? (
            filteredPortals.map((portal) => (
              <ResourceLink
                key={portal.link}
                label={portal.label}
                link={portal.link}
                icon={portal.icon}
              />
            ))
          ) : (
            <p className='text-sm text-slate-500 py-4'>
              No portal links match your current filter.
            </p>
          )}
        </div>

        <div className='resource-link-container'>
          <div className='flex flex-wrap justify-center gap-2'>
            {filteredFolders.map((folder) => (
              <FolderLink
                key={folder.label}
                label={folder.label}
                link={folder.link}
              />
            ))}
          </div>
        </div>
      </div>

      <div className='planner-section'>
        <div className='text-center space-y-2'>
          <h2 className='text-2xl md:text-3xl font-bold text-primary font-heading'>
            SoC Year 1 Study Planner
          </h2>
          <p className='text-sm text-slate-600 max-w-xl mx-auto'>
            Select your degree below to view recommended Year 1 core modules,
            S/U eligibility, and direct NUSMods links.
          </p>
        </div>

        <div className='planner-tabs' role='tablist' aria-label='SoC Majors'>
          {(Object.keys(PLANS) as MajorKey[]).map((key) => (
            <button
              key={key}
              type='button'
              role='tab'
              aria-selected={selectedMajor === key}
              onClick={() => setSelectedMajor(key)}
              className={`resources-pill ${
                selectedMajor === key
                  ? 'resources-pill-active'
                  : 'resources-pill-inactive'
              }`}
            >
              {key} — {PLANS[key].name}
            </button>
          ))}
        </div>

        <WindowCard
          widthClass='w-full'
          content={
            <div className='p-6 space-y-6'>
              <div
                className='flex flex-col md:flex-row md:items-center
                  justify-between gap-4 border-b border-slate-200 pb-4'
              >
                <div>
                  <h3 className='text-xl font-bold text-primary font-heading'>
                    {activePlan.name} ({selectedMajor})
                  </h3>
                  <p className='text-sm text-slate-600 mt-1'>
                    {activePlan.summary}
                  </p>
                </div>
                <a
                  href={activePlan.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 px-4 py-2 rounded-xl
                    bg-primary text-white text-xs md:text-sm font-semibold
                    hover:opacity-90 shrink-0'
                >
                  <span>Official Curriculum</span>
                  <FaExternalLinkAlt className='text-xs' />
                </a>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='planner-sem-card'>
                  <h4 className='font-bold text-primary text-base'>
                    Year 1 • Semester 1 Recommended
                  </h4>
                  {renderModList(activePlan.s1)}
                </div>

                <div className='planner-sem-card'>
                  <h4 className='font-bold text-primary text-base'>
                    Year 1 • Semester 2 Recommended
                  </h4>
                  {renderModList(activePlan.s2)}
                </div>
              </div>

              <div className='p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs md:text-sm text-slate-700'>
                <span className='font-bold text-primary'>Roadmap Tip: </span>
                {activePlan.tip}
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}

export default Resources;
