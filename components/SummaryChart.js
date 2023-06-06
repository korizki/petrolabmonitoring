import dynamic from 'next/dynamic';
const ChartEl = dynamic(() => import('../components/Chart'), { ssr: false });

export default function SummaryChart(props){
    const { listDataStorage, overallChartConfig, filterBy, listDisplayedData, setFilterBy, chartConfigByComponent } = props
    return (
      <div className="flex gap-10 bg-slate-50 justify-center px-10">
        <div className="bg-white border-slate-500 flex-1 rounded mb-8 shadow-sm shows">
          <h1 className='text-lg p-3 bg-sky-600 rounded-tl-lg rounded-tr-lg text-white'><i className="mx-2 fas fa-chart-pie"></i> Overall Status Summary </h1>
          <div className="p-2 flex gap-2 items-start">
            <div className="w-[70%] m-auto py-4 ">
              <ChartEl elName='chartoverall' chartProp={overallChartConfig} />
            </div>
          </div>
        </div>
        <div className="bg-white border-slate-500 flex-1 rounded mb-8 shadow-sm shows">
          <h1 className='text-lg p-3 bg-sky-600 rounded-tl-md rounded-tr-md text-white'><i className="mx-2 fas fa-chart-pie"></i> Component Summary </h1>
          <div className="p-2 flex gap-2 items-start">
            <div className="w-[70%] m-auto py-4 ">
              <ChartEl elName='chartcomponent' chartProp={chartConfigByComponent} />
            </div>
          </div>
        </div>
        {/* action button filter */}
        <div className="flex flex-col w-[15%] gap-2 actform">
            <p className="text-slate-500 font-semibold">Filter by <span className="text-rose-500">Overall Status</span></p>
            <button 
            className={`p-2 rounded-md border-slate-200 
            ${filterBy == 'All' ? 'bg-sky-500 text-white font-semibold' : 'bg-slate-100'}`} 
            onClick={() => setFilterBy('All')}
            >All 
                {filterBy == 'All' && (<i className="fas fa-check-circle"></i>)}
            </button>
            <button 
            className={`p-2 rounded-md border-slate-200
            ${filterBy == 'Normal' ? 'bg-emerald-600 text-white font-semibold' : 'bg-slate-100'}`} 
            onClick={() => setFilterBy('Normal')}
            >Normal 
                {filterBy == 'Normal' && (<i className="fas fa-check-circle"></i>)}
            </button>
            <button 
            className={`p-2 rounded-md border-slate-200
            ${filterBy == 'Caution' ? 'bg-orange-400 text-white font-semibold' : 'bg-slate-100'}`} 
            onClick={() => setFilterBy('Caution')}
            >Caution 
                {filterBy == 'Caution' && (<i className="fas fa-check-circle"></i>)}
            </button>
            <button 
            className={`p-2 rounded-md border-slate-200
            ${filterBy == 'Critical' ? 'bg-rose-400 text-white font-semibold' : 'bg-slate-100'}`} 
            onClick={() => setFilterBy('Critical')}
            >Critical 
                {filterBy == 'Critical' && (<i className="fas fa-check-circle"></i>)}
            </button>
            <button 
            className={`p-2 rounded-md border-slate-200
            ${filterBy == 'Severe' ? 'bg-rose-700 text-white font-semibold' : 'bg-slate-100'}`} 
            onClick={() => setFilterBy('Severe')}
            >Severe 
            {filterBy == 'Severe' && (<i className="fas fa-check-circle"></i>)}
            </button>
            {/* filter by component */}
            <p className="text-slate-500 font-semibold mt-2">Filter by <span className="text-rose-500">Component Status</span></p>
            <button 
            className={`p-2 rounded-md border-slate-200
            ${filterBy == 'componentNormal' ? 'bg-emerald-600 text-white font-semibold' : 'bg-slate-100'}`} 
            onClick={() => setFilterBy('componentNormal')}
            >Normal 
                {filterBy == 'componentNormal' && (<i className="fas fa-check-circle"></i>)}
            </button>
            <button 
            className={`p-2 rounded-md border-slate-200
            ${filterBy == 'componentCaution' ? 'bg-orange-400 text-white font-semibold' : 'bg-slate-100'}`} 
            onClick={() => setFilterBy('componentCaution')}
            >Caution 
                {filterBy == 'componentCaution' && (<i className="fas fa-check-circle"></i>)}
            </button>
            <button 
            className={`p-2 rounded-md border-slate-200
            ${filterBy == 'componentCritical' ? 'bg-rose-400 text-white font-semibold' : 'bg-slate-100'}`} 
            onClick={() => setFilterBy('componentCritical')}
            >Critical 
                {filterBy == 'componentCritical' && (<i className="fas fa-check-circle"></i>)}
            </button>
            <button 
            className={`p-2 rounded-md border-slate-200
            ${filterBy == 'componentSevere' ? 'bg-rose-700 text-white font-semibold' : 'bg-slate-100'}`} 
            onClick={() => setFilterBy('componentSevere')}
            >Severe 
            {filterBy == 'componentSevere' && (<i className="fas fa-check-circle"></i>)}
            </button>
            
        </div>
      </div>
    )
}