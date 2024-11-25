'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sampleResume, initialState } from '@/app/lib/sampleResume';
import { motionProps } from '@/app/lib/motionProps';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import CompanyScroller from '@/app/components/CompanyScroller';
import logo from '@/public/logo.png';
import IconUpload from '@/app/components/icons/IconUpload';
import IconAdd from '@/app/components/icons/IconAdd';

const TOAST_DURATION = 3000;

export default function page() {
  const [view, setView] = useState('initial');
  const [resume, setResume] = useState(sampleResume);
  const [toast, setToast] = useState('');
  async function handleResumeSubmission(e) {
    e.preventDefault();

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
    setResume(extractedResume);
  }

  function triggerToast(newToast) {
    setToast(newToast);
    setTimeout(() => {
      setToast('');
    }, TOAST_DURATION);
  }

  // todo:
  // [] add resume to localstorage
  // [] add it to user on sql
  // [] add error handling (already added toasts)
  // [] add functionality to base resume off job posting
  return (
    <main className='container mx-auto p-6 py-12 flex flex-col gap-8 min-h-lvh lg:max-h-lvh'>
      <header>
        <Link href='/'>
          <Image src={logo} className='w-24 ' alt='AL DENTE Logo' />
        </Link>
      </header>
      {view === 'initial' ? (
        <InitialView
          handleResumeSubmission={handleResumeSubmission}
          setView={setView}
        />
      ) : null}
      {view === 'build' ? (
        <BuildView setView={setView} setResume={setResume} resume={resume} />
      ) : null}
      {toast ? <Toast setToast={setToast} toast={toast} /> : null}
    </main>
  );
}

function InitialView({ handleResumeSubmission, setView }) {
  return (
    <aside className='h-full flex flex-col justify-between flex-grow lg:w-1/2'>
      <div className='flex flex-col gap-5'>
        <p className='font-mono'>AI-POWERED</p>
        <h1 className='font-bold text-4xl'>RESUME GENERATOR</h1>
        <p>CREATE A WINNING RESUME TO GUARANTEE AN INTERVIEW</p>
        <p>TRAINED OFF OF RESUMES THAT LANDED:</p>
        <CompanyScroller />
      </div>
      <div>
        <button className='font-mono' onClick={() => setView('build')}>
          BUILD FROM SCRATCH
        </button>
        <div className='flex justify-between items-center gap-8 my-8'>
          <div className='w-full h-0 border-t border-black' />
          <span>OR</span>
          <div className='w-full h-0 border-t border-black' />
        </div>
        <form onSubmit={handleResumeSubmission} id='resume'>
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

  const updateFormState = useCallback(
    (updates) => {
      setResume((prev) => ({ ...prev, ...updates }));
    },
    [resume]
  );

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
      <form name='resume' className='flex flex-col gap-2 col-span-2'>
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
          <>
            {certifications.map((certification, index) => (
              <div key={index} className='flex flex-col gap-2'>
                <label htmlFor={`certification-${index}-name`}>NAME</label>
                <input
                  type='text'
                  name='resume'
                  id={`certification-${index}-name`}
                  className='border px-3 py-2 border-black'
                  placeholder='Coursera Data Analytics'
                  defaultValue={certification?.name ? certification.name : ''}
                  onChange={(e) => {
                    const updatedCertifications = certifications.map(
                      (cert, i) =>
                        i === index ? { ...cert, name: e.target.value } : cert
                    );
                    updateFormState({ certifications: updatedCertifications });
                  }}
                />
                <label htmlFor={`certification-${index}-year`}>YEAR</label>
                <input
                  type='text'
                  name='resume'
                  id={`certification-${index}-year`}
                  className='border px-3 py-2 border-black'
                  placeholder='2024'
                  defaultValue={certification?.year ? certification.year : ''}
                  onChange={(e) => {
                    const updatedCertifications = certifications.map(
                      (cert, i) =>
                        i === index ? { ...cert, year: e.target.value } : cert
                    );
                    updateFormState({ certifications: updatedCertifications });
                  }}
                />
              </div>
            ))}
          </>
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
    <AnimatePresence>
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
    </AnimatePresence>
  );
}
