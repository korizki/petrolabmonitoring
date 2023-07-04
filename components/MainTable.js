export default function MainTable(props){
    const {listDisplayedData, listEvalCode} = props
    return (
        // menambahkan komentar untuk push ke repo public
        <>
            <table>
            <thead className="top-0 sticky z-[1000]">
                <tr>
                <th>Overall Status</th>
                <th>Code Unit</th>
                <th>SN</th>
                <th>Model</th>
                <th>EoD (days)</th>
                <th>HM Sample</th>
                <th>Date Sample</th>
                <th>Date Report</th>
                <th>Component</th>
                <th>Oil Hours</th>
                <th>P. Oil Change </th>
                <th>Condition (Last 5) </th>
                </tr>
            </thead>
            <tbody>
                {
                    listDisplayedData.map((it, index) => (
                        <tr key={index}>
                            <td className="text-center">
                                <span className={`py-1 px-2 text-white rounded text-xs ${it.highestStatus == 1 ? 'bg-emerald-700' :
                                    it.highestStatus == 2 ? 'bg-orange-500' :
                                    it.highestStatus == 3 ? 'bg-rose-400' : 'bg-rose-700'
                                }`}>{listEvalCode[it.highestStatus - 1]}</span>
                            </td>
                            <td className="text-center text-sm w-[10em]">{it.unit}</td>
                            <td>{it.dataPart[0].snUnit}</td>
                            <td>{it.dataPart[0].model}</td>
                            <td>
                                { /* eod */
                                    it.dataPart.map(((data, index) => (
                                        <div className={`comphov mt-[0.2em] mx-w-full`} key={index}>
                                            <span 
                                                className={`block text-center py-[0.5em] px-2 text-slate-500 text-xs ${index < it.dataPart.length -1 ? 'border-b-[1px]' : ''} border-slate-300`}
                                            >{data.eod}</span>
                                        </div>
                                    )))
                                }
                            </td>
                            <td>
                                { /* hm sample */
                                    it.dataPart.map(((data, index) => (
                                        <div className={`comphov mt-[0.2em] mx-w-full`} key={index}>
                                            <span 
                                                className={`block text-center py-[0.5em] px-2 text-slate-500 text-xs ${index < it.dataPart.length -1 ? 'border-b-[1px]' : ''}  border-slate-300`}
                                            >{data.hmSample}</span>
                                        </div>
                                    )))
                                }
                            </td>
                            <td>
                                { /* date sample */
                                    it.dataPart.map(((data, index) => (
                                        <div className={`comphov mt-[0.2em] mx-w-full`} key={index}>
                                            <span 
                                                className={`block text-center py-[0.5em] px-2 text-slate-500 text-xs ${index < it.dataPart.length -1 ? 'border-b-[1px]' : ''}  border-slate-300`}
                                            >{data.dateSample}</span>
                                        </div>
                                    )))
                                }
                            </td>
                            <td>
                                { /* date report */
                                    it.dataPart.map(((data, index) => (
                                        <div className={`comphov mt-[0.2em] mx-w-full`} key={index}>
                                            <span 
                                                className={`block text-center py-[0.5em] px-2 text-slate-500 text-xs ${index < it.dataPart.length -1 ? 'border-b-[1px]' : ''}  border-slate-300`}
                                            >{data.dateReport}</span>
                                        </div>
                                    )))
                                }
                            </td>
                            {/* column component */}
                            <td className="py-[0em] w-[20em] relative">
                                {
                                    it.dataPart.map((data, index) => (
                                        <div className={`comphov mt-[0.2em] mx-w-full`} key={index}>
                                            <span className={`block text-center py-[0.5em] px-2 text-white rounded text-xs ${it.overAllStatus[index] == 'N' ? 'bg-emerald-700' :
                                            it.overAllStatus[index] == 'B' ? 'bg-orange-500' :
                                                it.overAllStatus[index] == 'C' ? 'bg-rose-400' : 'bg-rose-700'
                                            }`}>{data.partName}
                                            </span>
                                            <div className="absolute p-2 px-3 backdrop-blur-lg bg-[rgba(255,255,255,0.3)] border border-slate-200 shadow-sm rounded top-[0] w-[20em]">
                                                <p className="mb-3"><span className="block font-semibold text-sky-600">
                                                <i className="fa-regular fa-clipboard mr-1"></i> Analisis</span><span className="text-slate-500 text-xs">{data.lastStatus.RECOMM1}</span></p>
                                                <p><span className="block font-semibold text-sky-600">
                                                <i className="fa-regular fa-clipboard mr-1"></i> Rekomendasi</span><span className="text-slate-500 text-xs">{data.lastStatus.RECOMM2}</span></p>
                                            </div>
                                        </div>
                                    ))
                                }
                            </td>
                            <td>
                                { /* oil hours */
                                    it.dataPart.map(((data, index) => (
                                        <div className={`comphov mt-[0.2em] mx-w-full`} key={index}>
                                            <span 
                                                className={`block text-center py-[0.5em] px-2 text-slate-500 text-xs ${index < it.dataPart.length -1 ? 'border-b-[1px]' : ''}  border-slate-300`}
                                            >{data.oilHours}</span>
                                        </div>
                                    )))
                                }
                            </td>
                            <td>
                                { /* p oil change*/
                                    it.dataPart.map(((data, index) => (
                                        <div className={`comphov mt-[0.2em] mx-w-full`} key={index}>
                                            <span 
                                                className={`block text-center py-[0.5em] px-2 text-slate-500 text-xs ${index < it.dataPart.length -1 ? 'border-b-[1px]' : ''}  border-slate-300`}
                                            >{data.lastOil}</span>
                                        </div>
                                    )))
                                }
                            </td>
                            {/* column last 5 condition */}
                            <td className="text-center py-[0]">
                                {
                                it.dataPart.map((data, index) => (
                                    <p className={`mx-1 mt-[0.2em]`} key={index}>{data.allData.map((last, index) => (
                                    <span
                                        title={`Update date : ${last.updatedate}`} key={index}
                                        className={`p-1 py-[0.5em] text-xs inline-block px-2 mr-1 rounded text-white ${last.EVAL_CODE == 'N' ? 'bg-emerald-700' :
                                            last.EVAL_CODE == 'B' ? 'bg-orange-500' :
                                            last.EVAL_CODE == 'C' ? 'bg-rose-400' : 'bg-rose-700'
                                        }`}
                                    >{last.EVAL_CODE}</span>
                                    ))}</p>
                                ))
                                }
                            </td>
                        </tr>
                    ))
                }
            </tbody>
            </table>
        </>
    )
}