'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, color } from 'framer-motion';
import { sampleResume, initialState } from '@/app/lib/sampleResume';
import { experimental_useObject as useObject } from 'ai/react';
import { resumeSchema } from '@/app/lib/sampleResume';
import { motionProps } from '@/app/lib/motionProps';
import {
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
import SortableItem from '@/app/components/dnd/SortableItem';
import CompanyScroller from '@/app/components/CompanyScroller';
import logo from '@/public/logo.png';
import IconUpload from '@/app/components/icons/IconUpload';
import IconAdd from '@/app/components/icons/IconAdd';
import IconCross from '@/app/components/icons/IconCross';
import IconClipboard from '@/app/components/icons/IconClipboard';

const TOAST_DURATION = 3000;

export default function Page() {
  const [view, setView] = useState('initial');
  const [resume, setResume] = useState(initialState);
  const [savedResumeFound, setSavedResumeFound] = useState(false);
  const [jobPosting, setJobPosting] = useState({
    description: '',
    modal: false,
  });
  const [toast, setToast] = useState('');

  const { object, submit, isLoading, stop } = useObject({
    schema: resumeSchema,
    api: '/api/resume/extractor/web',
  });

  useEffect(() => {
    if (object) {
      setResume(object);
      localStorage.setItem('resume', JSON.stringify(object));
    }
  }, [object]);

  async function handleResumeSubmission(e) {
    e.preventDefault();

    const resumeFile = e.target.files.item(0);
    var form = new FormData();
    form.set('resume', resumeFile);

    const res = await fetch('../api/resume/parse', {
      method: 'POST',
      body: form,
      headers: {
        Accept: 'application/json',
      },
    });

    const parsedResume = await res.json();

    submit(parsedResume);
    setView('build');

    // try {
    //   const resumeFile = e.target.files.item(0);
    //   const form = new FormData();
    //   form.set('resume', resumeFile);

    //   // submit(form); // Stream API call
    // } catch (error) {
    //   triggerToast('Error submitting the resume. Please try again.');
    // }
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
  //    - cursor target description
  // [] add drag drop into resume preview too
  //    - @dnd-kit/sortable
  //    - sortable is literally what im looking for looool
  // [] scrape data from here https://resumes.fyi/explore
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

  function saveFormState(updates) {
    updateFormState(updates);
    localStorage.setItem('resume', JSON.stringify(resume));
  }

  const updateFormState = useCallback((updates) => {
    setResume((prev) => ({ ...prev, ...updates }));
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    console.log(active, over);

    if (active.id !== over.id) {
      console.log(certifications[0].id);

      const oldIndex = certifications.indexOf(active.id);
      const newIndex = certifications.indexOf(over.id);
      saveFormState({
        certifications: [arrayMove(certifications, oldIndex, newIndex)],
      });
    }
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
            saveFormState({
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
            saveFormState({
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
            saveFormState({
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
          defaultValue={
            personalDetails?.social_media?.linkedin
              ? personalDetails.social_media?.linkedin
              : ''
          }
          onChange={(e) =>
            saveFormState({
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
          defaultValue={
            personalDetails?.social_media?.github
              ? personalDetails?.social_media.github
              : ''
          }
          onChange={(e) =>
            saveFormState({
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
            saveFormState({
              personalDetails: { ...personalDetails, website: e.target.value },
            })
          }
        />
        <h2 className='font-mono text-lg'>EDUCATION</h2>
        <div></div>
        <h2 className='font-mono text-lg'>CERTIFICATIONS</h2>
        {certifications?.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={certifications}
              strategy={verticalListSortingStrategy}
            >
              {certifications?.map((certification, index) => (
                <SortableItem
                  key={`certification-${certification.id}`}
                  id={`certification-${certification.id}`}
                >
                  <div className='flex flex-col gap-2 w-full'>
                    <label htmlFor={`certification-${certification.id}-name`}>
                      NAME
                    </label>
                    <input
                      type='text'
                      name='resume'
                      id={`certification-${certification.id}-name`}
                      className='border px-3 py-2 border-black bg-transparent'
                      placeholder='Coursera Data Analytics'
                      defaultValue={
                        certification?.name ? certification.name : ''
                      }
                      onChange={(e) => {
                        const updatedCertifications = certifications.map(
                          (cert) =>
                            cert.id == certification.id
                              ? { ...cert, name: e.target.value }
                              : cert
                        );
                        saveFormState({
                          certifications: updatedCertifications,
                        });
                      }}
                    />
                    <label htmlFor={`certification-${certification.id}-year`}>
                      DATE
                    </label>
                    <input
                      type='text'
                      name='resume'
                      id={`certification-${certification.id}-year`}
                      className='border px-3 py-2 border-black bg-transparent'
                      placeholder='2024'
                      defaultValue={
                        certification?.year ? certification.year : ''
                      }
                      onChange={(e) => {
                        const updatedCertifications = certifications.map(
                          (cert) =>
                            cert.id === certification.id
                              ? { ...cert, year: e.target.value }
                              : cert
                        );
                        saveFormState({
                          certifications: updatedCertifications,
                        });
                      }}
                    />
                  </div>
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>
        ) : null}
        <button
          className='flex gap-2 font-mono'
          onClick={() =>
            saveFormState({
              certifications: [
                ...certifications,
                { id: `${certifications.length}` },
              ],
            })
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
              href={personalDetails?.social_media?.linkedin || ''}
              className='underline'
            >
              {personalDetails?.social_media?.linkedin || ''}
            </Link>
            <p>|</p>
            <Link
              href={personalDetails?.social_media?.github || ''}
              className='underline'
            >
              {personalDetails?.social_media?.github}
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
                {project?.technologies?.length ? ' | ' : null}
                <p className='italic'>
                  {/* fix this not being a join */}
                  {project?.technologies?.map((technology, index) => (
                    <React.Fragment key={index}>
                      {technology}
                      {index != project.technologies?.length - 1 ? ', ' : ''}
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
