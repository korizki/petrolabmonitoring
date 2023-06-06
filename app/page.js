"use client"
// update ke github
import Image from 'next/image'
import { useState, useEffect } from 'react'
import $ from 'jquery'
import _ from 'lodash'
import dynamic from 'next/dynamic'
const ChartEl = dynamic(() => import('../components/Chart'), { ssr: false });

export default function Home() {
  const [listData, setListData] = useState([])
  const [listPart, setListPart] = useState([])
  const [listEvalCode, setListEvalCode] = useState(['Normal', 'Caution', 'Critical', 'Severe'])
  const [listUnit, setListUnit] = useState([])
  const [listDataStorage, setListDataStorage] = useState([])
  const [listDisplayedData, setListDisplayedData] = useState([])
  const [overallChartConfig, setOverAllChartConfig] = useState(null)
  const [filterBy, setFilterBy] = useState('All')
  // reformat data
  const processData = listData => {
    // set list part dan unit
    let listPart = _.uniq(_.map(listData, 'COMPONENT'))
    let listUnit = _.uniq(_.map(listData, 'UNIT_NO'))
    setListPart(listPart)
    setListUnit(listUnit)
    // convert data by list unit
    let convertedData = listUnit.map(unit => {
      // create list part info
      let dataPart = listPart.map(part => {
        let allData = listData.filter(data => data.UNIT_NO == unit && data.COMPONENT == part)
        // sort list report by date , ambil hanya 5 terakhir
        allData = allData.length ? allData.sort((a, b) => new Date(b.updatedate) > new Date(a.updatedate) ? 1 : -1) : false
        return {
          partName: part,
          lastStatus: allData ? allData[0] : 0,
          model: allData ? allData[0].MODEL : '-',
          snUnit: allData ? allData[0].SERIAL_NO : '-',
          eod: allData ? parseInt((new Date() - new Date(allData[0].SAMPL_DT1)) / 1000 / 60 / 60 / 24) : '0',
          hmSample: allData ? allData[0].HRS_KM_TOT : '-',
          dateSample: allData ? allData[0].SAMPL_DT1 : '-',
          dateReport: allData ? allData[0].RPT_DT1 : '-',
          oilHours: allData ? allData[0].HRS_KM_OC : '-',
          lastOil: allData ? allData[0].oil_change : '-',
          allData: allData ? allData.splice(0, 5) : [],
        }
      })
      // filter hanya equipment yang memiliki data
      dataPart = dataPart.filter(it => it.allData.length)
      // convert overall status jadi angka
      let overAllStatus = [...dataPart].map(it => it.lastStatus.EVAL_CODE)
      let highestStatus = [...overAllStatus].map(it => it == 'N' ? 1 : it == 'B' ? 2 : it == 'C' ? 3 : 4)
      return {
        unit,
        overAllStatus,
        highestStatus: highestStatus.sort((a, b) => b > a ? 1 : -1)[0],
        dataPart
      }
    })
    setListDataStorage(convertedData)
  }
  // create chart config for summary pie chart
  const createChartConfig = data => {
    let listConvertedData = data.map(it => it.highestStatus == 1 ? 'Normal' : it.highestStatus == 2 ? 'Caution' : it.highestStatus == 3 ? 'Critical' : 'Severe')
    // get unique labels
    let labels = _.uniq(listConvertedData)
    listConvertedData = labels.map(it => {
      let filtered = listConvertedData.filter(data => data === it)
      return {
        status: it,
        value: filtered.length
      }
    })
    let chartConfig = {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            label: 'Pencapaian',
            data: listConvertedData.map(it => it.value),
            backgroundColor: ['rgb(27, 156, 133)','rgb(255, 184, 76)','rgb(255, 105, 105)','rgb(183, 4, 4)' ]
          }
        ]
      },
      options: {
        responsive: true
      }
    }
    setOverAllChartConfig(chartConfig)
  }
  // update data preview with filter
  useEffect(() => {
    let listData = listDataStorage
    let sortIndex = 0
    if(filterBy == 'Normal') {
      sortIndex = 1 
    } else if(filterBy == 'Caution') {
      sortIndex = 2
    } else if(filterBy == 'Critical') {
      sortIndex = 3
    } else if(filterBy == 'Severe') {
      sortIndex = 4
    }
    listData = filterBy != 'All' ? listData.filter(it => it.highestStatus == sortIndex) : listDataStorage
    // tampilkan data setelah di filter by overall status
    setListDisplayedData(listData)
  }, [listDataStorage, filterBy])
  // show pie chart
  useEffect(() => {
    createChartConfig(listDataStorage)
  }, [listDataStorage])
  // get data from endpoint on first load
  useEffect(() => {
    $.ajax({
      url: `https://ut.petrolab.co.id/api/report?limit=true&page=1&data_per_page=500&order_by=RECV_DT1 DESC`,
      method: 'GET',
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", `Bearer KjVNJHkIfefaJnkrVZ8J_SUlG6rZo0Om`)
      },
      success: data => {
        setListData(data.data)
      }
    })
  }, [])
  // auto focus
  useEffect(() => {
    if(filterBy == 'All'){
      window.location.href="#"
    } else {
      window.location.href="#maintable"
    }
  }, [filterBy])
  // on update listdata continue process to new format
  useEffect(() => {
    processData(listData)
  }, [listData])
  return (
    <main>
      <div className="flex justify-between items-center px-10 py-6 bg-slate-50">
        <div className="mb-1">
          <h1 className="text-2xl text-slate-600 font-semibold mb-1"><i className="fa-solid mr-2 fa-file-waveform"></i>  Summary Data</h1>
          <p className="text-sky-700 bg-sky-100 mt-1 p-1 px-2 inline-block rounded"><i className="fa-solid fa-circle-info"></i> Menampilkan Total <strong>{listData.length}</strong> report, <strong>{listPart.length}</strong> Part, dan <strong>{listUnit.length}</strong> Unit</p>
        </div>
        <div className="flex gap-5">
          <img src="/ppa.png" width="50" />
        </div>
      </div>
      {/* chart */}
      <div className="flex gap-10 bg-slate-50 justify-center px-10">
        <div className="bg-white border-slate-500 flex-1 rounded mb-8 shadow-sm shows">
          <h1 className='text-lg p-2 bg-sky-600 rounded-tl-lg rounded-tr-lg text-white'><i className="mx-2 fas fa-chart-pie"></i> Overall Status Summary </h1>
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
                <p className="text-slate-500">Total Unit : <strong>{filterBy}</strong></p>
                <h1 className="text-[3em] translate-y-[-0.15em] text-sky-600 font-semibold">{listDisplayedData.length}</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white border-slate-500 flex-1 rounded-md mb-5">
          <h1 className='text-lg p-2 bg-sky-600 rounded text-white'><i className="mx-2 fas fa-chart-pie"></i> Component Summary </h1>
        </div>
      </div>
      {/* tabel */}
      <div id="maintable">
        <table>
          <thead className="top-0 sticky z-[1000]">
            <tr>
              <th>Overall Status</th>
              <th>Code Unit</th>
              <th>Model</th>
              <th>SN</th>
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
                  <td>{it.dataPart[0].model}</td>
                  <td>{it.dataPart[0].snUnit}</td>
                  <td>{it.dataPart[0].eod}</td>
                  <td>{it.dataPart[0].hmSample}</td>
                  <td>{it.dataPart[0].dateSample}</td>
                  <td>{it.dataPart[0].dateReport}</td>
                  {/* column component */}
                  <td className="py-2 w-[20em] relative">
                    {
                      it.dataPart.map((data, index) => (
                        <div className={`comphov py-[0.25em] my-[0.1em] mx-1`} key={index}>
                          <span className={`py-1 px-2 text-white rounded text-xs ${it.overAllStatus[index] == 'N' ? 'bg-emerald-700' :
                              it.overAllStatus[index] == 'B' ? 'bg-orange-500' :
                                it.overAllStatus[index] == 'C' ? 'bg-rose-400' : 'bg-rose-700'
                            }`}>{data.partName}</span>
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
                  <td>{it.dataPart[0].oilHours}</td>
                  <td>{it.dataPart[0].lastOil}</td>
                  {/* column last 5 condition */}
                  <td className="text-center">
                    {
                      it.dataPart.map((data, index) => (
                        <p className={`py-1 my-[0.1em] mx-1`} key={index}>{data.allData.map((last, index) => (
                          <span
                            title={`Update date : ${last.updatedate}`} key={index}
                            className={`p-1 px-2 mr-1 rounded text-white ${last.EVAL_CODE == 'N' ? 'bg-emerald-700' :
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
            {
              !listDisplayedData.length ? (
                <tr><td colSpan="12" className='text-center text-rose-600 font-semibold'><i className="fas fa-info-circle mr-2"></i> No data found.</td></tr>
              ) : false
            }
          </tbody>
        </table>
      </div>
    </main>
  )
}
