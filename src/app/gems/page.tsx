
'use client';

const gems = () => {
  return (
    <section id='gems'>
          <div className='container mx-auto lg:max-w-screen-xl md:max-w-screen-md'>
            <div className='text-center mb-14'>
              <h2 className='text-3xl lg:text-5xl font-semibold text-black dark:text-white mx-auto mt-20'>
                Underrated & Beloved
              </h2>
            </div>
            <div className="relative flex w-80 h-50 flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
      <div className="relative mx-4 -mt-6 h-20 overflow-hidden rounded-xl bg-primary bg-clip-border text-white shadow-primary-500/20 ">
      <h5 className="text-center p-4 mb-2 block font-sans text-xl font-semibold leading-snug text-blue-gray-900 antialiased">
          Bhole Chature
        </h5>
      </div>
      <div className="p-6">
      </div>
      <div className="p-6 pt-0">
        <button data-ripple-light="true" type="button" className="select-none rounded-lg bg-primary py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
          Read More
        </button>
      </div>
    </div>

          </div>
        </section>
  );
};

export default gems;

