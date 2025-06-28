import { BeatLoader } from 'react-spinners';

const Loader = () => (
  <div className="flex justify-center items-center h-[60vh] flex-col">


    <BeatLoader
  color="#06B6D4"
  size={25}
  className='w-full  flex items-center justify-center'
/>
    <p className='mt-2 text-white'>    Loading...</p>

  </div>
);

export default Loader