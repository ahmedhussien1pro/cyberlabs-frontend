import './App.css';
// test shadcn-ui
function App() {
  return (
    <>
      {/* test tailwind */}
      <div className='bg-blue-500 text-white p-4 rounded'>
        Hello, Tailwind CSS!
      </div>
      {/* test shadcn-ui */}
      <button className='bg-green-500 text-white px-4 py-2 rounded'>
        Hello, shadcn-ui!
      </button>
    </>
  );
}

export default App;
