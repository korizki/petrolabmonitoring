import dynamic from 'next/dynamic';
const ChartEl = dynamic(() => import('../components/Chart'), { ssr: false });

export default function SummaryChart(props){
    const {listDataStorage, overallChartConfig, filterBy, listDisplayedData, setFilterBy} = props
    return (
      <div className="flex gap-10 bg-slate-50 justify-center px-10">
        <div className="bg-white border-slate-500 flex-1 rounded mb-8 shadow-sm shows">
          <h1 className='text-lg p-3 bg-sky-600 rounded-tl-lg rounded-tr-lg text-white'><i className="mx-2 fas fa-chart-pie"></i> Overall Status Summary </h1>
          <div className="p-2 flex gap-2 items-start">
            <div className="w-[65%] py-4 ">
              <ChartEl data={listDataStorage} elName='chartoverall' chartProp={overallChartConfig} />
            </div>
            <div className="flex flex-col flex-1 gap-2 pt-6 px-4">
              <p className="text-slate-500">Filter by status</p>
              <button 
                className={`p-2 rounded-md border-slate-200 
                ${filterBy == 'All' ? 'bg-sky-500 text-white font-semibold' : 'bg-slate-100'}`} 
                onClick={() => setFilterBy('All')}
                >All</button>
              <button 
                className={`p-2 rounded-md border-slate-200
                ${filterBy == 'Normal' ? 'bg-emerald-600 text-white font-semibold' : 'bg-slate-100'}`} 
                onClick={() => setFilterBy('Normal')}
                >Normal</button>
              <button 
                className={`p-2 rounded-md border-slate-200
                ${filterBy == 'Caution' ? 'bg-orange-400 text-white font-semibold' : 'bg-slate-100'}`} 
                onClick={() => setFilterBy('Caution')}
                >Caution</button>
              <button 
                className={`p-2 rounded-md border-slate-200
                ${filterBy == 'Critical' ? 'bg-rose-400 text-white font-semibold' : 'bg-slate-100'}`} 
                onClick={() => setFilterBy('Critical')}
                >Critical</button>
              <button 
                className={`p-2 rounded-md border-slate-200
                ${filterBy == 'Severe' ? 'bg-rose-700 text-white font-semibold' : 'bg-slate-100'}`} 
                onClick={() => setFilterBy('Severe')}
              >Severe</button>
              {/* info total unit */}
              <div className="text-right mt-5">
                <p className="text-slate-500 text-[1.2em]">Total Unit : <strong>{filterBy}</strong></p>
                <h1 className="text-[3em] translate-y-[-0.15em] text-sky-600 font-semibold">{listDisplayedData.length}</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white border-slate-500 flex-1 rounded-md mb-5">
          <h1 className='text-lg p-3 bg-sky-600 rounded-tl-md rounded-tr-md text-white'><i className="mx-2 fas fa-chart-pie"></i> Component Summary </h1>
        </div>
      </div>
    )
}