import Image from 'next/image';
import logo from '@/public/logo-alt.png';
import background from '@/public/background.png';
import Link from 'next/link';
import IconRArrow from './components/icons/IconRArrow';

export default function Home() {
  return (
    <main
      className='bg-cover min-h-lvh text-white'
      style={{ backgroundImage: `url(${background.src})` }}
    >
      <header className='container mx-auto py-12 p-6 grid grid-cols-4'>
        <Link href='/' className='col-span-2'>
          <Image src={logo} className='w-24' alt='AL DENTE Logo' />
        </Link>
        <div className='flex justify-between col-span-2 items-center'>
          <Link href='/'>RESUME GENERATOR</Link>
          <Link href='/'>PROJECT GENERATOR</Link>
          <Link href='/'>CONTACT</Link>
        </div>
      </header>
      <section className='grid grid-cols-2'>
        <div className='col-start-2 col-span-2'>
          <div className='h-full flex flex-col gap-8 mt-8'>
            <p>Los Angeles, California</p>
            <h1 className='font-bold text-5xl'>
              <i className='font-serif'>Cooked</i> in CS?
              <br />
              Get Al Dente.
            </h1>
            <div className='flex gap-8'>
              <Link
                className='font-semibold text-xl flex gap-1 items-center'
                href='/resume/generator'
              >
                <IconRArrow /> Resume Generator
              </Link>
              <Link
                className='font-semibold text-xl flex gap-1 items-center'
                href='/project/generator'
              >
                <IconRArrow /> Project Generator
              </Link>
            </div>
          </div>
          <div className='flex flex-col gap-8 justify-end'>
            <h2 className='font-bold text-2xl'>⁂ KEY FEATURES</h2>
            <p>POWERED BY ARTIFICAL INTELLIGENCE</p>
            <p>TAILORED RESUMES TO JOB POSTINGS</p>
          </div>
        </div>
      </section>
    </main>
  );
}
