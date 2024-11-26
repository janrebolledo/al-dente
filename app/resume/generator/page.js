'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, color } from 'framer-motion';
import { sampleResume, initialState } from '@/app/lib/sampleResume';
import { motionProps } from '@/app/lib/motionProps';
import {
  useDraggable,
  useDroppable,
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import CompanyScroller from '@/app/components/CompanyScroller';
import logo from '@/public/logo.png';
import IconUpload from '@/app/components/icons/IconUpload';
import IconAdd from '@/app/components/icons/IconAdd';
import IconCross from '@/app/components/icons/IconCross';
import IconClipboard from '@/app/components/icons/IconClipboard';
import IconDragHandle from '@/app/components/icons/IconDragHandle';

const TOAST_DURATION = 3000;

export default function Page() {
  const [view, setView] = useState('initial');
  const [resume, setResume] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [savedResumeFound, setSavedResumeFound] = useState(false);
  const [jobPosting, setJobPosting] = useState({
    description: '',
    modal: false,
  });
  const [toast, setToast] = useState('');
  async function handleResumeSubmission(e) {
    e.preventDefault();
    setIsLoading(true);

    const resumeFile = e.target.files.item(0);
    var form = new FormData();
    form.set('resume', resumeFile);

    const res = await fetch('../api/resume/extractor', {
      method: 'POST',
      body: form,
      headers: {
        Accept: 'application/json',
      },
    });

    const extractedResume = await res.json();

    setView('build');
    // set loading/skeleton state meanwhile ai creates results
    // yarn add ai
    setResume(extractedResume);
    localStorage.setItem('resume', JSON.stringify(extractedResume));
  }

  function triggerToast(newToast) {
    setToast(newToast);
    setTimeout(() => {
      setToast('');
    }, TOAST_DURATION);
  }

  useEffect(() => {
    const localResume = localStorage.getItem('resume') || {};

    if (localResume.length > 0) {
      setSavedResumeFound(true);
    }
  }, []);

  // todo:
  // [] add it to user on sql
  // [] add error handling (already added toasts) lol
  // [] add functionality to base resume off job posting/
  // [] make chrome extension to auto generate resume on fly on job posting website
  //    - cursor taret description
  // [] add drag drop into resume preview too
  //    - @dnd-kit/sortable
  //    - sortable is literally what im looking for looool
  return (
    <main className='container mx-auto p-6 py-12 flex flex-col gap-8 min-h-lvh lg:max-h-lvh'>
      <header className='flex justify-between items-center'>
        <Link href='/'>
          <Image src={logo} className='w-24 ' alt='AL DENTE Logo' />
        </Link>
        <button
          className='flex gap-4 font-mono'
          onClick={() =>
            setJobPosting({ ...jobPosting, modal: !jobPosting.modal })
          }
        >
          <IconUpload />
          IMPORT JOB POSTING
        </button>
      </header>
      {view === 'initial' ? (
        <InitialView
          handleResumeSubmission={handleResumeSubmission}
          setView={setView}
          savedResumeFound={savedResumeFound}
          setResume={setResume}
        />
      ) : null}
      {view === 'build' ? (
        <BuildView setView={setView} setResume={setResume} resume={resume} />
      ) : null}
      <AnimatePresence>
        {jobPosting.modal ? (
          <>
            <div
              className='fixed top-0 left-0 right-0 bottom-0 z-10 bg-black/40'
              onClick={() =>
                setJobPosting({ ...jobPosting, modal: !jobPosting.modal })
              }
            />
            <JobPostingModal
              jobPosting={jobPosting}
              setJobPosting={setJobPosting}
            />
          </>
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {toast ? <Toast setToast={setToast} toast={toast} /> : null}
      </AnimatePresence>
    </main>
  );
}

function InitialView({
  handleResumeSubmission,
  setView,
  savedResumeFound,
  setResume,
}) {
  return (
    <aside className='h-full flex flex-col justify-between flex-grow lg:w-1/2'>
      <div className='flex flex-col gap-5'>
        <p className='font-mono'>AI-POWERED</p>
        <h1 className='font-bold text-4xl'>RESUME GENERATOR</h1>
        <p>CREATE A WINNING RESUME TO GUARANTEE AN INTERVIEW</p>
        <p>TRAINED OFF OF RESUMES THAT LANDED:</p>
        {/* <CompanyScroller /> */}
      </div>
      <div className='flex flex-col gap-4 items-start'>
        <button className='font-mono' onClick={() => setView('build')}>
          BUILD FROM SCRATCH
        </button>
        <div className={`flex justify-between items-center gap-8 my-8 w-full`}>
          <div className='w-full h-0 border-t border-black' />
          <span>OR</span>
          <div className='w-full h-0 border-t border-black' />
        </div>
        <form
          onSubmit={handleResumeSubmission}
          id='upload-resume'
          className={`${savedResumeFound ? '' : ''}`}
        >
          <label htmlFor='resume-upload' className='font-mono flex gap-4'>
            <IconUpload /> UPLOAD YOUR RESUME
            <input
              type='file'
              id='resume-upload'
              onChange={(e) => handleResumeSubmission(e)}
              className='hidden'
              accept='.pdf'
            />
          </label>
        </form>
        {savedResumeFound ? (
          <button
            className='px-3 py-4 bg-black text-white font-mono w-full mt-8'
            type='button'
            onClick={() => {
              setResume(JSON.parse(localStorage.getItem('resume')));
              setView('build');
            }}
          >
            CONTINUE FROM SAVED RESUME
          </button>
        ) : null}
      </div>
    </aside>
  );
}

function BuildView({ setView, setResume, resume }) {
  const {
    personalDetails,
    education,
    skills,
    experience,
    projects,
    certifications,
  } = resume;

  const updateFormState = useCallback((updates) => {
    setResume((prev) => ({ ...prev, ...updates }));
    localStorage.setItem('resume', JSON.stringify(resume));
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    // if (!over || active.id === over.id) return;

    const oldIndex = certifications.findIndex((item) => item.id === active.id);
    const newIndex = certifications.findIndex((item) => item.id === over.id);

    const updatedCertifications = arrayMove(certifications, oldIndex, newIndex);

    setResume((prev) => ({
      ...prev,
      certifications: updatedCertifications,
    }));
  }

  async function savePDF() {
    const res = await fetch('../api/resume/download', {
      method: 'POST',
      body: JSON.stringify(resume),
      headers: {
        Accept: 'application/json',
      },
    });

    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${personalDetails.name} Resume.pdf`);
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  }
  return (
    <div className='grid grid-cols-5 gap-8 h-full relative'>
      <form name='resume' className='flex flex-col gap-2 col-span-2 pb-12'>
        <h2 className='font-mono text-lg'>PERSONAL DETAILS</h2>
        <label htmlFor='name'>NAME</label>
        <input
          type='text'
          name='resume'
          id='name'
          className='border px-3 py-2 border-black'
          placeholder='Name'
          autoComplete='name'
          defaultValue={personalDetails?.name ? personalDetails.name : ''}
          onChange={(e) =>
            updateFormState({
              personalDetails: { ...personalDetails, name: e.target.value },
            })
          }
        />
        <label htmlFor='phone'>Phone</label>
        <input
          type='number'
          name='resume'
          id='phone'
          className='border px-3 py-2 border-black'
          placeholder='(000) 000 - 000'
          autoComplete='tel'
          defaultValue={personalDetails?.phone ? personalDetails.phone : ''}
          onChange={(e) =>
            updateFormState({
              personalDetails: { ...personalDetails, phone: e.target.value },
            })
          }
        />
        <label htmlFor='email'>EMAIL</label>
        <input
          type='email'
          name='resume'
          id='email'
          className='border px-3 py-2 border-black'
          placeholder='email@email.com'
          autoComplete='email'
          defaultValue={personalDetails?.email ? personalDetails.email : ''}
          onChange={(e) =>
            updateFormState({
              personalDetails: { ...personalDetails, email: e.target.value },
            })
          }
        />
        <label htmlFor='linkedin'>LINKEDIN</label>
        <input
          type='url'
          name='resume'
          id='linkedin'
          className='border px-3 py-2 border-black'
          placeholder='linkedin.com/username'
          defaultValue={personalDetails?.website ? personalDetails.website : ''}
          onChange={(e) =>
            updateFormState({
              personalDetails: {
                ...personalDetails,
                social_media: {
                  ...personalDetails.social_media,
                  linkedin: e.target.value,
                },
              },
            })
          }
        />
        <label htmlFor='github'>GITHUB</label>
        <input
          type='url'
          name='resume'
          id='github'
          className='border px-3 py-2 border-black'
          placeholder='github.com/username'
          defaultValue={personalDetails?.website ? personalDetails.website : ''}
          onChange={(e) =>
            updateFormState({
              personalDetails: {
                ...personalDetails,
                social_media: {
                  ...personalDetails.social_media,
                  github: e.target.value,
                },
              },
            })
          }
        />
        <label htmlFor='website'>WEBSITE</label>
        <input
          type='url'
          name='resume'
          id='website'
          className='border px-3 py-2 border-black'
          placeholder='yourwebsite.com'
          defaultValue={personalDetails?.website ? personalDetails.website : ''}
          onChange={(e) =>
            updateFormState({
              personalDetails: { ...personalDetails, website: e.target.value },
            })
          }
        />
        <h2 className='font-mono text-lg'>EDUCATION</h2>
        <div></div>
        <h2 className='font-mono text-lg'>CERTIFICATIONS</h2>
        {certifications.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Droppable id='certifications'>
              <SortableContext
                items={certifications}
                strategy={verticalListSortingStrategy}
              >
                {certifications.map((certification, index) => (
                  <SortableItem
                    key={`certification-${index}`}
                    id={`certification-${index}`}
                  >
                    <div className='flex flex-col gap-2 w-full'>
                      <label htmlFor={`certification-${index}-name`}>
                        NAME
                      </label>
                      <input
                        type='text'
                        name='resume'
                        id={`certification-${index}-name`}
                        className='border px-3 py-2 border-black bg-transparent'
                        placeholder='Coursera Data Analytics'
                        defaultValue={
                          certification?.name ? certification.name : ''
                        }
                        onChange={(e) => {
                          const updatedCertifications = certifications.map(
                            (cert, i) =>
                              i === index
                                ? { ...cert, name: e.target.value }
                                : cert
                          );
                          updateFormState({
                            certifications: updatedCertifications,
                          });
                        }}
                      />
                      <label htmlFor={`certification-${index}-year`}>
                        YEAR
                      </label>
                      <input
                        type='text'
                        name='resume'
                        id={`certification-${index}-year`}
                        className='border px-3 py-2 border-black bg-transparent'
                        placeholder='2024'
                        defaultValue={
                          certification?.year ? certification.year : ''
                        }
                        onChange={(e) => {
                          const updatedCertifications = certifications.map(
                            (cert, i) =>
                              i === index
                                ? { ...cert, year: e.target.value }
                                : cert
                          );
                          updateFormState({
                            certifications: updatedCertifications,
                          });
                        }}
                      />
                    </div>
                  </SortableItem>
                ))}
              </SortableContext>
            </Droppable>
          </DndContext>
        ) : null}
        <button
          className='flex gap-2 font-mono'
          onClick={() =>
            updateFormState({ certifications: [...certifications, {}] })
          }
          type='button'
        >
          <IconAdd /> ADD CERTIFICATION
        </button>

        <h2 className='font-mono text-lg'>SKILLS</h2>
        <button
          onClick={savePDF}
          type='button'
          className='px-3 py-2 bg-black text-white font-mono'
        >
          DOWNLOAD RESUME
        </button>
      </form>
      <aside
        className='flex flex-col gap-3 font-serif max-h-[90lvh] overflow-auto col-span-3 sticky top-12'
        id='resume'
      >
        <div className='text-center'>
          <h1 className='font-bold text-lg'>{personalDetails?.name}</h1>
          <div className='flex flex-wrap gap-2 justify-center'>
            <p>{personalDetails?.phone}</p>
            <p>|</p>
            <Link
              href={`mailto:${personalDetails?.email}`}
              className='underline'
            >
              {personalDetails?.email}
            </Link>
            <p>|</p>
            <Link
              href={personalDetails?.social_media.linkedin || ''}
              className='underline'
            >
              {personalDetails?.social_media.linkedin || ''}
            </Link>
            <p>|</p>
            <Link
              href={personalDetails?.social_media.github || ''}
              className='underline'
            >
              {personalDetails?.social_media.github}
            </Link>
            <p>|</p>
            <Link href={personalDetails?.website || ''} className='underline'>
              {personalDetails?.website}
            </Link>
          </div>
        </div>
        <h2 className='font-bold'>Education</h2>
        <hr />
        {education?.map((school, index) => (
          <div key={index}>
            <div className='flex justify-between'>
              <h3 className='font-bold'>{school?.institute}</h3>
              <p>{school?.location}</p>
            </div>
            <div className='flex justify-between'>
              <h3 className='italic'>{school?.course}</h3>
              <p className='italic'>{school?.year}</p>
            </div>
          </div>
        ))}
        <h2 className='font-bold'>Experience</h2>
        <hr />
        {experience?.map((exp, index) => (
          <div key={index}>
            <div className='flex justify-between'>
              <h3 className='font-bold'>{exp?.title}</h3>
              <p>{exp?.duration}</p>
            </div>
            <div className='flex justify-between'>
              <h3 className='italic'>{exp?.company}</h3>
              <p className='italic'>{exp?.location}</p>
            </div>
            <ul className='list-disc list-inside'>
              {exp?.description?.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
        <h2 className='font-bold'>Projects</h2>
        <hr />
        {projects?.map((project, index) => (
          <div key={index}>
            <div className='flex justify-between'>
              <div className='flex gap-2'>
                <h3 className='font-bold'>{project?.name}</h3>
                {project?.technologies.length ? ' | ' : null}
                <p className='italic'>
                  {/* fix this not being a join */}
                  {project?.technologies?.map((technology, index) => (
                    <React.Fragment key={index}>
                      {technology}
                      {index != project.technologies.length - 1 ? ', ' : ''}
                    </React.Fragment>
                  ))}
                </p>
              </div>
              <p className='text-right'>{project?.duration}</p>
            </div>
            <ul className='list-disc list-inside'>
              {project?.description?.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
        <h2 className='font-bold'>Certifications</h2>
        <hr />
        {certifications?.map((certification, index) => (
          <div className='flex justify-between' key={index}>
            <h3 className='font-bold'>{certification?.name}</h3>
            <p>{certification?.year}</p>
          </div>
        ))}

        <h2 className='font-bold'>Skills</h2>
        <hr />
        <p>{skills?.join(', ')}</p>
      </aside>
    </div>
  );
}

function Toast({ setToast, toast }) {
  return (
    <motion.div
      {...motionProps(0)}
      exit={{ opacity: 0 }}
      className={`absolute top-10 left-0 right-0 bg-black text-white w-max mx-auto px-3 py-2 font-medium z-10 cursor-grab select-none`}
      onPointerDown={() => setToast('')}
      drag='y'
      dragConstraints={{ top: 10, bottom: 10 }}
    >
      {toast}
    </motion.div>
  );
}

function JobPostingModal({ jobPosting, setJobPosting }) {
  async function getClipboardData() {
    const clipboardText = await navigator.clipboard.readText();
    setJobPosting({ ...jobPosting, description: clipboardText });
  }

  return (
    <motion.div
      {...motionProps(0)}
      exit={{ opacity: 0, translateY: 50 }}
      transition={{ ease: 'easeInOut', duration: 0.3 }}
      onDragEnd={() =>
        setJobPosting({ ...jobPosting, modal: !jobPosting.modal })
      }
      drag='y'
      dragConstraints={{ top: 100, bottom: 100 }}
      className='fixed left-0 right-0 -bottom-[100px] pb-[200px] flex items-center justify-center z-20 bg-white rounded-t-lg p-6 flex-col gap-4'
    >
      <div className='flex justify-between w-full'>
        <h2 className='font-mono text-xl'>ADD JOB DESCRIPTION</h2>
        <button
          type='button'
          onClick={() =>
            setJobPosting({ ...jobPosting, modal: !jobPosting.modal })
          }
        >
          <IconCross />
        </button>
      </div>
      <div className='flex justify-between items-center w-full'>
        <label htmlFor='description'>DESCRIPTION</label>
        <button onClick={getClipboardData}>
          <IconClipboard />
        </button>
      </div>
      <textarea
        type='text'
        id='description'
        className='border px-3 py-2 border-black w-full resize-none h-48'
        placeholder='Google is a...'
        onChange={(e) =>
          setJobPosting({ ...jobPosting, description: e.target.value })
        }
        value={jobPosting.description}
      />
      <button
        type='button'
        className='px-3 py-2 bg-black text-white font-mono w-full'
        onClick={() =>
          setJobPosting({ ...jobPosting, modal: !jobPosting.modal })
        }
      >
        SAVE
      </button>
    </motion.div>
  );
}

function SortableItem({ children, id }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style = transform
    ? {
        transform: `translate3d(0, ${transform.y}px, 0)`,
      }
    : null;

  function handleDragEnd() {
    console.log(transform.y);
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      onDragEnd={handleDragEnd}
      className={`${
        transform ? 'p-3 border border-blue-200 bg-blue-50' : ''
      } transition-[background-color,border,padding,gap] mb-6 flex hover:gap-4 group`}
    >
      <button
        {...listeners}
        {...attributes}
        type='button'
        className={`${
          transform ? 'cursor-grabbing' : 'cursor-grab'
        } w-0 group-hover:w-6 transition-all overflow-hidden`}
      >
        <IconDragHandle />
      </button>
      {children}
    </div>
  );
}

function Droppable({ children, id }) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  const defaultStyles = {
    transitionProperty: 'padding, background, border',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    transitionDuration: '150ms',
  };
  const style = isOver
    ? { backgroundColor: 'rgba(100,100,100,0.05)', ...defaultStyles }
    : { ...defaultStyles };
  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}
